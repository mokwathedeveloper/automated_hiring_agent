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
  },
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

beforeEach(() => {
  jest.clearAllMocks()
})