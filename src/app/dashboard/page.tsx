'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, FileText, BarChart2, User, Inbox, Plus, Upload } from 'lucide-react';
import ResumeUploader from '@/components/ResumeUploader';

interface Analysis {
  id: string;
  created_at: string;
  job_title: string;
  candidate_name: string;
  score: number;
  summary: string;
}

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [stats, setStats] = useState({ total: 0, avgScore: 0 });
  const [showUploader, setShowUploader] = useState(false);
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  const fetchAnalyses = useCallback(async () => {
    if (!user?.id) return;

    const { data } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setAnalyses(data as any);
      const total = data.length;
      const avgScore = total > 0 ? data.reduce((sum, a: any) => sum + a.score, 0) / total : 0;
      setStats({ total, avgScore });
    }
  }, [user, supabase]);

  useEffect(() => {
    if (user) {
      fetchAnalyses();
    }
  }, [user, fetchAnalyses, supabase]);

  const handleUploadSuccess = (results: any[]) => {
    // Refresh analyses after successful upload
    fetchAnalyses();
    setShowUploader(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-500">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-500">Welcome back, {user.email}</p>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={() => setShowUploader(!showUploader)}
              className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              {showUploader ? 'Hide Uploader' : 'Analyze Resume'}
            </Button>
            <Button
              variant="outline"
              onClick={signOut}
              className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 transition-colors duration-500"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Resume Uploader */}
        {showUploader && (
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-500">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
                Resume Analysis
              </h2>
              <ResumeUploader onUploadSuccess={handleUploadSuccess} />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-500">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center transition-colors duration-500">
                <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-500">Total Analyses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-500">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-500">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center transition-colors duration-500">
                <BarChart2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-500">Average Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-500">{stats.avgScore.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-500">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center transition-colors duration-500">
                <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-500">Profile</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-500">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-500">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 transition-colors duration-500">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-500">Recent Analyses</h2>
          </div>
          <div className="p-6">
            {analyses.length === 0 ? (
              <div className="text-center py-12">
                <Inbox className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 transition-colors duration-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white transition-colors duration-500">No analyses yet</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">Get started by analyzing your first resume.</p>
                <div className="mt-6">
                  <Button
                    onClick={() => setShowUploader(true)}
                    className="shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Start Analysis
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {analyses.map((analysis) => (
                  <div key={analysis.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-500">
                        {analysis.job_title || 'Resume Analysis'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                        {analysis.candidate_name || 'Candidate'} • {new Date(analysis.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-500">{analysis.summary}</p>
                    </div>
                    <div className="ml-4 flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        analysis.score >= 80 ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                        analysis.score >= 60 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                        'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      } transition-colors duration-500`}>
                        {analysis.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}