import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from '../../contexts/ThemeContext'

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Test data utilities
export const mockUser = {
  id: 'test-user-id',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  imageUrl: 'https://example.com/avatar.jpg',
  createdAt: new Date('2024-01-01'),
  lastActiveAt: new Date('2024-01-01'),
}

export const mockRecord = {
  id: 'record-id',
  text: 'Test expense',
  amount: 100,
  category: 'food',
  date: new Date('2024-01-15'),
  userId: 'test-user-id',
  createdAt: new Date('2024-01-15'),
}

export const mockRecords = [
  {
    id: 'record-1',
    text: 'Lunch',
    amount: 25,
    category: 'food',
    date: new Date('2024-01-15'),
    userId: 'test-user-id',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'record-2',
    text: 'Gas',
    amount: 50,
    category: 'transportation',
    date: new Date('2024-01-14'),
    userId: 'test-user-id',
    createdAt: new Date('2024-01-14'),
  },
  {
    id: 'record-3',
    text: 'Movie tickets',
    amount: 30,
    category: 'entertainment',
    date: new Date('2024-01-13'),
    userId: 'test-user-id',
    createdAt: new Date('2024-01-13'),
  },
]

export const mockInsights = [
  {
    id: 'insight-1',
    type: 'warning' as const,
    title: 'High Food Spending',
    message: 'Your food spending is 20% higher than last month',
    action: 'Review food expenses',
    confidence: 0.85,
  },
  {
    id: 'insight-2',
    type: 'success' as const,
    title: 'Budget Goal Achieved',
    message: 'You stayed within your entertainment budget this month',
    action: 'Keep it up!',
    confidence: 0.95,
  },
]

// Form data utilities
export const createFormData = (data: Record<string, string | number>) => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    formData.set(key, value.toString())
  })
  return formData
}

// Async utilities
export const waitForLoadingToFinish = async () => {
  // Wait for any loading states to finish
  await new Promise(resolve => setTimeout(resolve, 100))
}

// Mock functions
export const mockConsoleError = () => {
  const originalError = console.error
  const mockError = jest.fn()
  console.error = mockError
  return {
    mockError,
    restore: () => {
      console.error = originalError
    },
  }
}

export const mockConsoleWarn = () => {
  const originalWarn = console.warn
  const mockWarn = jest.fn()
  console.warn = mockWarn
  return {
    mockWarn,
    restore: () => {
      console.warn = originalWarn
    },
  }
}
