import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useAuth } from '@/hooks/useAuth';
import Pricing from '@/components/Pricing';

// Mock useAuth hook
jest.mock('@/hooks/useAuth');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

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
      setup: jest.fn((options) => ({
        openIframe: jest.fn(() => {
          // Simulate immediate callback for testing
          if (options.callback) {
            options.callback({ reference: 'mock_ref' });
          }
        })
      }))
    };
  });

  test('renders pricing plans', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signOut: jest.fn(),
      isAuthenticated: false,
    });

    act(() => {
      render(<Pricing />);
    });
    
    expect(screen.getByText('Free Plan')).toBeInTheDocument();
    expect(screen.getByText('Pro Plan')).toBeInTheDocument();
    expect(screen.getByText('₦0')).toBeInTheDocument();
    expect(screen.getByText('₦5,000')).toBeInTheDocument();
  });

  test('requires login for payment', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signOut: jest.fn(),
      isAuthenticated: false,
    });

    // Mock alert
    window.alert = jest.fn();

    act(() => {
      render(<Pricing />);
    });
    
    const upgradeButton = screen.getByText('Upgrade to Pro');
    act(() => {
      fireEvent.click(upgradeButton);
    });
    
    expect(window.alert).toHaveBeenCalledWith('Please login to upgrade');
  });

  test('initiates Paystack checkout for authenticated user', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: '123', email: 'test@example.com' } as any,
      loading: false,
      signOut: jest.fn(),
      isAuthenticated: true,
    });

    act(() => {
      render(<Pricing />);
    });
    
    const upgradeButton = screen.getByText('Upgrade to Pro');
    await act(async () => {
      fireEvent.click(upgradeButton);
    });
    
    expect(window.PaystackPop.setup).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'test@example.com',
        amount: 500000, // ₦5,000 in kobo
        currency: 'NGN'
      })
    );
  });

  test('handles payment verification', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: '123', email: 'test@example.com' } as any,
      loading: false,
      signOut: jest.fn(),
      isAuthenticated: true,
    });

    // Mock fetch for payment verification
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Payment verified' })
    });

    // Mock alert
    window.alert = jest.fn();

    act(() => {
      render(<Pricing />);
    });
    
    const upgradeButton = screen.getByText('Upgrade to Pro');
    await act(async () => {
      fireEvent.click(upgradeButton);
    });
    
    // Simulate Paystack callback
    const setupCall = (window.PaystackPop.setup as jest.Mock).mock.calls[0][0];
    await act(async () => {
      await setupCall.callback({ reference: 'test_ref_123' });
    });
    
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
    mockUseAuth.mockReturnValue({
      user: { id: '123', email: 'test@example.com' } as any,
      loading: false,
      signOut: jest.fn(),
      isAuthenticated: true,
    });

    // Mock fetch for failed verification
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, error: 'Payment failed' })
    });

    // Mock alert
    window.alert = jest.fn();

    act(() => {
      render(<Pricing />);
    });
    
    const upgradeButton = screen.getByText('Upgrade to Pro');
    await act(async () => {
      fireEvent.click(upgradeButton);
    });
    
    // Simulate Paystack callback
    const setupCall = (window.PaystackPop.setup as jest.Mock).mock.calls[0][0];
    await act(async () => {
      await setupCall.callback({ reference: 'failed_ref_123' });
    });
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('❌ Payment verification failed');
    });
  });
});