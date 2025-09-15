import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  verifyPayment,
  validateFlutterwaveConfig,
  initializePayment,
  generateTxRef,
  getRedirectUrl,
  getCurrencyInfo,
  type SupportedCountry
} from '@/lib/flutterwave';

// Initialize payment
export async function POST(request: NextRequest) {
  try {
    // Validate Flutterwave configuration first
    const configValidation = validateFlutterwaveConfig();
    if (!configValidation.isValid) {
      console.error('Flutterwave configuration errors:', configValidation.errors);
      return NextResponse.json({
        success: false,
        error: 'Payment system configuration error. Please contact support.'
      }, { status: 500 });
    }

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request format'
      }, { status: 400 });
    }

    const { amount, currency, planName, country } = requestBody;

    // Validate required fields
    if (!amount || !currency || !planName) {
      return NextResponse.json({
        success: false,
        error: 'Amount, currency, and plan name are required'
      }, { status: 400 });
    }

    // Get currency info
    const countryCode = (country || 'NG') as SupportedCountry;
    const currencyInfo = getCurrencyInfo(countryCode);

    console.log(`Initializing payment for user ${user.email}, plan: ${planName}, amount: ${currencyInfo.symbol}${amount}`);

    // Generate unique transaction reference
    const txRef = generateTxRef('hackathon_demo');

    // Initialize payment with Paystack (keeping existing integration for demo)
    const paymentPayload = {
      email: user.email,
      amount: amount * 100, // Convert to cents/kobo
      currency: currency,
      reference: txRef,
      callback_url: getRedirectUrl(),
      metadata: {
        plan_name: planName,
        user_id: user.id,
        demo_mode: true
      }
    };

    // For demo, return payment initialization data
    return NextResponse.json({
      success: true,
      message: 'Payment initialized successfully',
      data: {
        reference: txRef,
        amount: amount,
        currency: currency,
        email: user.email,
        demo_mode: true,
        paystack_config: {
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
          email: user.email,
          amount: amount * 100,
          currency: currency,
          ref: txRef
        }
      }
    });
  } catch (error: any) {
    console.error('Payment initialization error:', error);

    return NextResponse.json({
      success: false,
      error: 'Payment initialization failed: ' + (error.message || 'Unknown error')
    }, { status: 500 });
  }
}

// Verify payment
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json({
        success: false,
        error: 'Payment reference is required'
      }, { status: 400 });
    }

    console.log(`Verifying payment for user ${user.email}, reference: ${reference}`);

    // For demo, simulate successful verification
    // In production, this would call Paystack verification API
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully (Demo Mode)',
      data: {
        reference: reference,
        amount: 1250,
        currency: 'KES',
        status: 'success',
        demo_mode: true
      }
    });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Payment verification failed: ' + (error.message || 'Unknown error')
    }, { status: 500 });
  }
}