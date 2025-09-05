import { NextRequest, NextResponse } from 'next/server';
import openai from '@/lib/openai';
import { extractTextFromFile } from '@/lib/utils';
import { ParsedResume, ParseResponse } from '@/types';
import { ParsedResumeSchema } from '@/lib/validation';
import { calculateEnhancedAnalysis, ResumeAnalysisError } from '@/lib/analysis';
import { JobCriteria } from '@/types/enhanced-analysis';

export async function POST(request: NextRequest): Promise<NextResponse<ParseResponse>> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const jobDescription = formData.get('jobDescription') as string;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Only PDF and DOCX files are supported' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size must be less than 5MB' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const text = await extractTextFromFile(buffer, file.type);

    const prompt = `Extract JSON from resume:
{"name":"","email":"","phone":"","skills":[],"experience":[{"title":"","company":"","duration":"","description":""}],"education":[{"degree":"","institution":"","year":""}],"summary":""}

${text.slice(0, 2000)}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ success: false, error: 'Failed to parse resume' }, { status: 500 });
    }

    const rawData = JSON.parse(content);
    const validationResult = ParsedResumeSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return NextResponse.json({ success: false, error: 'Invalid resume data format' }, { status: 500 });
    }

    // Enhanced analysis if job description provided
    let enhancedAnalysis = null;
    if (jobDescription) {
      const defaultCriteria: JobCriteria = {
        requiredSkills: validationResult.data.skills.slice(0, 5),
        experienceLevel: 'mid',
        educationLevel: 'bachelor',
        industry: 'technology',
        weights: {
          technicalSkills: 0.4,
          experience: 0.3,
          education: 0.2,
          cultural: 0.1,
        },
      };
      
      try {
        enhancedAnalysis = calculateEnhancedAnalysis(validationResult.data, defaultCriteria);
      } catch (error) {
        console.warn('Enhanced analysis failed:', error);
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: validationResult.data,
      enhancedAnalysis 
    });
  } catch (error) {
    console.error('Parse error:', error);
    if (error instanceof ResumeAnalysisError) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        code: error.code,
        retryable: error.retryable 
      }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to parse resume' }, { status: 500 });
  }
}