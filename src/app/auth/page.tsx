'use client';

import { useState } from 'react';
import AuthModal from '@/components/AuthModal';

export default function AuthPage() {
  

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full">
        <AuthModal 
          isOpen={true}
          onClose={() => window.history.back()}
        />
        
      </div>
    </div>
  );
}