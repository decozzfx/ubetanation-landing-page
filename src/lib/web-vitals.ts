import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals'

function sendToAnalytics(metric: Metric) {
  // In a real application, you would send this to your analytics service
  // For now, we'll just log it to the console
  console.log('Web Vitals:', metric)
  
  // Example: Send to Google Analytics 4
  // gtag('event', metric.name, {
  //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
  //   event_label: metric.id,
  //   non_interaction: true,
  // })
}

export function reportWebVitals() {
  try {
    onCLS(sendToAnalytics)
    onINP(sendToAnalytics)
    onFCP(sendToAnalytics)
    onLCP(sendToAnalytics)
    onTTFB(sendToAnalytics)
  } catch (err) {
    console.error('Error reporting web vitals:', err)
  }
}

// Performance observer for additional metrics
export function initPerformanceObserver() {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    try {
      // Monitor long tasks (>50ms) that could affect interactivity
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('Long Task detected:', entry.duration)
          // In production, send this data to your monitoring service
        }
      })
      longTaskObserver.observe({ entryTypes: ['longtask'] })

      // Monitor layout shifts
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as PerformanceEntry & { value?: number };
          if (layoutShiftEntry.value && layoutShiftEntry.value > 0.1) {
            console.log('Layout Shift detected:', entry)
          }
        }
      })
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] })

      // Monitor navigation timing
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('Navigation timing:', entry)
        }
      })
      navigationObserver.observe({ entryTypes: ['navigation'] })
    } catch (err) {
      console.error('Error initializing performance observer:', err)
    }
  }
}

// Preload critical resources
export function preloadCriticalResources() {
  if (typeof document !== 'undefined') {
    // Preload critical fonts
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.href = '/fonts/inter-var.woff2'
    link.type = 'font/woff2'
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  }
}

// Optimize images with lazy loading and proper sizing
export function optimizeImageLoading() {
  if (typeof window !== 'undefined') {
    // Add intersection observer for images not using Next.js Image component
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.classList.remove('loading')
              observer.unobserve(img)
            }
          }
        })
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    )

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img)
    })
  }
}

// Resource hints for better loading performance
export function addResourceHints() {
  if (typeof document !== 'undefined') {
    // DNS prefetch for external resources
    const dnsPrefetchHosts = [
      'fonts.googleapis.com',
      'fonts.gstatic.com'
    ]

    dnsPrefetchHosts.forEach(host => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = `//${host}`
      document.head.appendChild(link)
    })

    // Preconnect to critical third-party origins
    const preconnectHosts = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ]

    preconnectHosts.forEach(host => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = host
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }
}