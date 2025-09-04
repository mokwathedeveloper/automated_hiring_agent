import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ParsedResume } from '@/types';

// Mock next-auth
jest.mock('next-auth/react');
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

const mockResumeData: ParsedResume = {
  name: 'Kemi Adebayo',
  email: 'kemi@example.com',
  phone: '+234 803 123 4567',
  skills: ['React', 'TypeScript', 'Node.js'],
  experience: [{
    title: 'Frontend Developer',
    company: 'Paystack',
    duration: '2022-Present',
    description: 'Building payment interfaces'
  }],
  education: [{
    degree: 'Computer Science',
    institution: 'University of Lagos',
    year: '2022'
  }],
  summary: 'Experienced frontend developer'
};

describe('WhatsApp Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  test('shows login prompt for unauthenticated users', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    });

    render(<WhatsAppButton resumeData={mockResumeData} />);
    
    expect(screen.getByText('Login to send resume via WhatsApp')).toBeInTheDocument();
  });

  test('shows WhatsApp button for authenticated users', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { email: 'test@example.com', name: 'Test User' }
      },
      status: 'authenticated'
    });

    render(<WhatsAppButton resumeData={mockResumeData} />);
    
    expect(screen.getByText('Send to WhatsApp')).toBeInTheDocument();
    expect(screen.getByText('Send Resume')).toBeInTheDocument();
  });

  test('opens phone input when send button clicked', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { email: 'test@example.com', name: 'Test User' }
      },
      status: 'authenticated'
    });

    render(<WhatsAppButton resumeData={mockResumeData} />);
    
    fireEvent.click(screen.getByText('Send Resume'));
    
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('+234 123 456 7890')).toBeInTheDocument();
  });

  test('validates phone number input', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { email: 'test@example.com', name: 'Test User' }
      },
      status: 'authenticated'
    });

    render(<WhatsAppButton resumeData={mockResumeData} />);
    
    fireEvent.click(screen.getByText('Send Resume'));
    fireEvent.click(screen.getByText('Send'));
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a phone number')).toBeInTheDocument();
    });
  });

  test('sends WhatsApp message successfully', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { email: 'test@example.com', name: 'Test User' }
      },
      status: 'authenticated'
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Message sent' })
    });

    render(<WhatsAppButton resumeData={mockResumeData} />);
    
    fireEvent.click(screen.getByText('Send Resume'));
    
    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.change(phoneInput, { target: { value: '+234 803 123 4567' } });
    
    fireEvent.click(screen.getByText('Send'));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: mockResumeData,
          phoneNumber: '+234 803 123 4567'
        })
      });
      expect(screen.getByText('✅ Resume sent to WhatsApp successfully!')).toBeInTheDocument();
    });
  });

  test('handles WhatsApp send failure', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { email: 'test@example.com', name: 'Test User' }
      },
      status: 'authenticated'
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, error: 'Failed to send' })
    });

    render(<WhatsAppButton resumeData={mockResumeData} />);
    
    fireEvent.click(screen.getByText('Send Resume'));
    
    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.change(phoneInput, { target: { value: '+234 803 123 4567' } });
    
    fireEvent.click(screen.getByText('Send'));
    
    await waitFor(() => {
      expect(screen.getByText('❌ Failed to send')).toBeInTheDocument();
    });
  });

  test('formats Nigerian phone numbers correctly', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { email: 'test@example.com', name: 'Test User' }
      },
      status: 'authenticated'
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    render(<WhatsAppButton resumeData={mockResumeData} />);
    
    fireEvent.click(screen.getByText('Send Resume'));
    
    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.change(phoneInput, { target: { value: '08031234567' } });
    
    fireEvent.click(screen.getByText('Send'));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/whatsapp', 
        expect.objectContaining({
          body: expect.stringContaining('+08031234567')
        })
      );
    });
  });
});