'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const plans = [
  {
    name: 'Free',
    price: 0,
    currency: '₦',
    period: 'forever',
    features: ['5 resume analyses', 'Basic scoring', 'Email support'],
    popular: false,
  },
  {
    name: 'Pro',
    price: 5000,
    currency: '₦',
    period: 'month',
    features: ['50 resume analyses', 'Advanced AI insights', 'WhatsApp support', 'Priority processing'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 15000,
    currency: '₦',
    period: 'month',
    features: ['Unlimited analyses', 'Custom AI prompts', 'API access', 'Dedicated support', 'Team management'],
    popular: false,
  },
];

export default function SubscriptionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planName: string, amount: number) => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if (amount === 0) {
      alert('You are already on the Free plan!');
      return;
    }

    setLoading(planName);

    try {
      // Initialize Paystack payment
      const handler = (window as any).PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: amount * 100, // Paystack expects amount in kobo
        currency: 'NGN',
        ref: `sub_${Date.now()}_${user.id}`,
        metadata: {
          plan: planName,
          user_id: user.id,
        },
        callback: async (response: any) => {
          // Verify payment
          const verifyResponse = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reference: response.reference }),
          });

          if (verifyResponse.ok) {
            alert(`🎉 Welcome to ${planName} plan! Your subscription is now active.`);
            router.push('/dashboard');
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        onClose: () => {
          setLoading(null);
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment initialization failed. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock the full potential of AI-powered resume analysis. 
            Pricing optimized for the Nigerian market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.currency}{plan.price.toLocaleString()}
                  </span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.name, plan.price)}
                  disabled={loading === plan.name}
                  className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === plan.name ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : plan.price === 0 ? (
                    'Current Plan'
                  ) : (
                    `Subscribe to ${plan.name}`
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            🇳🇬 Payments processed securely by Paystack • Nigerian banking supported
          </p>
          <p className="text-sm text-gray-500">
            All plans include access to our Nigerian job market optimization features
          </p>
        </div>
      </div>

      {/* Paystack Script */}
      <script src="https://js.paystack.co/v1/inline.js"></script>
    </div>
  );
}