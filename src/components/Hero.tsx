'use client';

export default function Hero() {
  const scrollToUpload = () => {
    const uploadSection = document.getElementById('upload');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-24 sm:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 text-blue-200 text-sm font-medium border border-blue-500/20">
            🚀 Powered by Advanced AI Technology
          </span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          AI-Powered Hiring
          <span className="block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Made Simple
          </span>
        </h1>
        
        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
          Transform your recruitment process with intelligent resume analysis designed specifically for the 
          <span className="text-blue-300 font-semibold">Nigerian job market</span>.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={scrollToUpload}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1"
          >
            Get Started Free
          </button>
          <button className="border-2 border-slate-300 text-slate-300 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-slate-300 hover:text-slate-900 transition-all duration-200">
            Watch Demo
          </button>
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">10,000+</div>
            <div className="text-slate-400 font-medium">Resumes Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">95%</div>
            <div className="text-slate-400 font-medium">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">500+</div>
            <div className="text-slate-400 font-medium">Nigerian Companies</div>
          </div>
        </div>
      </div>
    </section>
  );
}