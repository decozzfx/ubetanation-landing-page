import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from '@/components/contact/ContactForm'

// Mock fetch
global.fetch = jest.fn()

describe('ContactForm Component', () => {
  beforeEach(() => {
    ;(fetch as jest.Mock).mockClear()
  })

  it('renders all form fields', () => {
    render(<ContactForm />)

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/project type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/budget/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/timeline/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/project description/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    // Try to submit empty form
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/project description is required/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    // Enter invalid email
    await user.type(screen.getByLabelText(/email/i), 'invalid-email')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    })

    render(<ContactForm />)

    // Fill out form
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone/i), '+1234567890')
    await user.type(screen.getByLabelText(/company/i), 'Test Company')
    await user.selectOptions(screen.getByLabelText(/project type/i), 'web-development')
    await user.selectOptions(screen.getByLabelText(/budget/i), '10000-25000')
    await user.selectOptions(screen.getByLabelText(/timeline/i), '3-6-months')
    await user.type(screen.getByLabelText(/project description/i), 'Test project description')

    // Submit form
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          company: 'Test Company',
          projectType: 'web-development',
          budget: '10000-25000',
          timeline: '3-6-months',
          message: 'Test project description'
        })
      })
    })
  })

  it('shows success message after successful submission', async () => {
    const user = userEvent.setup()
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    })

    render(<ContactForm />)

    // Fill out and submit form
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/project description/i), 'Test project description')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument()
    })
  })

  it('shows error message on submission failure', async () => {
    const user = userEvent.setup()
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<ContactForm />)

    // Fill out and submit form
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/project description/i), 'Test project description')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByText(/failed to send message/i)).toBeInTheDocument()
    })
  })

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup()
    ;(fetch as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))

    render(<ContactForm />)

    // Fill out form
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/project description/i), 'Test project description')

    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/sending/i)).toBeInTheDocument()
  })
})