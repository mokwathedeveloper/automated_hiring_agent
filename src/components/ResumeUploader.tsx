'use client';

import { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Loader2, 
  Check, 
  X, 
  AlertCircle,
  File,
  Trash2
} from 'lucide-react';
import { sanitizeInput } from '@/lib/security';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Import shared types instead of duplicating
import { ParsedResume, WorkExperience, Education } from '@/types';

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

        let result;
        try {
          result = await response.json();
        } catch (jsonError) {
          console.error('Failed to parse response JSON:', jsonError);
          throw new Error(`Server returned invalid response for file: ${file.name}`);
        }

        if (!response.ok) {
          // If response is not OK, throw an error with the message from the backend
          const errorMessage = result?.error || `Server error (${response.status}) for file: ${file.name}`;
          console.error('API Error:', errorMessage, result);
          throw new Error(errorMessage);
        }

        if (!result.success) {
          const errorMessage = result?.error || `Upload failed for file: ${file.name}`;
          console.error('Upload Error:', errorMessage, result);
          throw new Error(errorMessage);
        }

        if (!result.data) {
          console.error('No data returned for file:', file.name, result);
          throw new Error(`No data returned for file: ${file.name}`);
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

      // Provide more specific error messages based on error type
      let userMessage = 'Upload failed. Please try again.';

      if (error.message) {
        if (error.message.includes('Network')) {
          userMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('Server error (500)')) {
          userMessage = 'Server error. Please try again later or contact support.';
        } else if (error.message.includes('Database')) {
          userMessage = 'Database error. The file was processed but not saved. Please contact support.';
        } else if (error.message.includes('AI processing failed')) {
          userMessage = 'AI processing failed. Please try with a different file or try again later.';
        } else if (error.message.includes('Invalid')) {
          userMessage = 'Invalid file format or content. Please check your file and try again.';
        } else {
          userMessage = `Upload failed: ${error.message}`;
        }
      }

      setError(userMessage);
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
    <div className="space-y-6">
      {/* Job Description Input */}
      <div className="space-y-3">
        <label htmlFor="job-description" className="block text-sm font-medium text-foreground">
          Job Description <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <textarea
            id="job-description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here to get a tailored analysis..."
            className="w-full px-4 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground transition-all duration-200 resize-none"
            rows={4}
            maxLength={10000}
            required
          />
          <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-background px-2 py-1 rounded">
            {jobDescription.length}/10000
          </div>
        </div>
      </div>

      {/* Enhanced Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-primary bg-primary/5 scale-105'
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        }`}
      >
        <input {...getInputProps()} data-testid="file-input" />
        <motion.div
          animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-foreground">
              {isDragActive ? 'Drop files here' : 'Drag & drop resumes, or click to select'}
            </p>
            <p className="text-sm text-muted-foreground">
              PDF or DOCX, up to 5MB each. Maximum 100 files.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-destructive font-medium">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Selected Files ({files.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                disabled={isUploading}
                className="text-muted-foreground hover:text-foreground"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </div>
            <div className="space-y-2">
              {files.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="card-hover">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-foreground truncate">
                              {file.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          disabled={isUploading}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleUpload}
          disabled={files.length === 0 || isUploading || jobDescription.trim().length < 10}
          className="flex-1 button-hover bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
          size="lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Check className="w-5 h-5 mr-2" />
              Analyze {files.length > 1 ? `${files.length} Resumes` : 'Resume'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}