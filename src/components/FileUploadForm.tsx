// src/components/FileUploadForm.tsx

'use client';

import { useState, useCallback } from 'react';

export default function FileUploadForm() {
  const [jobDescription, setJobDescription] = useState<File | null>(null);
  const [resumes, setResumes] = useState<FileList | null>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

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
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (type === 'job') {
        setJobDescription(files[0]);
      } else {
        setResumes(files);
      }
    }
  }, []);

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
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => setJobDescription(e.target.files ? e.target.files[0] : null)}
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
                  accept=".pdf,.doc,.docx,.txt"
                  multiple
                  onChange={(e) => setResumes(e.target.files)}
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
