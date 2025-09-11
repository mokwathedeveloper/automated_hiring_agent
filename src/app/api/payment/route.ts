import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextauth';
import { verifyPayment, validatePaystackConfig } from '@/lib/paystack';

export async function POST(request: NextRequest) {
  try {
    // Validate Paystack configuration first
    const configValidation = validatePaystackConfig();
    if (!configValidation.isValid) {
      console.error('Paystack configuration errors:', configValidation.errors);
      return NextResponse.json({
        success: false,
        error: 'Payment system configuration error. Please contact support.'
      }, { status: 500 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
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

    const { reference } = requestBody;

    if (!reference || typeof reference !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Valid payment reference is required'
      }, { status: 400 });
    }

    console.log(`Processing payment verification for user ${session.user?.email}, reference: ${reference}`);

    const paymentData = await verifyPayment(reference);

    // Enhanced validation of payment response
    if (paymentData && paymentData.status === true && paymentData.data) {
      const transactionData = paymentData.data;

      if (transactionData.status === 'success') {
        // In production, update user's premium status in database
        console.log(`Payment verified successfully for user ${session.user?.email}:`, {
          reference: reference,
          amount: transactionData.amount,
          currency: transactionData.currency,
          customer: transactionData.customer?.email
        });

        return NextResponse.json({
          success: true,
          message: 'Payment verified successfully',
          data: {
            reference: transactionData.reference,
            amount: transactionData.amount,
            currency: transactionData.currency,
            status: transactionData.status
          }
        });
      } else {
        console.warn(`Payment verification failed - transaction status: ${transactionData.status}`);
        return NextResponse.json({
          success: false,
          error: `Payment failed: ${transactionData.gateway_response || 'Transaction was not successful'}`
        }, { status: 400 });
      }
    } else {
      console.warn('Invalid payment verification response:', paymentData);
      return NextResponse.json({
        success: false,
        error: 'Invalid payment verification response from Paystack'
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Payment verification error:', error);

    // Provide specific error messages based on error type
    let errorMessage = 'Payment verification failed';
    let statusCode = 500;

    if (error.message) {
      if (error.message.includes('Invalid Paystack secret key')) {
        errorMessage = 'Payment system configuration error';
        statusCode = 500;
      } else if (error.message.includes('Payment transaction not found')) {
        errorMessage = 'Payment transaction not found';
        statusCode = 404;
      } else if (error.message.includes('Network')) {
        errorMessage = 'Network error during payment verification';
        statusCode = 503;
      } else {
        errorMessage = 'Payment verification failed: ' + error.message;
      }
    }

    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: statusCode });
  }
}