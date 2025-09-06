import { NextRequest } from 'next/server';
import twilio from 'twilio';
import { 
  sanitizeInput, 
  checkRateLimit, 
  getClientIP, 
  createErrorResponse, 
  createSuccessResponse,
  schemas,
  validateRequest
} from '@/lib/security';
import Joi from 'joi';

// Initialize Twilio client only when needed
let client: any = null;

function getTwilioClient() {
  if (!client && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
  return client;
}

// WhatsApp message validation schema
const whatsappMessageSchema = Joi.object({
  to: schemas.phone.required(),
  message: Joi.string().min(1).max(1600).required(), // WhatsApp limit
  mediaUrl: Joi.string().uri().optional()
});

// Webhook validation schema
const webhookSchema = Joi.object({
  From: Joi.string().required(),
  To: Joi.string().required(),
  Body: Joi.string().allow('').optional(),
  MediaUrl0: Joi.string().uri().optional(),
  MessageSid: Joi.string().required(),
  AccountSid: Joi.string().required()
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP, 30, 15 * 60 * 1000)) {
      return createErrorResponse('Rate limit exceeded', 429);
    }

    const contentType = request.headers.get('content-type') || '';
    let body: any;

    // Handle different content types
    if (contentType.includes('application/json')) {
      try {
        body = await request.json();
      } catch (error) {
        return createErrorResponse('Invalid JSON', 400);
      }
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      try {
        const formData = await request.formData();
        body = Object.fromEntries(formData.entries());
      } catch (error) {
        return createErrorResponse('Invalid form data', 400);
      }
    } else {
      return createErrorResponse('Unsupported content type', 400);
    }

    // Sanitize all input fields
    Object.keys(body).forEach(key => {
      if (typeof body[key] === 'string') {
        body[key] = sanitizeInput(body[key]);
      }
    });

    // Check if this is a Twilio webhook (incoming message)
    if (body.MessageSid && body.AccountSid) {
      // Validate webhook signature for security
      const twilioSignature = request.headers.get('x-twilio-signature');
      if (!twilioSignature) {
        return createErrorResponse('Missing Twilio signature', 401);
      }

      // Validate webhook data
      const webhookValidation = validateRequest(body, webhookSchema);
      if (!webhookValidation.valid) {
        return createErrorResponse(webhookValidation.error!, 400);
      }

      // Process incoming WhatsApp message
      const from = body.From;
      const messageBody = body.Body || '';
      const mediaUrl = body.MediaUrl0;

      // Log incoming message for monitoring
      console.log(`WhatsApp message from ${from}: ${messageBody.slice(0, 100)}`);

      // Auto-reply logic
      let replyMessage = 'Thank you for contacting HiringAgent! 🤖\n\n';
      
      if (messageBody.toLowerCase().includes('help')) {
        replyMessage += 'I can help you with:\n• Resume analysis\n• Job matching\n• Hiring insights\n\nSend "start" to begin!';
      } else if (messageBody.toLowerCase().includes('start')) {
        replyMessage += 'Great! Please visit our website to upload your resume: https://hiringagent.ai\n\nOr send me your resume document directly!';
      } else if (mediaUrl) {
        replyMessage += 'I received your document! 📄\n\nI\'ll analyze it and get back to you with insights shortly.';
      } else {
        replyMessage += 'Send "help" for assistance or visit https://hiringagent.ai to get started with AI-powered resume analysis!';
      }

      // Send reply
      try {
        const twilioClient = getTwilioClient();
        if (!twilioClient) {
          console.error('Twilio client not configured');
          return createSuccessResponse({ message: 'Webhook processed (no reply sent)' });
        }
        
        await twilioClient.messages.create({
          from: process.env.TWILIO_WHATSAPP_NUMBER,
          to: from,
          body: replyMessage
        });
      } catch (error) {
        console.error('Failed to send WhatsApp reply:', error);
      }

      return createSuccessResponse({ message: 'Webhook processed' });

    } else {
      // This is an outgoing message request
      const validation = validateRequest(body, whatsappMessageSchema);
      if (!validation.valid) {
        return createErrorResponse(validation.error!, 400);
      }

      const { to, message, mediaUrl } = validation.data!;

      // Send WhatsApp message
      try {
        const twilioClient = getTwilioClient();
        if (!twilioClient) {
          return createErrorResponse('WhatsApp service not configured', 503);
        }
        
        const messageOptions: any = {
          from: process.env.TWILIO_WHATSAPP_NUMBER,
          to: `whatsapp:${to}`,
          body: message
        };

        if (mediaUrl) {
          messageOptions.mediaUrl = [mediaUrl];
        }

        const result = await twilioClient.messages.create(messageOptions);

        console.log(`WhatsApp message sent to ${to}: ${result.sid}`);

        return createSuccessResponse({
          messageSid: result.sid,
          status: result.status
        });

      } catch (error: any) {
        console.error('Twilio error:', error);
        
        if (error.code === 21211) {
          return createErrorResponse('Invalid phone number format', 400);
        } else if (error.code === 21408) {
          return createErrorResponse('Permission denied for this number', 403);
        } else if (error.code === 21610) {
          return createErrorResponse('Message contains prohibited content', 400);
        } else {
          return createErrorResponse('Failed to send message', 500);
        }
      }
    }

  } catch (error) {
    console.error('WhatsApp API error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// Handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hubChallenge = searchParams.get('hub.challenge');
  const hubVerifyToken = searchParams.get('hub.verify_token');

  // Verify webhook token
  if (hubVerifyToken === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(hubChallenge, { status: 200 });
  }

  return createErrorResponse('Invalid verify token', 403);
}