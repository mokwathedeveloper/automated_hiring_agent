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
    } catch (error) {
      console.error('File reading error:', error);
      return withCORS(createErrorResponse('Failed to read file. The file may be corrupted or too large.', 400), request);
    }

    const buffer = Buffer.from(arrayBuffer);
    let text: string;

    try {
      text = await extractTextFromFile(buffer, file.type);
    } catch (error) {
      console.error('Text extraction error:', error);
      let errorMessage = 'Failed to extract text from file';

      if (error instanceof Error) {
        if (error.message.includes('Insufficient text content')) {
          errorMessage = 'The uploaded file does not contain enough readable text. Please ensure the file is a valid resume with text content.';
        } else if (error.message.includes('File too large')) {
          errorMessage = 'The file is too large to process. Please upload a file smaller than 5MB.';
        } else if (error.message.includes('Unsupported file type')) {
          errorMessage = 'Unsupported file format. Please upload a PDF or DOCX file.';
        } else {
          errorMessage = `File processing failed: ${error.message}`;
        }
      }

      return withCORS(createErrorResponse(errorMessage, 400), request);
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

    try {
      // Use DeepSeek API for resume parsing
      const { client: deepseekClient, model } = getOpenAIClient();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      completion = await deepseekClient.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 500,
      });

      clearTimeout(timeoutId);
    } catch (error) {
      console.error('DeepSeek API Error:', error);

      if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
        console.error('DeepSeek API authentication failed.');
        return withCORS(createErrorResponse('AI processing failed: Invalid API key. Please check DeepSeek configuration.', 500), request);
      } else {
        // Handle other types of API errors or network errors
        let errorMessage = 'AI processing failed. Please try again later.';
        if (error && typeof error === 'object' && 'status' in error) {
          switch (error.status) {
            case 429:
              errorMessage = 'You have exceeded your API quota. Please check your DeepSeek plan and billing details.';
              break;
            case 500:
              errorMessage = 'The DeepSeek API is currently experiencing issues. Please try again later.';
              break;
            default:
              errorMessage = `An unexpected error occurred with the DeepSeek API (Status: ${error.status}).`;
              break;
          }
        }
        return withCORS(createErrorResponse(errorMessage, 500), request);
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
      console.error('AI response content:', cleanedContent);

      // Try to provide a more helpful error message
      let errorMessage = 'The AI service returned an invalid response format';

      if (cleanedContent.length === 0) {
        errorMessage = 'The AI service returned an empty response. Please try again.';
      } else if (cleanedContent.includes('error') || cleanedContent.includes('Error')) {
        errorMessage = 'The AI service encountered an error processing your file. Please try with a different file.';
      } else {
        errorMessage = 'The AI service response could not be processed. This may be a temporary issue - please try again.';
      }

      return withCORS(createErrorResponse(errorMessage, 502), request);
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
    // Note: Requires candidates table with education JSONB column
    // Run migration: migrations/supabase/20250909135157_create_candidates_table.up.sql
    console.log('Data to be inserted into Supabase:', validationResult.data);

    // TEMPORARY: Skip Supabase insert for testing (remove this when migration is complete)
    const SKIP_DATABASE_INSERT = process.env.SKIP_DATABASE_INSERT === 'true';

    if (SKIP_DATABASE_INSERT) {
      console.log('⚠️  SKIPPING DATABASE INSERT (SKIP_DATABASE_INSERT=true)');
      console.log('✅ Resume parsing successful, but not saved to database');
    } else {
      // First, let's check if the candidates table exists
      const { data: tableCheck, error: tableError } = await supabase
        .from('candidates')
        .select('id')
        .limit(1);

      if (tableError) {
        console.error('Candidates table check failed:', tableError);
        console.error('This likely means the migration has not been run yet.');
        console.error('Please run the migration: migrations/supabase/20250909135157_create_candidates_table.up.sql');
        console.error('💡 Temporary fix: Add SKIP_DATABASE_INSERT=true to your .env to test without database');
        return withCORS(createErrorResponse('Database not properly configured. Please run migrations.', 500), request);
      }

      // Prepare the data for insertion
      const candidateData = {
        name: validationResult.data.name,
        email: validationResult.data.email,
        phone: validationResult.data.phone,
        work_experience: validationResult.data.experience, // JSONB field
        skills: validationResult.data.skills, // TEXT[] array
        education: validationResult.data.education, // JSONB field
      };

      console.log('Attempting to insert candidate data:', candidateData);

      const { data: insertedData, error: insertError } = await supabase
        .from('candidates')
        .insert(candidateData)
        .select();

      if (insertError) {
        console.error('Error saving candidate to Supabase:');
        console.error('Message:', insertError.message);
        console.error('Details:', insertError.details);
        console.error('Hint:', insertError.hint);
        console.error('Code:', insertError.code);
        console.error('Full error object:', JSON.stringify(insertError, null, 2));

        // Provide user-friendly error messages based on error type
        let userMessage = 'Failed to save candidate data';

        if (insertError.code === '23505') {
          userMessage = 'A candidate with this email already exists in the database';
        } else if (insertError.code === '23502') {
          userMessage = 'Required candidate information is missing';
        } else if (insertError.message.includes('permission')) {
          userMessage = 'Database permission error. Please contact support.';
        } else if (insertError.message.includes('connection')) {
          userMessage = 'Database connection error. Please try again later.';
        } else {
          userMessage = `Database error: ${insertError.message}`;
        }

        return withCORS(createErrorResponse(userMessage, 500), request);
      }

      console.log(`Candidate saved to Supabase successfully:`, insertedData);
    }

    return withCORS(createSuccessResponse(validationResult.data), request);
    
  } catch (error) {
    console.error('Parse error:', error);

    // Provide more specific error messages based on error type
    let errorMessage = 'Internal server error';
    let statusCode = 500;

    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('fetch')) {
        errorMessage = 'Network error occurred while processing request';
        statusCode = 503;
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again with a smaller file';
        statusCode = 408;
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Invalid data format received';
        statusCode = 422;
      } else if (error.message.includes('validation')) {
        errorMessage = 'Data validation failed';
        statusCode = 400;
      } else {
        errorMessage = `Processing failed: ${error.message}`;
      }
    }

    return withCORS(createErrorResponse(errorMessage, statusCode), request);
  }
}