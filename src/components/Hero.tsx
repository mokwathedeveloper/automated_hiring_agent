'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered Hiring
            <span className="text-indigo-600"> Made Simple</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto mb-8">
            Transform your recruitment process with intelligent resume analysis designed for the Nigerian job market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth" className="btn-primary text-lg px-8 py-3">
              Get Started Free
            </Link>
            <Link href="/pricing" className="btn-secondary text-lg px-8 py-3">
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}