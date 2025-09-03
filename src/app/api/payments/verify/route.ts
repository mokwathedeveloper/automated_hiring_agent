// src/app/api/payments/verify/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PAYSTACK_CONFIG } from '@/lib/paystack';

export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json(
        { status: false, message: 'Payment reference is required' },
        { status: 400 }
      );
    }

    if (!PAYSTACK_CONFIG.secretKey) {
      return NextResponse.json(
        { status: false, message: 'Paystack configuration missing' },
        { status: 500 }
      );
    }

    // Verify payment with Paystack API
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${PAYSTACK_CONFIG.secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        status: false,
        message: data.message || 'Payment verification failed'
      }, { status: response.status });
    }

    if (data.status && data.data.status === 'success') {
      // Payment successful
      console.log('Payment verified:', {
        reference: data.data.reference,
        amount: data.data.amount / 100, // Convert from kobo
        customer: data.data.customer.email,
        status: data.data.status
      });

      return NextResponse.json({
        status: true,
        message: 'Payment verified successfully',
        data: {
          reference: data.data.reference,
          amount: data.data.amount / 100,
          currency: data.data.currency,
          customer: data.data.customer,
          paidAt: data.data.paid_at,
          metadata: data.data.metadata
        }
      });
    } else {
      return NextResponse.json({
        status: false,
        message: 'Payment verification failed'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { 
        status: false, 
        message: 'Internal server error during payment verification' 
      },
      { status: 500 }
    );
  }
}