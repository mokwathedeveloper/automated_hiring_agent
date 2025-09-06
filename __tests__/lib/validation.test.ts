import { ParsedResumeSchema } from '@/lib/validation'

describe('validation', () => {
  describe('ParsedResumeSchema', () => {
    const validResumeData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+234 123 456 7890',
      skills: ['JavaScript', 'React', 'Node.js'],
      experience: [
        {
          title: 'Software Developer',
          company: 'Tech Corp',
          duration: '2020-2023',
          description: 'Developed web applications'
        }
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University of Lagos',
          year: '2020'
        }
      ],
      summary: 'Experienced software developer with expertise in web technologies'
    }

    it('validates correct resume data', () => {
      const result = ParsedResumeSchema.safeParse(validResumeData)
      expect(result.success).toBe(true)
    })

    it('requires name field', () => {
      const invalidData = { ...validResumeData, name: '' }
      const result = ParsedResumeSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('requires email field', () => {
      const invalidData = { ...validResumeData, email: '' }
      const result = ParsedResumeSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('validates email format', () => {
      const invalidData = { ...validResumeData, email: 'invalid-email' }
      const result = ParsedResumeSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('requires phone field to be non-empty string', () => {
      const dataWithEmptyPhone = { ...validResumeData, phone: '' }
      const result = ParsedResumeSchema.safeParse(dataWithEmptyPhone)
      expect(result.success).toBe(false)
    })

    it('validates skills array', () => {
      const invalidData = { ...validResumeData, skills: 'not an array' }
      const result = ParsedResumeSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('allows empty skills array', () => {
      const dataWithEmptySkills = { ...validResumeData, skills: [] }
      const result = ParsedResumeSchema.safeParse(dataWithEmptySkills)
      expect(result.success).toBe(true)
    })

    it('validates experience array structure', () => {
      const invalidData = {
        ...validResumeData,
        experience: [{ title: 'Developer' }] // missing required fields
      }
      const result = ParsedResumeSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('validates education array structure', () => {
      const invalidData = {
        ...validResumeData,
        education: [{ degree: 'BSc' }] // missing required fields
      }
      const result = ParsedResumeSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('allows empty experience array', () => {
      const dataWithEmptyExperience = { ...validResumeData, experience: [] }
      const result = ParsedResumeSchema.safeParse(dataWithEmptyExperience)
      expect(result.success).toBe(true)
    })

    it('allows empty education array', () => {
      const dataWithEmptyEducation = { ...validResumeData, education: [] }
      const result = ParsedResumeSchema.safeParse(dataWithEmptyEducation)
      expect(result.success).toBe(true)
    })

    it('requires summary field', () => {
      const invalidData = { ...validResumeData, summary: '' }
      const result = ParsedResumeSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('handles missing fields', () => {
      const incompleteData = {
        name: 'John Doe',
        email: 'john@example.com'
        // missing other required fields
      }
      const result = ParsedResumeSchema.safeParse(incompleteData)
      expect(result.success).toBe(false)
    })

    it('handles extra fields', () => {
      const dataWithExtraFields = {
        ...validResumeData,
        extraField: 'should be ignored'
      }
      const result = ParsedResumeSchema.safeParse(dataWithExtraFields)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).not.toHaveProperty('extraField')
      }
    })
  })
})