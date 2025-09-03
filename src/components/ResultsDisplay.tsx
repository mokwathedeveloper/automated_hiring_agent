// src/components/ResultsDisplay.tsx

'use client';

interface ResumeAnalysis {
  score: number;
  summary: string;
  pros: string[];
  cons: string[];
}

interface ResumeResult {
  fileName: string;
  analysis?: ResumeAnalysis;
  error?: string;
}

interface ResultsDisplayProps {
  results: ResumeResult[];
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    if (score >= 45) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Exceptional';
    if (score >= 75) return 'Strong';
    if (score >= 60) return 'Good';
    if (score >= 45) return 'Moderate';
    return 'Poor';
  };

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
      
      {results.map((result, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{result.fileName}</h3>
          </div>
          
          {result.error ? (
            <div className="px-6 py-4">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-600">{result.error}</span>
              </div>
            </div>
          ) : result.analysis ? (
            <div className="px-6 py-4 space-y-4">
              {/* Score Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(result.analysis.score)}`}>
                    {result.analysis.score}/100 - {getScoreLabel(result.analysis.score)}
                  </span>
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${result.analysis.score >= 75 ? 'bg-green-500' : result.analysis.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${result.analysis.score}%` }}
                  ></div>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Summary</h4>
                <p className="text-gray-700">{result.analysis.summary}</p>
              </div>

              {/* Pros and Cons */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {result.analysis.pros.map((pro, proIndex) => (
                      <li key={proIndex} className="text-sm text-gray-700 flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-orange-800 mb-2 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-1">
                    {result.analysis.cons.map((con, conIndex) => (
                      <li key={conIndex} className="text-sm text-gray-700 flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}