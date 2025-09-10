import { EnhancedAnalysis, JobCriteria, AnalysisWeights } from '@/types/enhanced-analysis';
import { ParsedResumeType } from '@/lib/validation';
import { NIGERIAN_UNIVERSITIES } from './ng-education';

const DEFAULT_WEIGHTS: AnalysisWeights = {
  technicalSkills: 0.4,
  experience: 0.3,
  education: 0.2,
  cultural: 0.1,
};

export class ResumeAnalysisError extends Error {
  constructor(
    message: string,
    public code: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'ResumeAnalysisError';
  }
}

export function calculateEnhancedAnalysis(
  resume: ParsedResumeType,
  jobCriteria: JobCriteria
): EnhancedAnalysis {
  const weights = { ...DEFAULT_WEIGHTS, ...jobCriteria.weights };
  
  // Technical Skills Analysis
  const technicalSkills = analyzeTechnicalSkills(resume.skills, jobCriteria.requiredSkills);
  const skillsScore = calculateSkillsMatch(technicalSkills, jobCriteria.requiredSkills);
  
  // Experience Analysis
  const experienceMatch = analyzeExperience(resume.experience, jobCriteria.experienceLevel);
  
  // Education Analysis
  const educationFit = analyzeEducation(resume.education, jobCriteria.educationLevel);
  
  // Cultural Fit (based on Nigerian context)
  const culturalFit = analyzeCulturalFit(resume);
  
  // Overall Score Calculation
  const overallScore = Math.round(
    skillsScore * weights.technicalSkills +
    experienceMatch * weights.experience +
    educationFit * weights.education +
    culturalFit * weights.cultural
  );
  
  return {
    technicalSkills,
    experienceMatch,
    educationFit,
    culturalFit,
    salaryExpectation: extractSalaryExpectation(resume.summary),
    availabilityDate: extractAvailabilityDate(resume.summary),
    overallScore,
    recommendations: generateRecommendations(overallScore, skillsScore, experienceMatch),
    strengths: identifyStrengths(resume, skillsScore, experienceMatch, educationFit),
    weaknesses: identifyWeaknesses(resume, skillsScore, experienceMatch, educationFit),
  };
}

function analyzeTechnicalSkills(skills: string[], requiredSkills: string[]): { skill: string; proficiency: number }[] {
  return skills.map(skill => ({
    skill,
    proficiency: calculateSkillProficiency(skill, requiredSkills),
  }));
}

function calculateSkillsMatch(technicalSkills: { skill: string; proficiency: number }[], requiredSkills: string[]): number {
  if (requiredSkills.length === 0) return 80;
  
  const matchedSkills = technicalSkills.filter(ts => 
    requiredSkills.some(rs => rs.toLowerCase().includes(ts.skill.toLowerCase()) || ts.skill.toLowerCase().includes(rs.toLowerCase()))
  );
  
  return Math.min(100, (matchedSkills.length / requiredSkills.length) * 100);
}

function calculateSkillProficiency(skill: string, requiredSkills: string[]): number {
  const isRequired = requiredSkills.some(rs => 
    rs.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs.toLowerCase())
  );
  return isRequired ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 40) + 40;
}

function analyzeExperience(experience: any[], experienceLevel: string): number {
  const totalYears = experience.length * 1.5; // Rough estimation
  
  switch (experienceLevel) {
    case 'entry': return totalYears >= 1 ? 90 : Math.max(60, totalYears * 60);
    case 'mid': return totalYears >= 3 ? 90 : Math.max(50, totalYears * 30);
    case 'senior': return totalYears >= 5 ? 90 : Math.max(40, totalYears * 18);
    default: return 70;
  }
}

function analyzeEducation(education: any[], educationLevel: string): number {
  if (education.length === 0) return 40;
  
  const hasNigerianUniversity = education.some(edu => 
    NIGERIAN_UNIVERSITIES.some(uni => edu.institution.toLowerCase().includes(uni.toLowerCase()))
  );
  
  let baseScore = 70;
  if (hasNigerianUniversity) baseScore += 15; // Nigerian university bonus
  
  const highestEducation = education[0]; // Assume first is highest
  const degree = highestEducation.degree.toLowerCase();
  
  if (degree.includes('phd') || degree.includes('doctorate')) baseScore += 20;
  else if (degree.includes('master') || degree.includes('msc') || degree.includes('mba')) baseScore += 15;
  else if (degree.includes('bachelor') || degree.includes('bsc') || degree.includes('beng')) baseScore += 10;
  
  return Math.min(100, baseScore);
}

function analyzeCulturalFit(resume: ParsedResumeType): number {
  let score = 70; // Base cultural fit score
  
  // Nigerian phone number format
  if (resume.phone.includes('+234') || resume.phone.startsWith('0')) score += 10;
  
  // Nigerian context in experience
  const nigerianCompanies = ['flutterwave', 'paystack', 'andela', 'interswitch', 'konga', 'jumia'];
  const hasNigerianExperience = resume.experience.some(exp => 
    nigerianCompanies.some(company => exp.company.toLowerCase().includes(company))
  );
  if (hasNigerianExperience) score += 15;
  
  return Math.min(100, score);
}

function extractSalaryExpectation(summary: string): string {
  const salaryRegex = /(?:salary|compensation|pay).*?(\d+(?:,\d+)*(?:\.\d+)?k?)\s*(?:naira|ngn|₦|million)/i;
  const match = summary.match(salaryRegex);
  return match ? match[1] : 'Not specified';
}

function extractAvailabilityDate(summary: string): string {
  const dateRegex = /(?:available|start).*?(\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}\s+\w+\s+\d{4}|immediately|asap)/i;
  const match = summary.match(dateRegex);
  return match ? match[1] : 'Not specified';
}

function generateRecommendations(overallScore: number, skillsScore: number, experienceMatch: number): string[] {
  const recommendations: string[] = [];
  
  if (overallScore >= 80) {
    recommendations.push('Strong candidate - recommend for interview');
  } else if (overallScore >= 60) {
    recommendations.push('Good candidate - consider for interview');
  } else {
    recommendations.push('May need additional screening');
  }
  
  if (skillsScore < 70) {
    recommendations.push('Consider skills assessment or training program');
  }
  
  if (experienceMatch < 60) {
    recommendations.push('May benefit from mentorship or junior role');
  }
  
  return recommendations;
}

function identifyStrengths(resume: ParsedResumeType, skillsScore: number, experienceMatch: number, educationFit: number): string[] {
  const strengths: string[] = [];
  
  if (skillsScore >= 80) strengths.push('Strong technical skills match');
  if (experienceMatch >= 80) strengths.push('Excellent experience level');
  if (educationFit >= 85) strengths.push('Strong educational background');
  if (resume.skills.length >= 8) strengths.push('Diverse skill set');
  
  return strengths;
}

function identifyWeaknesses(resume: ParsedResumeType, skillsScore: number, experienceMatch: number, educationFit: number): string[] {
  const weaknesses: string[] = [];
  
  if (skillsScore < 60) weaknesses.push('Limited technical skills match');
  if (experienceMatch < 50) weaknesses.push('Insufficient experience level');
  if (educationFit < 60) weaknesses.push('Education level below requirements');
  if (resume.skills.length < 5) weaknesses.push('Limited skill diversity');
  
  return weaknesses;
}