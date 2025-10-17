import { cn } from '@/lib/utils'

describe('cn utility function', () => {
  it('should combine class names correctly', () => {
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500')
  })

  it('should handle conditional classes', () => {
    expect(cn('text-red-500', true && 'bg-blue-500')).toBe('text-red-500 bg-blue-500')
    expect(cn('text-red-500', false && 'bg-blue-500')).toBe('text-red-500')
  })

  it('should handle undefined and null values', () => {
    expect(cn('text-red-500', undefined, null, 'bg-blue-500')).toBe('text-red-500 bg-blue-500')
  })

  it('should merge conflicting classes correctly', () => {
    expect(cn('p-4 p-2')).toBe('p-2')
  })

  it('should handle empty input', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
  })
})