'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const scrollToUpload = () => {
    const uploadSection = document.getElementById('upload');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-primary-900 to-primary-950 py-24 sm:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 text-primary-200 text-sm font-medium border border-primary-500/20">
            🚀 Powered by Advanced AI Technology
          </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
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
          className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Transform your recruitment process with intelligent resume analysis designed specifically for the 
          <span className="text-primary-300 font-semibold">Nigerian job market</span>.
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
              className="border-2 border-gray-300 text-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-300 hover:text-gray-900 transition-all duration-200"
            >
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <motion.div 
            className="group text-center p-6 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer hover:scale-105"
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors duration-300">10,000+</div>
            <div className="text-gray-400 font-medium group-hover:text-gray-300 transition-colors duration-300">Resumes Analyzed</div>
          </motion.div>
          <motion.div 
            className="group text-center p-6 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer hover:scale-105"
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors duration-300">95%</div>
            <div className="text-gray-400 font-medium group-hover:text-gray-300 transition-colors duration-300">Accuracy Rate</div>
          </motion.div>
          <motion.div 
            className="group text-center p-6 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer hover:scale-105"
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors duration-300">500+</div>
            <div className="text-gray-400 font-medium group-hover:text-gray-300 transition-colors duration-300">Nigerian Companies</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}