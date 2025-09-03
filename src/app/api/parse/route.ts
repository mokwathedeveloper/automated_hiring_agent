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
    const body: ParseRequest = await req.json();
    const { jobDescription, resume } = body;

    if (!jobDescription || !resume) {
      return NextResponse.json<ParseResponse>(
        { success: false, error: 'Missing required fields: jobDescription and resume' },
        { status: 400 }
      );
    }

    const prompt = PROMPT_TEMPLATES.RESUME_ANALYSIS
      .replace('{jobDescription}', jobDescription)
      .replace('{resume}', resume);

    const completion: OpenAIResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const analysis: ResumeAnalysis = JSON.parse(content);
    
    return NextResponse.json<ParseResponse>({
      success: true,
      data: analysis,
    });

  } catch (error) {
    console.error('Parse API error:', error);
    return NextResponse.json<ParseResponse>(
      { success: false, error: 'Failed to analyze resume' },
      { status: 500 }
    );
  }
}