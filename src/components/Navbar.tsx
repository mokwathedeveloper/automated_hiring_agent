'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FaBars, FaHome, FaTachometerAlt, FaDollarSign, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { CheckCircle } from 'lucide-react';
import AuthModal from './AuthModal';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-gray-50/95 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">HiringAgent</span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <Link href="/" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors flex items-center">
                <FaHome className="mr-1" /> Home
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors flex items-center">
                <FaTachometerAlt className="mr-1" /> Dashboard
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors flex items-center">
                <FaDollarSign className="mr-1" /> Pricing
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex md:items-center md:space-x-4">
              {user ? (
                <>
                  <span className="text-gray-700 flex items-center">
                    <FaUser className="mr-1" /> {user.email}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={() => signOut()}
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors flex items-center"
                  >
                    <FaSignOutAlt className="mr-1" /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors flex items-center"
                  >
                    <FaSignInAlt className="mr-1" /> Login
                  </Button>
                  <Button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                  >
                    <FaUserPlus className="mr-1" /> Sign Up
                  </Button>
                </>
              )}
            </div>
            
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaBars className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="block px-3 py-2 text-base font-medium text-gray-900 flex items-center">
                <FaHome className="mr-2" /> Home
              </Link>
              <Link href="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-500 flex items-center">
                <FaTachometerAlt className="mr-2" /> Dashboard
              </Link>
              <Link href="/pricing" className="block px-3 py-2 text-base font-medium text-gray-500 flex items-center">
                <FaDollarSign className="mr-2" /> Pricing
              </Link>
              <div className="pt-4 pb-3 border-t border-gray-200">
                {user ? (
                  <>
                    <span className="block px-3 py-2 text-base font-medium text-gray-700 flex items-center">
                      <FaUser className="mr-2" /> {user.email}
                    </span>
                    <Button
                      variant="ghost"
                      onClick={() => signOut()}
                      className="block w-full text-left text-base font-medium text-gray-500 flex items-center"
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => setIsAuthModalOpen(true)}
                      className="block w-full text-left text-base font-medium text-gray-500 flex items-center"
                    >
                      <FaSignInAlt className="mr-2" /> Login
                    </Button>
                    <Button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="block w-full text-left text-base font-medium bg-primary-600 text-white rounded-md mt-2 flex items-center"
                    >
                      <FaUserPlus className="mr-2" /> Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode="login"
      />
    </nav>
  );
}