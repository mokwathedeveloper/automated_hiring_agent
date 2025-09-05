// src/components/Dashboard.tsx

'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

interface Resume {
  id: string;
  filename: string;
  analysis: {
    score: number;
    summary: string;
    pros: string[];
    cons: string[];
  };
  created_at: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { user } = await auth.getCurrentUser();
        setUser(user);
        
        if (user) {
          const response = await fetch('/api/resumes');
          if (response.ok) {
            const data = await response.json();
            setResumes(data.resumes || []);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSignOut = async () => {
    await auth.signOut();
    window.location.href = '/auth';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please sign in to access your dashboard.</p>
          <Button asChild>
            <a href="/auth" className="text-white px-6 py-2 rounded-lg" style={{ backgroundColor: '#4f46e5', color: 'white' }}>
              Sign In
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.email}</p>
            </div>
            <Button
              variant="secondary"
              onClick={handleSignOut}
              className="text-gray-700"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">{resumes.length}</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Resumes
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {resumes.length} analyzed
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">
                        {resumes.length > 0 ? Math.round(resumes.reduce((acc, r) => acc + r.analysis.score, 0) / resumes.length) : 0}
                      </span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Average Score
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {resumes.length > 0 ? Math.round(resumes.reduce((acc, r) => acc + r.analysis.score, 0) / resumes.length) : 0}/100
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">5</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Remaining Analyses
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        5 left this month
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resume History */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Resume Analysis History
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Your recent resume analyses and scores.
              </p>
            </div>
            <ul className="divide-y divide-gray-200">
              {resumes.length === 0 ? (
                <li className="px-4 py-4 text-center text-gray-500">
                  No resumes analyzed yet. <Button variant="link" asChild><a href="/" className="text-indigo-600">Start analyzing</a></Button>
                </li>
              ) : (
                resumes.map((resume) => (
                  <li key={resume.id} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                            resume.analysis.score >= 80 ? 'bg-green-500' :
                            resume.analysis.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}>
                            {resume.analysis.score}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {resume.filename}
                          </div>
                          <div className="text-sm text-gray-500">
                            {resume.analysis.summary}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(resume.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}