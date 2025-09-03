// src/app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { analyze } from '@/lib/ai';

const MIME_TYPES = {
  PDF: 'application/pdf',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
} as const;

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

    const jobDescriptionText = await parseFile(jobDescriptionFile);
    const resumesText = await Promise.all(resumeFiles.map(parseFile));

    const feedback = await analyze(jobDescriptionText, resumesText);

    return NextResponse.json(feedback);

  } catch (error) {
    console.error('Error processing file upload:', error);
    return NextResponse.json({ error: 'Failed to process files' }, { status: 500 });
  }
}
