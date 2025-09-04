import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResumeDisplay from '@/components/ResumeDisplay';
import { ParsedResume } from '@/types';

const mockData: ParsedResume = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+234 123 456 7890',
  skills: ['React', 'TypeScript', 'Node.js'],
  experience: [
    {
      title: 'Software Engineer',
      company: 'Tech Corp',
      duration: '2020-2023',
      description: 'Developed web applications'
    }
  ],
  education: [
    {
      degree: 'B.Sc Computer Science',
      institution: 'University of Lagos',
      year: '2020'
    }
  ],
  summary: 'Experienced software engineer with expertise in web development'
};

describe('ResumeDisplay', () => {
  it('renders candidate information', () => {
    render(<ResumeDisplay data={mockData} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('+234 123 456 7890')).toBeInTheDocument();
  });

  it('renders skills as tags', () => {
    render(<ResumeDisplay data={mockData} />);
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('renders experience section', () => {
    render(<ResumeDisplay data={mockData} />);
    
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp • 2020-2023')).toBeInTheDocument();
    expect(screen.getByText('Developed web applications')).toBeInTheDocument();
  });

  it('renders education section', () => {
    render(<ResumeDisplay data={mockData} />);
    
    expect(screen.getByText('B.Sc Computer Science')).toBeInTheDocument();
    expect(screen.getByText('University of Lagos • 2020')).toBeInTheDocument();
  });
});