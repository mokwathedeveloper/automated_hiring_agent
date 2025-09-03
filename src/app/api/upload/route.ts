// src/app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { analyze } from '@/lib/ai';

const MIME_TYPES = {
  PDF: 'application/pdf',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
} as const;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_CONCURRENT_FILES = 5;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const jobDescriptionFile = formData.get('jobDescription') as File | null;
    const resumeFiles = formData.getAll('resumes') as File[];

    if (!jobDescriptionFile || resumeFiles.length === 0) {
      return NextResponse.json({ error: 'Missing job description or resumes' }, { status: 400 });
    }

    const parseFile = async (file: File): Promise<string> => {
      try {
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`File ${file.name} exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
        }
        
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        if (file.type === MIME_TYPES.PDF) {
          const data = await pdf(buffer);
          return data.text;
        } else if (file.type === MIME_TYPES.DOCX) {
          const { value } = await mammoth.extractRawText({ buffer });
          return value;
        } else {
          return new TextDecoder().decode(arrayBuffer);
        }
      } catch (error) {
        throw new Error(`Failed to parse file ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    const processBatch = async (files: File[]): Promise<string[]> => {
      const results: string[] = [];
      for (let i = 0; i < files.length; i += MAX_CONCURRENT_FILES) {
        const batch = files.slice(i, i + MAX_CONCURRENT_FILES);
        const batchResults = await Promise.all(batch.map(parseFile));
        results.push(...batchResults);
      }
      return results;
    };

    const jobDescriptionText = await parseFile(jobDescriptionFile);
    const resumesText = await processBatch(resumeFiles);

    const feedback = await analyze(jobDescriptionText, resumesText);

    return NextResponse.json(feedback);

  } catch (error) {
    console.error('Error processing file upload:', error);
    return NextResponse.json({ error: 'Failed to process files' }, { status: 500 });
  }
}
