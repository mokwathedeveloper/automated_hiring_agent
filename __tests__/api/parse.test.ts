import { POST } from '@/app/api/parse/route'

// Mock NextRequest
const createMockRequest = (body: any, headers: Record<string, string> = {}) => {
  return {
    formData: jest.fn().mockResolvedValue(body),
    headers: new Map(Object.entries(headers)),
    cookies: {
      get: jest.fn(),
    },
  } as any;
};
import { getOpenAIClient } from '@/lib/openai'

jest.mock('@/lib/openai', () => ({
  getOpenAIClient: jest.fn(),
}))

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
    (getOpenAIClient as jest.Mock).mockReturnValue({
      client: mockOpenAIClient,
      model: 'gpt-3.5-turbo',
    });
  });

  it('handles successful resume parsing', async () => {
    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    const formData = new FormData()
    formData.append('file', mockFile)

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

    const request = createMockRequest(formData, {
      'content-type': 'multipart/form-data',
      'x-forwarded-for': '127.0.0.1',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.name).toBe('John Doe')
  })

  it('handles missing file', async () => {
    const formData = new FormData()

    const request = createMockRequest(formData, {
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
    const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const formData = new FormData()
    formData.append('file', mockFile)

    const request = createMockRequest(formData, {
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
    const largeContent = 'x'.repeat(6 * 1024 * 1024) // 6MB
    const mockFile = new File([largeContent], 'large.pdf', { type: 'application/pdf' })
    const formData = new FormData()
    formData.append('file', mockFile)

    const request = createMockRequest(formData, {
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
    const formData = new FormData()
    formData.append('file', mockFile)

    mockChatCompletionsCreate.mockRejectedValue(new Error('OpenAI API error'))

    const request = createMockRequest(formData, {
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
    const formData = new FormData()
    formData.append('file', mockFile)

    const mockCompletion = {
      choices: [{
        message: {
          content: 'invalid json'
        }
      }]
    }

    mockChatCompletionsCreate.mockResolvedValue(mockCompletion as any)

    const request = createMockRequest(formData, {
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