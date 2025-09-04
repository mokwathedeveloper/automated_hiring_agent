// src/app/page.tsx

import FileUploadForm from '@/components/FileUploadForm';

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            AI-Powered Hiring
            <span className="text-indigo-600"> Made Simple</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Transform your recruitment process with intelligent resume analysis designed for the Nigerian job market.
          </p>
        </div>
        
        {/* Main Content */}
        <div className="max-w-4xl mx-auto animate-slide-up">
          <FileUploadForm />
        </div>
      </div>
    </div>
  );
}
