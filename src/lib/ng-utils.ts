// Nigerian-specific utilities

export const LAGOS_TIMEZONE = 'Africa/Lagos';

export const validateNigerianPhone = (phone: string): boolean => {
  // Nigerian phone formats: +234XXXXXXXXXX, 0XXXXXXXXXX, 234XXXXXXXXXX
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return /^(\+234|0234|234|0)[789][01]\d{8}$/.test(cleanPhone);
};

export const formatNigerianTime = (date: Date): string => {
  return date.toLocaleString('en-NG', { 
    timeZone: LAGOS_TIMEZONE,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatNaira = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount);
};

export const formatNigerianPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  if (cleanPhone.startsWith('+234')) {
    return cleanPhone;
  } else if (cleanPhone.startsWith('0')) {
    return '+234' + cleanPhone.substring(1);
  } else if (cleanPhone.startsWith('234')) {
    return '+' + cleanPhone;
  }
  
  return phone; // Return original if format not recognized
};

// Nigerian phone validation schema for Zod
import { z } from 'zod';

export const NigerianPhoneSchema = z.string()
  .refine(validateNigerianPhone, {
    message: 'Please enter a valid Nigerian phone number (e.g., +234 803 123 4567)'
  });

export const NigerianEmailSchema = z.string()
  .email('Please enter a valid email address')
  .refine(email => email.length <= 100, {
    message: 'Email address too long'
  });