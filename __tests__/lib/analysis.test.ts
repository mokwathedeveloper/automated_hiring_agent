import { calculateEnhancedAnalysis, ResumeAnalysisError } from '@/lib/analysis';
import { JobCriteria } from '@/types/enhanced-analysis';
import { ParsedResumeType } from '@/lib/validation';

const mockResume: ParsedResumeType = {
  name: 'Adebayo Ogundimu',
  email: 'adebayo@example.com',
  phone: '+234 803 123 4567',
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
  experience: [
    {
      title: 'Software Engineer',
      company: 'Flutterwave',
      duration: '2 years',
      description: 'Built payment processing systems'
    }
  ],
  education: [
    {
      degree: 'BSc Computer Science',
      institution: 'University of Lagos',
      year: '2020'
    }
  ],
  summary: 'Experienced software engineer with 2 years at Flutterwave. Available immediately. Salary expectation: 500k naira.'
};

const mockCriteria: JobCriteria = {
  requiredSkills: ['JavaScript', 'React', 'Node.js'],
  experienceLevel: 'mid',
  educationLevel: 'bachelor',
  industry: 'fintech',
  weights: {
    technicalSkills: 0.4,
    experience: 0.3,
    education: 0.2,
    cultural: 0.1,
  },
};

describe('Enhanced Analysis', () => {
  test('should calculate enhanced analysis correctly', () => {
    const result = calculateEnhancedAnalysis(mockResume, mockCriteria);
    
    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
    expect(result.technicalSkills).toHaveLength(5);
    expect(result.salaryExpectation).toBe('500k');
    expect(result.availabilityDate).toBe('immediately');
  });

  test('should handle Nigerian university bonus', () => {
    const result = calculateEnhancedAnalysis(mockResume, mockCriteria);
    expect(result.educationFit).toBeGreaterThan(70); // Should get Nigerian university bonus
  });

  test('should identify Nigerian phone format', () => {
    const result = calculateEnhancedAnalysis(mockResume, mockCriteria);
    expect(result.culturalFit).toBeGreaterThan(70); // Should get phone format bonus
  });

  test('should throw ResumeAnalysisError for invalid data', () => {
    expect(() => {
      throw new ResumeAnalysisError('Test error', 'TEST_ERROR', true);
    }).toThrow(ResumeAnalysisError);
  });
});