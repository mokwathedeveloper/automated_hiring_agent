import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ResumeUploader from '@/components/ResumeUploader'

// Mock fetch
global.fetch = jest.fn()

describe('ResumeUploader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders upload interface correctly', () => {
    render(<ResumeUploader />)
    
    expect(screen.getByText('Upload Resume')).toBeInTheDocument()
    expect(screen.getByText('Drag & Drop Resume Here')).toBeInTheDocument()
    expect(screen.getByText('or click to browse files • PDF, DOC, DOCX supported')).toBeInTheDocument()
    expect(screen.getByText('Choose File')).toBeInTheDocument()
  })

  it('handles file selection', () => {
    render(<ResumeUploader />)
    
    const fileInput = screen.getByLabelText('Choose File')
    const file = new File(['test content'], 'test-resume.pdf', { type: 'application/pdf' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    expect(screen.getByText('test-resume.pdf')).toBeInTheDocument()
    expect(screen.getByText('Analyze Resume')).toBeInTheDocument()
  })

  it('handles drag and drop', () => {
    render(<ResumeUploader />)
    
    const dropZone = screen.getByText('Drag & Drop Resume Here').closest('div')
    const file = new File(['test content'], 'dropped-resume.pdf', { type: 'application/pdf' })
    
    fireEvent.dragOver(dropZone!)
    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [file]
      }
    })
    
    expect(screen.getByText('dropped-resume.pdf')).toBeInTheDocument()
  })

  it('shows loading state during upload', async () => {
    const mockFetch = jest.mocked(fetch)
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(<ResumeUploader />)
    
    const fileInput = screen.getByLabelText('Choose File')
    const file = new File(['test content'], 'test-resume.pdf', { type: 'application/pdf' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    fireEvent.click(screen.getByText('Analyze Resume'))
    
    expect(screen.getByText('Parsing Resume...')).toBeInTheDocument()
  })

  it('handles successful upload', async () => {
    const mockFetch = jest.mocked(fetch)
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          skills: ['JavaScript', 'React'],
          experience: [],
          education: [],
          summary: 'Experienced developer'
        }
      })
    } as Response)

    render(<ResumeUploader />)
    
    const fileInput = screen.getByLabelText('Choose File')
    const file = new File(['test content'], 'test-resume.pdf', { type: 'application/pdf' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    fireEvent.click(screen.getByText('Analyze Resume'))
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  it('handles upload error', async () => {
    const mockFetch = jest.mocked(fetch)
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: false,
        error: 'Failed to parse resume'
      })
    } as Response)

    render(<ResumeUploader />)
    
    const fileInput = screen.getByLabelText('Choose File')
    const file = new File(['test content'], 'test-resume.pdf', { type: 'application/pdf' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    fireEvent.click(screen.getByText('Analyze Resume'))
    
    await waitFor(() => {
      expect(screen.getByText('Failed to parse resume')).toBeInTheDocument()
    })
  })

  it('handles network error', async () => {
    const mockFetch = jest.mocked(fetch)
    mockFetch.mockRejectedValue(new Error('Network error'))

    render(<ResumeUploader />)
    
    const fileInput = screen.getByLabelText('Choose File')
    const file = new File(['test content'], 'test-resume.pdf', { type: 'application/pdf' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    fireEvent.click(screen.getByText('Analyze Resume'))
    
    await waitFor(() => {
      expect(screen.getByText('Network error. Please try again.')).toBeInTheDocument()
    })
  })

  it('shows drag over state', () => {
    render(<ResumeUploader />)
    
    const dropZone = screen.getByText('Drag & Drop Resume Here').closest('div')
    
    fireEvent.dragOver(dropZone!)
    
    expect(dropZone).toHaveClass('border-primary-500')
  })

  it('removes drag over state on drag leave', () => {
    render(<ResumeUploader />)
    
    const dropZone = screen.getByText('Drag & Drop Resume Here').closest('div')
    
    fireEvent.dragOver(dropZone!)
    fireEvent.dragLeave(dropZone!)
    
    expect(dropZone).not.toHaveClass('border-primary-500')
  })
})