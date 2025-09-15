
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { FaUser, FaFileAlt, FaChartLine, FaAward, FaClock, FaSearch, FaWhatsapp, FaDownload, FaTrophy, FaStar, FaUpload } from 'react-icons/fa';
import { useState, useMemo } from 'react';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorMessage from './ErrorMessage';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import WhatsAppModal from './WhatsAppModal';
import BatchUpload from './BatchUpload';

// Import shared types instead of duplicating
import { WorkExperience, Education } from '@/types';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  work_experience: WorkExperience[];
  skills: string[];
  education: Education[];
  created_at: string;
  analysis_score?: number;
  analysis_data?: {
    overallScore: number;
    technicalSkills: { skill: string; proficiency: number }[];
    experienceMatch: number;
    educationFit: number;
    culturalFit: number;
    salaryExpectation?: string;
    availabilityDate?: string;
    recommendations: string[];
    strengths: string[];
    weaknesses: string[];
  };
  last_analyzed?: string;
}

interface Stats {
  totalCandidates: number;
  // Add other relevant stats for candidates if needed
}

// Function to fetch candidates from our new API endpoint
const fetchCandidates = async (): Promise<Candidate[]> => {
  const response = await fetch('/api/candidates');
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch candidates');
  }
  const result = await response.json();
  return result.data;
};

import { Badge } from '@/components/ui/badge';
import { exportToExcel, exportToPDF, downloadFile } from '@/lib/export';

const CandidateCard = ({ candidate, openWhatsAppModal, rank }: { candidate: Candidate, openWhatsAppModal: (candidate: Candidate) => void, rank?: number }) => (
  <Card className={`flex flex-col justify-between transition-all hover:shadow-lg ${rank && rank <= 3 ? 'ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-white' : ''}`}>
    <CardHeader>
      <div className="flex justify-between items-start">
        {rank && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold ${
            rank === 1 ? 'bg-yellow-100 text-yellow-800' :
            rank === 2 ? 'bg-gray-100 text-gray-800' :
            rank === 3 ? 'bg-orange-100 text-orange-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {rank <= 3 && <FaTrophy className="w-3 h-3" />}
            <span>#{rank}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <CardTitle className="truncate text-sm sm:text-base" title={candidate.name || 'N/A'}>
            {candidate.name || 'N/A'}
          </CardTitle>
          <CardDescription className="truncate text-xs sm:text-sm" title={candidate.email || 'No email found'}>
            {candidate.email || 'No email found'}
          </CardDescription>
          <CardDescription className="truncate text-xs sm:text-sm" title={candidate.phone || 'No phone found'}>
            {candidate.phone || 'No phone found'}
          </CardDescription>
          {candidate.analysis_score && (
            <div className="flex items-center mt-2">
              <FaStar className="w-3 h-3 text-yellow-500 mr-1" />
              <span className={`text-sm font-semibold ${
                candidate.analysis_score >= 80 ? 'text-green-600' :
                candidate.analysis_score >= 60 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                Score: {candidate.analysis_score}/100
              </span>
            </div>
          )}
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2">Skills</h4>
        <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto scrollbar-thin">
          {candidate.skills?.slice(0, 6).map(skill => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          )) ?? <Badge variant="secondary" className="text-xs">No skills found</Badge>}
          {candidate.skills && candidate.skills.length > 6 && (
            <Badge variant="outline" className="text-xs">
              +{candidate.skills.length - 6} more
            </Badge>
          )}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2">Work Experience</h4>
        <div className="max-h-24 overflow-y-auto">
          {candidate.work_experience?.slice(0, 2).map((exp, index) => (
            <div key={index} className="mb-2">
              <p className="font-medium text-sm truncate" title={`${exp.title} at ${exp.company}`}>
                {exp.title} at {exp.company}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{exp.duration}</p>
              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{exp.description}</p>
            </div>
          )) ?? <p className="text-sm text-gray-600 dark:text-gray-300">No work experience found</p>}
          {candidate.work_experience && candidate.work_experience.length > 2 && (
            <p className="text-xs text-gray-500">+{candidate.work_experience.length - 2} more positions</p>
          )}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2">Education</h4>
        <div className="max-h-20 overflow-y-auto">
          {candidate.education?.slice(0, 2).map((edu, index) => (
            <div key={index} className="mb-2">
              <p className="font-medium text-sm truncate" title={`${edu.degree} from ${edu.institution}`}>
                {edu.degree}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                {edu.institution} ({edu.year})
              </p>
            </div>
          )) ?? <p className="text-sm text-gray-600 dark:text-gray-300">No education found</p>}
          {candidate.education && candidate.education.length > 2 && (
            <p className="text-xs text-gray-500">+{candidate.education.length - 2} more degrees</p>
          )}
        </div>
      </div>
    </CardContent>
    <CardFooter className="flex justify-between items-center">
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Added: {new Date(candidate.created_at).toLocaleDateString()}
      </div>
      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
        <Button variant="outline" size="sm" className="text-xs">
          View Details
        </Button>
        <Button variant="outline" size="sm" onClick={() => openWhatsAppModal(candidate)} className="text-xs">
          <FaWhatsapp className="mr-1 w-3 h-3" />
          <span className="hidden sm:inline">WhatsApp</span>
          <span className="sm:hidden">Chat</span>
        </Button>
      </div>
    </CardFooter>
  </Card>
);

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [showBatchUpload, setShowBatchUpload] = useState(false);

  const openWhatsAppModal = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsWhatsAppModalOpen(true);
  };

  const { data: candidates = [], isLoading, error } = useQuery<Candidate[]>({
    queryKey: ['candidates', user?.id],
    queryFn: fetchCandidates,
    enabled: !!user, // Only run the query if the user is authenticated
  });

  const filteredCandidates = useMemo(() => {
    let filtered = candidates;
    if (searchTerm) {
      filtered = candidates.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort by analysis score (highest first), then by creation date
    return filtered.sort((a, b) => {
      if (a.analysis_score && b.analysis_score) {
        return b.analysis_score - a.analysis_score;
      }
      if (a.analysis_score && !b.analysis_score) return -1;
      if (!a.analysis_score && b.analysis_score) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [candidates, searchTerm]);

  const stats: Stats = useMemo(() => {
    return {
      totalCandidates: candidates.length,
    };
  }, [candidates]);

  // Export functionality
  const handleExportCSV = async () => {
    try {
      const exportData = filteredCandidates
        .filter(candidate => candidate.analysis_data)
        .map(candidate => ({
          fileName: candidate.name,
          analysis: {
            ...candidate.analysis_data!,
            salaryExpectation: candidate.analysis_data!.salaryExpectation || 'Not specified',
            availabilityDate: candidate.analysis_data!.availabilityDate || 'Not specified'
          }
        }));

      if (exportData.length === 0) {
        alert('No analyzed candidates to export');
        return;
      }

      const blob = await exportToExcel(exportData);
      downloadFile(blob, `candidates-analysis-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const handleExportPDF = async () => {
    try {
      const exportData = filteredCandidates
        .filter(candidate => candidate.analysis_data)
        .map(candidate => ({
          fileName: candidate.name,
          analysis: {
            ...candidate.analysis_data!,
            salaryExpectation: candidate.analysis_data!.salaryExpectation || 'Not specified',
            availabilityDate: candidate.analysis_data!.availabilityDate || 'Not specified'
          }
        }));

      if (exportData.length === 0) {
        alert('No analyzed candidates to export');
        return;
      }

      const blob = await exportToPDF(exportData);
      downloadFile(blob, `candidates-analysis-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
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
                        <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                        <FaUser className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCandidates}</div>
                    </CardContent>
                </Card>
                {/* Removed other stats as they are not directly applicable to candidates without analysis */}
            </div>

            {/* Top Candidates Section */}
            {filteredCandidates.some(c => c.analysis_score) && (
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaTrophy className="w-5 h-5 text-yellow-500" />
                      <CardTitle>Top Candidates</CardTitle>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleExportCSV} variant="outline" size="sm">
                        <FaDownload className="w-4 h-4 mr-2" />
                        Export CSV
                      </Button>
                      <Button onClick={handleExportPDF} variant="outline" size="sm">
                        <FaDownload className="w-4 h-4 mr-2" />
                        Export PDF
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredCandidates
                      .filter(c => c.analysis_score)
                      .slice(0, 3)
                      .map((candidate, index) => (
                        <div key={candidate.id} className={`p-4 rounded-lg border-2 ${
                          index === 0 ? 'border-yellow-400 bg-yellow-50' :
                          index === 1 ? 'border-gray-400 bg-gray-50' :
                          'border-orange-400 bg-orange-50'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <FaTrophy className={`w-4 h-4 ${
                                index === 0 ? 'text-yellow-500' :
                                index === 1 ? 'text-gray-500' :
                                'text-orange-500'
                              }`} />
                              <span className="font-bold">#{index + 1}</span>
                            </div>
                            <span className="text-lg font-bold text-green-600">
                              {candidate.analysis_score}/100
                            </span>
                          </div>
                          <h3 className="font-semibold truncate">{candidate.name}</h3>
                          <p className="text-sm text-gray-600 truncate">{candidate.email}</p>
                          {candidate.analysis_data?.recommendations && (
                            <p className="text-xs text-gray-500 mt-2 truncate">
                              {candidate.analysis_data.recommendations[0]}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Batch Upload Section */}
            {showBatchUpload && (
              <div className="mb-6">
                <BatchUpload />
              </div>
            )}

            {/* Candidate List */}
            <Card>
              <CardHeader className="flex-row justify-between items-center">
                <div>
                  <CardTitle>Candidate List</CardTitle>
                  <CardDescription>Manage your candidate profiles</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <Button
                    onClick={() => setShowBatchUpload(!showBatchUpload)}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <FaUpload className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Batch Upload</span>
                    <span className="sm:hidden">Upload</span>
                  </Button>
                  <div className="relative w-full sm:w-auto">
                    <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search candidates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-colors duration-500"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredCandidates.length === 0 ? (
                  <div className="text-center py-8">
                    <FaUser className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {searchTerm ? `No candidates found for "${searchTerm}"` : 'No candidates added yet'}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Mobile and Tablet View (Cards) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-6">
                      {filteredCandidates.map((candidate, index) => (
                        <CandidateCard
                          key={candidate.id}
                          candidate={candidate}
                          openWhatsAppModal={openWhatsAppModal}
                          rank={candidate.analysis_score ? index + 1 : undefined}
                        />
                      ))}
                    </div>

                    {/* Desktop View (Table) */}
                    <div className="hidden lg:block overflow-x-auto">
                      <Table className="min-w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-16">Rank</TableHead>
                            <TableHead className="min-w-[120px]">Name</TableHead>
                            <TableHead className="min-w-[180px]">Email</TableHead>
                            <TableHead className="min-w-[120px]">Phone</TableHead>
                            <TableHead className="w-20">Score</TableHead>
                            <TableHead className="min-w-[200px]">Skills</TableHead>
                            <TableHead className="min-w-[200px]">Education</TableHead>
                            <TableHead className="min-w-[200px]">Experience</TableHead>
                            <TableHead className="w-24">Added On</TableHead>
                            <TableHead className="w-32">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredCandidates.map((candidate, index) => (
                            <TableRow key={candidate.id} className={index < 3 && candidate.analysis_score ? 'bg-yellow-50' : ''}>
                              <TableCell>
                                {candidate.analysis_score && (
                                  <div className={`flex items-center space-x-1 ${
                                    index < 3 ? 'font-bold' : ''
                                  }`}>
                                    {index < 3 && <FaTrophy className={`w-3 h-3 ${
                                      index === 0 ? 'text-yellow-500' :
                                      index === 1 ? 'text-gray-500' :
                                      'text-orange-500'
                                    }`} />}
                                    <span>#{index + 1}</span>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="font-medium">
                                <div className="truncate max-w-[120px]" title={candidate.name}>
                                  {candidate.name}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="truncate max-w-[180px]" title={candidate.email}>
                                  {candidate.email}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="truncate max-w-[120px]" title={candidate.phone}>
                                  {candidate.phone}
                                </div>
                              </TableCell>
                              <TableCell>
                                {candidate.analysis_score ? (
                                  <div className={`flex items-center space-x-1 font-semibold ${
                                    candidate.analysis_score >= 80 ? 'text-green-600' :
                                    candidate.analysis_score >= 60 ? 'text-yellow-600' :
                                    'text-red-600'
                                  }`}>
                                    <FaStar className="w-3 h-3" />
                                    <span>{candidate.analysis_score}/100</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">Not analyzed</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="max-w-[200px]">
                                  <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                                    {candidate.skills?.slice(0, 3).map(skill => (
                                      <Badge key={skill} variant="outline" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                    {candidate.skills && candidate.skills.length > 3 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{candidate.skills.length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-[200px] max-h-16 overflow-y-auto">
                                  {candidate.education?.slice(0, 2).map((edu, index) => (
                                    <div key={index} className="text-xs mb-1 truncate" title={`${edu.degree} from ${edu.institution} (${edu.year})`}>
                                      <div className="font-medium truncate">{edu.degree}</div>
                                      <div className="text-gray-500 truncate">{edu.institution} ({edu.year})</div>
                                    </div>
                                  ))}
                                  {candidate.education && candidate.education.length > 2 && (
                                    <div className="text-xs text-gray-500">+{candidate.education.length - 2} more</div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-[200px] max-h-16 overflow-y-auto">
                                  {candidate.work_experience?.slice(0, 2).map((exp, index) => (
                                    <div key={index} className="text-xs mb-1 truncate" title={`${exp.title} at ${exp.company} (${exp.duration})`}>
                                      <div className="font-medium truncate">{exp.title}</div>
                                      <div className="text-gray-500 truncate">{exp.company} ({exp.duration})</div>
                                    </div>
                                  ))}
                                  {candidate.work_experience && candidate.work_experience.length > 2 && (
                                    <div className="text-xs text-gray-500">+{candidate.work_experience.length - 2} more</div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{new Date(candidate.created_at).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex space-x-1">
                                  <Button variant="outline" size="sm" className="px-2">
                                    View
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => openWhatsAppModal(candidate)} className="px-2">
                                    <FaWhatsapp className="w-3 h-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
      {isWhatsAppModalOpen && selectedCandidate && (
        <WhatsAppModal
          isOpen={isWhatsAppModalOpen}
          onClose={() => setIsWhatsAppModalOpen(false)}
          candidate={selectedCandidate}
        />
      )}
    </div>
  );
}
