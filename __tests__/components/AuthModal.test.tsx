import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuthModal from '@/components/AuthModal'
import { createClient } from '@/lib/supabase/client'

jest.mock('@/lib/supabase/client')

const mockSignInWithOtp = jest.fn();
const mockSignUp = jest.fn();

(createClient as jest.Mock).mockReturnValue({
  auth: {
    signInWithOtp: mockSignInWithOtp,
    signUp: mockSignUp,
  },
});

describe('AuthModal', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders login modal correctly', () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} mode="login" />)

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('renders signup modal correctly', () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} mode="signup" />)

    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<AuthModal isOpen={false} onClose={mockOnClose} mode="login" />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('handles successful login submission', async () => {
    const mockSupabaseClient = {
      auth: {
        signInWithOtp: jest.fn().mockResolvedValue({ error: null })
      }
    }

    jest.mocked(createClient).mockReturnValue(mockSupabaseClient as any)

    render(<AuthModal isOpen={true} onClose={mockOnClose} mode="login" />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const submitButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSupabaseClient.auth.signInWithOtp).toHaveBeenCalledWith({
        email: 'test@example.com',
        options: {
          emailRedirectTo: expect.stringContaining('/auth/callback'),
        },
      })
    })

    expect(screen.getByText('Check your email for the login link!')).toBeInTheDocument()
  })

  it('handles signup submission', async () => {
    const mockSupabaseClient = {
      auth: {
        signUp: jest.fn().mockResolvedValue({ error: null })
      }
    }

    jest.mocked(createClient).mockReturnValue(mockSupabaseClient as any)

    render(<AuthModal isOpen={true} onClose={mockOnClose} mode="signup" />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const submitButton = screen.getByRole('button', { name: /sign up/i })

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
    const mockSignInWithOtp = jest.mocked(mockSignInWithOtp)
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