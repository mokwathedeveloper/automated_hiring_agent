'use client';

import Link from 'next/link';
import { useState } from 'react';
import { auth } from '@/lib/supabase';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await auth.signOut();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AHA</span>
              </div>
              <span className="font-semibold text-gray-900 hidden sm:block">
                Automated Hiring Agent
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Pricing
            </Link>
            <Link href="/auth" className="btn-primary">
              Sign In
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-indigo-600 transition-colors">
                Home
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-indigo-600 transition-colors">
                Pricing
              </Link>
              <Link href="/auth" className="btn-primary w-fit">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}