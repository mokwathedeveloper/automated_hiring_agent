import { NextRequest } from 'next/server';
import { POST } from '@/app/api/parse/route';

// Mock OpenAI
jest.mock('@/lib/openai', () => ({
  __esModule: true,
  default: {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  },
}));

// Mock file extraction
jest.mock('@/lib/utils', () => ({
  extractTextFromFile: jest.fn(),
}));

describe('/api/parse', () => {
  it('should return error for missing file', async () => {
    const formData = new FormData();
    const request = new NextRequest('http://localhost:3000/api/parse', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('No file provided');
  });

  it('should return error for unsupported file type', async () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', file);

    const request = new NextRequest('http://localhost:3000/api/parse', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Only PDF and DOCX files are supported');
  });
});