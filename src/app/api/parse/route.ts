// src/app/api/parse/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

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
    // Validate request body
    let body: ParseRequest;
    try {
      body = await req.json();
    } catch (error) {
      throw new ValidationError('Invalid JSON in request body');
    }

    const { jobDescription, resume } = body;

    // Comprehensive input validation
    if (!jobDescription || typeof jobDescription !== 'string') {
      throw new ValidationError('jobDescription is required and must be a string');
    }
    
    if (!resume || typeof resume !== 'string') {
      throw new ValidationError('resume is required and must be a string');
    }

    if (jobDescription.trim().length < 10) {
      throw new ValidationError('jobDescription must be at least 10 characters long');
    }

    if (resume.trim().length < 50) {
      throw new ValidationError('resume must be at least 50 characters long');
    }

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
    let analysis: ResumeAnalysis;
    try {
      analysis = JSON.parse(content);
    } catch (error) {
      throw new JSONParseError(`Failed to parse OpenAI response as JSON: ${error instanceof Error ? error.message : 'Invalid JSON'}`);
    }

    // Validate analysis structure
    if (typeof analysis.score !== 'number' || analysis.score < 1 || analysis.score > 100) {
      throw new JSONParseError('Invalid score in analysis response');
    }

    if (!analysis.summary || typeof analysis.summary !== 'string') {
      throw new JSONParseError('Invalid summary in analysis response');
    }

    if (!Array.isArray(analysis.pros) || !Array.isArray(analysis.cons)) {
      throw new JSONParseError('Invalid pros/cons format in analysis response');
    }
    
    return NextResponse.json<ParseResponse>({
      success: true,
      data: analysis,
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