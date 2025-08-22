import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Clerk authentication
jest.mock('@clerk/nextjs', () => ({
  auth: jest.fn(() => Promise.resolve({ userId: 'test-user-id' })),
  currentUser: jest.fn(() => Promise.resolve({
    id: 'test-user-id',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    imageUrl: 'https://example.com/avatar.jpg',
    createdAt: new Date('2024-01-01'),
    lastActiveAt: new Date('2024-01-01'),
  })),
  useUser: jest.fn(() => ({
    isSignedIn: true,
    user: {
      id: 'test-user-id',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      imageUrl: 'https://example.com/avatar.jpg',
    },
  })),
  SignIn: jest.fn(() => <div>Sign In Mock</div>),
  SignUp: jest.fn(() => <div>Sign Up Mock</div>),
}))

// Mock Prisma - using relative path
jest.mock('./lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      upsert: jest.fn(),
    },
    record: {
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}))

// Mock OpenAI
jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(() => Promise.resolve({
          choices: [{ message: { content: 'Mock AI response' } }],
        })),
      },
    },
  })),
}))

// Mock Chart.js
jest.mock('chart.js/auto', () => ({
  Chart: {
    register: jest.fn(),
  },
}))

// Mock react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Bar: jest.fn(() => <div>Chart Mock</div>),
  Line: jest.fn(() => <div>Chart Mock</div>),
  Pie: jest.fn(() => <div>Chart Mock</div>),
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

global.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}))

// Mock browser APIs that don't exist in JSDOM
Object.defineProperty(global.HTMLInputElement.prototype, 'showPicker', {
  value: jest.fn(),
  writable: true,
})

// Mock other browser APIs
global.HTMLElement.prototype.showPicker = jest.fn()
