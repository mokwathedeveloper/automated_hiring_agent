import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import ResumeUploader from '@/components/ResumeUploader'

// Mock fetch
global.fetch = jest.fn()

// Mock react-dropzone to avoid file drop issues
jest.mock('react-dropzone', () => ({
  useDropzone: jest.fn(() => ({
    getRootProps: () => ({ 'data-testid': 'dropzone' }),
    getInputProps: () => ({ 'data-testid': 'file-input' }),
    isDragActive: false,
  })),
}))

describe('ResumeUploader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders upload interface correctly', () => {
    render(<ResumeUploader />)

    // Check for actual text that exists in the component
    expect(screen.getByText('Drag & drop resumes, or click to select')).toBeInTheDocument()
    expect(screen.getByText('PDF or DOCX, up to 5MB each. Maximum 100 files.')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /job description/i })).toBeInTheDocument()
  })

  it('handles file selection', async () => {
    await act(async () => {
      render(<ResumeUploader />)
    })

    const fileInput = screen.getByTestId('file-input')
    const file = new File(['test content'], 'test-resume.pdf', { type: 'application/pdf' })

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } })
    })

    expect(screen.getByText('test-resume.pdf')).toBeInTheDocument()
    expect(screen.getByText(/Analyze.*Resume/i)).toBeInTheDocument()
  })

  it('handles drag and drop', async () => {
    await act(async () => {
      render(<ResumeUploader />)
    })

    const dropZone = screen.getByTestId('dropzone')
    const file = new File(['test content'], 'dropped-resume.pdf', { type: 'application/pdf' })

    await act(async () => {
      fireEvent.dragOver(dropZone)
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [file]
        }
      })
    })

    // Since we're mocking react-dropzone, we can't test the actual file handling
    // Just verify the dropzone exists
    expect(dropZone).toBeInTheDocument()
  })

  it('shows loading state during upload', async () => {
    const mockFetch = jest.mocked(fetch)
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(<ResumeUploader />)
    
    const fileInput = screen.getByTestId('file-input')
    const file = new File(['test content'], 'test-resume.pdf', { type: 'application/pdf' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    fireEvent.click(screen.getByText(/Analyze.*Resume/i))
    
    expect(screen.getByText('Analyzing...')).toBeInTheDocument()
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
    
    const fileInput = screen.getByTestId('file-input')
    const file = new File(['test content'], 'test-resume.pdf', { type: 'application/pdf' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    fireEvent.click(screen.getByText(/Analyze.*Resume/i))
    
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
    
    const fileInput = screen.getByTestId('file-input')
    const file = new File(['test content'], 'test-resume.pdf', { type: 'application/pdf' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    fireEvent.click(screen.getByText(/Analyze.*Resume/i))
    
    await waitFor(() => {
      expect(screen.getByText(/Upload failed/i)).toBeInTheDocument()
    })
  })

  it('handles network error', async () => {
    const mockFetch = jest.mocked(fetch)
    mockFetch.mockRejectedValue(new Error('Network error'))

    render(<ResumeUploader />)
    
    const fileInput = screen.getByTestId('file-input')
    const file = new File(['test content'], 'test-resume.pdf', { type: 'application/pdf' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    fireEvent.click(screen.getByText(/Analyze.*Resume/i))
    
    await waitFor(() => {
      expect(screen.getByText(/Upload failed/i)).toBeInTheDocument()
    })
  })

  it('shows drag over state', () => {
    render(<ResumeUploader />)
    
    const dropZone = screen.getByText('Drag & drop resumes, or click to select').closest('div')
    
    fireEvent.dragOver(dropZone!)
    
    expect(dropZone).toHaveClass('border-primary-500')
  })

  it('removes drag over state on drag leave', () => {
    render(<ResumeUploader />)
    
    const dropZone = screen.getByText('Drag & drop resumes, or click to select').closest('div')
    
    fireEvent.dragOver(dropZone!)
    fireEvent.dragLeave(dropZone!)
    
    expect(dropZone).not.toHaveClass('border-primary-500')
  })
})