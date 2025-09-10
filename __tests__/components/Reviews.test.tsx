import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Reviews from '@/components/Reviews'

describe('Reviews', () => {
  it('renders initial state correctly', () => {
    render(<Reviews />)
    
    expect(screen.getByText('Client Reviews & Ratings')).toBeInTheDocument()
    expect(screen.getByText('Write a Review')).toBeInTheDocument()
    expect(screen.getByText('No Reviews Yet')).toBeInTheDocument()
    expect(screen.getByText('Be the first to share your experience!')).toBeInTheDocument()
  })

  it('shows review form when Write a Review is clicked', () => {
    render(<Reviews />)
    
    const writeReviewButton = screen.getByText('Write a Review')
    fireEvent.click(writeReviewButton)

    expect(screen.getByText('Your Name *')).toBeInTheDocument()
    expect(screen.getByText('Company *')).toBeInTheDocument()
    expect(screen.getByText('Job Title *')).toBeInTheDocument()
    expect(screen.getByText('Rating *')).toBeInTheDocument()
    expect(screen.getByText('Your Review *')).toBeInTheDocument()
    expect(screen.getByText('Submit Review')).toBeInTheDocument()
  })

  it('hides form when Cancel is clicked', () => {
    render(<Reviews />)
    
    const writeReviewButton = screen.getByText('Write a Review')
    fireEvent.click(writeReviewButton)
    
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(screen.queryByText('Your Name *')).not.toBeInTheDocument()
    expect(screen.getByText('Write a Review')).toBeInTheDocument()
  })

  it('submits review successfully', async () => {
    render(<Reviews />)
    
    // Open form
    fireEvent.click(screen.getByText('Write a Review'))

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
      target: { value: 'John Doe' }
    })
    fireEvent.change(screen.getByPlaceholderText('Your company name'), {
      target: { value: 'Tech Corp' }
    })
    fireEvent.change(screen.getByPlaceholderText('Your job title'), {
      target: { value: 'HR Manager' }
    })
    fireEvent.change(screen.getByPlaceholderText('Share your experience with our platform...'), {
      target: { value: 'Great platform!' }
    })

    // Submit form
    fireEvent.click(screen.getByText('Submit Review'))

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('HR Manager')).toBeInTheDocument()
      expect(screen.getByText('Tech Corp')).toBeInTheDocument()
      expect(screen.getByText('"Great platform!"')).toBeInTheDocument()
    })

    // Check that average rating is displayed
    expect(screen.getByText('5.0 out of 5')).toBeInTheDocument()
    expect(screen.getByText('(1 review)')).toBeInTheDocument()
  })

  it('validates required fields', () => {
    render(<Reviews />)
    
    fireEvent.click(screen.getByText('Write a Review'))
    fireEvent.click(screen.getByText('Submit Review'))

    // Form should not submit without required fields
    expect(screen.getByText('Your Name *')).toBeInTheDocument()
  })

  it('allows rating selection', () => {
    render(<Reviews />)

    fireEvent.click(screen.getByText('Write a Review'))

    // Check that rating section exists
    expect(screen.getByText('Rating *')).toBeInTheDocument()

    // Stars should be present in the form
    const { container } = render(<Reviews />);
    fireEvent.click(screen.getByText('Write a Review'));
    const starIcons = container.querySelectorAll('svg');
    expect(starIcons.length).toBeGreaterThan(0);
  })

  it('displays multiple reviews correctly', async () => {
    render(<Reviews />)
    
    // Submit first review
    fireEvent.click(screen.getByText('Write a Review'))
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
      target: { value: 'John Doe' }
    })
    fireEvent.change(screen.getByPlaceholderText('Your company name'), {
      target: { value: 'Tech Corp' }
    })
    fireEvent.change(screen.getByPlaceholderText('Your job title'), {
      target: { value: 'HR Manager' }
    })
    fireEvent.change(screen.getByPlaceholderText('Share your experience with our platform...'), {
      target: { value: 'Great platform!' }
    })
    fireEvent.click(screen.getByText('Submit Review'))

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    // Submit second review
    fireEvent.click(screen.getByText('Write a Review'))
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
      target: { value: 'Jane Smith' }
    })
    fireEvent.change(screen.getByPlaceholderText('Your company name'), {
      target: { value: 'Another Corp' }
    })
    fireEvent.change(screen.getByPlaceholderText('Your job title'), {
      target: { value: 'Recruiter' }
    })
    fireEvent.change(screen.getByPlaceholderText('Share your experience with our platform...'), {
      target: { value: 'Excellent tool!' }
    })
    fireEvent.click(screen.getByText('Submit Review'))

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('(2 reviews)')).toBeInTheDocument()
    })
  })
})