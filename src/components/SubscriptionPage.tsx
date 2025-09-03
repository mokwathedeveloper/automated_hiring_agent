// src/components/SubscriptionPage.tsx

'use client';

import { useState } from 'react';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  popular?: boolean;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 2500,
    currency: 'NGN',
    interval: 'month',
    features: [
      '10 resume analyses per month',
      'Basic AI insights',
      'Email support',
      'Standard processing speed'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 5000,
    currency: 'NGN',
    interval: 'month',
    popular: true,
    features: [
      '50 resume analyses per month',
      'Advanced AI insights',
      'Priority email support',
      'Fast processing speed',
      'WhatsApp integration',
      'Bulk analysis'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 10000,
    currency: 'NGN',
    interval: 'month',
    features: [
      'Unlimited resume analyses',
      'Premium AI insights',
      '24/7 phone support',
      'Fastest processing speed',
      'WhatsApp integration',
      'Bulk analysis',
      'Custom integrations',
      'Dedicated account manager'
    ]
  }
];

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('professional');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (planId: string) => {
    setIsLoading(true);
    try {
      // TODO: Integrate with Paystack
      console.log('Subscribing to plan:', planId);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your hiring needs. All plans include our AI-powered resume analysis.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-200 ${
                plan.popular
                  ? 'border-indigo-500 scale-105'
                  : selectedPlan === plan.id
                  ? 'border-indigo-300'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ₦{plan.price.toLocaleString()}
                  </span>
                  <span className="text-gray-600 ml-2">/{plan.interval}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? 'Processing...' : 'Subscribe Now'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            All plans include a 7-day free trial. Cancel anytime.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <span>✓ Secure payments with Paystack</span>
            <span>✓ No setup fees</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}