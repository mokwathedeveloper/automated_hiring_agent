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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-500">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-500">Please sign in to access your dashboard</p>
          <a href="/auth" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <header className="bg-white dark:bg-gray-800 shadow transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center transition-colors duration-500">
                <FaUser className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-500">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-500">Welcome back, {user.email}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-500">Total Resumes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-500">{stats.totalResumes}</p>
              </div>
              <FaFileAlt className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-500">Average Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-500">{stats.averageScore}/100</p>
              </div>
              <FaChartLine className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-500">High Scores</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-500">{stats.highScoreResumes}</p>
              </div>
              <FaAward className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-500">{stats.pendingAnalyses}</p>
              </div>
              <FaClock className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Resume History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors duration-500">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-500">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-500">Resume Analysis History</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">Your recent resume analyses and performance scores</p>
          </div>
          <div className="p-6">
            {resumes.length === 0 ? (
              <div className="text-center py-8">
                <FaFileAlt className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4 transition-colors duration-500" />
                <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-500">No resumes analyzed yet</p>
                <a href="/" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                  Start Analyzing Resumes
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-500"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center transition-colors duration-500">
                        <span className="text-green-600 dark:text-green-400 font-bold transition-colors duration-500">{resume.score}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white transition-colors duration-500">{resume.filename}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                          {resume.file_type} • {formatFileSize(resume.file_size)}
                        </div>
                        {resume.analysis?.summary && (
                          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-500">
                            {resume.analysis.summary}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                        {new Date(resume.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full transition-colors duration-500">
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