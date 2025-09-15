'use client';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import AuthModal from '@/components/AuthModal';

export default function AuthPage() {
  

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full">
        <AuthModal 
          isOpen={true}
          onClose={() => window.history.back()}
          mode="login"
        />
        
      </div>
    </div>
  );
}