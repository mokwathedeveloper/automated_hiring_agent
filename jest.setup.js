import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}))

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    section: 'section',
    h1: 'h1',
    h2: 'h2',
    p: 'p',
    li: 'li', // Ensure li is mocked as a string
  },
  useAnimation: () => ({ start: jest.fn() }),
  AnimatePresence: ({ children }) => children, // Render children directly
}))

// Mock modules will be handled in individual test files

// Global test utilities
global.fetch = jest.fn()
global.FormData = jest.fn(() => ({
  append: jest.fn(),
  get: jest.fn(),
}))

global.Response = jest.fn(() => ({
  ok: true,
  json: jest.fn(),
  text: jest.fn(),
}));

global.Request = jest.fn();

// Mock NextRequest for API tests
global.NextRequest = jest.fn().mockImplementation((url, options = {}) => {
  const request = {
    url,
    method: options.method || 'GET',
    headers: new Map(Object.entries(options.headers || {})),
    body: options.body,
    formData: jest.fn().mockResolvedValue(options.body),
    json: jest.fn().mockResolvedValue({}),
    text: jest.fn().mockResolvedValue(''),
    cookies: {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    },
    nextUrl: {
      searchParams: new URLSearchParams(),
    },
  };
  return request;
});

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn((name) => {
      if (name === 'next-auth.session-token') {
        return 'mock-session-token';
      }
      return undefined;
    }),
  })),
}));

beforeEach(() => {
  jest.clearAllMocks()
})