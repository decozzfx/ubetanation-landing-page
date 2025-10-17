import { render, screen, waitFor } from '@testing-library/react'
import { OptimizedImage, createBlurDataURL } from '@/components/ui/optimized-image'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, onLoad, onError, ...props }: any) {
    return (
      <img
        src={src}
        alt={alt}
        onLoad={onLoad}
        onError={onError}
        {...props}
      />
    )
  }
})

describe('OptimizedImage Component', () => {
  it('renders image with correct props', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={200}
        height={200}
      />
    )

    expect(screen.getByAltText('Test image')).toBeInTheDocument()
    expect(screen.getByAltText('Test image')).toHaveAttribute('src', '/test-image.jpg')
  })

  it('shows loading placeholder initially', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={200}
        height={200}
      />
    )

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('handles image load event', async () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={200}
        height={200}
      />
    )

    const image = screen.getByAltText('Test image')
    
    // Simulate image load
    Object.defineProperty(image, 'naturalWidth', { value: 200 })
    Object.defineProperty(image, 'naturalHeight', { value: 200 })
    image.dispatchEvent(new Event('load'))

    await waitFor(() => {
      expect(image).toHaveClass('opacity-100')
    })
  })

  it('handles image error with fallback', async () => {
    render(
      <OptimizedImage
        src="/broken-image.jpg"
        alt="Test image"
        fallbackSrc="/fallback.jpg"
        width={200}
        height={200}
      />
    )

    const image = screen.getByAltText('Test image')
    
    // Simulate image error
    image.dispatchEvent(new Event('error'))

    await waitFor(() => {
      expect(image).toHaveAttribute('src', '/fallback.jpg')
    })
  })

  it('shows error message when no fallback provided', async () => {
    render(
      <OptimizedImage
        src="/broken-image.jpg"
        alt="Test image"
        width={200}
        height={200}
      />
    )

    const image = screen.getByAltText('Test image')
    
    // Simulate image error
    image.dispatchEvent(new Event('error'))

    await waitFor(() => {
      expect(screen.getByText('Failed to load image')).toBeInTheDocument()
    })
  })

  it('applies aspect ratio classes correctly', () => {
    const { rerender } = render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        aspectRatio="square"
        width={200}
        height={200}
      />
    )

    expect(screen.getByAltText('Test image').parentElement).toHaveClass('aspect-square')

    rerender(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        aspectRatio="video"
        width={200}
        height={200}
      />
    )

    expect(screen.getByAltText('Test image').parentElement).toHaveClass('aspect-video')
  })

  it('can disable placeholder', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        showPlaceholder={false}
        width={200}
        height={200}
      />
    )

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('forwards custom className', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        className="custom-class"
        width={200}
        height={200}
      />
    )

    expect(screen.getByAltText('Test image').parentElement).toHaveClass('custom-class')
  })
})

describe('createBlurDataURL utility', () => {
  it('creates valid base64 SVG data URL', () => {
    const dataUrl = createBlurDataURL(10, 10)
    expect(dataUrl).toMatch(/^data:image\/svg\+xml;base64,/)
    
    // Decode and verify it's valid SVG
    const base64 = dataUrl.split(',')[1]
    const svg = Buffer.from(base64, 'base64').toString()
    expect(svg).toContain('<svg')
    expect(svg).toContain('width="10"')
    expect(svg).toContain('height="10"')
  })

  it('uses default dimensions when not provided', () => {
    const dataUrl = createBlurDataURL()
    const base64 = dataUrl.split(',')[1]
    const svg = Buffer.from(base64, 'base64').toString()
    expect(svg).toContain('width="8"')
    expect(svg).toContain('height="8"')
  })
})