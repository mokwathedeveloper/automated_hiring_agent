'use client';

import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  LogOut, 
  FileText, 
  User, 
  Inbox, 
  Plus, 
  Upload, 
  Search, 
  MessageCircle,
  TrendingUp,
  Clock,
  Users,
  Activity
} from 'lucide-react';
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

// Enhanced Candidate Card Component with animations
const CandidateCard = ({ candidate, openWhatsAppModal }: { candidate: Candidate, openWhatsAppModal: (candidate: Candidate) => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={{ y: -4 }}
  >
    <Card className="card-hover h-full flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold truncate">
              {candidate.name || 'N/A'}
            </CardTitle>
            <CardDescription className="truncate flex items-center">
              <User className="w-3 h-3 mr-1" />
              {candidate.email || 'No email found'}
            </CardDescription>
            <CardDescription className="truncate flex items-center">
              <MessageCircle className="w-3 h-3 mr-1" />
              {candidate.phone || 'No phone found'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center">
            <Activity className="w-3 h-3 mr-1" />
            Skills
          </h4>
          <div className="flex flex-wrap gap-1">
            {candidate.skills?.slice(0, 4).map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Badge variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              </motion.div>
            ))}
            {candidate.skills?.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{candidate.skills.length - 4} more
              </Badge>
            )}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            Experience
          </h4>
          {candidate.work_experience?.length > 0 ? (
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{candidate.work_experience[0].title}</p>
              <p>{candidate.work_experience[0].company}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No experience listed</p>
          )}
        </div>
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-xs text-muted-foreground flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Added {new Date(candidate.created_at).toLocaleDateString()}
          </span>
          <Button
            size="sm"
            onClick={() => openWhatsAppModal(candidate)}
            className="button-hover bg-green-600 hover:bg-green-700 text-white"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header with animations */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 space-y-4 lg:space-y-0"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold gradient-text">Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Welcome back, <span className="font-semibold text-foreground">{user.email}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setIsSetupGuideOpen(true)}
              variant="outline"
              size="sm"
              className={`button-hover ${
                whatsappStatus?.status?.configured
                  ? 'text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950'
                  : 'text-orange-600 border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950'
              }`}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {whatsappStatus?.status?.configured ? 'WhatsApp Ready' : 'Setup WhatsApp'}
              {whatsappStatus?.status?.configured && (
                <motion.span 
                  className="ml-2 w-2 h-2 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </Button>
            <Button
              onClick={() => setShowUploader(!showUploader)}
              className="button-hover bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
            >
              <Upload className="w-4 h-4 mr-2" />
              {showUploader ? 'Hide Uploader' : 'Analyze Resume'}
            </Button>
            <Button
              variant="outline"
              onClick={signOut}
              className="button-hover"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </motion.div>

        {/* Enhanced Resume Uploader with animations */}
        <AnimatePresence>
          {showUploader && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mb-8 overflow-hidden"
            >
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Resume Analysis
                  </CardTitle>
                  <CardDescription>
                    Upload and analyze candidate resumes with AI-powered insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResumeUploader onUploadSuccess={handleUploadSuccess} />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Stats with animations */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalCandidates}</div>
                <p className="text-xs text-muted-foreground">
                  Candidates in database
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
                <div className="p-2 rounded-lg bg-green-500/10">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Activity className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">Active</div>
                <p className="text-xs text-muted-foreground">
                  System operational
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Enhanced Candidates Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="card-hover">
            <CardHeader className="space-y-4">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
                <div>
                  <CardTitle className="text-2xl">Candidate List</CardTitle>
                  <CardDescription className="text-base">
                    Manage your candidate profiles and track their progress
                  </CardDescription>
                </div>
                <div className="relative w-full lg:w-80">
                  <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search by name, email, phone, skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-input rounded-xl bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all duration-200"
                  />
                </div>
              </div>
            </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <ErrorMessage message={error.message} />
            ) : filteredCandidates.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-16"
              >
                <div className="mx-auto w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                  <Inbox className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchTerm ? `No candidates found for "${searchTerm}"` : 'No candidates added yet'}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {searchTerm ? 'Try adjusting your search terms or clear the search to see all candidates.' : 'Get started by uploading your first resume to begin building your candidate database.'}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setShowUploader(true)}
                    className="button-hover bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Upload Resume
                  </Button>
                )}
              </motion.div>
            ) : (
              <>
                {/* Mobile and Tablet View (Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-6">
                  {filteredCandidates.map((candidate) => (
                    <CandidateCard key={candidate.id} candidate={candidate} openWhatsAppModal={openWhatsAppModal} />
                  ))}
                </div>

                {/* Enhanced Desktop View (Table) */}
                <div className="hidden lg:block">
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="font-semibold">Name</TableHead>
                          <TableHead className="font-semibold">Email</TableHead>
                          <TableHead className="font-semibold">Phone</TableHead>
                          <TableHead className="font-semibold">Skills</TableHead>
                          <TableHead className="font-semibold">Experience</TableHead>
                          <TableHead className="font-semibold">Added On</TableHead>
                          <TableHead className="font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCandidates.map((candidate, index) => (
                          <motion.tr
                            key={candidate.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-muted/50 transition-colors"
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="w-4 h-4 text-primary" />
                                </div>
                                <span>{candidate.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{candidate.email}</TableCell>
                            <TableCell className="text-muted-foreground">{candidate.phone}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {candidate.skills?.slice(0, 2).map(skill => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {candidate.skills?.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{candidate.skills.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {candidate.work_experience?.length > 0 ? (
                                <div>
                                  <div className="font-medium text-sm">{candidate.work_experience[0].title}</div>
                                  <div className="text-xs text-muted-foreground">{candidate.work_experience[0].company}</div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">No experience</span>
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {new Date(candidate.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => openWhatsAppModal(candidate)}
                                className="button-hover bg-green-600 hover:bg-green-700 text-white"
                              >
                                <MessageCircle className="w-4 h-4 mr-1" />
                                WhatsApp
                              </Button>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          </Card>
        </motion.div>
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