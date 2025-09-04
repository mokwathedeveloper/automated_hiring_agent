'use client';

import { useState } from 'react';

export default function ResumeUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Uploading file:', selectedFile.name);
      // Upload logic will be implemented later
    }
  };

  return (
    <section id="upload" className="py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Upload Resume
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload a resume to get started with AI-powered analysis tailored for the Nigerian job market
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            isDragOver
              ? 'border-blue-500 bg-blue-50 shadow-lg'
              : 'border-slate-300 hover:border-slate-400 hover:shadow-md'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <svg
              className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            
            <div>
              <p className="text-xl font-semibold text-slate-900 mb-2">
                {selectedFile ? selectedFile.name : 'Drag & Drop Resume Here'}
              </p>
              <p className="text-sm text-slate-500">
                or click to browse files • PDF, DOC, DOCX supported
              </p>
            </div>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-6 py-3 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 cursor-pointer transition-colors"
            >
              Choose File
            </label>
          </div>
        </div>

        {selectedFile && (
          <div className="mt-8 text-center">
            <button
              onClick={handleUpload}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Analyze Resume
            </button>
          </div>
        )}
      </div>
    </section>
  );
}