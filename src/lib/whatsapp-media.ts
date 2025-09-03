// src/lib/whatsapp-media.ts

// import { TWILIO_CONFIG } from './twilio';

// Fallback config for build
const TWILIO_CONFIG = {
  accountSid: process.env.TWILIO_ACCOUNT_SID || '',
  authToken: process.env.TWILIO_AUTH_TOKEN || '',
  whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || '',
};

interface MediaDownloadResult {
  success: boolean;
  content?: string;
  error?: string;
  fileName?: string;
  contentType?: string;
}

// Download media file from Twilio
export async function downloadWhatsAppMedia(
  mediaUrl: string,
  contentType: string
): Promise<MediaDownloadResult> {
  try {
    if (!TWILIO_CONFIG.accountSid || !TWILIO_CONFIG.authToken) {
      throw new Error('Twilio credentials not configured');
    }

    // Create basic auth header for Twilio API
    const auth = Buffer.from(`${TWILIO_CONFIG.accountSid}:${TWILIO_CONFIG.authToken}`).toString('base64');
    
    const response = await fetch(mediaUrl, {
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download media: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    return {
      success: true,
      content: buffer.toString('base64'),
      contentType,
      fileName: `whatsapp-media-${Date.now()}.${getFileExtension(contentType)}`,
    };
  } catch (error) {
    console.error('Error downloading WhatsApp media:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Extract text from downloaded media
export async function extractTextFromWhatsAppMedia(
  base64Content: string,
  contentType: string
): Promise<{ success: boolean; text?: string; error?: string }> {
  try {
    const buffer = Buffer.from(base64Content, 'base64');
    
    if (contentType === 'application/pdf') {
      // Use existing PDF extraction
      const pdfParse = (await import('pdf-parse')).default;
      const data = await pdfParse(buffer);
      return {
        success: true,
        text: data.text,
      };
    } else if (contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Use existing DOCX extraction
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      return {
        success: true,
        text: result.value,
      };
    } else {
      throw new Error(`Unsupported content type: ${contentType}`);
    }
  } catch (error) {
    console.error('Error extracting text from media:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Process WhatsApp media for resume analysis
export async function processWhatsAppMediaForAnalysis(
  mediaUrl: string,
  contentType: string
): Promise<{ success: boolean; text?: string; error?: string }> {
  try {
    // Download the media file
    const downloadResult = await downloadWhatsAppMedia(mediaUrl, contentType);
    
    if (!downloadResult.success || !downloadResult.content) {
      return {
        success: false,
        error: downloadResult.error || 'Failed to download media',
      };
    }

    // Extract text from the downloaded file
    const extractResult = await extractTextFromWhatsAppMedia(
      downloadResult.content,
      contentType
    );

    if (!extractResult.success) {
      return {
        success: false,
        error: extractResult.error || 'Failed to extract text',
      };
    }

    return {
      success: true,
      text: extractResult.text,
    };
  } catch (error) {
    console.error('Error processing WhatsApp media:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Get file extension from content type
function getFileExtension(contentType: string): string {
  switch (contentType) {
    case 'application/pdf':
      return 'pdf';
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'docx';
    default:
      return 'bin';
  }
}

// Validate supported media types
export function isSupportedMediaType(contentType: string): boolean {
  return contentType === 'application/pdf' || 
         contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
}