'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface StatItem {
  value: number;
  display: string;
  label: string;
}

interface StatsData {
  resumesAnalyzed: StatItem;
  accuracyRate: StatItem;
  companiesSupported: StatItem;
}

export default function Hero() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to default display values if API fails
        setStats({
          resumesAnalyzed: { value: 0, display: '0+', label: 'Resumes Analyzed' },
          accuracyRate: { value: 85, display: '85%', label: 'Accuracy Rate' },
          companiesSupported: { value: 100, display: '100+', label: 'Nigerian Companies' }
        });
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);
  const scrollToUpload = () => {
    const uploadSection = document.getElementById('upload');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-primary-50 to-primary-100 dark:from-gray-900 dark:via-primary-900 dark:to-primary-950 py-24 sm:py-32 overflow-hidden transition-colors duration-500">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 text-primary-700 dark:text-primary-200 text-sm font-medium border border-primary-500/20">
            🚀 Powered by Advanced AI Technology
          </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight transition-colors duration-500"
        >
          AI-Powered Hiring
          <span className="block bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
            Made Simple
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed transition-colors duration-500"
        >
          Transform your recruitment process with intelligent resume analysis designed specifically for the 
          <span className="text-primary-600 dark:text-primary-300 font-semibold"> Nigerian job market</span>.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={scrollToUpload}
              className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-primary-700 hover:to-primary-800 shadow-xl hover:shadow-2xl transition-all duration-200"
            >
              Get Started Free
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              className="border-2 border-gray-600 dark:border-gray-300 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-600 dark:hover:bg-gray-300 hover:text-white dark:hover:text-gray-900 transition-all duration-200"
            >
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {isLoadingStats ? (
            // Loading skeleton for stats
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="text-center p-6 rounded-lg">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))
          ) : stats ? (
            <>
              <motion.div
                className="group text-center p-6 rounded-lg hover:bg-gray-900/5 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer hover:scale-105"
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors duration-300">
                  {stats.resumesAnalyzed.display}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                  {stats.resumesAnalyzed.label}
                </div>
              </motion.div>
              <motion.div
                className="group text-center p-6 rounded-lg hover:bg-gray-900/5 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer hover:scale-105"
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors duration-300">
                  {stats.accuracyRate.display}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                  {stats.accuracyRate.label}
                </div>
              </motion.div>
              <motion.div
                className="group text-center p-6 rounded-lg hover:bg-gray-900/5 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer hover:scale-105"
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors duration-300">
                  {stats.companiesSupported.display}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                  {stats.companiesSupported.label}
                </div>
              </motion.div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}