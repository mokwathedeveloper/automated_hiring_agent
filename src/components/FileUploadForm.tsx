// src/components/FileUploadForm.tsx

'use client';

import { useState, useCallback } from 'react';

export default function FileUploadForm() {
  const [jobDescription, setJobDescription] = useState<File | null>(null);
  const [resumes, setResumes] = useState<FileList | null>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      return 'Only PDF and DOCX files are allowed';
    }
    
    if (file.size > maxSize) {
      return `File size must be under 5MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }
    
    return null;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, type: 'job' | 'resume') => {
    e.preventDefault();
    setIsDragOver(false);
    setValidationError(null);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (type === 'job') {
        const error = validateFile(files[0]);
        if (error) {
          setValidationError(error);
          return;
        }
        setJobDescription(files[0]);
      } else {
        for (let i = 0; i < files.length; i++) {
          const error = validateFile(files[i]);
          if (error) {
            setValidationError(`${files[i].name}: ${error}`);
            return;
          }
        }
        setResumes(files);
      }
    }
  }, [validateFile]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!jobDescription || !resumes) {
      alert('Please select a job description and at least one resume.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('jobDescription', jobDescription);
    for (let i = 0; i < resumes.length; i++) {
      formData.append('resumes', resumes[i]);
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFeedback(data);
      } else {
        alert('File upload failed.');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('An error occurred while uploading the files.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'job')}
            className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver ? 'border-violet-500 bg-violet-50' : 'border-gray-300'
            }`}
          >
            {jobDescription ? (
              <div className="text-sm text-gray-600">
                <span className="font-medium">{jobDescription.name}</span>
                <button
                  type="button"
                  onClick={() => setJobDescription(null)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-500">Drag and drop your job description here, or</p>
                <input
                  id="jobDescription"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(e) => {
                    setValidationError(null);
                    const file = e.target.files?.[0];
                    if (file) {
                      const error = validateFile(file);
                      if (error) {
                        setValidationError(error);
                        return;
                      }
                      setJobDescription(file);
                    }
                  }}
                  className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
              </div>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="resumes" className="block text-sm font-medium text-gray-700">
            Resumes
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'resume')}
            className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver ? 'border-violet-500 bg-violet-50' : 'border-gray-300'
            }`}
          >
            {resumes && resumes.length > 0 ? (
              <div className="text-sm text-gray-600">
                <span className="font-medium">{resumes.length} file(s) selected</span>
                <button
                  type="button"
                  onClick={() => setResumes(null)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-500">Drag and drop resumes here, or</p>
                <input
                  id="resumes"
                  type="file"
                  accept=".pdf,.docx"
                  multiple
                  onChange={(e) => {
                    setValidationError(null);
                    const files = e.target.files;
                    if (files) {
                      for (let i = 0; i < files.length; i++) {
                        const error = validateFile(files[i]);
                        if (error) {
                          setValidationError(`${files[i].name}: ${error}`);
                          return;
                        }
                      }
                      setResumes(files);
                    }
                  }}
                  className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
              </div>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
        {validationError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{validationError}</p>
          </div>
        )}
      </form>
      {feedback && (
        <div className="mt-8 p-4 border rounded-md">
          <h2 className="text-xl font-bold">Analysis Results</h2>
          <pre className="mt-4 whitespace-pre-wrap">{JSON.stringify(feedback, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
