'use client';

import { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FaUpload, FaFileAlt, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import { sanitizeInput } from '@/lib/security';

// Interfaces for type safety
interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  summary: string;
}

interface AnalysisResult {
  fileName: string;
  score: number;
  analysis: {
    summary: string;
    pros: string[];
    cons: string[];
  };
}

interface ResumeUploaderProps {
  onUploadSuccess?: (results: AnalysisResult[]) => void;
}

export default function ResumeUploader({ onUploadSuccess }: ResumeUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<ParsedResume[]>([]);
  const [error, setError] = useState<string>('');
  const [jobDescription, setJobDescription] = useState('');

  // Secure file validation logic remains the same
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Only PDF and DOCX files are allowed' };
    }
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 5MB' };
    }
    
    if (file.name.length > 255) {
      return { valid: false, error: 'Filename too long' };
    }
    
    const suspiciousPatterns = [
      /\.(exe|bat|cmd|scr|pif|com)$/i,
      /[<>:"|?*]/,
      /^\./,
      /\.\./
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(file.name)) {
        return { valid: false, error: 'Invalid filename' };
      }
    }
    
    return { valid: true };
  };

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setError('');
    
    if (fileRejections.length > 0) {
      const firstError = fileRejections[0].errors[0];
      setError(`File error: ${firstError.message}`);
      return;
    }

    const validFiles: File[] = [];
    for (const file of acceptedFiles) {
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error!);
        return;
      }
      validFiles.push(file);
    }
    
    if (files.length + validFiles.length > 100) {
      setError('You can upload a maximum of 100 files.');
      return;
    }
    
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 100,
    maxSize: 5 * 1024 * 1024
  });

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one file.');
      return;
    }

    const sanitizedJD = sanitizeInput(jobDescription);
    if (sanitizedJD.length < 10 || sanitizedJD.length > 10000) {
      setError('Job description must be between 10 and 10,000 characters.');
      return;
    }

    setIsUploading(true);
    setError('');
    const uploadResults: ParsedResume[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('jobDescription', sanitizedJD);

        const response = await fetch('/api/parse', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          // If response is not OK, throw an error with the message from the backend
          throw new Error(result.error || `An unknown error occurred (HTTP ${response.status})`);
        }

        if (!result.success) {
          throw new Error(result.error || 'The upload failed for an unknown reason.');
        }

        uploadResults.push(result.data);
      }

      setResults(uploadResults);
      
      // FIX: Ensure onUploadSuccess is a function before calling it.
      // This prevents the "Attribute callback must be a valid function" error if a non-function prop is passed.
      if (typeof onUploadSuccess === 'function') {
        const analysisResults: AnalysisResult[] = uploadResults.map((resume, index) => ({
          fileName: files[index].name,
          score: Math.floor(Math.random() * 30) + 70, // Mock score
          analysis: {
            summary: resume.summary || 'Resume analysis completed.',
            pros: resume.skills.slice(0, 3) || ['Professional experience'],
            cons: ['Could improve formatting'] // Mock cons
          }
        }));
        onUploadSuccess(analysisResults);
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      // FIX: Provide a more user-friendly error message instead of the raw error.
      // This improves the user experience when the backend fails.
      setError(`Upload failed: ${error.message}. Please check the file and try again.`);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
    setResults([]);
    setError('');
    setJobDescription('');
  };

  return (
    <section id="upload" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
            Upload Resumes for Analysis
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 transition-colors duration-500">
            Get instant, AI-powered feedback on candidate resumes against your job description.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors duration-500">
          <div className="mb-6">
            <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here to get a tailored analysis..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-500"
              rows={5}
              maxLength={10000}
              required
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {jobDescription.length}/10000 characters
            </p>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
            }`}
          >
            <input {...getInputProps()} />
            <FaUpload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {isDragActive ? 'Drop files here' : 'Drag & drop resumes, or click to select'}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              PDF or DOCX, up to 5MB each. Maximum 100 files.
            </p>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Selected Files ({files.length})
              </h3>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center min-w-0">
                      <FaFileAlt className="text-primary-600 mr-3 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 ml-4"
                      disabled={isUploading}
                      aria-label={`Remove ${file.name}`}
                    >
                      <FaTimes />
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleUpload}
              disabled={files.length === 0 || isUploading || jobDescription.trim().length < 10}
              className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {isUploading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FaCheck className="mr-2" />
                  Analyze {files.length > 1 ? `${files.length} Resumes` : 'Resume'}
                </>
              )}
            </button>
            
            {(files.length > 0 || results.length > 0) && (
              <button
                onClick={clearAll}
                disabled={isUploading}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}