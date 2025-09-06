import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuthModal from '@/components/AuthModal'
import { supabase } from '@/lib/supabase'

jest.mock('@/lib/supabase')

describe('AuthModal', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders login modal correctly', () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} mode="login" />)
    
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email address')).toBeInTheDocument()
    expect(screen.getByText('Send Login Link')).toBeInTheDocument()
  })

  it('renders signup modal correctly', () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} mode="signup" />)
    
    expect(screen.getByText('Sign Up')).toBeInTheDocument()
    expect(screen.getByText('Send Signup Link')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<AuthModal isOpen={false} onClose={mockOnClose} mode="login" />)
    
    expect(screen.queryByText('Login')).not.toBeInTheDocument()
  })

  it('handles successful login submission', async () => {
    const mockSignInWithOtp = jest.mocked(supabase.auth.signInWithOtp)
    mockSignInWithOtp.mockResolvedValue({ error: null } as any)

    render(<AuthModal isOpen={true} onClose={mockOnClose} mode="login" />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email address')
    const submitButton = screen.getByText('Send Login Link')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSignInWithOtp).toHaveBeenCalledWith({
        email: 'test@example.com',
        options: {
          emailRedirectTo: expect.stringContaining('/auth/callback'),
        },
      })
    })

    expect(screen.getByText('Check your email for the login link!')).toBeInTheDocument()
  })

  it('handles signup submission', async () => {
    const mockSignUp = jest.mocked(supabase.auth.signUp)
    mockSignUp.mockResolvedValue({ error: null } as any)

    render(<AuthModal isOpen={true} onClose={mockOnClose} mode="signup" />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email address')
    const submitButton = screen.getByText('Send Signup Link')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'temp-password',
        options: {
          emailRedirectTo: expect.stringContaining('/auth/callback'),
        },
      })
    })

    expect(screen.getByText('Check your email to confirm your account!')).toBeInTheDocument()
  })

  it('handles authentication errors', async () => {
    const mockSignInWithOtp = jest.mocked(supabase.auth.signInWithOtp)
    mockSignInWithOtp.mockResolvedValue({ error: { message: 'Invalid email' } } as any)

    render(<AuthModal isOpen={true} onClose={mockOnClose} mode="login" />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email address')
    const submitButton = screen.getByText('Send Login Link')

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument()
    })
  })

  it('closes modal when close button is clicked', () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} mode="login" />)
    
    const closeButton = screen.getByText('✕')
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalled()
  })
})