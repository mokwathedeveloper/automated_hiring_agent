'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, X, ExternalLink, Clock, Users, Star } from 'lucide-react';

interface WatchDemoProps {
  youtubeUrl?: string;
}

export default function WatchDemo({ youtubeUrl }: WatchDemoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleWatchDemo = async () => {
    setIsLoading(true);
    
    try {
      // If no YouTube URL is provided, we'll use a placeholder for now
      if (!youtubeUrl) {
        // You can replace this with an API call to fetch the URL later
        console.log('No YouTube URL provided yet - will be added later');
        // For now, just open the modal with a placeholder
        setIsModalOpen(true);
      } else {
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error loading demo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const videoId = youtubeUrl ? getYouTubeVideoId(youtubeUrl) : null;
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;

  return (
    <>
      {/* Watch Demo Card Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              See HiringAgent in Action
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Watch how our AI-powered platform transforms the hiring process for Nigerian companies
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Demo Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="relative overflow-hidden bg-white dark:bg-gray-800 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-primary-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white">
                    <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                    Product Demo
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    See how HiringAgent analyzes resumes and provides intelligent insights
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <Clock className="w-4 h-4 text-primary-500" />
                      <span>3 minute overview</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <Users className="w-4 h-4 text-primary-500" />
                      <span>Real candidate analysis</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <Star className="w-4 h-4 text-primary-500" />
                      <span>Nigerian market focus</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleWatchDemo}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 group-hover:scale-105"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Loading...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Play className="w-5 h-5" />
                        Watch Demo
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Features Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Analysis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Advanced AI parsing and scoring of candidate resumes
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Nigerian Context</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Tailored for Nigerian companies and job market
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">WhatsApp Integration</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Seamless candidate communication via WhatsApp
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Real-time Dashboard</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Live analytics and candidate management
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  HiringAgent Demo
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="p-4">
                {embedUrl ? (
                  <div className="aspect-video">
                    <iframe
                      src={embedUrl}
                      title="HiringAgent Demo"
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Demo Video Coming Soon
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        The demo video will be available here once the YouTube URL is provided.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setIsModalOpen(false)}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Close
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
