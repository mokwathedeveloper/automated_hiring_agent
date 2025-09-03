// src/lib/paystack.ts

export const PAYSTACK_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || process.env.PAYSTACK_PUBLIC_KEY || '',
  secretKey: process.env.PAYSTACK_SECRET_KEY || '',
} as const;

export interface PaystackPaymentData {
  email: string;
  amount: number;
  currency: string;
  reference: string;
  plan?: string;
  metadata?: Record<string, any>;
}

export interface PaystackResponse {
  status: boolean;
  message: string;
  data?: any;
}

// Initialize Paystack payment
export function initializePaystackPayment(paymentData: PaystackPaymentData) {
  return new Promise<PaystackResponse>((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Paystack can only be initialized in browser'));
      return;
    }

    // Load Paystack script if not already loaded
    if (!window.PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => initPayment();
      document.head.appendChild(script);
    } else {
      initPayment();
    }

    function initPayment() {
      const handler = window.PaystackPop.setup({
        key: PAYSTACK_CONFIG.publicKey,
        email: paymentData.email,
        amount: paymentData.amount * 100, // Convert to kobo
        currency: paymentData.currency,
        ref: paymentData.reference,
        metadata: paymentData.metadata,
        callback: function(response: any) {
          resolve({
            status: true,
            message: 'Payment successful',
            data: response
          });
        },
        onClose: function() {
          reject({
            status: false,
            message: 'Payment cancelled by user'
          });
        }
      });
      
      handler.openIframe();
    }
  });
}

// Generate payment reference
export function generatePaymentReference(prefix: string = 'AHA'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`.toUpperCase();
}

// Verify payment on server
export async function verifyPaystackPayment(reference: string): Promise<PaystackResponse> {
  try {
    const response = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reference }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : 'Verification failed'
    };
  }
}

// Declare global PaystackPop
declare global {
  interface Window {
    PaystackPop: any;
  }
}