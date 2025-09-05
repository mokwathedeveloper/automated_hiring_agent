import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { signIn } from 'next-auth/react';
import AuthModal from '@/components/AuthModal';

// Mock next-auth
jest.mock('next-auth/react');
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;

describe('Authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login modal', () => {
    act(() => {
      render(
        <AuthModal isOpen={true} onClose={() => {}} mode="login" />
      );
    });
    
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  test('renders signup modal', () => {
    act(() => {
      render(
        <AuthModal isOpen={true} onClose={() => {}} mode="signup" />
      );
    });
    
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  test('handles login submission', async () => {
    mockSignIn.mockResolvedValue({ ok: true, error: null } as any);
    
    act(() => {
      render(
        <AuthModal isOpen={true} onClose={() => {}} mode="login" />
      );
    });
    
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
        target: { value: 'password123' }
      });
      
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      });
    });
  });

  test('displays error on failed login', async () => {
    mockSignIn.mockResolvedValue({ ok: false, error: 'Invalid credentials' } as any);
    
    act(() => {
      render(
        <AuthModal isOpen={true} onClose={() => {}} mode="login" />
      );
    });
    
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'wrong@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
        target: { value: 'wrongpassword' }
      });
      
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});