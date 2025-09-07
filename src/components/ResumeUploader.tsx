'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FaUpload, FaFileAlt, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import { sanitizeInput } from '@/lib/security';

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

interface ResumeUploaderProps {
  onUploadSuccess?: (results: Array<{
    fileName: string;
    score: number;
    analysis: {
      summary: string;
      pros: string[];
      cons: string[];
    };
  }>) => void;
}

export default function ResumeUploader({ onUploadSuccess }: ResumeUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<ParsedResume[]>([]);
  const [error, setError] = useState<string>('');
  const [jobDescription, setJobDescription] = useState('');

  // Secure file validation
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
    
    // Check for suspicious file names
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError('');
    
    // Validate each file
    const validFiles: File[] = [];
    for (const file of acceptedFiles) {
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error!);
        return;
      }
      validFiles.push(file);
    }
    
    // Limit number of files
    if (validFiles.length > 100) {
      setError('Maximum 100 files allowed');
      return;
    }
    
    setFiles(validFiles);
  }, []);

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
      setError('Please select at least one file');
      return;
    }

    // Validate job description (now mandatory)
    if (!jobDescription || jobDescription.trim().length === 0) {
      setError('Job description is required');
      return;
    }
    
    const sanitized = sanitizeInput(jobDescription);
    if (sanitized.length < 10 || sanitized.length > 10000) {
      setError('Job description must be between 10 and 10,000 characters');
      return;
    }

    setIsUploading(true);
    setError('');
    const uploadResults: ParsedResume[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        
        // Job description is now mandatory
        formData.append('jobDescription', sanitizeInput(jobDescription));

        const response = await fetch('/api/parse', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Upload failed');
        }

        uploadResults.push(result.data);
      }

      setResults(uploadResults);
      
      // Call success callback if provided
      if (onUploadSuccess) {
        const analysisResults = uploadResults.map((resume, index) => ({
          fileName: files[index].name,
          score: Math.floor(Math.random() * 30) + 70, // Mock score
          analysis: {
            summary: resume.summary || 'Resume analysis completed',
            pros: resume.skills.slice(0, 3) || ['Professional experience'],
            cons: ['Could improve formatting'] // Mock cons
          }
        }));
        onUploadSuccess(analysisResults);
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setError('');
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
            Upload Resume
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 transition-colors duration-500">
            Upload candidate resumes for AI-powered analysis
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors duration-500">
          {/* Job Description Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Enter job description for targeted resume analysis (required)..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-500"
              rows={4}
              maxLength={10000}
              required
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-500">
              {jobDescription.length}/10,000 characters (minimum 10 characters required)
            </p>
          </div>

          {/* File Upload Area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
            }`}
          >
            <input {...getInputProps()} />
            <FaUpload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4 transition-colors duration-500" />
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-500">
              {isDragActive ? 'Drop files here' : 'Drag & Drop Resume Here'}
            </p>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-500">
              or click to browse files • PDF, DOCX supported • Max 5MB each • Up to 100 files
            </p>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-500">
                Selected Files ({files.length}/100)
              </h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-500"
                  >
                    <div className="flex items-center">
                      <FaFileAlt className="text-primary-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white transition-colors duration-500">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      disabled={isUploading}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg transition-colors duration-500">
              <p className="text-red-700 dark:text-red-400 transition-colors duration-500">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleUpload}
              disabled={files.length === 0 || isUploading || !jobDescription.trim() || jobDescription.trim().length < 10}
              className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isUploading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FaCheck className="mr-2" />
                  Analyze Resume{files.length > 1 ? 's' : ''}
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