'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, Brain, Lock, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: 0,
    currency: '₦',
    period: 'forever',
    description: 'Perfect for trying out our AI-powered analysis',
    features: ['5 resume analyses per month', 'Basic AI scoring', 'Email support', 'Nigerian market insights'],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: 5000,
    currency: '₦',
    period: 'month',
    description: 'Ideal for HR professionals and small teams',
    features: ['50 resume analyses per month', 'Advanced AI insights', 'WhatsApp integration', 'Priority support', 'Detailed analytics'],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 15000,
    currency: '₦',
    period: 'month',
    description: 'For large organizations with high-volume needs',
    features: ['Unlimited analyses', 'Custom AI prompts', 'API access', 'Dedicated support', 'Team management', 'White-label options'],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Choose the perfect plan for your hiring needs. Pricing optimized for the Nigerian market with local payment methods.
          </p>
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            🇳🇬 Nigerian Naira (₦) • Paystack Secure Payments
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
                plan.popular ? 'border-indigo-500 scale-105' : 'border-gray-200'
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
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.currency}{plan.price.toLocaleString()}
                  </span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button asChild
                  className={`block w-full font-medium text-center transition-all duration-200 ${
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <Link href="/auth">
                    {plan.cta}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-indigo-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Analysis</h4>
              <p className="text-gray-600">Advanced OpenAI integration optimized for Nigerian job market requirements</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Secure & Reliable</h4>
              <p className="text-gray-600">Bank-level security with Paystack integration and data protection</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h4>
              <p className="text-gray-600">Instant resume analysis with real-time results and insights</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            🇳🇬 Proudly serving Nigerian businesses • Local payment methods supported
          </p>
          <p className="text-sm text-gray-500">
            All plans include Nigerian university recognition, local company database, and Naira pricing
          </p>
        </div>
      </div>
    </div>
  );
}