'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import ResumeUploader from '@/components/ResumeUploader';
import Reviews from '@/components/Reviews';
import Pricing from '@/components/Pricing';
import ResultsDisplay from '@/components/ResultsDisplay';

export default function HomePage() {
  const [analysisResults, setAnalysisResults] = useState<Array<{
    fileName: string;
    score: number;
    analysis: {
      summary: string;
      pros: string[];
      cons: string[];
    };
  }> | null>(null);

  const handleUploadSuccess = (results: Array<{
    fileName: string;
    score: number;
    analysis: {
      summary: string;
      pros: string[];
      cons: string[];
    };
  }>) => {
    setAnalysisResults(results);
  };

  return (
    <main>
      <Hero />
      
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Try It Now
            </h2>
            <p className="text-lg text-gray-600">
              Upload a job description and candidate resumes to see our AI analysis in action
            </p>
          </div>
          
          <ResumeUploader onUploadSuccess={handleUploadSuccess} />
          
          {analysisResults && (
            <div className="mt-12">
              <ResultsDisplay results={analysisResults} />
            </div>
          )}
        </div>
      </section>
      
      <Reviews />
      <Pricing />
    </main>
  );
}