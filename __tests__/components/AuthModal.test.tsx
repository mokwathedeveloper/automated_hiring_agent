import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuthModal from '@/components/AuthModal'
import { createClient } from '@/lib/supabase/client'

jest.mock('@/lib/supabase/client')

const mockSignInWithPassword = jest.fn();
const mockSignUp = jest.fn();

(createClient as jest.Mock).mockReturnValue({
  auth: {
    signInWithPassword: mockSignInWithPassword,
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
        signInWithPassword: jest.fn().mockResolvedValue({ error: null })
      }
    }

    jest.mocked(createClient).mockReturnValue(mockSupabaseClient as any)

    render(<AuthModal isOpen={true} onClose={mockOnClose} mode="login" />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })

    expect(screen.getByText('Login successful! Redirecting...')).toBeInTheDocument()
  })

  it('handles signup submission', async () => {
    const mockSupabaseClient = {
      auth: {
        signUp: jest.fn().mockResolvedValue({ error: null })
      }
    }

    jest.mocked(createClient).mockReturnValue(mockSupabaseClient as any)

    render(<AuthModal isOpen={true} onClose={mockOnClose} mode="signup" />)

    const firstNameInput = screen.getByPlaceholderText('Enter your first name')
    const lastNameInput = screen.getByPlaceholderText('Enter your last name')
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password')
    const submitButton = screen.getByRole('button', { name: /sign up/i })

    fireEvent.change(firstNameInput, { target: { value: 'John' } })
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
        options: {
          data: {
            first_name: 'John',
            last_name: 'Doe',
            full_name: 'John Doe',
          },
        },
      })
    })

    expect(screen.getByText('Account created successfully! You can now log in.')).toBeInTheDocument()
  })

  it('handles authentication errors', async () => {
    const mockSupabaseClient = {
      auth: {
        signInWithPassword: jest.fn().mockResolvedValue({ error: { message: 'Invalid login credentials' } })
      }
    }

    jest.mocked(createClient).mockReturnValue(mockSupabaseClient as any)

    render(<AuthModal isOpen={true} onClose={mockOnClose} mode="login" />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /login/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid login credentials')).toBeInTheDocument()
    })
  })

  it('handles password reset correctly', async () => {
    const mockSupabaseClient = {
      auth: {
        resetPasswordForEmail: jest.fn().mockResolvedValue({ error: null })
      }
    }

    jest.mocked(createClient).mockReturnValue(mockSupabaseClient as any)

    render(<AuthModal isOpen={true} onClose={mockOnClose} mode="login" />)

    // Click "Forgot Password?" link
    const forgotPasswordLink = screen.getByText('Forgot Password?')
    fireEvent.click(forgotPasswordLink)

    // Fill in email and submit
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const submitButton = screen.getByRole('button', { name: /send reset email/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSupabaseClient.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        {
          redirectTo: expect.stringContaining('/auth/update-password'),
        }
      )
    })

    expect(screen.getByText('Password reset email sent! Please check your inbox.')).toBeInTheDocument()
  })

  it('closes modal when close button is clicked', () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} mode="login" />)

    const closeButton = screen.getByText('✕')
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalled()
  })
})