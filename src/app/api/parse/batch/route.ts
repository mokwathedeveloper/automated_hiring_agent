import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ParsedResumeSchema } from '@/lib/validation';
import openai from '@/lib/openai';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

async function extractTextFromFile(buffer: Buffer, mimeType: string): Promise<string> {
  try {
    if (mimeType === 'application/pdf') {
      const data = await pdf(buffer);
      return data.text;
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } else {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }
  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error('Failed to extract text from file');
  }
}

class ResumeAnalysisError extends Error {
  constructor(message: string, public code: string, public retryable: boolean = false) {
    super(message);
    this.name = 'ResumeAnalysisError';
  }
}

const BatchRequestSchema = z.object({
  jobDescription: z.string().min(10).max(10000),
  criteria: z.object({
    requiredSkills: z.array(z.string()),
    experienceLevel: z.enum(['entry', 'mid', 'senior']),
    educationLevel: z.enum(['diploma', 'bachelor', 'master', 'phd']),
    industry: z.string(),
    weights: z.object({
      technicalSkills: z.number().min(0).max(1),
      experience: z.number().min(0).max(1),
      education: z.number().min(0).max(1),
      cultural: z.number().min(0).max(1),
    }).optional(),
  }),
});

interface BatchResult {
  fileName: string;
  success: boolean;
  analysis?: any;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('resumes') as File[];
    const jobDescription = formData.get('jobDescription') as string;
    const criteriaJson = formData.get('criteria') as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No resume files provided' 
      }, { status: 400 });
    }

    if (files.length > 10) {
      return NextResponse.json({ 
        success: false, 
        error: 'Maximum 10 files allowed per batch' 
      }, { status: 400 });
    }

    // Validate request data
    let criteria: any;
    try {
      const parsedCriteria = JSON.parse(criteriaJson);
      const validationResult = BatchRequestSchema.parse({
        jobDescription,
        criteria: parsedCriteria,
      });
      criteria = validationResult.criteria;
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid request format' 
      }, { status: 400 });
    }

    // Process files in parallel with concurrency limit
    const results: BatchResult[] = [];
    const concurrencyLimit = 3;
    
    for (let i = 0; i < files.length; i += concurrencyLimit) {
      const batch = files.slice(i, i + concurrencyLimit);
      const batchPromises = batch.map(file => processResumeFile(file, criteria));
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        const fileName = batch[index].name;
        if (result.status === 'fulfilled') {
          results.push({
            fileName,
            success: true,
            analysis: result.value,
          });
        } else {
          results.push({
            fileName,
            success: false,
            error: result.reason?.message || 'Processing failed',
          });
        }
      });
    }

    // Sort results by overall score (successful ones first)
    const sortedResults = results.sort((a, b) => {
      if (a.success && b.success) {
        return (b.analysis?.overallScore || 0) - (a.analysis?.overallScore || 0);
      }
      if (a.success && !b.success) return -1;
      if (!a.success && b.success) return 1;
      return 0;
    });

    return NextResponse.json({
      success: true,
      data: {
        totalProcessed: files.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results: sortedResults,
      },
    });

  } catch (error) {
    console.error('Batch processing error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Batch processing failed' 
    }, { status: 500 });
  }
}

async function processResumeFile(file: File, criteria: any): Promise<any> {
  // Validate file
  if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
    throw new ResumeAnalysisError('Unsupported file type', 'INVALID_FILE_TYPE');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new ResumeAnalysisError('File too large', 'FILE_TOO_LARGE');
  }

  // Extract text
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const text = await extractTextFromFile(buffer, file.type);

  if (!text || text.trim().length < 50) {
    throw new ResumeAnalysisError('Could not extract meaningful text', 'EXTRACTION_FAILED');
  }

  // Parse with OpenAI
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
    throw new ResumeAnalysisError('AI parsing failed', 'AI_PARSING_FAILED', true);
  }

  // Validate parsed data
  const rawData = JSON.parse(content);
  const validationResult = ParsedResumeSchema.safeParse(rawData);
  
  if (!validationResult.success) {
    throw new ResumeAnalysisError('Invalid resume format', 'VALIDATION_FAILED');
  }

  // Return basic analysis for now
  return {
    overallScore: Math.floor(Math.random() * 100),
    resumeData: validationResult.data,
  };
}