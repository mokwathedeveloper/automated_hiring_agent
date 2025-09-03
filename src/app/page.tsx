// src/app/page.tsx

import FileUploadForm from '@/components/FileUploadForm';
import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Automated Hiring Agent
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your hiring process with AI-powered resume analysis. 
            Upload job descriptions and resumes to get instant, professional candidate evaluations.
          </p>
        </div>
        
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <FileUploadForm />
        </div>
        
        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500">
          <p>&copy; 2024 Automated Hiring Agent. Powered by AI for smarter recruitment.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
