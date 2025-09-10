'use client';

import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LogOut, FileText, User, Inbox, Plus, Upload, Search, MessageCircle } from 'lucide-react';
import ResumeUploader from '@/components/ResumeUploader';
import WhatsAppModal from '@/components/WhatsAppModal';
import WhatsAppSetupGuide from '@/components/WhatsAppSetupGuide';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorMessage from '@/components/ErrorMessage';
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
}

interface Stats {
  totalCandidates: number;
}

// Function to fetch candidates from our API endpoint
const fetchCandidates = async (): Promise<Candidate[]> => {
  const response = await fetch('/api/candidates');
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch candidates');
  }
  const result = await response.json();
  return result.data;
};

// Candidate Card Component
const CandidateCard = ({ candidate, openWhatsAppModal }: { candidate: Candidate, openWhatsAppModal: (candidate: Candidate) => void }) => (
  <Card className="flex flex-col justify-between transition-all hover:shadow-lg">
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="truncate">{candidate.name || 'N/A'}</CardTitle>
          <CardDescription className="truncate">{candidate.email || 'No email found'}</CardDescription>
          <CardDescription className="truncate">{candidate.phone || 'No phone found'}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2">Skills</h4>
        <div className="flex flex-wrap gap-1">
          {candidate.skills?.slice(0, 5).map(skill => (
            <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
          ))}
          {candidate.skills?.length > 5 && (
            <Badge variant="outline" className="text-xs">+{candidate.skills.length - 5} more</Badge>
          )}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2">Experience</h4>
        {candidate.work_experience?.length > 0 ? (
          <div className="text-sm text-gray-600">
            <p className="font-medium">{candidate.work_experience[0].title}</p>
            <p>{candidate.work_experience[0].company}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No experience listed</p>
        )}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Added {new Date(candidate.created_at).toLocaleDateString()}
        </span>
        <Button
          size="sm"
          onClick={() => openWhatsAppModal(candidate)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <MessageCircle className="w-4 h-4 mr-1" />
          WhatsApp
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const [showUploader, setShowUploader] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isSetupGuideOpen, setIsSetupGuideOpen] = useState(false);
  const [whatsappConfigured, setWhatsappConfigured] = useState<boolean | null>(null);
  const router = useRouter();

  // Fetch candidates using React Query
  const { data: candidates = [], isLoading, error, refetch } = useQuery<Candidate[]>({
    queryKey: ['candidates'],
    queryFn: fetchCandidates,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Check WhatsApp configuration status
  const { data: whatsappStatus } = useQuery({
    queryKey: ['whatsapp-status'],
    queryFn: async () => {
      const response = await fetch('/api/whatsapp/status');
      const result = await response.json();
      return result.data;
    },
    refetchInterval: 60000, // Check every minute
  });

  const openWhatsAppModal = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsWhatsAppModalOpen(true);
  };

  const filteredCandidates = useMemo(() => {
    if (!searchTerm) return candidates;
    return candidates.filter(candidate =>
      candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [candidates, searchTerm]);

  const stats: Stats = useMemo(() => {
    return {
      totalCandidates: candidates.length,
    };
  }, [candidates]);

  const handleUploadSuccess = (results: any[]) => {
    // Refresh candidates after successful upload
    refetch();
    setShowUploader(false);
  };

  // Redirect to auth if not authenticated
  if (!loading && !user) {
    router.push('/auth');
    return null;
  }

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
              onClick={() => setIsSetupGuideOpen(true)}
              variant="outline"
              size="sm"
              className={`${
                whatsappStatus?.status?.configured
                  ? 'text-green-600 border-green-600 hover:bg-green-50'
                  : 'text-orange-600 border-orange-600 hover:bg-orange-50'
              }`}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {whatsappStatus?.status?.configured ? 'WhatsApp Ready' : 'Setup WhatsApp'}
              {whatsappStatus?.status?.configured && (
                <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </Button>
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCandidates}</div>
              <p className="text-xs text-muted-foreground">
                Candidates in database
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {candidates.filter(c => {
                  const dayAgo = new Date();
                  dayAgo.setDate(dayAgo.getDate() - 1);
                  return new Date(c.created_at) > dayAgo;
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">
                In the last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Status</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">
                System operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Candidates Section */}
        <Card>
          <CardHeader className="flex-row justify-between items-center">
            <div>
              <CardTitle>Candidate List</CardTitle>
              <CardDescription>Manage your candidate profiles</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name, email, phone, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-colors duration-500"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <ErrorMessage message={error.message} />
            ) : filteredCandidates.length === 0 ? (
              <div className="text-center py-12">
                <Inbox className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 transition-colors duration-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white transition-colors duration-500">
                  {searchTerm ? `No candidates found for "${searchTerm}"` : 'No candidates added yet'}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Get started by uploading your first resume.'}
                </p>
                {!searchTerm && (
                  <div className="mt-6">
                    <Button
                      onClick={() => setShowUploader(true)}
                      className="shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="-ml-1 mr-2 h-5 w-5" />
                      Upload Resume
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Mobile and Tablet View (Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-6">
                  {filteredCandidates.map((candidate) => (
                    <CandidateCard key={candidate.id} candidate={candidate} openWhatsAppModal={openWhatsAppModal} />
                  ))}
                </div>

                {/* Desktop View (Table) */}
                <div className="hidden lg:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Skills</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Added On</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCandidates.map((candidate) => (
                        <TableRow key={candidate.id}>
                          <TableCell className="font-medium">{candidate.name}</TableCell>
                          <TableCell>{candidate.email}</TableCell>
                          <TableCell>{candidate.phone}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {candidate.skills?.slice(0, 3).map(skill => (
                                <Badge key={skill} variant="outline">{skill}</Badge>
                              ))}
                              {candidate.skills?.length > 3 && (
                                <Badge variant="outline">+{candidate.skills.length - 3}</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {candidate.work_experience?.length > 0 ? (
                              <div>
                                <div className="font-medium">{candidate.work_experience[0].title}</div>
                                <div className="text-sm text-gray-500">{candidate.work_experience[0].company}</div>
                              </div>
                            ) : (
                              <span className="text-gray-500">No experience</span>
                            )}
                          </TableCell>
                          <TableCell>{new Date(candidate.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => openWhatsAppModal(candidate)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <MessageCircle className="w-4 h-4 mr-1" />
                              WhatsApp
                            </Button>
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
      </div>

      {/* WhatsApp Modal */}
      {isWhatsAppModalOpen && selectedCandidate && (
        <WhatsAppModal
          isOpen={isWhatsAppModalOpen}
          onClose={() => setIsWhatsAppModalOpen(false)}
          candidate={selectedCandidate}
        />
      )}

      {/* WhatsApp Setup Guide */}
      <WhatsAppSetupGuide
        isOpen={isSetupGuideOpen}
        onClose={() => setIsSetupGuideOpen(false)}
      />
    </div>
  );
}