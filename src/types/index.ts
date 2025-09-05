export interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  summary: string;
}

export interface WorkExperience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface ParseResponse {
  success: boolean;
  data?: ParsedResume;
  error?: string;
}

export interface ResumeData {
  content: string;
  analysis: any;
  filename: string;
}
