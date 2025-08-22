import { auth } from '@clerk/nextjs/server'
import { db } from '../../lib/db'
import { checkUser } from '../../lib/checkUser'
import addExpenseRecord from '../../app/actions/addExpenseRecord'

// Mock dependencies
jest.mock('@clerk/nextjs/server')
jest.mock('../../lib/db')
jest.mock('../../lib/checkUser')
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockDb = db as jest.Mocked<typeof db>
const mockCheckUser = checkUser as jest.MockedFunction<typeof checkUser>

describe('addExpenseRecord', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully add an expense record', async () => {
    // Mock auth
    mockAuth.mockResolvedValue({ userId: 'test-user-id' })

    // Mock checkUser
    mockCheckUser.mockResolvedValue({
      id: 'test-user-id',
      clerkUserId: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      imageUrl: 'https://example.com/avatar.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Mock database create
    const mockCreatedRecord = {
      id: 'record-id',
      text: 'Test expense',
      amount: 100,
      category: 'food',
      date: new Date('2024-01-15'),
      userId: 'test-user-id',
      createdAt: new Date(),
    }
    mockDb.record.create.mockResolvedValue(mockCreatedRecord)

    // Create form data
    const formData = new FormData()
    formData.set('text', 'Test expense')
    formData.set('amount', '100')
    formData.set('category', 'food')
    formData.set('date', '2024-01-15')

    const result = await addExpenseRecord(formData)

    expect(result.data).toEqual({
      text: 'Test expense',
      amount: 100,
      category: 'food',
      date: mockCreatedRecord.date.toISOString(),
    })
    expect(result.error).toBeUndefined()
    expect(mockDb.record.create).toHaveBeenCalledWith({
      data: {
        text: 'Test expense',
        amount: 100,
        category: 'food',
        date: expect.any(String),
        userId: 'test-user-id',
      },
    })
  })

  it('should return error when text is missing', async () => {
    const formData = new FormData()
    formData.set('amount', '100')
    formData.set('category', 'food')
    formData.set('date', '2024-01-15')

    const result = await addExpenseRecord(formData)

    expect(result.error).toBe('Text, amount, category, or date is missing')
    expect(result.data).toBeUndefined()
  })

  it('should return error when amount is missing', async () => {
    const formData = new FormData()
    formData.set('text', 'Test expense')
    formData.set('category', 'food')
    formData.set('date', '2024-01-15')

    const result = await addExpenseRecord(formData)

    expect(result.error).toBe('Text, amount, category, or date is missing')
    expect(result.data).toBeUndefined()
  })

  it('should return error when category is missing', async () => {
    const formData = new FormData()
    formData.set('text', 'Test expense')
    formData.set('amount', '100')
    formData.set('date', '2024-01-15')

    const result = await addExpenseRecord(formData)

    expect(result.error).toBe('Text, amount, category, or date is missing')
    expect(result.data).toBeUndefined()
  })

  it('should return error when date is missing', async () => {
    const formData = new FormData()
    formData.set('text', 'Test expense')
    formData.set('amount', '100')
    formData.set('category', 'food')

    const result = await addExpenseRecord(formData)

    expect(result.error).toBe('Text, amount, category, or date is missing')
    expect(result.data).toBeUndefined()
  })

  it('should return error when user is not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null })

    const formData = new FormData()
    formData.set('text', 'Test expense')
    formData.set('amount', '100')
    formData.set('category', 'food')
    formData.set('date', '2024-01-15')

    const result = await addExpenseRecord(formData)

    expect(result.error).toBe('User not found')
    expect(result.data).toBeUndefined()
  })

  it('should return error when checkUser fails', async () => {
    mockAuth.mockResolvedValue({ userId: 'test-user-id' })
    mockCheckUser.mockResolvedValue(null)

    const formData = new FormData()
    formData.set('text', 'Test expense')
    formData.set('amount', '100')
    formData.set('category', 'food')
    formData.set('date', '2024-01-15')

    const result = await addExpenseRecord(formData)

    expect(result.error).toBe('Failed to sync user to database')
    expect(result.data).toBeUndefined()
  })

  it('should return error when database operation fails', async () => {
    mockAuth.mockResolvedValue({ userId: 'test-user-id' })
    mockCheckUser.mockResolvedValue({
      id: 'test-user-id',
      clerkUserId: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      imageUrl: 'https://example.com/avatar.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    mockDb.record.create.mockRejectedValue(new Error('Database error'))

    const formData = new FormData()
    formData.set('text', 'Test expense')
    formData.set('amount', '100')
    formData.set('category', 'food')
    formData.set('date', '2024-01-15')

    const result = await addExpenseRecord(formData)

    expect(result.error).toBe('An unexpected error occurred while adding the expense record.')
    expect(result.data).toBeUndefined()
  })

  it('should handle invalid date format', async () => {
    const formData = new FormData()
    formData.set('text', 'Test expense')
    formData.set('amount', '100')
    formData.set('category', 'food')
    formData.set('date', 'invalid-date')

    const result = await addExpenseRecord(formData)

    expect(result.error).toBe('Invalid date format')
    expect(result.data).toBeUndefined()
  })

  it('should parse amount as number correctly', async () => {
    mockAuth.mockResolvedValue({ userId: 'test-user-id' })
    mockCheckUser.mockResolvedValue({
      id: 'test-user-id',
      clerkUserId: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      imageUrl: 'https://example.com/avatar.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const mockCreatedRecord = {
      id: 'record-id',
      text: 'Test expense',
      amount: 50.5,
      category: 'food',
      date: new Date('2024-01-15'),
      userId: 'test-user-id',
      createdAt: new Date(),
    }
    mockDb.record.create.mockResolvedValue(mockCreatedRecord)

    const formData = new FormData()
    formData.set('text', 'Test expense')
    formData.set('amount', '50.5')
    formData.set('category', 'food')
    formData.set('date', '2024-01-15')

    const result = await addExpenseRecord(formData)

    expect(result.data?.amount).toBe(50.5)
    expect(mockDb.record.create).toHaveBeenCalledWith({
      data: {
        text: 'Test expense',
        amount: 50.5,
        category: 'food',
        date: expect.any(String),
        userId: 'test-user-id',
      },
    })
  })
})
