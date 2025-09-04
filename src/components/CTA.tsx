import Link from 'next/link';

export default function CTA() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 py-20 sm:py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-8">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          Join 500+ Nigerian Companies
        </div>
        
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Ready to Transform Your 
          <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Hiring Process?</span>
        </h2>
        
        <p className="text-xl sm:text-2xl text-indigo-100 mb-12 max-w-4xl mx-auto leading-relaxed">
          Join Nigerian companies already using AI to find the best candidates faster, more efficiently, and with greater accuracy than ever before.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Link href="/auth" className="group inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 hover:bg-gray-50 font-bold text-lg rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
            <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start Free Trial
            <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">No Credit Card</span>
          </Link>
          
          <Link href="/pricing" className="group inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-bold text-lg rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
            <svg className="w-5 h-5 mr-2 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Pricing
          </Link>
        </div>
        
        {/* Trust indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto text-indigo-100">
          <div className="flex items-center justify-center">
            <svg className="w-6 h-6 mr-3 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">5-Minute Setup</span>
          </div>
          <div className="flex items-center justify-center">
            <svg className="w-6 h-6 mr-3 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="font-medium">Bank-Level Security</span>
          </div>
          <div className="flex items-center justify-center">
            <svg className="w-6 h-6 mr-3 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
            </svg>
            <span className="font-medium">24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}