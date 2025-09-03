// src/app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { analyze } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const jobDescriptionFile = formData.get('jobDescription') as File | null;
    const resumeFiles = formData.getAll('resumes') as File[];

    if (!jobDescriptionFile || resumeFiles.length === 0) {
      return NextResponse.json({ error: 'Missing job description or resumes' }, { status: 400 });
    }

    const parseFile = async (file: File) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      if (file.type === 'application/pdf') {
        const data = await pdf(buffer);
        return data.text;
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const { value } = await mammoth.extractRawText({ buffer });
        return value;
      } else {
        return new TextDecoder().decode(arrayBuffer);
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
