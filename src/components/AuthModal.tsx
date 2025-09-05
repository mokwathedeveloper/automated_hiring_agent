'use client';

import { useState } from 'react';
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

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
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
    setError('');
    setSuccess('');
    setIsLoading(false);
  };

  const renderForm = () => {
    switch (mode) {
      case 'signup':
        return (
          <form onSubmit={handleSignUp} className="space-y-4">
            {renderEmailInput()}
            {renderPasswordInput()}
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
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        placeholder="Enter your email"
        required
      />
    </div>
  );

  const renderPasswordInput = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        placeholder="Enter your password"
        required
        minLength={6}
      />
    </div>
  );

  const renderSubmitButton = (text: string) => (
    <button
      type="submit"
      disabled={isLoading || !!success}
      className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
    >
      {isLoading ? 'Processing...' : text}
    </button>
  );

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 sm:mx-auto sm:max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{mode === 'signup' ? 'Create Account' : 'Login'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md mb-4">{error}</div>}
        {success && <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md mb-4">{success}</div>}

        {renderForm()}

        <div className="mt-6 text-sm text-center">
          {mode !== 'signup' && (
            <p>
              Don't have an account?{' '}
              <button onClick={() => switchMode('signup')} className="text-primary-600 hover:underline">
                Sign Up
              </button>
            </p>
          )}
          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button onClick={() => switchMode('login')} className="text-primary-600 hover:underline">
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
