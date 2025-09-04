'use client';

import { useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { ParsedResume, ParseResponse } from '@/types';
import ResumeDisplay from './ResumeDisplay';

export default function ResumeUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null);

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

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/parse', {
        method: 'POST',
        body: formData,
      });

      const result: ParseResponse = await response.json();

      if (result.success && result.data) {
        setParsedData(result.data);
      } else {
        setError(result.error || 'Failed to parse resume');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="upload" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Upload Resume
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a resume to get started with AI-powered analysis tailored for the Nigerian job market
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            isDragOver
              ? 'border-primary-500 bg-primary-50 shadow-lg'
              : 'border-gray-300 hover:border-primary-400 hover:shadow-md'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <FaCloudUploadAlt className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
            
            <div>
              <p className="text-xl font-semibold text-gray-900 mb-2">
                {selectedFile ? selectedFile.name : 'Drag & Drop Resume Here'}
              </p>
              <p className="text-sm text-gray-500">
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
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-colors"
            >
              Choose File
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}

        {selectedFile && (
          <div className="mt-8 text-center">
            <button
              onClick={handleUpload}
              disabled={isLoading}
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Parsing Resume...' : 'Analyze Resume'}
            </button>
          </div>
        )}
      </div>
      
      {parsedData && (
        <div className="mt-12">
          <ResumeDisplay data={parsedData} />
        </div>
      )}
    </section>
  );
}