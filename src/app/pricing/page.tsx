// src/app/pricing/page.tsx

import PricingSection from '@/components/PricingSection';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Streamline your hiring process with AI-powered resume analysis
          </p>
        </div>
        <PricingSection />
      </div>
    </div>
  );
}