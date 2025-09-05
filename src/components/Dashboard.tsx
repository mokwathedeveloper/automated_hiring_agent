'use client';

import { useState, useEffect } from 'react';
import { supabase, auth, db } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User, FileText, TrendingUp, Calendar, BarChart3, Users, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardSidebar from './DashboardSidebar';
import ProfileForm from './ProfileForm';

interface Resume {
  id: string;
  filename: string;
  file_size: number;
  file_type: string;
  analysis: {
    score: number;
    summary: string;
    pros: string[];
    cons: string[];
  } | null;
  score: number | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

interface DashboardStats {
  totalResumes: number;
  averageScore: number;
  completedAnalyses: number;
  pendingAnalyses: number;
  thisMonthResumes: number;
  highScoreResumes: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalResumes: 0,
    averageScore: 0,
    completedAnalyses: 0,
    pendingAnalyses: 0,
    thisMonthResumes: 0,
    highScoreResumes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { user: currentUser, error: userError } = await auth.getCurrentUser();
      if (userError || !currentUser) {
        setError('Please sign in to access your dashboard');
        return;
      }

      setUser(currentUser);

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (!profileError && profileData) {
        setProfile(profileData);
      }

      // Get user resumes
      const { data: resumesData, error: resumesError } = await db.getUserResumes(currentUser.id);
      
      if (resumesError) {
        console.error('Error fetching resumes:', resumesError);
        setError('Failed to load resume data');
        return;
      }

      const userResumes: Resume[] = (resumesData as Resume[]) || [];
      setResumes(userResumes);

      // Calculate stats
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const completedResumes = userResumes.filter((r: Resume) => r.status === 'completed');
      const pendingResumes = userResumes.filter((r: Resume) => r.status === 'pending' || r.status === 'processing');
      const thisMonthResumes = userResumes.filter((r: Resume) => new Date(r.created_at) >= thisMonth);
      const highScoreResumes = completedResumes.filter((r: Resume) => (r.score || 0) >= 80);
      
      const totalScore = completedResumes.reduce((sum: number, r: Resume) => sum + (r.score || 0), 0);
      const averageScore = completedResumes.length > 0 ? Math.round(totalScore / completedResumes.length) : 0;

      setStats({
        totalResumes: userResumes.length,
        averageScore,
        completedAnalyses: completedResumes.length,
        pendingAnalyses: pendingResumes.length,
        thisMonthResumes: thisMonthResumes.length,
        highScoreResumes: highScoreResumes.length,
      });

    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      window.location.href = '/auth';
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const handleProfileUpdate = async (profileData: any) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          full_name: `${profileData.firstName} ${profileData.lastName}`,
          company: profileData.company,
          job_title: profileData.jobTitle,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      // Update local profile state
      setProfile(data);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number | null) => {
    if (!score) return 'bg-gray-100';
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-48 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
            <CardDescription>
              {error || 'Please sign in to access your dashboard'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <a href="/auth">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow lg:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <DashboardSidebar onSignOut={handleSignOut} />
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Layout with Sidebar */}
      <div className="hidden lg:flex min-h-screen">
        <div className="p-6">
          <DashboardSidebar onSignOut={handleSignOut} />
        </div>
        
        <div className="flex-1 p-6">
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">
                  Welcome back, {profile?.full_name || profile?.first_name || user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid - Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="relative overflow-hidden group cursor-pointer border-0 bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-300">Total Resumes</CardTitle>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <FileText className="h-4 w-4 text-blue-500 group-hover:text-blue-600" />
                  </motion.div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <motion.div 
                    className="text-2xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    {stats.totalResumes}
                  </motion.div>
                  <p className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                    {stats.thisMonthResumes} this month
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="relative overflow-hidden group cursor-pointer border-0 bg-gradient-to-br from-emerald-50 to-green-100 hover:from-emerald-100 hover:to-green-200 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-gray-700 group-hover:text-emerald-700 transition-colors duration-300">Average Score</CardTitle>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <TrendingUp className="h-4 w-4 text-emerald-500 group-hover:text-emerald-600" />
                  </motion.div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <motion.div 
                    className="text-2xl font-bold text-gray-900 group-hover:text-emerald-900 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    {stats.averageScore}/100
                  </motion.div>
                  <p className="text-xs text-gray-600 group-hover:text-emerald-600 transition-colors duration-300">
                    {stats.completedAnalyses} completed
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="relative overflow-hidden group cursor-pointer border-0 bg-gradient-to-br from-amber-50 to-yellow-100 hover:from-amber-100 hover:to-yellow-200 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-gray-700 group-hover:text-amber-700 transition-colors duration-300">High Scores</CardTitle>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Award className="h-4 w-4 text-amber-500 group-hover:text-amber-600" />
                  </motion.div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <motion.div 
                    className="text-2xl font-bold text-gray-900 group-hover:text-amber-900 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    {stats.highScoreResumes}
                  </motion.div>
                  <p className="text-xs text-gray-600 group-hover:text-amber-600 transition-colors duration-300">
                    80+ score resumes
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="relative overflow-hidden group cursor-pointer border-0 bg-gradient-to-br from-purple-50 to-violet-100 hover:from-purple-100 hover:to-violet-200 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors duration-300">Pending</CardTitle>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Clock className="h-4 w-4 text-purple-500 group-hover:text-purple-600" />
                  </motion.div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <motion.div 
                    className="text-2xl font-bold text-gray-900 group-hover:text-purple-900 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    {stats.pendingAnalyses}
                  </motion.div>
                  <p className="text-xs text-gray-600 group-hover:text-purple-600 transition-colors duration-300">
                    In processing
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Resume History - Desktop */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Resume Analysis History</span>
              </CardTitle>
              <CardDescription>
                Your recent resume analyses and performance scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resumes.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No resumes analyzed yet</p>
                  <Button asChild>
                    <a href="/">Start Analyzing Resumes</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 hover:shadow-md hover:border-gray-300 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                          resume.status === 'completed' 
                            ? getScoreBgColor(resume.score)
                            : 'bg-gray-200'
                        }`}>
                          {resume.status === 'completed' ? (
                            <span className={getScoreColor(resume.score)}>
                              {resume.score || 0}
                            </span>
                          ) : (
                            <Clock className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 truncate">
                            {resume.filename}
                          </div>
                          <div className="text-sm text-gray-500">
                            {resume.file_type} • {formatFileSize(resume.file_size)}
                          </div>
                          {resume.analysis?.summary && (
                            <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {resume.analysis.summary}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end space-y-1">
                        <div className="text-sm text-gray-500">
                          {new Date(resume.created_at).toLocaleDateString()}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          resume.status === 'completed' ? 'bg-green-100 text-green-800' :
                          resume.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          resume.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {resume.status.charAt(0).toUpperCase() + resume.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <div className="mt-8">
            <ProfileForm
              initialData={{
                firstName: profile?.first_name || '',
                lastName: profile?.last_name || '',
                email: user.email || '',
                company: profile?.company || '',
                jobTitle: profile?.job_title || '',
              }}
              onSubmit={handleProfileUpdate}
            />
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <main className="lg:hidden max-w-7xl mx-auto py-6 px-4 sm:px-6">
        {/* Stats Grid - Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-blue-700 transition-colors">Total Resumes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:scale-110 transition-all duration-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold group-hover:text-blue-900 transition-colors">{stats.totalResumes}</div>
              <p className="text-xs text-muted-foreground group-hover:text-blue-600 transition-colors">
                {stats.thisMonthResumes} this month
              </p>
            </CardContent>
          </Card>

          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-emerald-200 hover:bg-emerald-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-emerald-700 transition-colors">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 group-hover:scale-110 transition-all duration-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold group-hover:text-emerald-900 transition-colors">{stats.averageScore}/100</div>
              <p className="text-xs text-muted-foreground group-hover:text-emerald-600 transition-colors">
                {stats.completedAnalyses} completed
              </p>
            </CardContent>
          </Card>

          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-amber-200 hover:bg-amber-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-amber-700 transition-colors">High Scores</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground group-hover:text-amber-500 group-hover:scale-110 transition-all duration-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold group-hover:text-amber-900 transition-colors">{stats.highScoreResumes}</div>
              <p className="text-xs text-muted-foreground group-hover:text-amber-600 transition-colors">
                80+ score resumes
              </p>
            </CardContent>
          </Card>

          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-purple-200 hover:bg-purple-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-purple-700 transition-colors">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground group-hover:text-purple-500 group-hover:scale-110 transition-all duration-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold group-hover:text-purple-900 transition-colors">{stats.pendingAnalyses}</div>
              <p className="text-xs text-muted-foreground group-hover:text-purple-600 transition-colors">
                In processing
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Resume History - Mobile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Resume Analysis History</span>
            </CardTitle>
            <CardDescription>
              Your recent resume analyses and performance scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resumes.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No resumes analyzed yet</p>
                <Button asChild>
                  <a href="/">Start Analyzing Resumes</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 hover:shadow-md hover:border-gray-300 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                        resume.status === 'completed' 
                          ? getScoreBgColor(resume.score)
                          : 'bg-gray-200'
                      }`}>
                        {resume.status === 'completed' ? (
                          <span className={getScoreColor(resume.score)}>
                            {resume.score || 0}
                          </span>
                        ) : (
                          <Clock className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 truncate">
                          {resume.filename}
                        </div>
                        <div className="text-sm text-gray-500">
                          {resume.file_type} • {formatFileSize(resume.file_size)}
                        </div>
                        {resume.analysis?.summary && (
                          <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {resume.analysis.summary}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end space-y-1">
                      <div className="text-sm text-gray-500">
                        {new Date(resume.created_at).toLocaleDateString()}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        resume.status === 'completed' ? 'bg-green-100 text-green-800' :
                        resume.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        resume.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {resume.status.charAt(0).toUpperCase() + resume.status.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Settings - Mobile */}
        <div className="mt-8">
          <ProfileForm
            initialData={{
              firstName: profile?.first_name || '',
              lastName: profile?.last_name || '',
              email: user.email || '',
              company: profile?.company || '',
              jobTitle: profile?.job_title || '',
            }}
            onSubmit={handleProfileUpdate}
          />
        </div>
      </main>
    </div>
  );
}