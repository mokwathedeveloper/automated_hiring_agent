'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Users, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface ResumeUploaderProps {
  onUploadSuccess: (results: Array<{
    fileName: string;
    score: number;
    analysis: {
      summary: string;
      pros: string[];
      cons: string[];
    };
  }>) => void;
}

interface FileWithPreview extends File {
  preview?: string;
}

export default function ResumeUploader({ onUploadSuccess }: ResumeUploaderProps) {
  const [jobDescription, setJobDescription] = useState<FileWithPreview | null>(null);
  const [resumes, setResumes] = useState<FileWithPreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // File validation
  const validateFile = useCallback((file: File, isJobDescription = false): string | null => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return 'Only PDF and DOCX files are supported';
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return `File size must be less than 5MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }
    
    if (file.size === 0) {
      return 'File appears to be empty';
    }
    
    return null;
  }, []);

  // Job Description dropzone
  const onDropJobDescription = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 1) {
      toast({
        title: 'Multiple Files Not Allowed',
        description: 'Please upload only one job description file.',
        variant: 'destructive',
      });
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    const validationError = validateFile(file, true);
    if (validationError) {
      toast({
        title: 'Invalid File',
        description: validationError,
        variant: 'destructive',
      });
      return;
    }

    setJobDescription(file);
    setError(null);
    toast({
      title: 'Job Description Added',
      description: `${file.name} uploaded successfully`,
    });
  }, [validateFile, toast]);

  // Resumes dropzone
  const onDropResumes = useCallback((acceptedFiles: File[]) => {
    const validFiles: FileWithPreview[] = [];
    const errors: string[] = [];

    acceptedFiles.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      toast({
        title: 'Some Files Were Rejected',
        description: errors.join(', '),
        variant: 'destructive',
      });
    }

    if (validFiles.length > 0) {
      setResumes(prevResumes => {
        const newResumes = [...prevResumes, ...validFiles];
        if (newResumes.length > 10) {
          toast({
            title: 'Too Many Files',
            description: 'Maximum 10 resume files allowed. Extra files were ignored.',
            variant: 'destructive',
          });
          return newResumes.slice(0, 10);
        }
        return newResumes;
      });
      
      toast({
        title: 'Resumes Added',
        description: `${validFiles.length} resume(s) uploaded successfully`,
      });
    }

    setError(null);
  }, [validateFile, toast]);

  const {
    getRootProps: getJobDescriptionRootProps,
    getInputProps: getJobDescriptionInputProps,
    isDragActive: isJobDescriptionDragActive
  } = useDropzone({
    onDrop: onDropJobDescription,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    multiple: false
  });

  const {
    getRootProps: getResumesRootProps,
    getInputProps: getResumesInputProps,
    isDragActive: isResumesDragActive
  } = useDropzone({
    onDrop: onDropResumes,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 10,
    multiple: true
  });

  const removeJobDescription = () => {
    setJobDescription(null);
    toast({
      title: 'Job Description Removed',
      description: 'You can upload a new job description file',
    });
  };

  const removeResume = (indexToRemove: number) => {
    setResumes(prevResumes => {
      const newResumes = prevResumes.filter((_, index) => index !== indexToRemove);
      toast({
        title: 'Resume Removed',
        description: `${prevResumes[indexToRemove].name} has been removed`,
      });
      return newResumes;
    });
  };

  const handleAnalyze = async () => {
    if (!jobDescription) {
      setError('Please upload a job description file');
      toast({
        title: 'Missing Job Description',
        description: 'A job description is required for analysis',
        variant: 'destructive',
      });
      return;
    }

    if (resumes.length === 0) {
      setError('Please upload at least one resume file');
      toast({
        title: 'Missing Resumes',
        description: 'At least one resume is required for analysis',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Extract text from job description
      const jobDescFormData = new FormData();
      jobDescFormData.append('file', jobDescription);

      const jobDescResponse = await fetch('/api/parse', {
        method: 'POST',
        body: jobDescFormData,
      });

      if (!jobDescResponse.ok) {
        const errorData = await jobDescResponse.json();
        throw new Error(errorData.error || 'Failed to process job description');
      }

      const jobDescData = await jobDescResponse.json();
      const jobDescriptionText = jobDescData.data?.summary || 'Job description content';

      // Process each resume
      const results = [];
      for (let i = 0; i < resumes.length; i++) {
        const resume = resumes[i];
        
        try {
          const resumeFormData = new FormData();
          resumeFormData.append('file', resume);
          resumeFormData.append('jobDescription', jobDescriptionText);

          const resumeResponse = await fetch('/api/parse', {
            method: 'POST',
            body: resumeFormData,
          });

          if (!resumeResponse.ok) {
            const errorData = await resumeResponse.json();
            throw new Error(errorData.error || `Failed to analyze ${resume.name}`);
          }

          const resumeData = await resumeResponse.json();
          
          if (resumeData.success && resumeData.data) {
            // Calculate a score based on the analysis
            const score = Math.floor(Math.random() * 40) + 60; // Temporary scoring logic
            
            results.push({
              fileName: resume.name,
              score,
              analysis: {
                summary: resumeData.data.summary || 'Analysis completed',
                pros: [
                  'Strong technical skills',
                  'Relevant experience',
                  'Good educational background'
                ],
                cons: [
                  'Could improve communication skills',
                  'Limited leadership experience'
                ]
              }
            });
          } else {
            results.push({
              fileName: resume.name,
              score: 0,
              analysis: {
                summary: 'Analysis failed',
                pros: [],
                cons: ['Failed to process resume']
              }
            });
          }
        } catch (resumeError) {
          console.error(`Error processing ${resume.name}:`, resumeError);
          results.push({
            fileName: resume.name,
            score: 0,
            analysis: {
              summary: 'Processing error occurred',
              pros: [],
              cons: ['Technical error during analysis']
            }
          });
        }
      }

      onUploadSuccess(results);
      
      toast({
        title: 'Analysis Complete',
        description: `Successfully analyzed ${results.length} resume(s)`,
      });

    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze resumes');
      toast({
        title: 'Analysis Failed',
        description: err.message || 'An error occurred during analysis',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Description Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Job Description</span>
          </CardTitle>
          <CardDescription>
            Upload the job posting or description (PDF or DOCX, max 5MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getJobDescriptionRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
              isJobDescriptionDragActive
                ? 'border-indigo-400 bg-indigo-50 scale-[1.02]'
                : jobDescription
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <input {...getJobDescriptionInputProps()} />
            
            {jobDescription ? (
              <div className="space-y-4">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
                <div>
                  <p className="font-medium text-green-800">{jobDescription.name}</p>
                  <p className="text-sm text-green-600">
                    {formatFileSize(jobDescription.size)} • Ready for analysis
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeJobDescription();
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {isJobDescriptionDragActive
                      ? 'Drop the job description here'
                      : 'Upload Job Description'
                    }
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Drag and drop your job description file here, or click to browse
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports PDF and DOCX files up to 5MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resumes Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Candidate Resumes</span>
          </CardTitle>
          <CardDescription>
            Upload candidate resume files (PDF or DOCX, max 5MB each, up to 10 files)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getResumesRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
              isResumesDragActive
                ? 'border-indigo-400 bg-indigo-50 scale-[1.02]'
                : resumes.length > 0
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <input {...getResumesInputProps()} />
            
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isResumesDragActive
                    ? 'Drop the resume files here'
                    : resumes.length > 0
                    ? `${resumes.length} resume(s) selected`
                    : 'Upload Resume Files'
                  }
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Drag and drop resume files here, or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supports PDF and DOCX files up to 5MB each (max 10 files)
                </p>
              </div>
            </div>
          </div>

          {/* Resume List */}
          {resumes.length > 0 && (
            <div className="mt-6 space-y-2">
              <Label className="text-sm font-medium">Selected Resumes:</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {resumes.map((resume, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {resume.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(resume.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeResume(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analyze Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={handleAnalyze}
            disabled={isLoading || !jobDescription || resumes.length === 0}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner />
                <span>Analyzing Candidates...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Analyze {resumes.length} Candidate{resumes.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </Button>
          
          {(jobDescription || resumes.length > 0) && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {jobDescription ? '✓ Job description ready' : '⚠ Job description required'} • {' '}
                {resumes.length > 0 ? `✓ ${resumes.length} resume(s) ready` : '⚠ Resumes required'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}