import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import ResumeUploader from '@/components/ResumeUploader';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('Resume Processing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders resume uploader', () => {
    act(() => {
      render(<ResumeUploader />);
    });
    
    expect(screen.getByText(/drag.*drop.*resume/i)).toBeInTheDocument();
    expect(screen.getByText(/choose file/i)).toBeInTheDocument();
  });

  test('handles file upload', async () => {
    const mockResponse = {
      success: true,
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+234 123 456 7890',
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: [{
          title: 'Software Developer',
          company: 'Tech Corp',
          duration: '2020-2023',
          description: 'Built web applications'
        }],
        education: [{
          degree: 'Computer Science',
          institution: 'University of Lagos',
          year: '2020'
        }],
        summary: 'Experienced developer'
      }
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    act(() => {
      render(<ResumeUploader />);
    });
    
    const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/choose file/i);
    
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /analyze resume/i }));
    });
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/parse', expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      }));
    });
  });

  test('validates file type', async () => {
    act(() => {
      render(<ResumeUploader />);
    });
    
    const invalidFile = new File(['content'], 'resume.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/choose file/i);
    
    await act(async () => {
      fireEvent.change(input, { target: { files: [invalidFile] } });
    });
    
    await waitFor(() => {
      expect(screen.getByText(/please upload a pdf or docx file/i)).toBeInTheDocument();
    });
  });

  test('validates file size', async () => {
    act(() => {
      render(<ResumeUploader />);
    });
    
    // Create a file larger than 5MB
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.pdf', { 
      type: 'application/pdf' 
    });
    const input = screen.getByLabelText(/choose file/i);
    
    await act(async () => {
      fireEvent.change(input, { target: { files: [largeFile] } });
    });
    
    await waitFor(() => {
      expect(screen.getByText(/file size must be less than 5mb/i)).toBeInTheDocument();
    });
  });

  test('handles Nigerian resume format', async () => {
    const nigerianResume = {
      success: true,
      data: {
        name: 'Adebayo Ogundimu',
        email: 'adebayo@gmail.com',
        phone: '+234 803 123 4567',
        skills: ['Python', 'Django', 'PostgreSQL'],
        experience: [{
          title: 'Backend Developer',
          company: 'Flutterwave',
          duration: '2021-Present',
          description: 'Payment processing systems'
        }],
        education: [{
          degree: 'Computer Engineering',
          institution: 'University of Ibadan',
          year: '2021'
        }],
        summary: 'Nigerian fintech developer'
      }
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => nigerianResume,
    } as Response);

    act(() => {
      render(<ResumeUploader />);
    });
    
    const file = new File(['Nigerian resume'], 'adebayo_cv.pdf', { 
      type: 'application/pdf' 
    });
    const input = screen.getByLabelText(/choose file/i);
    
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /analyze resume/i }));
    });
    
    await waitFor(() => {
      expect(screen.getByText('Adebayo Ogundimu')).toBeInTheDocument();
      expect(screen.getByText('Flutterwave')).toBeInTheDocument();
      expect(screen.getByText('University of Ibadan')).toBeInTheDocument();
    });
  });
});