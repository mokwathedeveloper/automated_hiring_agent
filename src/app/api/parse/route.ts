import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient, markApiKeyAsInvalid } from '@/lib/openai';
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
import { OpenAI } from 'openai';
import { createClient } from '@/lib/supabase/server'; // Use centralized Supabase client

// Request validation schema
const parseRequestSchema = Joi.object({
  jobDescription: schemas.jobDescription.optional()
});

// Handle CORS pre-flight requests
export async function OPTIONS(request: NextRequest) {
  return withCORS(new NextResponse(null, { status: 204 }), request);
}

async function extractTextFromFile(buffer: Buffer, mimeType: string): Promise<string> {
  try {
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
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP, 50, 15 * 60 * 1000)) {
      return withCORS(createErrorResponse('Rate limit exceeded. Please try again later.', 429), request);
    }

    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
      return withCORS(createErrorResponse('Request too large', 413), request);
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return withCORS(createErrorResponse('Invalid form data', 400), request);
    }

    const file = formData.get('file') as File;
    const jobDescription = formData.get('jobDescription') as string;

    if (!file) {
      return withCORS(createErrorResponse('No file provided', 400), request);
    }

    const fileValidation = validateFileUpload(file);
    if (!fileValidation.valid) {
      return withCORS(createErrorResponse(fileValidation.error!, 400), request);
    }

    if (jobDescription) {
      const validation = validateRequest({ jobDescription }, parseRequestSchema);
      if (!validation.valid) {
        return withCORS(createErrorResponse(validation.error!, 400), request);
      }
    }

    let arrayBuffer: ArrayBuffer;
    try {
      arrayBuffer = await file.arrayBuffer();
    } catch {
      return withCORS(createErrorResponse('Failed to read file', 400), request);
    }

    const buffer = Buffer.from(arrayBuffer);
    let text: string;
    
    try {
      text = await extractTextFromFile(buffer, file.type);
    } catch {
      return withCORS(createErrorResponse('Failed to extract text from file', 400), request);
    }

    const sanitizedText = sanitizeInput(text);
    if (sanitizedText.length < 50) {
      return withCORS(createErrorResponse('Insufficient text content in file', 400), request);
    }

    const prompt = `Extract JSON from resume (respond only with valid JSON):
{"name":"","email":"","phone":"","skills":[],"experience":[{"title":"","company":"","duration":"","description":""}],"education":[{"degree":"","institution":"","year":""}],"summary":""}

Resume text:
${sanitizedText.slice(0, 2000)}`;

    let completion;
    let attempts = 0;
    const MAX_ATTEMPTS = 3; // Max attempts to try different API keys

    while (attempts < MAX_ATTEMPTS) {
      try {
        const { client: openai, model } = getOpenAIClient(); // Get an OpenAI client and model with the current active key
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        completion = await openai.chat.completions.create({
          model: model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1,
          max_tokens: 500,
        });
        
        clearTimeout(timeoutId);
        break; // Success, exit loop
      } catch (error) {
        console.error('OpenAI API Error:', error); 

        if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
          markApiKeyAsInvalid(); // Mark current key as invalid and switch
          attempts++;
          if (attempts < MAX_ATTEMPTS) {
            console.warn(`Retrying API call with a new key (attempt ${attempts}/${MAX_ATTEMPTS}).`);
            continue; // Retry with next key
          } else {
            console.error('All API keys exhausted after multiple attempts.');
            return withCORS(createErrorResponse('AI processing failed: All API keys exhausted.', 500), request);
          }
        } else {
          // Handle other types of API errors or network errors
          let errorMessage = 'AI processing failed. Please try again later.';
          if (error && typeof error === 'object' && 'status' in error) {
            switch (error.status) {
              case 429:
                errorMessage = 'You have exceeded your API quota. Please check your plan and billing details.';
                break;
              case 500:
                errorMessage = 'The AI API is currently experiencing issues. Please try again later.';
                break;
              default:
                errorMessage = `An unexpected error occurred with the AI API (Status: ${error.status}).`;
                break;
            }
          }
          return withCORS(createErrorResponse(errorMessage, 500), request);
        }
      }
    }

    const content = completion!.choices[0]?.message?.content;
    if (!content) {
      return withCORS(createErrorResponse('No response from AI', 500), request);
    }

    let rawData;
    let cleanedContent = content;
    // Attempt to extract JSON from markdown code block if present
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      cleanedContent = jsonMatch[1];
    }

    try {
      rawData = JSON.parse(cleanedContent);
    } catch (error) {
      console.error('JSON parse error:', error);
      return withCORS(createErrorResponse('Invalid AI response format', 500), request);
    }

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

    const processingTime = Date.now() - startTime;
    console.log(`Resume processed in ${processingTime}ms for IP: ${clientIP}`);

    // Use centralized Supabase client
    const supabase = await createClient();

    // Save parsed data to Supabase candidates table
    console.log('Data to be inserted into Supabase:', validationResult.data);
    const { data: candidateData, error: insertError } = await supabase
      .from('candidates')
      .insert({
        name: validationResult.data.name,
        email: validationResult.data.email,
        phone: validationResult.data.phone,
        work_experience: validationResult.data.experience,
        skills: validationResult.data.skills,
        education: validationResult.data.education,
      })
      .select();

    if (insertError) {
      console.error('Error saving candidate to Supabase:', insertError.message, insertError.details, insertError.hint, insertError.code);
      return withCORS(createErrorResponse('Failed to save candidate data.', 500), request);
    }

    console.log(`Candidate saved to Supabase:`, candidateData);

    return withCORS(createSuccessResponse(validationResult.data), request);
    
  } catch (error) {
    console.error('Parse error:', error);
    return withCORS(createErrorResponse('Internal server error', 500), request);
  }
}