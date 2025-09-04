// src/app/page.tsx

import FileUploadForm from '@/components/FileUploadForm';
import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Automated Hiring Agent
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Streamline your hiring process with AI-powered resume analysis. 
            Upload job descriptions and resumes to get instant, professional candidate evaluations.
          </p>
        </div>
        
        {/* Main Content */}
        <div className="max-w-4xl mx-auto animate-slide-up">
          <FileUploadForm />
        </div>
        
        {/* Footer */}
        <footer className="mt-12 sm:mt-16 text-center text-gray-500 px-4">
          <p className="text-sm sm:text-base">&copy; 2024 Automated Hiring Agent. Powered by AI for smarter recruitment.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
