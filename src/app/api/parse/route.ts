import { NextRequest } from 'next/server';
import openai from '@/lib/openai';
import { ParsedResume, ParseResponse } from '@/types';
import { ParsedResumeSchema } from '@/lib/validation';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { 
  validateFileUpload, 
  sanitizeInput, 
  checkRateLimit, 
  getClientIP, 
  createErrorResponse, 
  createSuccessResponse,
  schemas,
  validateRequest,
  withCORS
} from '@/lib/security';
import Joi from 'joi';

// Request validation schema
const parseRequestSchema = Joi.object({
  jobDescription: schemas.jobDescription.optional()
});

// Handle CORS pre-flight requests
export async function OPTIONS(request: NextRequest) {
  return withCORS(new Response(null, { status: 204 }), request);
}

async function extractTextFromFile(buffer: Buffer, mimeType: string): Promise<string> {
  try {
    // Additional security check
    if (buffer.length > 5 * 1024 * 1024) {
      throw new Error('File too large');
    }
    
    if (mimeType === 'application/pdf') {
      const data = await pdf(buffer);
      const text = sanitizeInput(data.text);
      if (text.length < 50) {
        throw new Error('Insufficient text content');
      }
      return text;
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer });
      const text = sanitizeInput(result.value);
      if (text.length < 50) {
        throw new Error('Insufficient text content');
      }
      return text;
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error('Failed to extract text from file');
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP, 50, 15 * 60 * 1000)) {
      return withCORS(createErrorResponse('Rate limit exceeded. Please try again later.', 429), request);
    }

    // Request size check
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
      return withCORS(createErrorResponse('Request too large', 413), request);
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (error) {
      return withCORS(createErrorResponse('Invalid form data', 400), request);
    }

    const file = formData.get('file') as File;
    const jobDescription = formData.get('jobDescription') as string;

    // File validation
    if (!file) {
      return withCORS(createErrorResponse('No file provided', 400), request);
    }

    const fileValidation = validateFileUpload(file);
    if (!fileValidation.valid) {
      return withCORS(createErrorResponse(fileValidation.error!, 400), request);
    }

    // Job description validation
    if (jobDescription) {
      const validation = validateRequest({ jobDescription }, parseRequestSchema);
      if (!validation.valid) {
        return withCORS(createErrorResponse(validation.error!, 400), request);
      }
    }

    // Extract and validate text
    let arrayBuffer: ArrayBuffer;
    try {
      arrayBuffer = await file.arrayBuffer();
    } catch (error) {
      return withCORS(createErrorResponse('Failed to read file', 400), request);
    }

    const buffer = Buffer.from(arrayBuffer);
    let text: string;
    
    try {
      text = await extractTextFromFile(buffer, file.type);
    } catch (error) {
      return withCORS(createErrorResponse('Failed to extract text from file', 400), request);
    }

    // Sanitize extracted text
    const sanitizedText = sanitizeInput(text);
    if (sanitizedText.length < 50) {
      return withCORS(createErrorResponse('Insufficient text content in file', 400), request);
    }

    // Create secure prompt
    const prompt = `Extract JSON from resume (respond only with valid JSON):
{"name":"","email":"","phone":"","skills":[],"experience":[{"title":"","company":"","duration":"","description":""}],"education":[{"degree":"","institution":"","year":""}],"summary":""}

Resume text:
${sanitizedText.slice(0, 2000)}`;

    // OpenAI API call with timeout
    let completion;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
      
      completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 500,
      });
      
      clearTimeout(timeoutId);
    } catch (error) {
      console.error('OpenAI API error:', error);
      return withCORS(createErrorResponse('AI processing failed', 500), request);
    }

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return withCORS(createErrorResponse('No response from AI', 500), request);
    }

    // Parse and validate JSON response
    let rawData;
    try {
      rawData = JSON.parse(content);
    } catch (error) {
      console.error('JSON parse error:', error);
      return withCORS(createErrorResponse('Invalid AI response format', 500), request);
    }

    // Sanitize all string fields in the response
    if (rawData && typeof rawData === 'object') {
      Object.keys(rawData).forEach(key => {
        if (typeof rawData[key] === 'string') {
          rawData[key] = sanitizeInput(rawData[key]);
        } else if (Array.isArray(rawData[key])) {
          rawData[key] = rawData[key].map((item: any) => {
            if (typeof item === 'string') {
              return sanitizeInput(item);
            } else if (typeof item === 'object' && item !== null) {
              Object.keys(item).forEach(subKey => {
                if (typeof item[subKey] === 'string') {
                  item[subKey] = sanitizeInput(item[subKey]);
                }
              });
            }
            return item;
          });
        }
      });
    }

    const validationResult = ParsedResumeSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return withCORS(createErrorResponse('Invalid resume data format', 400), request);
    }

    // Log processing time for monitoring
    const processingTime = Date.now() - startTime;
    console.log(`Resume processed in ${processingTime}ms for IP: ${clientIP}`);

    return withCORS(createSuccessResponse(validationResult.data), request);
    
  } catch (error) {
    console.error('Parse error:', error);
    return withCORS(createErrorResponse('Internal server error', 500), request);
  }
}