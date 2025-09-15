'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { createClient } from '@/lib/supabase/client';
import { signIn } from 'next-auth/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: AuthMode;
}

export type AuthMode = 'login' | 'signup';

export default function AuthModal({ isOpen, onClose, mode: initialMode }: AuthModalProps) {
  const supabase = createClient();
  
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleResponse = (errorMsg: string | null, successMsg: string) => {
    if (errorMsg) {
      setError(errorMsg);
      setSuccess('');
    } else {
      setError('');
      setSuccess(successMsg);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      handleResponse(error?.message ?? null, 'Login successful! Redirecting...');
      if (!error) {
        setTimeout(() => (window.location.href = '/dashboard'), 1000);
      }
    } catch (err: any) {
      handleResponse(err.message || 'An unexpected error occurred.', '');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      handleResponse(
        error?.message ?? null,
        'Password reset email sent! Please check your inbox.'
      );
    } catch (err: any) {
      handleResponse(err.message || 'An unexpected error occurred.', '');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password) ||
        !/[^A-Za-z0-9]/.test(password)
    ) {
      handleResponse(
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
        ''
      );
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      handleResponse('Passwords do not match.', '');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
          },
        },
      });
      handleResponse(error?.message ?? null, 'Account created successfully! You can now log in.');
    } catch (err: any) {
      handleResponse(err.message || 'An unexpected error occurred.', '');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setError('');
    setSuccess('');
    setIsLoading(false);
    setIsResettingPassword(false);
  };

  const renderForm = () => {
    if (isResettingPassword) {
      return (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          {renderEmailInput()}
          {renderSubmitButton('Send Reset Email')}
          <Button variant="link" onClick={() => setIsResettingPassword(false)} className="w-full">
            Back to Login
          </Button>
        </form>
      );
    }

    switch (mode) {
      case 'signup':
        return (
          <form onSubmit={handleSignUp} className="space-y-4">
            {renderFirstNameInput()}
            {renderLastNameInput()}
            {renderEmailInput()}
            {renderPasswordInput()}
            {renderConfirmPasswordInput()}
            {renderSubmitButton('Sign Up')}
          </form>
        );
      case 'login':
      default:
        return (
          <form onSubmit={handleLogin} className="space-y-4">
            {renderEmailInput()}
            {renderPasswordInput()}
            <Button variant="link" onClick={() => setIsResettingPassword(true)} className="text-sm text-primary-600 p-2 h-auto justify-start">
              Forgot Password?
            </Button>
            {renderSubmitButton('Login')}
          </form>
        );
    }
  };

  const renderEmailInput = () => (
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        id="email"
      />
    </div>
  );

  const renderPasswordInput = () => (
    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        required
        minLength={8}
        id="password"
      />
    </div>
  );

  const renderConfirmPasswordInput = () => (
    <div>
      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
      <Input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm your password"
        required
        minLength={8}
        id="confirm-password"
      />
    </div>
  );

  const renderFirstNameInput = () => (
    <div>
      <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
      <Input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="Enter your first name"
        required
        id="first-name"
      />
    </div>
  );

  const renderLastNameInput = () => (
    <div>
      <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
      <Input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Enter your last name"
        required
        id="last-name"
      />
    </div>
  );

  const renderSubmitButton = (text: string) => (
    <Button
      type="submit"
      disabled={isLoading || !!success}
      className="w-full"
    >
      {isLoading ? 'Processing...' : text}
    </Button>
  );

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === 'signup' ? 'Create Account' : 'Login'}</DialogTitle>
          <DialogDescription>
            {mode === 'signup' ? 'Enter your details to create an account.' : 'Enter your email and password to log in.'}
          </DialogDescription>
        </DialogHeader>

        {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md mb-4">{error}</div>}
        {success && <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md mb-4">{success}</div>}

        {renderForm()}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => signIn('google')}
          disabled={isLoading || !!success}
        >
          Sign in with Google
        </Button>

        <div className="mt-6 text-sm text-center">
          {mode !== 'signup' && (
            <p>
              Don&apos;t have an account?{' '}
              <Button variant="link" onClick={() => switchMode('signup')} className="text-primary-600">
                Sign Up
              </Button>
            </p>
          )}
          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <Button variant="link" onClick={() => switchMode('login')} className="text-primary-600">
                Login
              </Button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
