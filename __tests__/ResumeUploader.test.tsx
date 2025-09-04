import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResumeUploader from '@/components/ResumeUploader';

// Mock fetch
global.fetch = jest.fn();

describe('ResumeUploader', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders upload interface', () => {
    render(<ResumeUploader />);
    
    expect(screen.getByText('Upload Resume')).toBeInTheDocument();
    expect(screen.getByText('Drag & Drop Resume Here')).toBeInTheDocument();
    expect(screen.getByText('Choose File')).toBeInTheDocument();
  });

  it('handles file selection', () => {
    render(<ResumeUploader />);
    
    const file = new File(['test'], 'resume.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText('Choose File') as HTMLInputElement;
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(screen.getByText('resume.pdf')).toBeInTheDocument();
    expect(screen.getByText('Analyze Resume')).toBeInTheDocument();
  });

  it('shows loading state during upload', async () => {
    (fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        json: () => Promise.resolve({ success: true, data: {} })
      }), 100))
    );

    render(<ResumeUploader />);
    
    const file = new File(['test'], 'resume.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText('Choose File') as HTMLInputElement;
    
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByText('Analyze Resume'));
    
    expect(screen.getByText('Parsing Resume...')).toBeInTheDocument();
  });
});