import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddNewRecord from '../../app/components/AddNewRecord'

// Mock the server actions
jest.mock('../../app/actions/addExpenseRecord', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('../../app/actions/suggestCategory', () => ({
  suggestCategory: jest.fn(),
}))

describe('AddNewRecord', () => {
  const mockAddExpenseRecord = require('../../app/actions/addExpenseRecord').default
  const mockSuggestCategory = require('../../app/actions/suggestCategory').suggestCategory

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the component with correct title', () => {
    render(<AddNewRecord />)
    
    expect(screen.getByText('Add New Expense')).toBeInTheDocument()
    expect(screen.getByText('Track your spending with AI assistance')).toBeInTheDocument()
  })

  it('displays form fields', () => {
    render(<AddNewRecord />)
    
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument()
  })

  it('has default amount value of 50', () => {
    render(<AddNewRecord />)
    
    const amountInput = screen.getByLabelText(/amount/i) as HTMLInputElement
    expect(amountInput.value).toBe('50')
  })

  it('allows user to change amount', async () => {
    const user = userEvent.setup()
    render(<AddNewRecord />)
    
    const amountInput = screen.getByLabelText(/amount/i)
    await user.clear(amountInput)
    await user.type(amountInput, '100')
    
    expect(amountInput).toHaveValue(100)
  })

  it('shows AI suggest category button', () => {
    render(<AddNewRecord />)
    
    // Look for the AI button by its title attribute
    expect(screen.getByTitle('AI Category Suggestion')).toBeInTheDocument()
  })

  it('calls suggestCategory when AI button is clicked', async () => {
    const user = userEvent.setup()
    mockSuggestCategory.mockResolvedValue({ category: 'Food' })
    
    render(<AddNewRecord />)
    
    const descriptionInput = screen.getByLabelText(/description/i)
    await user.type(descriptionInput, 'Lunch at restaurant')
    
    const aiButton = screen.getByTitle('AI Category Suggestion')
    await user.click(aiButton)
    
    await waitFor(() => {
      expect(mockSuggestCategory).toHaveBeenCalledWith('Lunch at restaurant')
    })
  })

  it('shows error when trying to use AI without description', async () => {
    const user = userEvent.setup()
    render(<AddNewRecord />)
    
    const aiButton = screen.getByTitle('AI Category Suggestion')
    await user.click(aiButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a description first')).toBeInTheDocument()
    })
  })

  it('submits form with correct data', async () => {
    const user = userEvent.setup()
    mockAddExpenseRecord.mockResolvedValue({ data: {} })
    
    render(<AddNewRecord />)
    
    const descriptionInput = screen.getByLabelText(/description/i)
    const categoryInput = screen.getByLabelText(/category/i)
    const dateInput = screen.getByLabelText(/date/i)
    const submitButton = screen.getByRole('button', { name: /add expense/i })
    
    await user.type(descriptionInput, 'Test expense')
    await user.selectOptions(categoryInput, 'Food')
    await user.type(dateInput, '2024-01-15')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockAddExpenseRecord).toHaveBeenCalled()
    })
  })

  it('shows success message after successful submission', async () => {
    const user = userEvent.setup()
    mockAddExpenseRecord.mockResolvedValue({ data: {} })
    
    render(<AddNewRecord />)
    
    const descriptionInput = screen.getByLabelText(/description/i)
    const categoryInput = screen.getByLabelText(/category/i)
    const dateInput = screen.getByLabelText(/date/i)
    const submitButton = screen.getByRole('button', { name: /add expense/i })
    
    await user.type(descriptionInput, 'Test expense')
    await user.selectOptions(categoryInput, 'Food')
    await user.type(dateInput, '2024-01-15')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Expense record added successfully!')).toBeInTheDocument()
    })
  })

  it('shows error message when submission fails', async () => {
    const user = userEvent.setup()
    mockAddExpenseRecord.mockResolvedValue({ error: 'Database error' })
    
    render(<AddNewRecord />)
    
    const descriptionInput = screen.getByLabelText(/description/i)
    const categoryInput = screen.getByLabelText(/category/i)
    const dateInput = screen.getByLabelText(/date/i)
    const submitButton = screen.getByRole('button', { name: /add expense/i })
    
    await user.type(descriptionInput, 'Test expense')
    await user.selectOptions(categoryInput, 'Food')
    await user.type(dateInput, '2024-01-15')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Error: Database error')).toBeInTheDocument()
    })
  })
})
