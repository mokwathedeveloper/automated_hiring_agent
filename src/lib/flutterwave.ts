// import Flutterwave from 'flutterwave-node-v3'; // Disabled for hackathon demo

export const flutterwaveConfig = {
  publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY || '',
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY || '',
  encryptionKey: process.env.FLUTTERWAVE_ENCRYPTION_KEY || '',
};

// Initialize Flutterwave instance (disabled for demo)
// const flw = new Flutterwave(flutterwaveConfig.publicKey, flutterwaveConfig.secretKey);

// Currency configuration for multi-country support
export const SUPPORTED_CURRENCIES = {
  NG: {
    code: 'NGN',
    symbol: '₦',
    country: 'Nigeria',
    exchangeRate: 1, // Base currency
  },
  KE: {
    code: 'KES',
    symbol: 'KSh',
    country: 'Kenya',
    exchangeRate: 0.25, // Approximate: 1 NGN = 0.25 KES
  },
} as const;

export type SupportedCountry = keyof typeof SUPPORTED_CURRENCIES;

// Convert NGN prices to local currency
export const convertPrice = (ngnPrice: number, targetCountry: SupportedCountry): number => {
  const currency = SUPPORTED_CURRENCIES[targetCountry];
  return Math.round(ngnPrice * currency.exchangeRate);
};

// Get currency info based on user location or preference
export const getCurrencyInfo = (country: SupportedCountry = 'NG') => {
  return SUPPORTED_CURRENCIES[country];
};

// Payment initialization payload
export interface FlutterwavePaymentPayload {
  tx_ref: string;
  amount: number;
  currency: string;
  redirect_url: string;
  customer: {
    email: string;
    phonenumber?: string;
    name?: string;
  };
  customizations: {
    title: string;
    description: string;
    logo?: string;
  };
  meta?: {
    [key: string]: any;
  };
}

// Initialize payment (demo implementation)
export const initializePayment = async (payload: FlutterwavePaymentPayload) => {
  try {
    console.log('Demo: Initializing payment:', {
      ...payload,
      customer: { ...payload.customer, email: payload.customer.email.substring(0, 5) + '...' }
    });

    // Demo implementation - return mock success
    return {
      success: true,
      data: {
        id: 'demo_' + Date.now(),
        tx_ref: payload.tx_ref,
        amount: payload.amount,
        currency: payload.currency
      },
      paymentLink: `https://demo-payment-link.com/${payload.tx_ref}`
    };
  } catch (error: any) {
    console.error('Demo payment initialization error:', error);
    throw new Error(error.message || 'Payment initialization failed');
  }
};

// Verify payment (demo implementation)
export const verifyPayment = async (transactionId: string) => {
  try {
    if (!transactionId) {
      throw new Error('Transaction ID is required');
    }

    console.log(`Demo: Verifying payment with transaction ID: ${transactionId}`);

    // Demo implementation - return mock success
    return {
      success: true,
      data: {
        id: transactionId,
        tx_ref: transactionId,
        amount: 1250,
        currency: 'KES',
        status: 'successful',
        customer: { email: 'demo@example.com' },
        created_at: new Date().toISOString(),
      }
    };
  } catch (error: any) {
    console.error('Demo payment verification error:', error);
    throw new Error(error.message || 'Payment verification failed');
  }
};

// Validate Flutterwave configuration
export const validateFlutterwaveConfig = () => {
  const errors = [];

  if (!flutterwaveConfig.publicKey) {
    errors.push('FLUTTERWAVE_PUBLIC_KEY is not configured');
  } else if (!flutterwaveConfig.publicKey.startsWith('FLWPUBK_')) {
    errors.push('Invalid Flutterwave public key format (should start with FLWPUBK_)');
  }

  if (!flutterwaveConfig.secretKey) {
    errors.push('FLUTTERWAVE_SECRET_KEY is not configured');
  } else if (!flutterwaveConfig.secretKey.startsWith('FLWSECK_')) {
    errors.push('Invalid Flutterwave secret key format (should start with FLWSECK_)');
  }

  if (!flutterwaveConfig.encryptionKey) {
    errors.push('FLUTTERWAVE_ENCRYPTION_KEY is not configured');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generate unique transaction reference
export const generateTxRef = (prefix: string = 'hiring_agent'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}_${timestamp}_${random}`;
};

// Get payment redirect URL based on environment
export const getRedirectUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
  return `${baseUrl}/payment/callback`;
};
