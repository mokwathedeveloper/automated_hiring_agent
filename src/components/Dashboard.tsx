'use client';

import { useAuth } from '@/hooks/useAuth';
import { FaUser, FaFileAlt, FaChartLine, FaAward, FaClock } from 'react-icons/fa';

export default function Dashboard() {
  const { user, signOut } = useAuth();

  const stats = {
    totalResumes: 5,
    averageScore: 85,
    completedAnalyses: 4,
    pendingAnalyses: 1,
    thisMonthResumes: 3,
    highScoreResumes: 2,
  };

  const resumes = [
    {
      id: '1',
      filename: 'john_doe_resume.pdf',
      file_size: 245760,
      file_type: 'application/pdf',
      score: 85,
      status: 'completed' as const,
      created_at: new Date().toISOString(),
      analysis: {
        summary: 'Strong technical background with relevant experience'
      }
    }
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please sign in to access your dashboard</p>
          <a href="/auth" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <FaUser className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user.email}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Resumes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalResumes}</p>
              </div>
              <FaFileAlt className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageScore}/100</p>
              </div>
              <FaChartLine className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Scores</p>
                <p className="text-2xl font-bold text-gray-900">{stats.highScoreResumes}</p>
              </div>
              <FaAward className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingAnalyses}</p>
              </div>
              <FaClock className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Resume History */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Resume Analysis History</h3>
            <p className="text-sm text-gray-600">Your recent resume analyses and performance scores</p>
          </div>
          <div className="p-6">
            {resumes.length === 0 ? (
              <div className="text-center py-8">
                <FaFileAlt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No resumes analyzed yet</p>
                <a href="/" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                  Start Analyzing Resumes
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold">{resume.score}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{resume.filename}</div>
                        <div className="text-sm text-gray-500">
                          {resume.file_type} • {formatFileSize(resume.file_size)}
                        </div>
                        {resume.analysis?.summary && (
                          <div className="text-sm text-gray-600 mt-1">
                            {resume.analysis.summary}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {new Date(resume.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        Completed
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}