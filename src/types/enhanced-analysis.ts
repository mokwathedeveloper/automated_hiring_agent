export interface EnhancedAnalysis {
  technicalSkills: { skill: string; proficiency: number }[];
  experienceMatch: number;
  educationFit: number;
  culturalFit: number;
  salaryExpectation: string;
  availabilityDate: string;
  overallScore: number;
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface AnalysisWeights {
  technicalSkills: number;
  experience: number;
  education: number;
  cultural: number;
}

export interface JobCriteria {
  requiredSkills: string[];
  experienceLevel: 'entry' | 'mid' | 'senior';
  educationLevel: 'diploma' | 'bachelor' | 'master' | 'phd';
  industry: string;
  weights: AnalysisWeights;
}