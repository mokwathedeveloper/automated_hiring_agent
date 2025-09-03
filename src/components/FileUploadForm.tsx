// src/components/FileUploadForm.tsx

'use client';

import { useState } from 'react';

export default function FileUploadForm() {
  const [jobDescription, setJobDescription] = useState<File | null>(null);
  const [resumes, setResumes] = useState<FileList | null>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

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
          <input
            id="jobDescription"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => setJobDescription(e.target.files ? e.target.files[0] : null)}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        </div>
        <div>
          <label htmlFor="resumes" className="block text-sm font-medium text-gray-700">
            Resumes
          </label>
          <input
            id="resumes"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            multiple
            onChange={(e) => setResumes(e.target.files)}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
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
