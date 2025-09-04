import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextauth';
import { verifyPayment } from '@/lib/paystack';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json({ success: false, error: 'Payment reference is required' }, { status: 400 });
    }

    const paymentData = await verifyPayment(reference);

    if (paymentData.status && paymentData.data.status === 'success') {
      // In production, update user's premium status in database
      console.log(`Payment verified for user ${session.user?.email}: ${reference}`);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Payment verified successfully',
        data: paymentData.data 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Payment verification failed' 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Payment verification failed' 
    }, { status: 500 });
  }
}