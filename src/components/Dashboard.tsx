
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { FaUser, FaFileAlt, FaChartLine, FaAward, FaClock, FaSearch, FaWhatsapp } from 'react-icons/fa';
import { useState, useMemo } from 'react';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorMessage from './ErrorMessage';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import WhatsAppModal from './WhatsAppModal';

// Define types for the data we expect from the API
interface WorkExperience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

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
        <div className="flex flex-wrap">
          {candidate.skills?.map(skill => <Badge key={skill} variant="secondary" className="mr-1 mb-1">{skill}</Badge>) ?? <Badge variant="secondary">No skills found</Badge>}
        </div>
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2">Work Experience</h4>
        {candidate.work_experience?.map((exp, index) => (
          <div key={index} className="mb-2">
            <p className="font-medium">{exp.title} at {exp.company}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{exp.duration}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{exp.description}</p>
          </div>
        )) ?? <p className="text-sm text-gray-600 dark:text-gray-300">No work experience found</p>}
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2">Education</h4>
        {candidate.education?.map((edu, index) => (
          <div key={index} className="mb-2">
            <p className="font-medium">{edu.degree} from {edu.institution}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{edu.year}</p>
          </div>
        )) ?? <p className="text-sm text-gray-600 dark:text-gray-300">No education found</p>}
      </div>
    </CardContent>
    <CardFooter className="flex justify-between items-center">
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Added: {new Date(candidate.created_at).toLocaleDateString()}
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm">View Details</Button>
        <Button variant="outline" size="sm" onClick={() => openWhatsAppModal(candidate)}><FaWhatsapp className="mr-1" /> WhatsApp</Button>
      </div>
    </CardFooter>
  </Card>
);

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

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
    if (!searchTerm) return candidates;
    return candidates.filter(candidate => 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [candidates, searchTerm]);

  const stats: Stats = useMemo(() => {
    return {
      totalCandidates: candidates.length,
    };
  }, [candidates]);

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

            {/* Candidate List */}
            <Card>
              <CardHeader className="flex-row justify-between items-center">
                <div>
                  <CardTitle>Candidate List</CardTitle>
                  <CardDescription>Manage your candidate profiles</CardDescription>
                </div>
                <div className="relative">
                  <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
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
                            <TableHead>Education</TableHead>
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
                                  {candidate.skills?.map(skill => <Badge key={skill} variant="outline">{skill}</Badge>)}
                                </div>
                              </TableCell>
                              <TableCell>
                                {candidate.education?.map((edu, index) => (
                                  <div key={index}>
                                    {edu.degree} from {edu.institution} ({edu.year})
                                  </div>
                                ))}
                              </TableCell>
                              <TableCell>
                                {candidate.work_experience?.map((exp, index) => (
                                  <div key={index}>
                                    {exp.title} at {exp.company} ({exp.duration})
                                  </div>
                                ))}
                              </TableCell>
                              <TableCell>{new Date(candidate.created_at).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">View</Button>
                                  <Button variant="outline" size="sm" onClick={() => openWhatsAppModal(candidate)}><FaWhatsapp className="mr-1" /> WhatsApp</Button>
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
