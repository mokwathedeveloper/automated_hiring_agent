// src/lib/twilio.ts

import twilio from 'twilio';

// Validate required environment variables
if (!process.env.TWILIO_ACCOUNT_SID) {
  console.warn('TWILIO_ACCOUNT_SID environment variable is not set');
}

if (!process.env.TWILIO_AUTH_TOKEN) {
  console.warn('TWILIO_AUTH_TOKEN environment variable is not set');
}

if (!process.env.TWILIO_WHATSAPP_NUMBER) {
  console.warn('TWILIO_WHATSAPP_NUMBER environment variable is not set');
}

// Initialize Twilio client conditionally
let client: any = null;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

// WhatsApp configuration
export const TWILIO_CONFIG = {
  accountSid: process.env.TWILIO_ACCOUNT_SID || '',
  authToken: process.env.TWILIO_AUTH_TOKEN || '',
  whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || '',
} as const;

// Send WhatsApp message
export async function sendWhatsAppMessage(
  to: string,
  body: string
): Promise<string> {
  if (!client) {
    throw new Error('Twilio client not initialized. Check environment variables.');
  }
  
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
  if (!client) {
    throw new Error('Twilio client not initialized. Check environment variables.');
  }
  
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