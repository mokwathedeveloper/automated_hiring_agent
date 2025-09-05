'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';

interface ResultsDisplayProps {
  results: Array<{
    fileName: string;
    score: number;
    analysis: {
      summary: string;
      pros: string[];
      cons: string[];
    };
  }>;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Analysis Results</h3>
        <p className="text-gray-600">AI-powered candidate evaluation completed</p>
      </div>

      <div className="grid gap-6">
        {results.map((result, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <CardTitle className="text-lg">{result.fileName}</CardTitle>
                    <CardDescription>Candidate Analysis</CardDescription>
                  </div>
                </div>
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${getScoreBg(result.score)}`}>
                  <TrendingUp className={`h-4 w-4 ${getScoreColor(result.score)}`} />
                  <span className={`font-bold text-lg ${getScoreColor(result.score)}`}>
                    {result.score}/100
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                <p className="text-gray-700">{result.analysis.summary}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {result.analysis.pros.map((pro, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-1">
                    {result.analysis.cons.map((con, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}