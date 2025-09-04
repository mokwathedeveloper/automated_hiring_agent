import { z } from 'zod';

export const WorkExperienceSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  duration: z.string().min(1),
  description: z.string().min(1),
});

export const EducationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  year: z.string().min(1),
});

export const ParsedResumeSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  skills: z.array(z.string()),
  experience: z.array(WorkExperienceSchema),
  education: z.array(EducationSchema),
  summary: z.string().min(1),
});

export type ParsedResumeType = z.infer<typeof ParsedResumeSchema>;