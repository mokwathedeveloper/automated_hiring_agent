'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'signup';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

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
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
          },
        },
      });
      handleResponse(error?.message ?? null, 'Signup successful! Please check your email to verify your account.');
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
  };

  const renderForm = () => {
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
            {renderSubmitButton('Login')}
          </form>
        );
    }
  };

  const renderEmailInput = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
    </div>
  );

  const renderPasswordInput = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        required
        minLength={6}
      />
    </div>
  );

  const renderConfirmPasswordInput = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
      <Input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm your password"
        required
        minLength={6}
      />
    </div>
  );

  const renderFirstNameInput = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
      <Input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="Enter your first name"
        required
      />
    </div>
  );

  const renderLastNameInput = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
      <Input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Enter your last name"
        required
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
        </DialogHeader>

        {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md mb-4">{error}</div>}
        {success && <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md mb-4">{success}</div>}

        {renderForm()}

        <div className="mt-6 text-sm text-center">
          {mode !== 'signup' && (
            <p>
              Don't have an account?{' '}
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
