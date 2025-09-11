'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { FaCheck, FaCreditCard } from 'react-icons/fa';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function Pricing() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

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

  // Enhanced Paystack error handler
  const handlePaystackError = (error: any) => {
    console.error('Paystack error details:', error);

    // Check for specific error types
    if (error.message && error.message.includes('Currency not supported')) {
      alert('❌ Payment Error: Currency not supported. We have switched to USD for better compatibility. Please try again.');
    } else if (error.message && error.message.includes('Invalid public key')) {
      alert('❌ Payment Error: Payment system configuration issue. Please contact support.');
    } else if (error.message && error.message.includes('Network')) {
      alert('❌ Network Error: Please check your internet connection and try again.');
    } else if (error.message && error.message.includes('400')) {
      alert('❌ Payment Error: Invalid payment configuration. This may be due to currency or merchant account settings. Please contact support.');
    } else {
      alert('❌ Payment setup failed: ' + (error.message || 'Unknown error. Please try again or contact support.'));
    }

    setIsLoading(false);
  };

  // Add global error listener for Paystack iframe errors
  const setupPaystackErrorListener = () => {
    const handlePaystackIframeError = (event: any) => {
      if (event.origin === 'https://api.paystack.co' || event.origin === 'https://checkout.paystack.com') {
        console.error('Paystack iframe error:', event.data);
        if (event.data && event.data.error) {
          handlePaystackError(new Error(event.data.error));
        }
      }
    };

    window.addEventListener('message', handlePaystackIframeError);

    // Cleanup function
    return () => {
      window.removeEventListener('message', handlePaystackIframeError);
    };
  };

  const handlePayment = () => {
    if (!user) {
      alert('Please login to upgrade');
      return;
    }

    // Check if Paystack is loaded
    if (typeof window === 'undefined' || !window.PaystackPop) {
      alert('Payment system is not available. Please refresh the page and try again.');
      return;
    }

    // Validate required data
    if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
      alert('Payment system is not configured. Please contact support.');
      return;
    }

    if (!user.email) {
      alert('User email is required for payment. Please ensure you are logged in.');
      return;
    }

    setIsLoading(true);

    // Setup error listener for Paystack iframe
    const cleanupErrorListener = setupPaystackErrorListener();

    try {
      // Use USD currency for better international compatibility
      const currency = 'USD';
      const amount = 50 * 100; // $50.00 in cents

      // Validate Paystack key format
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!publicKey.startsWith('pk_')) {
        throw new Error('Invalid Paystack public key format');
      }

      const paystackConfig = {
        key: publicKey,
        email: user.email,
        amount: amount,
        currency: currency,
        ref: `hiring_agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        metadata: {
          custom_fields: [
            {
              display_name: "Service",
              variable_name: "service",
              value: "Premium Subscription"
            }
          ]
        },
        callback: function(response: any) {
          // Ensure response has reference before proceeding
          if (response && response.reference) {
            console.log('Payment successful, verifying...', response.reference);
            handlePaymentVerification(response.reference);
          } else {
            console.error('Invalid payment response:', response);
            alert('❌ Payment response is invalid. Please contact support.');
            setIsLoading(false);
          }
        },
        onClose: function() {
          console.log('Payment popup closed by user');
          setIsLoading(false);
          cleanupErrorListener(); // Clean up error listener when popup closes
        },
      };

      console.log('Initializing Paystack with config:', {
        ...paystackConfig,
        key: publicKey.substring(0, 10) + '...' // Log partial key for debugging
      });

      const handler = window.PaystackPop.setup(paystackConfig);

      // Add error handling for iframe opening
      if (handler && typeof handler.openIframe === 'function') {
        handler.openIframe();
      } else {
        throw new Error('Paystack handler not properly initialized');
      }
    } catch (error) {
      console.error('Paystack setup error:', error);
      cleanupErrorListener(); // Clean up error listener on error
      handlePaystackError(error);
    }
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
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-500">$0</div>
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
              <div className="text-4xl font-bold text-blue-600 mb-2">$50</div>
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

            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
            >
              <FaCreditCard className="mr-2" />
              {isLoading ? 'Processing...' : 'Upgrade to Pro'}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}