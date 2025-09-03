// src/components/PricingDisplay.tsx

'use client';

interface PricingTier {
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  features: string[];
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Starter',
    price: 1500,
    currency: 'NGN',
    period: 'month',
    description: 'Perfect for small businesses',
    features: ['5 resume analyses', 'Basic AI insights', 'Email support']
  },
  {
    name: 'Professional',
    price: 5000,
    currency: 'NGN', 
    period: 'month',
    description: 'Best for growing companies',
    features: ['50 resume analyses', 'Advanced AI insights', 'Priority support', 'WhatsApp integration']
  },
  {
    name: 'Enterprise',
    price: 15000,
    currency: 'NGN',
    period: 'month', 
    description: 'For large organizations',
    features: ['Unlimited analyses', 'Premium insights', '24/7 support', 'Custom integrations']
  }
];

export default function PricingDisplay() {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your hiring needs. All plans include our AI-powered resume analysis.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PRICING_TIERS.map((tier, index) => (
            <div
              key={tier.name}
              className={`rounded-lg border-2 p-8 ${
                index === 1 
                  ? 'border-indigo-500 bg-indigo-50 scale-105' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {tier.name}
                </h3>
                <p className="text-gray-600 mb-6">{tier.description}</p>
                
                <div className="mb-8">
                  <span className="text-4xl font-bold text-gray-900">
                    ₦{tier.price.toLocaleString()}
                  </span>
                  <span className="text-gray-600">/{tier.period}</span>
                </div>

                <ul className="text-left space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 px-4 rounded-lg font-medium ${
                  index === 1
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}>
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-6 text-sm text-gray-500">
            <span className="flex items-center">
              <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              7-day free trial
            </span>
            <span className="flex items-center">
              <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Cancel anytime
            </span>
            <span className="flex items-center">
              <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Secure payments
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}