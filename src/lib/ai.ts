// src/lib/ai.ts

import OpenAI from 'openai';
import { randomUUID } from 'crypto';
import { JobDescription, Resume, Feedback } from '@/types';

const AI_CONFIG = {
  MODEL: 'gpt-3.5-turbo',
  DEFAULT_JOB_ID: 'job-1',
} as const;

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyze(jobDescription: string, resumes: string[]): Promise<Feedback[]> {
  const responses = await Promise.all(
    resumes.map(async (resume) => {
      const prompt = `
        Given the following job description and resume, please provide a score from 1-100, a brief summary, a list of pros, and a list of cons.
        Return the data in a JSON format like this: {"score": 85, "summary": "...", "pros": ["...", "..."], "cons": ["...", "..."]}

        Job Description:
        ${jobDescription}

        Resume:
        ${resume}
      `;

      const completion = await openai.chat.completions.create({
        model: AI_CONFIG.MODEL,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('No content in response');
      }
      
      try {
        return JSON.parse(content);
      } catch (parseError) {
        throw new Error(`Failed to parse OpenAI response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }
    })
  );

  return responses.map((response, index) => ({
    id: randomUUID(),
    candidateId: `candidate-${randomUUID()}`,
    jobDescriptionId: AI_CONFIG.DEFAULT_JOB_ID,
    ...response,
  }));
}
