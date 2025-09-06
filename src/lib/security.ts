import { NextRequest } from 'next/server';
import Joi from 'joi';

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Input validation schemas
export const schemas = {
  email: Joi.string().email().max(254).required(),
  resumeText: Joi.string().min(50).max(50000).required(),
  jobDescription: Joi.string().min(10).max(10000).required(),
  fileName: Joi.string().max(255).pattern(/^[a-zA-Z0-9._-]+$/).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  reviewText: Joi.string().min(10).max(1000).required(),
  name: Joi.string().min(2).max(100).pattern(/^[a-zA-Z\s]+$/).required(),
  company: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^\+234[0-9]{10}$/).optional(),
};

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data: protocol
    .trim()
    .slice(0, 10000); // Limit length
}

// Validate file upload
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only PDF and DOCX allowed.' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large. Maximum 5MB allowed.' };
  }
  
  if (file.name.length > 255) {
    return { valid: false, error: 'Filename too long.' };
  }
  
  // Check for suspicious file names
  const suspiciousPatterns = [
    /\.(exe|bat|cmd|scr|pif|com)$/i,
    /[<>:"|?*]/,
    /^\./,
    /\.\./
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(file.name)) {
      return { valid: false, error: 'Invalid filename.' };
    }
  }
  
  return { valid: true };
}

// Rate limiting
export function checkRateLimit(ip: string, limit: number = 100, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const key = ip;
  
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

// Get client IP safely
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// Validate API request
export function validateRequest(data: any, schema: Joi.ObjectSchema): { valid: boolean; error?: string; data?: any } {
  try {
    const { error, value } = schema.validate(data, { 
      stripUnknown: true,
      abortEarly: false 
    });
    
    if (error) {
      return { 
        valid: false, 
        error: error.details.map(d => d.message).join(', ') 
      };
    }
    
    return { valid: true, data: value };
  } catch (err) {
    return { valid: false, error: 'Validation failed' };
  }
}

// Security headers
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' js.paystack.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.openai.com https://api.paystack.co; frame-src 'none';"
};

// Error response helper
export function createErrorResponse(message: string, status: number = 400) {
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: sanitizeInput(message),
      timestamp: new Date().toISOString()
    }),
    { 
      status,
      headers: {
        'Content-Type': 'application/json',
        ...securityHeaders
      }
    }
  );
}

// Success response helper
export function createSuccessResponse(data: any, status: number = 200) {
  return new Response(
    JSON.stringify({ 
      success: true, 
      data,
      timestamp: new Date().toISOString()
    }),
    { 
      status,
      headers: {
        'Content-Type': 'application/json',
        ...securityHeaders
      }
    }
  );
}