'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Check, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PricingSkeleton } from './LoadingSkeleton';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function Pricing() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handlePayment = () => {
    if (!user) {
      alert('Please login to upgrade');
      return;
    }

    setIsLoading(true);

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: 5000 * 100, // Amount in kobo (₦5,000)
      currency: 'NGN',
      ref: `ref_${Date.now()}`,
      callback: async function(response: any) {
        try {
          const verifyResponse = await fetch('/api/payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reference: response.reference }),
          });

          const result = await verifyResponse.json();
          
          if (result.success) {
            alert('✅ Payment successful! Premium features unlocked.');
          } else {
            alert('❌ Payment verification failed');
          }
        } catch (error) {
          alert('❌ Payment verification error');
        } finally {
          setIsLoading(false);
        }
      },
      onClose: function() {
        setIsLoading(false);
      },
    });

    handler.openIframe();
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade when you need more features
          </p>
        </div>

        {isLoading ? (
          <PricingSkeleton />
        ) : (
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">₦0</div>
              <p className="text-gray-600">Perfect for getting started</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="text-green-500 mr-3" />
                <span>5 resume analyses per month</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 mr-3" />
                <span>Basic AI parsing</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 mr-3" />
                <span>PDF & DOCX support</span>
              </li>
            </ul>

            <Button
              disabled
              className="w-full bg-gray-300 text-gray-500 font-semibold cursor-not-allowed"
            >
              Current Plan
            </Button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-500 relative"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro Plan</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">₦5,000</div>
              <p className="text-gray-600">Per month</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="text-green-500 mr-3" />
                <span>Unlimited resume analyses</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 mr-3" />
                <span>Advanced AI insights</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 mr-3" />
                <span>WhatsApp integration</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 mr-3" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 mr-3" />
                <span>Export to multiple formats</span>
              </li>
            </ul>

            <Button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
            >
              <CreditCard className="mr-2" />
              {isLoading ? 'Processing...' : 'Upgrade to Pro'}
            </Button>
          </motion.div>
        </div>
        )}
      </div>

      {/* Paystack Script */}
      <script src="https://js.paystack.co/v1/inline.js"></script>
    </section>
  );
}