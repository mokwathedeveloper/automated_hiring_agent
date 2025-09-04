import { NextRequest, NextResponse } from 'next/server';
import openai from '@/lib/openai';
import { extractTextFromFile } from '@/lib/utils';
import { ParsedResume, ParseResponse } from '@/types';
import { ParsedResumeSchema } from '@/lib/validation';

export async function POST(request: NextRequest): Promise<NextResponse<ParseResponse>> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Only PDF and DOCX files are supported' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size must be less than 5MB' }, { status: 400 });
    }

    const text = await extractTextFromFile(file);

    const prompt = `Parse the following resume text and extract structured information. Return a JSON object with the following structure:
{
  "name": "Full name",
  "email": "Email address",
  "phone": "Phone number",
  "skills": ["skill1", "skill2"],
  "experience": [{"title": "Job title", "company": "Company name", "duration": "Duration", "description": "Brief description"}],
  "education": [{"degree": "Degree", "institution": "Institution", "year": "Year"}],
  "summary": "Brief professional summary"
}

Resume text:
${text}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 1000,
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

    return NextResponse.json({ success: true, data: validationResult.data });
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json({ success: false, error: 'Failed to parse resume' }, { status: 500 });
  }
}