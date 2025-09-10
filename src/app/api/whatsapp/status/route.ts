import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    const status = {
      configured: false,
      accountSid: {
        present: !!accountSid,
        valid: accountSid && accountSid !== 'your_account_sid_here' && accountSid.startsWith('AC'),
      },
      authToken: {
        present: !!authToken,
        valid: authToken && authToken !== 'your_auth_token_here' && authToken.length > 10,
      },
      whatsappNumber: {
        present: !!whatsappNumber,
        valid: whatsappNumber && whatsappNumber !== 'whatsapp:+your_whatsapp_number_here' && whatsappNumber.startsWith('whatsapp:+'),
      },
    };

    status.configured = !!(status.accountSid.valid && status.authToken.valid && status.whatsappNumber.valid);

    return createSuccessResponse({
      status,
      message: status.configured 
        ? 'WhatsApp is properly configured' 
        : 'WhatsApp configuration incomplete',
    });
  } catch (error) {
    console.error('WhatsApp status check error:', error);
    return createErrorResponse('Failed to check WhatsApp status', 500);
  }
}
