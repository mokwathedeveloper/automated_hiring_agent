// src/components/FileUploadForm.tsx

'use client';

import { useState, useCallback } from 'react';
import ResultsDisplay from './ResultsDisplay';

export default function FileUploadForm() {
  const [jobDescription, setJobDescription] = useState<File | null>(null);
  const [resumes, setResumes] = useState<FileList | null>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

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

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        resolve(text);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!jobDescription || !resumes || resumes.length === 0) {
      setApiError('Please select a job description and at least one resume.');
      return;
    }

    setIsLoading(true);
    setApiError(null);
    setFeedback(null);

    try {
      // Extract text from job description
      const jobDescriptionText = await extractTextFromFile(jobDescription);
      
      // Process each resume individually using the parse API
      const results = [];
      for (let i = 0; i < resumes.length; i++) {
        const resume = resumes[i];
        try {
          const resumeText = await extractTextFromFile(resume);
          
          const response = await fetch('/api/parse', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jobDescription: jobDescriptionText,
              resume: resumeText,
            }),
          });

          const result = await response.json();
          
          if (result.success && result.data) {
            results.push({
              fileName: resume.name,
              analysis: result.data,
            });
          } else {
            results.push({
              fileName: resume.name,
              error: result.error || 'Analysis failed',
            });
          }
        } catch (error) {
          results.push({
            fileName: resume.name,
            error: `Failed to process: ${error instanceof Error ? error.message : 'Unknown error'}`,
          });
        }
      }
      
      setFeedback(results);
    } catch (error) {
      console.error('Error processing files:', error);
      setApiError(`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
          disabled={isLoading || !jobDescription || !resumes}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Resumes...
            </div>
          ) : (
            'Analyze Resumes'
          )}
        </button>
        {validationError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-600">{validationError}</p>
              </div>
            </div>
          </div>
        )}
        {apiError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-600">{apiError}</p>
              </div>
            </div>
          </div>
        )}
      </form>
      
      {feedback && feedback.length > 0 && (
        <ResultsDisplay results={feedback} />
      )}
    </div>
  );
}
