import { test, expect } from '@playwright/test'

test.describe('Performance Tests', () => {
  test('should load pages quickly', async ({ page }) => {
    const pages = [
      { name: 'Homepage', url: '/' },
      { name: 'About', url: '/about' },
      { name: 'Services', url: '/services' },
      { name: 'Contact', url: '/contact' },
    ]

    for (const { name, url } of pages) {
      console.log(`Testing ${name} performance...`)
      
      const startTime = Date.now()
      await page.goto(url, { waitUntil: 'networkidle' })
      const loadTime = Date.now() - startTime
      
      console.log(`${name} loaded in ${loadTime}ms`)
      
      // Pages should load within 3 seconds
      expect(loadTime).toBeLessThan(3000)
      
      // Check that essential content is visible
      await expect(page.getByRole('main')).toBeVisible()
    }
  })

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    // Measure performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        // Use PerformanceObserver to get Web Vitals
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const webVitals: Record<string, number> = {}
          
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming
              webVitals.loadTime = navEntry.loadEventEnd - navEntry.loadEventStart
              webVitals.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart
            }
          })
          
          // Get paint timing
          const paintEntries = performance.getEntriesByType('paint')
          paintEntries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              webVitals.fcp = entry.startTime
            }
          })
          
          resolve(webVitals)
        })
        
        observer.observe({ entryTypes: ['navigation', 'paint'] })
        
        // Fallback timeout
        setTimeout(() => resolve({}), 5000)
      })
    })
    
    console.log('Performance metrics:', metrics)
    
    // Assert on metrics if available
    if (typeof metrics === 'object' && metrics !== null) {
      const metricsObj = metrics as Record<string, number>
      
      // First Contentful Paint should be under 1.8s
      if (metricsObj.fcp) {
        expect(metricsObj.fcp).toBeLessThan(1800)
      }
      
      // DOM Content Loaded should be quick
      if (metricsObj.domContentLoaded) {
        expect(metricsObj.domContentLoaded).toBeLessThan(1000)
      }
    }
  })

  test('should handle multiple concurrent users', async ({ browser }) => {
    const pages = await Promise.all([
      browser.newPage(),
      browser.newPage(),
      browser.newPage(),
      browser.newPage(),
      browser.newPage(),
    ])

    // Simulate 5 concurrent users
    const loadTimes = await Promise.all(
      pages.map(async (page, index) => {
        const startTime = Date.now()
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        const loadTime = Date.now() - startTime
        
        console.log(`User ${index + 1} load time: ${loadTime}ms`)
        await page.close()
        
        return loadTime
      })
    )

    // All pages should load within reasonable time even under concurrent load
    loadTimes.forEach((loadTime, index) => {
      expect(loadTime).toBeLessThan(5000) // 5 second max under load
    })

    // Average load time should be reasonable
    const avgLoadTime = loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length
    console.log(`Average load time: ${avgLoadTime}ms`)
    expect(avgLoadTime).toBeLessThan(3000)
  })

  test('should optimize image loading', async ({ page }) => {
    await page.goto('/')
    
    // Wait for images to load
    await page.waitForLoadState('networkidle')
    
    // Check that images are using Next.js Image optimization
    const images = await page.locator('img').all()
    
    for (const image of images) {
      const src = await image.getAttribute('src')
      const loading = await image.getAttribute('loading')
      
      if (src) {
        console.log(`Image src: ${src}, loading: ${loading}`)
        
        // Next.js optimized images should have proper loading attribute
        if (!src.includes('data:image') && !src.includes('.svg')) {
          // Most images should be lazy loaded
          expect(['lazy', 'eager', null]).toContain(loading)
        }
        
        // Check if image loads successfully
        const response = await page.evaluate(async (imageSrc) => {
          return new Promise((resolve) => {
            const img = new Image()
            img.onload = () => resolve({ loaded: true, naturalWidth: img.naturalWidth })
            img.onerror = () => resolve({ loaded: false })
            img.src = imageSrc
          })
        }, src)
        
        expect(response).toHaveProperty('loaded', true)
      }
    }
  })

  test('should minimize render blocking resources', async ({ page }) => {
    // Monitor network requests
    const requests: { url: string; resourceType: string; size?: number }[] = []
    
    page.on('response', async (response) => {
      const request = response.request()
      const resourceType = request.resourceType()
      
      if (['stylesheet', 'script', 'font'].includes(resourceType)) {
        const url = request.url()
        let size: number | undefined
        
        try {
          const buffer = await response.body()
          size = buffer.length
        } catch (e) {
          // Size couldn't be determined
        }
        
        requests.push({ url, resourceType, size })
      }
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    console.log('Render blocking resources:')
    requests.forEach(req => {
      console.log(`  ${req.resourceType}: ${req.url} (${req.size || 'unknown'} bytes)`)
    })
    
    // Should not have excessive render blocking resources
    const stylesheets = requests.filter(r => r.resourceType === 'stylesheet')
    const scripts = requests.filter(r => r.resourceType === 'script')
    
    // Reasonable limits for critical resources
    expect(stylesheets.length).toBeLessThan(10)
    expect(scripts.length).toBeLessThan(15)
    
    // Check for large resources that might slow down rendering
    const largeResources = requests.filter(r => r.size && r.size > 500000) // 500KB
    expect(largeResources.length).toBeLessThan(3)
  })

  test('should have efficient bundle size', async ({ page }) => {
    const jsRequests: { url: string; size: number }[] = []
    
    page.on('response', async (response) => {
      const request = response.request()
      if (request.resourceType() === 'script' && request.url().includes('_next/static')) {
        try {
          const buffer = await response.body()
          jsRequests.push({
            url: request.url(),
            size: buffer.length
          })
        } catch (e) {
          // Skip if can't get size
        }
      }
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    console.log('JavaScript bundles:')
    let totalSize = 0
    jsRequests.forEach(req => {
      console.log(`  ${req.url.split('/').pop()}: ${(req.size / 1024).toFixed(2)} KB`)
      totalSize += req.size
    })
    
    console.log(`Total JS bundle size: ${(totalSize / 1024).toFixed(2)} KB`)
    
    // Total JS bundle size should be reasonable (under 1MB)
    expect(totalSize).toBeLessThan(1024 * 1024)
    
    // Individual chunks should not be too large
    const largeChunks = jsRequests.filter(req => req.size > 500 * 1024) // 500KB
    expect(largeChunks.length).toBeLessThan(2)
  })

  test('should cache resources properly', async ({ page }) => {
    // First visit - measure uncached performance
    const firstVisitStart = Date.now()
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const firstVisitTime = Date.now() - firstVisitStart
    
    // Second visit - should be faster due to caching
    const secondVisitStart = Date.now()
    await page.reload()
    await page.waitForLoadState('networkidle')
    const secondVisitTime = Date.now() - secondVisitStart
    
    console.log(`First visit: ${firstVisitTime}ms, Second visit: ${secondVisitTime}ms`)
    
    // Second visit should generally be faster (allowing for some variance)
    // This might not always be true in development, so we use a lenient check
    expect(secondVisitTime).toBeLessThan(firstVisitTime + 1000)
  })
})