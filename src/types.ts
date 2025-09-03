// src/types.ts

export interface JobDescription {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
}

export interface Resume {
  id: string;
  candidateId: string;
  fileName: string;
  fileType: string;
  content: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumes: Resume[];
}

export interface Feedback {
  id: string;
  candidateId: string;
  jobDescriptionId: string;
  score: number;
  summary: string;
  pros: string[];
  cons: string[];
}
