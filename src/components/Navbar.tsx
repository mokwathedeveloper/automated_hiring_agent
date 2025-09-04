'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900">HiringAgent</span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <Link href="/" className="text-slate-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Home
              </Link>
              <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/pricing" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors">
                Pricing
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex md:items-center md:space-x-4">
              <button className="text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Login
              </button>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 px-6 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200">
                Sign Up
              </button>
            </div>
            
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="block px-3 py-2 text-base font-medium text-gray-900">
                Home
              </Link>
              <Link href="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-500">
                Dashboard
              </Link>
              <Link href="/pricing" className="block px-3 py-2 text-base font-medium text-gray-500">
                Pricing
              </Link>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <button className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500">
                  Login
                </button>
                <button className="block w-full text-left px-3 py-2 text-base font-medium bg-indigo-600 text-white rounded-md mt-2">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}