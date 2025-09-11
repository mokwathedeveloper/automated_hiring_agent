export const paystackConfig = {
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  secretKey: process.env.PAYSTACK_SECRET_KEY || '',
};

export const verifyPayment = async (reference: string) => {
  try {
    // Validate inputs
    if (!reference) {
      throw new Error('Payment reference is required');
    }

    if (!paystackConfig.secretKey) {
      throw new Error('Paystack secret key is not configured');
    }

    console.log(`Verifying payment with reference: ${reference}`);

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackConfig.secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Paystack API error (${response.status}):`, errorText);

      if (response.status === 401) {
        throw new Error('Invalid Paystack secret key');
      } else if (response.status === 404) {
        throw new Error('Payment transaction not found');
      } else {
        throw new Error(`Paystack API error: ${response.status} - ${errorText}`);
      }
    }

    const data = await response.json();
    console.log('Paystack verification response:', data);

    // Validate response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response from Paystack API');
    }

    return data;
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};

// Helper function to validate Paystack configuration
export const validatePaystackConfig = () => {
  const errors = [];

  if (!paystackConfig.publicKey) {
    errors.push('NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not configured');
  } else if (!paystackConfig.publicKey.startsWith('pk_')) {
    errors.push('Invalid Paystack public key format (should start with pk_)');
  }

  if (!paystackConfig.secretKey) {
    errors.push('PAYSTACK_SECRET_KEY is not configured');
  } else if (!paystackConfig.secretKey.startsWith('sk_')) {
    errors.push('Invalid Paystack secret key format (should start with sk_)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};