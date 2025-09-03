// src/app/api/whatsapp/route.ts

import { NextRequest, NextResponse } from 'next/server';
// import { sendWhatsAppMessage } from '@/lib/twilio';

interface WhatsAppMessage {
  From: string;
  To: string;
  Body: string;
  MessageSid: string;
  NumMedia: string;
  MediaUrl0?: string;
  MediaContentType0?: string;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const message: WhatsAppMessage = {
      From: formData.get('From') as string,
      To: formData.get('To') as string,
      Body: formData.get('Body') as string,
      MessageSid: formData.get('MessageSid') as string,
      NumMedia: formData.get('NumMedia') as string,
      MediaUrl0: formData.get('MediaUrl0') as string || undefined,
      MediaContentType0: formData.get('MediaContentType0') as string || undefined,
    };

    console.log('Received WhatsApp message:', {
      from: message.From,
      body: message.Body,
      hasMedia: parseInt(message.NumMedia) > 0,
      mediaType: message.MediaContentType0,
    });

    // Extract phone number from WhatsApp format
    const phoneNumber = message.From.replace('whatsapp:', '');
    
    // Handle different message types
    if (parseInt(message.NumMedia) > 0 && message.MediaUrl0) {
      // Message with media (file attachment)
      await handleMediaMessage(message, phoneNumber);
    } else if (message.Body.toLowerCase().includes('help')) {
      // Help command
      await handleHelpMessage(phoneNumber);
    } else {
      // Regular text message
      await handleTextMessage(message, phoneNumber);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleMediaMessage(message: WhatsAppMessage, phoneNumber: string) {
  try {
    const mediaType = message.MediaContentType0;
    
    if (mediaType === 'application/pdf' || 
        mediaType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      
      // await sendWhatsAppMessage(
      //   phoneNumber,
      //   '📄 Resume received! I\'ll analyze it shortly. Please also send the job description if you haven\'t already.'
      // );
      console.log('Would send: Resume received message to', phoneNumber);
      
      // TODO: Process the media file for resume analysis
      console.log('Processing resume file:', message.MediaUrl0);
      
    } else {
      // await sendWhatsAppMessage(
      //   phoneNumber,
      //   '❌ Please send only PDF or DOCX files for resume analysis.'
      // );
      console.log('Would send: File type error to', phoneNumber);
    }
  } catch (error) {
    console.error('Error handling media message:', error);
    // await sendWhatsAppMessage(
    //   phoneNumber,
    //   '⚠️ Sorry, there was an error processing your file. Please try again.'
    // );
    console.log('Would send: Error message to', phoneNumber);
  }
}

async function handleHelpMessage(phoneNumber: string) {
  const helpText = `🤖 *Automated Hiring Agent*

How to use:
1. Send your resume (PDF or DOCX)
2. Send the job description (PDF or DOCX)
3. I'll analyze the match and send results

Commands:
• Type "help" for this message
• Send files to start analysis

Need assistance? Just send your documents!`;

  // await sendWhatsAppMessage(phoneNumber, helpText);
  console.log('Would send help text to', phoneNumber);
}

async function handleTextMessage(message: WhatsAppMessage, phoneNumber: string) {
  if (message.Body.trim()) {
    // await sendWhatsAppMessage(
    //   phoneNumber,
    //   '👋 Hi! Send me a resume and job description (PDF/DOCX files) for analysis. Type "help" for more info.'
    // );
    console.log('Would send welcome message to', phoneNumber);
  }
}