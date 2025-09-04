'use client';

export default function Hero() {
  const scrollToUpload = () => {
    const uploadSection = document.getElementById('upload');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          AI-Powered Hiring Made Simple
        </h1>
        <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-10">
          Transform your recruitment process with intelligent resume analysis designed specifically for the Nigerian job market.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={scrollToUpload}
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}