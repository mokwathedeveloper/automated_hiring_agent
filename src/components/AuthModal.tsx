'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          setError(error.message);
        } else {
          setSuccess('Check your email for the login link!');
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password: 'temp-password',
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          setError(error.message);
        } else {
          setSuccess('Check your email to confirm your account!');
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }

    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 sm:mx-auto sm:max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your email address"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>
          )}

          {success && (
            <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">{success}</div>
          )}

          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Sending...' : mode === 'login' ? 'Send Login Link' : 'Send Signup Link'}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>We'll send you a magic link to {mode === 'login' ? 'sign in' : 'create your account'}.</p>
          <p className="mt-2">No password required! 🎉</p>
        </div>
      </div>
    </div>
  );
}