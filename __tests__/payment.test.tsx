import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import Pricing from '@/components/Pricing';

// Mock next-auth
jest.mock('next-auth/react');
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

// Mock Paystack
declare global {
  interface Window {
    PaystackPop: {
      setup: jest.Mock;
    };
  }
}

describe('Payment Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Paystack
    window.PaystackPop = {
      setup: jest.fn(() => ({
        openIframe: jest.fn()
      }))
    };
  });

  test('renders pricing plans', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    });

    render(<Pricing />);
    
    expect(screen.getByText('Free Plan')).toBeInTheDocument();
    expect(screen.getByText('Pro Plan')).toBeInTheDocument();
    expect(screen.getByText('₦0')).toBeInTheDocument();
    expect(screen.getByText('₦5,000')).toBeInTheDocument();
  });

  test('requires login for payment', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    });

    // Mock alert
    window.alert = jest.fn();

    render(<Pricing />);
    
    const upgradeButton = screen.getByText('Upgrade to Pro');
    fireEvent.click(upgradeButton);
    
    expect(window.alert).toHaveBeenCalledWith('Please login to upgrade');
  });

  test('initiates Paystack checkout for authenticated user', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          email: 'test@example.com',
          name: 'Test User'
        }
      },
      status: 'authenticated'
    });

    render(<Pricing />);
    
    const upgradeButton = screen.getByText('Upgrade to Pro');
    fireEvent.click(upgradeButton);
    
    expect(window.PaystackPop.setup).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'test@example.com',
        amount: 500000, // ₦5,000 in kobo
        currency: 'NGN'
      })
    );
  });

  test('handles payment verification', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          email: 'test@example.com',
          name: 'Test User'
        }
      },
      status: 'authenticated'
    });

    // Mock fetch for payment verification
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Payment verified' })
    });

    // Mock alert
    window.alert = jest.fn();

    render(<Pricing />);
    
    const upgradeButton = screen.getByText('Upgrade to Pro');
    fireEvent.click(upgradeButton);
    
    // Simulate Paystack callback
    const setupCall = (window.PaystackPop.setup as jest.Mock).mock.calls[0][0];
    await setupCall.callback({ reference: 'test_ref_123' });
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: 'test_ref_123' })
      });
      expect(window.alert).toHaveBeenCalledWith('✅ Payment successful! Premium features unlocked.');
    });
  });

  test('handles payment verification failure', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          email: 'test@example.com',
          name: 'Test User'
        }
      },
      status: 'authenticated'
    });

    // Mock fetch for failed verification
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, error: 'Payment failed' })
    });

    // Mock alert
    window.alert = jest.fn();

    render(<Pricing />);
    
    const upgradeButton = screen.getByText('Upgrade to Pro');
    fireEvent.click(upgradeButton);
    
    // Simulate Paystack callback
    const setupCall = (window.PaystackPop.setup as jest.Mock).mock.calls[0][0];
    await setupCall.callback({ reference: 'failed_ref_123' });
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('❌ Payment verification failed');
    });
  });
});