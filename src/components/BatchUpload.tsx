'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaUpload, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

interface BatchResult {
  fileName: string;
  success: boolean;
  analysis?: any;
  error?: string;
}

export default function BatchUpload() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<BatchResult[]>([]);
  const [jobDescription, setJobDescription] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
    setResults([]); // Clear previous results
  };

  const handleBatchUpload = async () => {
    if (!files || files.length === 0) {
      alert('Please select files to upload');
      return;
    }

    setIsProcessing(true);
    setResults([]);

    const formData = new FormData();
    
    // Add all files to FormData
    Array.from(files).forEach((file, index) => {
      formData.append(`files`, file);
    });

    // Add job description and criteria
    formData.append('jobDescription', jobDescription || 'General technology position');
    formData.append('criteria', JSON.stringify({
      requiredSkills: ['javascript', 'python', 'react', 'node.js'],
      experienceLevel: 'mid',
      educationLevel: 'bachelor',
      industry: 'technology',
      weights: {
        technicalSkills: 0.4,
        experience: 0.3,
        education: 0.2,
        cultural: 0.1,
      }
    }));

    try {
      const response = await fetch('/api/parse/batch', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.results || []);
      } else {
        alert(`Batch processing failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Batch upload error:', error);
      alert('Batch processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FaUpload className="w-5 h-5" />
          <span>Batch Resume Processing</span>
        </CardTitle>
        <CardDescription>
          Upload multiple resumes for simultaneous analysis and ranking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Job Description Input */}
        <div className="space-y-2">
          <Label htmlFor="jobDescription">Job Description (Optional)</Label>
          <textarea
            id="jobDescription"
            className="w-full p-3 border border-gray-300 rounded-md resize-none"
            rows={4}
            placeholder="Enter job description to improve analysis accuracy..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="files">Select Resume Files</Label>
          <Input
            id="files"
            type="file"
            multiple
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          <p className="text-sm text-gray-500">
            Select multiple PDF or DOCX files (max 5MB each)
          </p>
        </div>

        {/* Upload Button */}
        <Button 
          onClick={handleBatchUpload}
          disabled={!files || files.length === 0 || isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
              Processing {files?.length || 0} files...
            </>
          ) : (
            <>
              <FaUpload className="w-4 h-4 mr-2" />
              Process {files?.length || 0} Resumes
            </>
          )}
        </Button>

        {/* Results Display */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Processing Results</h3>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    result.success 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {result.success ? (
                      <FaCheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <FaExclamationCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium">{result.fileName}</p>
                      {result.success && result.analysis && (
                        <p className="text-sm text-gray-600">
                          Score: {result.analysis.overallScore}/100
                        </p>
                      )}
                      {!result.success && (
                        <p className="text-sm text-red-600">{result.error}</p>
                      )}
                    </div>
                  </div>
                  {result.success && result.analysis && (
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      result.analysis.overallScore >= 80 ? 'bg-green-100 text-green-800' :
                      result.analysis.overallScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {result.analysis.overallScore >= 80 ? 'Excellent' :
                       result.analysis.overallScore >= 60 ? 'Good' : 'Needs Review'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
