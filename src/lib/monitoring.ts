// Monitoring and health check utilities

interface HealthCheck {
  service: string
  status: 'healthy' | 'unhealthy' | 'degraded'
  responseTime?: number
  message?: string
  timestamp: string
}

interface SystemMetrics {
  uptime: number
  memory: {
    used: number
    total: number
    percentage: number
  }
  performance: {
    averageResponseTime: number
    requestsPerMinute: number
    errorRate: number
  }
}

class HealthMonitor {
  private healthChecks: HealthCheck[] = []
  private metrics: SystemMetrics | null = null

  async checkDatabaseHealth(): Promise<HealthCheck> {
    const startTime = Date.now()
    
    try {
      // Simple database connectivity check
      const response = await fetch('/api/health/database', {
        method: 'GET',
        cache: 'no-cache'
      })
      
      const responseTime = Date.now() - startTime
      
      if (response.ok) {
        return {
          service: 'database',
          status: responseTime > 1000 ? 'degraded' : 'healthy',
          responseTime,
          message: responseTime > 1000 ? 'Slow response time' : 'Database is responsive',
          timestamp: new Date().toISOString()
        }
      } else {
        throw new Error(`Database health check failed: ${response.status}`)
      }
    } catch (error) {
      return {
        service: 'database',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        message: error instanceof Error ? error.message : 'Unknown database error',
        timestamp: new Date().toISOString()
      }
    }
  }

  async checkAPIHealth(): Promise<HealthCheck> {
    const startTime = Date.now()
    
    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        cache: 'no-cache'
      })
      
      const responseTime = Date.now() - startTime
      
      if (response.ok) {
        return {
          service: 'api',
          status: responseTime > 2000 ? 'degraded' : 'healthy',
          responseTime,
          message: 'API is responsive',
          timestamp: new Date().toISOString()
        }
      } else {
        throw new Error(`API health check failed: ${response.status}`)
      }
    } catch (error) {
      return {
        service: 'api',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        message: error instanceof Error ? error.message : 'API health check failed',
        timestamp: new Date().toISOString()
      }
    }
  }

  async checkExternalServices(): Promise<HealthCheck[]> {
    const services = [
      {
        name: 'analytics',
        url: 'https://www.google-analytics.com/analytics.js',
        timeout: 5000
      }
    ]

    const checks = await Promise.allSettled(
      services.map(async (service) => {
        const startTime = Date.now()
        
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), service.timeout)
          
          const response = await fetch(service.url, {
            signal: controller.signal,
            mode: 'no-cors'
          })
          
          clearTimeout(timeoutId)
          const responseTime = Date.now() - startTime
          
          return {
            service: service.name,
            status: 'healthy' as const,
            responseTime,
            message: 'External service is accessible',
            timestamp: new Date().toISOString()
          }
        } catch (error) {
          return {
            service: service.name,
            status: 'unhealthy' as const,
            responseTime: Date.now() - startTime,
            message: error instanceof Error ? error.message : 'External service check failed',
            timestamp: new Date().toISOString()
          }
        }
      })
    )

    return checks
      .filter((check) => check.status === 'fulfilled')
      .map(check => (check as PromiseFulfilledResult<HealthCheck>).value)
  }

  async runAllHealthChecks(): Promise<HealthCheck[]> {
    const [dbCheck, apiCheck, externalChecks] = await Promise.all([
      this.checkDatabaseHealth(),
      this.checkAPIHealth(),
      this.checkExternalServices()
    ])

    this.healthChecks = [dbCheck, apiCheck, ...externalChecks]
    return this.healthChecks
  }

  getOverallStatus(): 'healthy' | 'unhealthy' | 'degraded' {
    if (this.healthChecks.length === 0) return 'unhealthy'
    
    const hasUnhealthy = this.healthChecks.some(check => check.status === 'unhealthy')
    const hasDegraded = this.healthChecks.some(check => check.status === 'degraded')
    
    if (hasUnhealthy) return 'unhealthy'
    if (hasDegraded) return 'degraded'
    return 'healthy'
  }

  async collectMetrics(): Promise<SystemMetrics> {
    // Note: In a real production environment, you would collect actual system metrics
    // This is a simplified version for demonstration
    
    const metrics: SystemMetrics = {
      uptime: process.uptime ? process.uptime() : 0,
      memory: {
        used: 0,
        total: 0,
        percentage: 0
      },
      performance: {
        averageResponseTime: 0,
        requestsPerMinute: 0,
        errorRate: 0
      }
    }

    // In Node.js environment, we can get memory usage
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage()
      metrics.memory = {
        used: memUsage.heapUsed,
        total: memUsage.heapTotal,
        percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100
      }
    }

    this.metrics = metrics
    return metrics
  }

  getLatestMetrics(): SystemMetrics | null {
    return this.metrics
  }

  getLatestHealthChecks(): HealthCheck[] {
    return this.healthChecks
  }

  // Send alerts when critical issues are detected
  async sendAlert(check: HealthCheck): Promise<void> {
    if (check.status === 'unhealthy') {
      console.error(`ALERT: ${check.service} is unhealthy - ${check.message}`)
      
      // In production, you would send this to your alerting system
      // Examples: PagerDuty, Slack, email notifications, etc.
      
      try {
        await fetch('/api/alerts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'health_check_failure',
            service: check.service,
            status: check.status,
            message: check.message,
            timestamp: check.timestamp,
            responseTime: check.responseTime
          })
        })
      } catch (error) {
        console.error('Failed to send alert:', error)
      }
    }
  }
}

// Singleton instance for monitoring
export const healthMonitor = new HealthMonitor()

// Utility functions for client-side monitoring
export const clientMonitoring = {
  // Track page performance metrics
  trackPageLoad: (pageName: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const metrics = {
        page: pageName,
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstByte: navigation.responseStart - navigation.requestStart,
        timestamp: new Date().toISOString()
      }

      // Send metrics to analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'page_load_performance', {
          custom_parameter_1: metrics.loadTime,
          custom_parameter_2: metrics.domContentLoaded,
          custom_parameter_3: metrics.firstByte
        })
      }

      return metrics
    }
    return null
  },

  // Track JavaScript errors
  trackError: (error: Error, context?: string) => {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    }

    console.error('Client Error:', errorInfo)

    // Send to error tracking service
    if (typeof fetch !== 'undefined') {
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorInfo)
      }).catch(err => console.error('Failed to report error:', err))
    }

    return errorInfo
  },

  // Track user interactions
  trackInteraction: (action: string, element?: string, value?: number) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: 'user_interaction',
        event_label: element,
        value: value
      })
    }
  }
}

// Set up global error handling for production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  window.addEventListener('error', (event) => {
    clientMonitoring.trackError(
      new Error(event.message),
      `Global error at ${event.filename}:${event.lineno}:${event.colno}`
    )
  })

  window.addEventListener('unhandledrejection', (event) => {
    clientMonitoring.trackError(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      'Unhandled promise rejection'
    )
  })
}