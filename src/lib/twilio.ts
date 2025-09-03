// src/lib/twilio.ts

import twilio from 'twilio';

// Validate required environment variables
if (!process.env.TWILIO_ACCOUNT_SID) {
  throw new Error('TWILIO_ACCOUNT_SID environment variable is required');
}

if (!process.env.TWILIO_AUTH_TOKEN) {
  throw new Error('TWILIO_AUTH_TOKEN environment variable is required');
}

if (!process.env.TWILIO_WHATSAPP_NUMBER) {
  throw new Error('TWILIO_WHATSAPP_NUMBER environment variable is required');
}

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// WhatsApp configuration
export const TWILIO_CONFIG = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER,
} as const;

// Send WhatsApp message
export async function sendWhatsAppMessage(
  to: string,
  body: string
): Promise<string> {
  try {
    const message = await client.messages.create({
      from: TWILIO_CONFIG.whatsappNumber,
      to: `whatsapp:${to}`,
      body,
    });
    
    return message.sid;
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
    throw new Error(`WhatsApp message failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Send WhatsApp message with media
export async function sendWhatsAppMessageWithMedia(
  to: string,
  body: string,
  mediaUrl: string
): Promise<string> {
  try {
    const message = await client.messages.create({
      from: TWILIO_CONFIG.whatsappNumber,
      to: `whatsapp:${to}`,
      body,
      mediaUrl: [mediaUrl],
    });
    
    return message.sid;
  } catch (error) {
    console.error('Failed to send WhatsApp message with media:', error);
    throw new Error(`WhatsApp media message failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export default client;