'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, FileText, BarChart2, User, Inbox, Plus } from 'lucide-react';

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
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchAnalyses();
    }
  }, [user]);

  const fetchAnalyses = async () => {
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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.email}</p>
          </div>
          <Button
            variant="outline"
            onClick={signOut}
            className="text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Analyses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <BarChart2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgScore.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Profile</p>
                <p className="text-sm font-medium text-gray-900">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Analyses</h2>
          </div>
          <div className="p-6">
            {analyses.length === 0 ? (
              <div className="text-center py-12">
                <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No analyses yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by analyzing your first resume.</p>
                <div className="mt-6">
                  <Button
                    onClick={() => router.push('/')}
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
                  <div key={analysis.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {analysis.job_title || 'Resume Analysis'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {analysis.candidate_name || 'Candidate'} • {new Date(analysis.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{analysis.summary}</p>
                    </div>
                    <div className="ml-4 flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        analysis.score >= 80 ? 'bg-green-100 text-green-800' :
                        analysis.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
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