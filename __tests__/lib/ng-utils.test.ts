import { validateNigerianPhone, formatNaira, formatNigerianTime } from '@/lib/ng-utils';

describe('Nigerian Utilities', () => {
  describe('validateNigerianPhone', () => {
    test('should validate correct Nigerian phone numbers', () => {
      expect(validateNigerianPhone('+234 803 123 4567')).toBe(true);
      expect(validateNigerianPhone('0803 123 4567')).toBe(true);
      expect(validateNigerianPhone('08031234567')).toBe(true);
      expect(validateNigerianPhone('+2348031234567')).toBe(true);
    });

    test('should reject invalid phone numbers', () => {
      expect(validateNigerianPhone('123456789')).toBe(false);
      expect(validateNigerianPhone('+1 555 123 4567')).toBe(false);
      expect(validateNigerianPhone('0123456789')).toBe(false);
    });
  });

  describe('formatNaira', () => {
    test('should format currency correctly', () => {
      expect(formatNaira(5000)).toBe('₦5,000.00');
      expect(formatNaira(15000)).toBe('₦15,000.00');
      expect(formatNaira(1000000)).toBe('₦1,000,000.00');
    });
  });

  describe('formatNigerianTime', () => {
    test('should format time in Lagos timezone', () => {
      const date = new Date('2025-01-06T12:00:00Z');
      const formatted = formatNigerianTime(date);
      expect(formatted).toContain('2025');
      expect(formatted).toContain('Jan');
    });
  });
});