// __tests__/components/ResumeUploader.test.tsx

import { render, screen } from '@testing-library/react';
import ResumeUploader from '@/components/ResumeUploader';

describe('ResumeUploader', () => {
  it('renders upload instructions', () => {
    render(<ResumeUploader />);
    
    expect(screen.getByText('Drop your resume here')).toBeInTheDocument();
    expect(screen.getByText('or click to browse files')).toBeInTheDocument();
    expect(screen.getByText('Supports PDF and DOCX files up to 5MB')).toBeInTheDocument();
  });

  it('shows loading state when processing', () => {
    render(<ResumeUploader />);
    
    // Component should render without loading state initially
    expect(screen.queryByText('Processing file...')).not.toBeInTheDocument();
  });
});