import { cn, createResumeHash } from '@/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('handles conditional classes', () => {
      expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3')
    })

    it('handles undefined and null', () => {
      expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2')
    })

    it('handles Tailwind conflicts', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
    })
  })

  describe('createResumeHash', () => {
    it('creates consistent hash for same content', () => {
      const content = 'test content'
      const hash1 = createResumeHash(content)
      const hash2 = createResumeHash(content)
      
      expect(hash1).toBe(hash2)
      expect(typeof hash1).toBe('string')
      expect(hash1.length).toBeGreaterThan(0)
    })

    it('creates different hashes for different content', () => {
      const hash1 = createResumeHash('content1')
      const hash2 = createResumeHash('content2')
      
      expect(hash1).not.toBe(hash2)
    })

    it('handles empty string', () => {
      const hash = createResumeHash('')
      expect(typeof hash).toBe('string')
    })

    it('handles special characters', () => {
      const hash = createResumeHash('content with special chars: !@#$%^&*()')
      expect(typeof hash).toBe('string')
      expect(hash.length).toBeGreaterThan(0)
    })

    it('returns positive hash values', () => {
      const hash = createResumeHash('test content')
      const numericValue = parseInt(hash, 36)
      expect(numericValue).toBeGreaterThan(0)
    })
  })
})