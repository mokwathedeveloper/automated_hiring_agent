'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { FaCheck, FaCreditCard } from 'react-icons/fa';
import { formatCurrency } from '@/lib/ng-utils';
import dynamic from 'next/dynamic';

// Dynamically import PaystackButton to avoid SSR issues
const PaystackButton = dynamic(
  () => import('react-paystack').then((mod) => mod.PaystackButton),
  { ssr: false }
);

// PaystackButton from react-paystack handles all the popup logic

export default function Pricing() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);

  // Ensure component only renders PaystackButton on client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get the configured currency - only use NEXT_PUBLIC_ vars for client consistency
  const currency = process.env.NEXT_PUBLIC_PAYSTACK_CURRENCY || 'NGN';

  // Format prices based on currency
  const freePrice = formatCurrency(0, currency);
  const proPrice = formatCurrency(5000, currency);

  const handlePaymentVerification = async (reference: string) => {
    try {
      const verifyResponse = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference }),
      });

      const result = await verifyResponse.json();

      if (result.success) {
        alert('✅ Payment successful! Premium features unlocked.');
      } else {
        alert('❌ Payment verification failed: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      alert('❌ Payment verification error. Please contact support if this persists.');
    } finally {
      setIsLoading(false);
    }
  };

  // react-paystack handles error scenarios automatically

  // react-paystack handles all the complex error handling and iframe management

  // Paystack configuration following the working guide pattern
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';
  const amount = 5000 * 100; // Amount in kobo (₦50.00 = 5000 kobo)
  const email = user?.email || 'user@example.com';

  const paystackProps = {
    email,
    amount,
    publicKey,
    text: isLoading ? "Processing..." : "Upgrade to Pro",
    currency: currency,
    metadata: {
      custom_fields: [
        {
          display_name: "Service",
          variable_name: "service",
          value: "Premium Subscription"
        }
      ]
    },
    onSuccess: (response: any) => {
      console.log("Payment successful!", response);
      if (response && response.reference) {
        handlePaymentVerification(response.reference);
      } else {
        console.error('Invalid payment response:', response);
        alert('❌ Payment response is invalid. Please contact support.');
        setIsLoading(false);
      }
    },
    onClose: () => {
      console.log("Payment dialog closed");
      setIsLoading(false);
    },
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-500">
            Start free and upgrade when you need more features
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border-2 border-gray-200 dark:border-gray-700 transition-colors duration-500"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-500">Free Plan</h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-500">{freePrice}</div>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-500">Perfect for getting started</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300 transition-colors duration-500">5 resume analyses per month</span>
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300 transition-colors duration-500">Basic AI parsing</span>
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300 transition-colors duration-500">PDF & DOCX support</span>
              </li>
            </ul>

            <button
              disabled
              className="w-full bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 py-3 px-6 rounded-lg font-semibold cursor-not-allowed transition-colors duration-500"
            >
              Current Plan
            </button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border-2 border-blue-500 relative transition-colors duration-500"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-500">Pro Plan</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">{proPrice}</div>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-500">Per month</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300 transition-colors duration-500">Unlimited resume analyses</span>
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300 transition-colors duration-500">Advanced AI insights</span>
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300 transition-colors duration-500">WhatsApp integration</span>
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300 transition-colors duration-500">Priority support</span>
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300 transition-colors duration-500">Export to multiple formats</span>
              </li>
            </ul>

            {user ? (
              isClient ? (
                <PaystackButton
                  {...paystackProps}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                  onSuccess={(response) => {
                    console.log("Payment successful!", response);
                    if (response && response.reference) {
                      handlePaymentVerification(response.reference);
                    } else {
                      console.error('Invalid payment response:', response);
                      alert('❌ Payment response is invalid. Please contact support.');
                      setIsLoading(false);
                    }
                  }}
                  onClose={() => {
                    console.log("Payment dialog closed");
                    setIsLoading(false);
                  }}
                />
              ) : (
                <button
                  disabled
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold opacity-50 transition-colors flex items-center justify-center"
                >
                  <FaCreditCard className="mr-2" />
                  Loading Payment...
                </button>
              )
            ) : (
              <button
                onClick={() => alert('Please login to upgrade')}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <FaCreditCard className="mr-2" />
                Upgrade to Pro
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}