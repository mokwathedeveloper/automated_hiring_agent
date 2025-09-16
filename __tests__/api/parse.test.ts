// Mock all dependencies first
const mockNextResponse = {
  json: jest.fn((data: any, options?: { status?: number }) => ({
    json: jest.fn().mockResolvedValue(data),
    status: options?.status || 200,
    headers: new Map(),
    ok: (options?.status || 200) >= 200 && (options?.status || 200) < 300,
    cookies: { get: jest.fn(), set: jest.fn() },
    clone: jest.fn(),
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
    formData: jest.fn(),
    text: jest.fn(),
    body: null,
    bodyUsed: false,
    redirected: false,
    statusText: 'OK',
    type: 'basic' as ResponseType,
    url: '',
  })),
};

jest.mock('next/server', () => ({
  NextResponse: mockNextResponse,
}));

jest.mock('@/lib/openai', () => ({
  getOpenAIClient: jest.fn(),
}));

jest.mock('@/lib/security', () => ({
  createErrorResponse: jest.fn((message, status = 400) => ({
    json: jest.fn().mockResolvedValue({ success: false, error: message }),
    status,
    headers: new Map(),
    ok: status >= 200 && status < 300,
  } as any)),
  createSuccessResponse: jest.fn((data) => ({
    json: jest.fn().mockResolvedValue({ success: true, data }),
    status: 200,
    headers: new Map(),
    ok: true,
  } as any)),
  sanitizeInput: jest.fn((input) => input),
  validateFileUpload: jest.fn(() => ({ valid: true })),
  checkRateLimit: jest.fn().mockResolvedValue(true),
  getClientIP: jest.fn().mockReturnValue('127.0.0.1'),
  validateRequest: jest.fn().mockResolvedValue({ isValid: true }),
  withCORS: jest.fn((response) => response),
  schemas: {
    jobDescription: {
      optional: jest.fn().mockReturnValue({
        validate: jest.fn().mockReturnValue({ error: null, value: '' })
      })
    }
  }
}));

jest.mock('@/lib/validation', () => ({
  ParsedResumeSchema: {
    validate: jest.fn().mockReturnValue({ error: null, value: {} })
  }
}));

jest.mock('@/lib/analysis', () => ({
  calculateEnhancedAnalysis: jest.fn().mockReturnValue({
    overallScore: 85,
    strengths: ['Good experience'],
    improvements: ['Add more skills']
  })
}));

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: [{ id: 1 }], error: null })
      })
    })
  })
}));

jest.mock('pdf-parse', () => jest.fn().mockResolvedValue({ text: 'Mock PDF content' }));
jest.mock('mammoth', () => ({
  extractRawText: jest.fn().mockResolvedValue({ value: 'Mock DOCX content' })
}));

// Now import the modules
import { POST } from '@/app/api/parse/route';
import { getOpenAIClient } from '@/lib/openai';
import * as security from '@/lib/security';

// Get references to the mocked functions
const mockValidateFileUpload = security.validateFileUpload as jest.MockedFunction<typeof security.validateFileUpload>;
const mockCreateErrorResponse = security.createErrorResponse as jest.MockedFunction<typeof security.createErrorResponse>;
const mockCreateSuccessResponse = security.createSuccessResponse as jest.MockedFunction<typeof security.createSuccessResponse>;

// Mock NextRequest helper
const createMockRequest = (file: File | null, jobDescription: string = '', headers: Record<string, string> = {}) => {
  // Create a mock FormData that directly returns the file
  const mockFormData = {
    get: jest.fn((key: string) => {
      if (key === 'file') {
        return file;
      }
      if (key === 'jobDescription') {
        return jobDescription;
      }
      return null;
    }),
    has: jest.fn((key: string) => {
      if (key === 'file') return !!file;
      if (key === 'jobDescription') return !!jobDescription;
      return false;
    }),
    entries: jest.fn(() => []),
  };

  return {
    formData: jest.fn().mockResolvedValue(mockFormData),
    headers: new Map(Object.entries(headers)),
    cookies: {
      get: jest.fn(),
    },
  } as any;
};

describe('/api/parse', () => {
  const mockChatCompletionsCreate = jest.fn();
  const mockOpenAIClient = {
    chat: {
      completions: {
        create: mockChatCompletionsCreate,
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock behaviors
    (getOpenAIClient as jest.Mock).mockReturnValue({
      client: mockOpenAIClient,
      model: 'deepseek-chat',
    });

    // Default success responses - cast as any to bypass strict typing
    mockCreateErrorResponse.mockImplementation((message, status = 400) => ({
      json: jest.fn().mockResolvedValue({ success: false, error: message }),
      status,
      headers: new Map(),
      ok: status >= 200 && status < 300,
    } as any));

    mockCreateSuccessResponse.mockImplementation((data) => ({
      json: jest.fn().mockResolvedValue({ success: true, data }),
      status: 200,
      headers: new Map(),
      ok: true,
    } as any));

    // Default file validation - success
    mockValidateFileUpload.mockReturnValue({ valid: true });
  });

  it('handles successful resume parsing', async () => {
    // Create a proper mock file with arrayBuffer method
    const mockFile = {
      name: 'test.pdf',
      type: 'application/pdf',
      size: 1000,
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(1000)),
      stream: jest.fn(),
      text: jest.fn(),
      slice: jest.fn(),
    } as any;

    const mockCompletion = {
      choices: [{
        message: {
          content: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+234 123 456 7890',
            skills: ['JavaScript', 'React'],
            experience: [],
            education: [],
            summary: 'Experienced developer'
          })
        }
      }]
    }

    mockChatCompletionsCreate.mockResolvedValue(mockCompletion as any)

    const request = createMockRequest(mockFile, '', {
      'content-type': 'multipart/form-data',
      'x-forwarded-for': '127.0.0.1',
    })

    const response = await POST(request)
    const data = await response.json()

    // Debug: Log the actual response to see what's happening
    if (response.status !== 200) {
      console.log('Unexpected response:', { status: response.status, data });
    }

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.name).toBe('John Doe')
  })

  it('handles missing file', async () => {
    const request = createMockRequest(null, '', {
      'content-type': 'multipart/form-data',
      'x-forwarded-for': '127.0.0.1',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('No file provided')
  })

  it('handles unsupported file type', async () => {
    // Mock file validation to return error for unsupported file type
    mockValidateFileUpload.mockReturnValue({
      valid: false,
      error: 'Only PDF and DOCX files are supported'
    });

    const mockFile = {
      name: 'test.txt',
      type: 'text/plain',
      size: 1000,
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(1000)),
      stream: jest.fn(),
      text: jest.fn(),
      slice: jest.fn(),
    } as any;

    const request = createMockRequest(mockFile, '', {
      'content-type': 'multipart/form-data',
      'x-forwarded-for': '127.0.0.1',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Only PDF and DOCX files are supported')
  })

  it('handles file size limit', async () => {
    // Mock file validation to return error for large file
    mockValidateFileUpload.mockReturnValue({
      valid: false,
      error: 'File size must be less than 5MB'
    });

    const largeContent = 'x'.repeat(6 * 1024 * 1024) // 6MB
    const mockFile = new File([largeContent], 'large.pdf', { type: 'application/pdf' })

    const request = createMockRequest(mockFile, '', {
      'content-type': 'multipart/form-data',
      'x-forwarded-for': '127.0.0.1',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('File size must be less than 5MB')
  })

  it('handles OpenAI API errors', async () => {
    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })

    mockChatCompletionsCreate.mockRejectedValue(new Error('OpenAI API error'))

    const request = createMockRequest(mockFile, '', {
      'content-type': 'multipart/form-data',
      'x-forwarded-for': '127.0.0.1',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Failed to parse resume')
  })

  it('handles invalid JSON response from OpenAI', async () => {
    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })

    const mockCompletion = {
      choices: [{
        message: {
          content: 'invalid json'
        }
      }]
    }

    mockChatCompletionsCreate.mockResolvedValue(mockCompletion as any)

    const request = createMockRequest(mockFile, '', {
      'content-type': 'multipart/form-data',
      'x-forwarded-for': '127.0.0.1',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Failed to parse resume')
  })
})