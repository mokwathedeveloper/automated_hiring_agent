import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    render(
      <AuthModal isOpen={true} onClose={() => {}} mode="login" />
    );
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  test('renders signup modal', () => {
    render(
      <AuthModal isOpen={true} onClose={() => {}} mode="signup" />
    );
    
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  test('handles login submission', async () => {
    mockSignIn.mockResolvedValue({ ok: true, error: null } as any);
    
    render(
      <AuthModal isOpen={true} onClose={() => {}} mode="login" />
    );
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
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
    
    render(
      <AuthModal isOpen={true} onClose={() => {}} mode="login" />
    );
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'wrong@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpassword' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});