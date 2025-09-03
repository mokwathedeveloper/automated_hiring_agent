// src/app/auth/page.tsx

import AuthForm from '@/components/AuthForm';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Automated Hiring Agent
          </h1>
          <p className="text-gray-600">
            Sign in to access your resume analysis dashboard
          </p>
        </div>
        
        <AuthForm />
      </div>
    </div>
  );
}