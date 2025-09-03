// src/app/api/parse/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

// Zod schemas for robust validation
const ParseRequestSchema = z.object({
  jobDescription: z.string()
    .min(10, 'Job description must be at least 10 characters')
    .max(10000, 'Job description must not exceed 10,000 characters')
    .trim(),
  resume: z.string()
    .min(50, 'Resume must be at least 50 characters')
    .max(20000, 'Resume must not exceed 20,000 characters')
    .trim(),
});

const ResumeAnalysisSchema = z.object({
  score: z.number()
    .int('Score must be an integer')
    .min(1, 'Score must be at least 1')
    .max(100, 'Score must not exceed 100'),
  summary: z.string()
    .min(10, 'Summary must be at least 10 characters')
    .max(500, 'Summary must not exceed 500 characters')
    .trim(),
  pros: z.array(z.string().min(1, 'Each pro must be a non-empty string'))
    .min(1, 'At least one pro is required')
    .max(10, 'Maximum 10 pros allowed'),
  cons: z.array(z.string().min(1, 'Each con must be a non-empty string'))
    .min(1, 'At least one con is required')
    .max(10, 'Maximum 10 cons allowed'),
});

const ParseResponseSchema = z.object({
  success: z.boolean(),
  data: ResumeAnalysisSchema.optional(),
  error: z.string().optional(),
});

// Type definitions inferred from Zod schemas
type ParseRequest = z.infer<typeof ParseRequestSchema>;
type ResumeAnalysis = z.infer<typeof ResumeAnalysisSchema>;
type ParseResponse = z.infer<typeof ParseResponseSchema>;

// Zod validation helper functions
function validateWithZod<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      throw new ValidationError(`Validation failed: ${errorMessages}`);
    }
    throw error;
  }
}

interface OpenAIChoice {
  message?: {
    content?: string | null;
  };
}

interface OpenAIResponse {
  choices: OpenAIChoice[];
}

// Error types for comprehensive error handling
class ParseAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public errorCode: string = 'PARSE_ERROR'
  ) {
    super(message);
    this.name = 'ParseAPIError';
  }
}

class ValidationError extends ParseAPIError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

class OpenAIError extends ParseAPIError {
  constructor(message: string) {
    super(message, 502, 'OPENAI_ERROR');
    this.name = 'OpenAIError';
  }
}

class JSONParseError extends ParseAPIError {
  constructor(message: string) {
    super(message, 502, 'JSON_PARSE_ERROR');
    this.name = 'JSONParseError';
  }
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PROMPT_TEMPLATES = {
  RESUME_ANALYSIS: `You are an expert HR professional and resume analyst. Analyze the provided resume against the job description with precision and objectivity.

INSTRUCTIONS:
- Provide a numerical score from 1-100 based on job fit
- Write a concise 2-3 sentence summary
- List 3-5 specific strengths (pros) with evidence from the resume
- List 2-4 areas for improvement (cons) or missing qualifications
- Focus on skills, experience, and qualifications relevant to the job
- Be objective and constructive in your assessment

RESPONSE FORMAT (JSON only):
{
  "score": <number 1-100>,
  "summary": "<brief assessment>",
  "pros": ["<specific strength 1>", "<specific strength 2>", ...],
  "cons": ["<area for improvement 1>", "<missing qualification 1>", ...]
}

JOB DESCRIPTION:
{jobDescription}

RESUME:
{resume}

Provide your analysis in the exact JSON format specified above:`,
} as const;

export async function POST(req: NextRequest): Promise<NextResponse<ParseResponse>> {
  try {
    // Parse and validate request body with Zod
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch (error) {
      throw new ValidationError('Invalid JSON in request body');
    }

    // Validate request using Zod schema
    const { jobDescription, resume } = validateWithZod(ParseRequestSchema, rawBody);

    const prompt = PROMPT_TEMPLATES.RESUME_ANALYSIS
      .replace('{jobDescription}', jobDescription)
      .replace('{resume}', resume);

    let completion: OpenAIResponse;
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1000,
      });
    } catch (error) {
      throw new OpenAIError(`OpenAI API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Validate OpenAI response structure
    if (!completion.choices || completion.choices.length === 0) {
      throw new OpenAIError('No choices returned from OpenAI API');
    }

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new OpenAIError('No content received from OpenAI response');
    }

    // Parse and validate JSON response with Zod
    let rawAnalysis: unknown;
    try {
      rawAnalysis = JSON.parse(content);
    } catch (error) {
      throw new JSONParseError(`Failed to parse OpenAI response as JSON: ${error instanceof Error ? error.message : 'Invalid JSON'}`);
    }

    // Validate analysis using Zod schema
    let validatedAnalysis: ResumeAnalysis;
    try {
      validatedAnalysis = validateWithZod(ResumeAnalysisSchema, rawAnalysis);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new JSONParseError(`OpenAI response validation failed: ${error.message}`);
      }
      throw error;
    }
    
    return NextResponse.json<ParseResponse>({
      success: true,
      data: validatedAnalysis,
    });

  } catch (error) {
    console.error('Parse API error:', error);
    
    // Handle specific error types with appropriate responses
    if (error instanceof ValidationError) {
      return NextResponse.json<ParseResponse>(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }
    
    if (error instanceof OpenAIError) {
      return NextResponse.json<ParseResponse>(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }
    
    if (error instanceof JSONParseError) {
      return NextResponse.json<ParseResponse>(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }
    
    // Handle unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json<ParseResponse>(
      { success: false, error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}