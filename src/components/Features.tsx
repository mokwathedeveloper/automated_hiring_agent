import FeatureCard from './FeatureCard';
import { Button } from '@/components/ui/button';
import { Brain, MapPin, MessageCircle, CreditCard, BarChart, ShieldCheck, Sparkles } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: (
        <Brain className="w-8 h-8 text-indigo-600" />
      ),
      title: "AI-Powered Analysis",
      description: "Advanced OpenAI integration with HR-focused prompting for accurate candidate evaluation and intelligent scoring.",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: (
        <MapPin className="w-8 h-8 text-green-600" />
      ),
      title: "Nigerian Market Focus",
      description: "Specialized for local companies, universities, and resume formats with deep understanding of the Nigerian job market.",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: (
        <MessageCircle className="w-8 h-8 text-purple-600" />
      ),
      title: "WhatsApp Integration",
      description: "Direct candidate communication and resume upload via WhatsApp Business API for seamless recruitment workflow.",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: (
        <CreditCard className="w-8 h-8 text-yellow-600" />
      ),
      title: "Paystack Payments",
      description: "Seamless Nigerian payment processing with Paystack integration for subscriptions and secure transactions.",
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      icon: (
        <BarChart className="w-8 h-8 text-teal-600" />
      ),
      title: "Analytics Dashboard",
      description: "Comprehensive analytics with performance metrics, candidate insights, and detailed reporting capabilities.",
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      icon: (
        <ShieldCheck className="w-8 h-8 text-red-600" />
      ),
      title: "Enterprise Security",
      description: "Row-level security, rate limiting, data encryption, and comprehensive protection for sensitive HR data.",
      gradient: "from-red-500 to-rose-600"
    }
  ];

  return (
    <section className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Platform Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need for 
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Smart Hiring</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive AI-powered recruitment tools designed specifically for the Nigerian market with enterprise-grade security and performance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-6">
            Ready to experience the future of recruitment?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a href="/auth" className="inline-flex items-center justify-center text-base font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md" style={{ backgroundColor: '#4f46e5', color: 'white' }}>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Free Trial
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="/pricing" className="inline-flex items-center justify-center text-base font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md" style={{ borderColor: '#d1d5db', color: '#4b5563', backgroundColor: 'white' }}>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Learn More
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}