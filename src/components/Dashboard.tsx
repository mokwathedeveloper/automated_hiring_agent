
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { FaUser, FaFileAlt, FaChartLine, FaAward, FaClock, FaSearch } from 'react-icons/fa';
import { useState, useMemo } from 'react';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorMessage } from './ErrorMessage';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Define types for the data we expect from the API
interface Resume {
  id: string;
  filename: string;
  file_size: number;
  file_type: string;
  score: number;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
  analysis: {
    summary?: string;
    name?: string;
    email?: string;
    skills?: string[];
  } | null;
}

interface Stats {
  totalResumes: number;
  averageScore: number;
  highScoreResumes: number;
  pendingAnalyses: number;
}

// Function to fetch resumes from our new API endpoint
const fetchResumes = async (): Promise<Resume[]> => {
  const response = await fetch('/api/resumes');
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch resumes');
  }
  const result = await response.json();
  return result.data;
};

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 mr-2 mb-2">
    {children}
  </span>
);

const CandidateCard = ({ resume }: { resume: Resume }) => (
  <Card className="flex flex-col justify-between transition-all hover:shadow-lg">
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="truncate">{resume.analysis?.name || resume.filename}</CardTitle>
          <CardDescription className="truncate">{resume.analysis?.email || 'No email found'}</CardDescription>
        </div>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${resume.score >= 85 ? 'bg-green-500' : resume.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}>
          {resume.score || 'N/A'}
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600 dark:text-gray-300 italic line-clamp-2">"{resume.analysis?.summary || 'No summary available'}"</p>
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2">Top Skills</h4>
        <div className="flex flex-wrap">
          {resume.analysis?.skills?.slice(0, 3).map(skill => <Badge key={skill}>{skill}</Badge>) ?? <Badge>No skills found</Badge>}
        </div>
      </div>
    </CardContent>
    <CardFooter className="flex justify-between items-center">
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Submitted: {new Date(resume.created_at).toLocaleDateString()}
      </div>
      <Button variant="outline" size="sm">View Details</Button>
    </CardFooter>
  </Card>
);

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: resumes = [], isLoading, error } = useQuery<Resume[]>({ 
    queryKey: ['resumes', user?.id], 
    queryFn: fetchResumes, 
    enabled: !!user, // Only run the query if the user is authenticated
  });

  const filteredResumes = useMemo(() => {
    if (!searchTerm) return resumes;
    return resumes.filter(resume => 
      resume.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.analysis?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.analysis?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [resumes, searchTerm]);

  const stats: Stats = useMemo(() => {
    const completedResumes = resumes.filter(r => r.status === 'completed' && r.score);
    const totalScore = completedResumes.reduce((acc, r) => acc + r.score, 0);
    return {
      totalResumes: resumes.length,
      averageScore: completedResumes.length > 0 ? Math.round(totalScore / completedResumes.length) : 0,
      highScoreResumes: completedResumes.filter(r => r.score >= 85).length,
      pendingAnalyses: resumes.filter(r => r.status === 'pending').length,
    };
  }, [resumes]);

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
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center transition-colors duration-500">
                <FaUser className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-500">Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">Welcome back, {user.email}</p>
              </div>
            </div>
            <Button onClick={signOut} variant="outline">Sign Out</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorMessage message={error.message} />
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
                        <FaFileAlt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalResumes}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <FaChartLine className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.averageScore}/100</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">High Scores</CardTitle>
                        <FaAward className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.highScoreResumes}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <FaClock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingAnalyses}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Resume History */}
            <Card>
              <CardHeader className="flex-row justify-between items-center">
                <div>
                  <CardTitle>Resume Analysis History</CardTitle>
                  <CardDescription>Your recent resume analyses and performance scores</CardDescription>
                </div>
                <div className="relative">
                  <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Search by name, email, file..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-colors duration-500"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredResumes.length === 0 ? (
                  <div className="text-center py-8">
                    <FaFileAlt className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {searchTerm ? `No resumes found for "${searchTerm}"` : 'No resumes analyzed yet'}
                    </p>
                    <Button asChild>
                      <a href="/">Start Analyzing Resumes</a>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResumes.map((resume) => (
                      <CandidateCard key={resume.id} resume={resume} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
