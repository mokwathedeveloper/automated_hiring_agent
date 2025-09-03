// src/app/api/parse/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Validation schemas for request/response consistency
const VALIDATION_RULES = {
  jobDescription: {
    minLength: 10,
    maxLength: 10000,
    required: true,
  },
  resume: {
    minLength: 50,
    maxLength: 20000,
    required: true,
  },
  score: {
    min: 1,
    max: 100,
    type: 'number',
  },
  summary: {
    minLength: 10,
    maxLength: 500,
    type: 'string',
  },
  pros: {
    minItems: 1,
    maxItems: 10,
    type: 'array',
  },
  cons: {
    minItems: 1,
    maxItems: 10,
    type: 'array',
  },
} as const;

// Type definitions for structured API responses
interface ResumeAnalysis {
  score: number;
  summary: string;
  pros: string[];
  cons: string[];
}

interface ParseRequest {
  jobDescription: string;
  resume: string;
}

interface ParseResponse {
  success: boolean;
  data?: ResumeAnalysis;
  error?: string;
}

// Validation functions
function validateRequest(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Request body must be a valid object');
    return { isValid: false, errors };
  }
  
  // Validate jobDescription
  if (!data.jobDescription) {
    errors.push('jobDescription is required');
  } else if (typeof data.jobDescription !== 'string') {
    errors.push('jobDescription must be a string');
  } else {
    const jobDesc = data.jobDescription.trim();
    if (jobDesc.length < VALIDATION_RULES.jobDescription.minLength) {
      errors.push(`jobDescription must be at least ${VALIDATION_RULES.jobDescription.minLength} characters`);
    }
    if (jobDesc.length > VALIDATION_RULES.jobDescription.maxLength) {
      errors.push(`jobDescription must not exceed ${VALIDATION_RULES.jobDescription.maxLength} characters`);
    }
  }
  
  // Validate resume
  if (!data.resume) {
    errors.push('resume is required');
  } else if (typeof data.resume !== 'string') {
    errors.push('resume must be a string');
  } else {
    const resume = data.resume.trim();
    if (resume.length < VALIDATION_RULES.resume.minLength) {
      errors.push(`resume must be at least ${VALIDATION_RULES.resume.minLength} characters`);
    }
    if (resume.length > VALIDATION_RULES.resume.maxLength) {
      errors.push(`resume must not exceed ${VALIDATION_RULES.resume.maxLength} characters`);
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

function validateAnalysis(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Analysis must be a valid object');
    return { isValid: false, errors };
  }
  
  // Validate score
  if (typeof data.score !== 'number') {
    errors.push('score must be a number');
  } else if (data.score < VALIDATION_RULES.score.min || data.score > VALIDATION_RULES.score.max) {
    errors.push(`score must be between ${VALIDATION_RULES.score.min} and ${VALIDATION_RULES.score.max}`);
  }
  
  // Validate summary
  if (!data.summary || typeof data.summary !== 'string') {
    errors.push('summary must be a non-empty string');
  } else {
    const summary = data.summary.trim();
    if (summary.length < VALIDATION_RULES.summary.minLength) {
      errors.push(`summary must be at least ${VALIDATION_RULES.summary.minLength} characters`);
    }
    if (summary.length > VALIDATION_RULES.summary.maxLength) {
      errors.push(`summary must not exceed ${VALIDATION_RULES.summary.maxLength} characters`);
    }
  }
  
  // Validate pros
  if (!Array.isArray(data.pros)) {
    errors.push('pros must be an array');
  } else {
    if (data.pros.length < VALIDATION_RULES.pros.minItems) {
      errors.push(`pros must have at least ${VALIDATION_RULES.pros.minItems} item`);
    }
    if (data.pros.length > VALIDATION_RULES.pros.maxItems) {
      errors.push(`pros must not exceed ${VALIDATION_RULES.pros.maxItems} items`);
    }
    data.pros.forEach((pro: any, index: number) => {
      if (typeof pro !== 'string' || pro.trim().length === 0) {
        errors.push(`pros[${index}] must be a non-empty string`);
      }
    });
  }
  
  // Validate cons
  if (!Array.isArray(data.cons)) {
    errors.push('cons must be an array');
  } else {
    if (data.cons.length < VALIDATION_RULES.cons.minItems) {
      errors.push(`cons must have at least ${VALIDATION_RULES.cons.minItems} item`);
    }
    if (data.cons.length > VALIDATION_RULES.cons.maxItems) {
      errors.push(`cons must not exceed ${VALIDATION_RULES.cons.maxItems} items`);
    }
    data.cons.forEach((con: any, index: number) => {
      if (typeof con !== 'string' || con.trim().length === 0) {
        errors.push(`cons[${index}] must be a non-empty string`);
      }
    });
  }
  
  return { isValid: errors.length === 0, errors };
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
    // Parse and validate request body
    let body: any;
    try {
      body = await req.json();
    } catch (error) {
      throw new ValidationError('Invalid JSON in request body');
    }

    // Use validation schema for request validation
    const requestValidation = validateRequest(body);
    if (!requestValidation.isValid) {
      throw new ValidationError(`Request validation failed: ${requestValidation.errors.join(', ')}`);
    }

    const { jobDescription, resume }: ParseRequest = body;

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

    // Parse and validate JSON response
    let analysis: any;
    try {
      analysis = JSON.parse(content);
    } catch (error) {
      throw new JSONParseError(`Failed to parse OpenAI response as JSON: ${error instanceof Error ? error.message : 'Invalid JSON'}`);
    }

    // Use validation schema for response validation
    const analysisValidation = validateAnalysis(analysis);
    if (!analysisValidation.isValid) {
      throw new JSONParseError(`Analysis validation failed: ${analysisValidation.errors.join(', ')}`);
    }

    const validatedAnalysis: ResumeAnalysis = analysis;
    
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