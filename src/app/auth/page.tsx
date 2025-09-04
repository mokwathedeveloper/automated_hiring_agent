'use client';

import { useState } from 'react';
import AuthModal from '@/components/AuthModal';

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full">
        <AuthModal 
          isOpen={true}
          onClose={() => window.history.back()}
          mode={authMode}
        />
        <div className="text-center mt-4">
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            {authMode === 'login' ? 'Need an account? Sign up' : 'Have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}