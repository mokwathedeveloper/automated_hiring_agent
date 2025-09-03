// src/app/api/parse/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { supabaseAdmin, db } from '@/lib/supabase';

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
  RESUME_ANALYSIS: `You are a senior HR professional with 15+ years of experience in talent acquisition and resume evaluation. Your expertise spans multiple industries and you excel at objective candidate assessment.

CONTEXT & ROLE:
- Evaluate candidates with fairness and precision
- Focus on job-relevant qualifications and transferable skills
- Consider both technical competencies and cultural fit indicators
- Provide actionable feedback for candidate improvement

ANALYSIS FRAMEWORK:
1. RELEVANCE SCORING (40%): Direct job requirement alignment
2. EXPERIENCE QUALITY (30%): Depth, progression, and achievements
3. SKILLS MATCH (20%): Technical and soft skills compatibility
4. POTENTIAL INDICATORS (10%): Growth trajectory and adaptability

EVALUATION CRITERIA:
- Score 90-100: Exceptional fit, exceeds most requirements
- Score 75-89: Strong candidate, meets key requirements with minor gaps
- Score 60-74: Good potential, some important requirements missing
- Score 45-59: Moderate fit, significant skill/experience gaps
- Score 1-44: Poor match, major misalignment with role requirements

OUTPUT REQUIREMENTS:
- Provide numerical score (1-100) with clear justification
- Write 2-3 sentence executive summary highlighting key findings
- List 3-5 specific strengths with concrete evidence from resume
- Identify 2-4 improvement areas or missing qualifications
- Maintain professional, constructive tone throughout
- Base all assessments on factual resume content

RESPONSE FORMAT (Valid JSON only):
{
  "score": <integer between 1-100>,
  "summary": "<concise professional assessment>",
  "pros": ["<specific strength with evidence>", "<another strength>", ...],
  "cons": ["<improvement area or gap>", "<another consideration>", ...]
}

JOB DESCRIPTION:
{jobDescription}

RESUME TO ANALYZE:
{resume}

Provide your professional analysis in the exact JSON format specified:`,
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

    // Store resume analysis in database if user is authenticated
    const authHeader = req.headers.get('authorization');
    if (authHeader && supabaseAdmin) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabaseAdmin.auth.getUser(token);
        
        if (user) {
          await db.insertResume(user.id, {
            content: resume,
            analysis: validatedAnalysis,
            filename: 'uploaded_resume.txt',
            file_type: 'text/plain'
          });
        }
      } catch (dbError) {
        console.error('Database storage error:', dbError);
        // Continue without failing the request
      }
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