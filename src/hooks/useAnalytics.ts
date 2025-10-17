"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface AnalyticsConfig {
  enabled?: boolean
  trackPageViews?: boolean
  debug?: boolean
}

const defaultConfig: AnalyticsConfig = {
  enabled: process.env.NODE_ENV === 'production',
  trackPageViews: true,
  debug: process.env.NODE_ENV === 'development'
}

export function useAnalytics(config: AnalyticsConfig = {}) {
  const pathname = usePathname()
  const finalConfig = { ...defaultConfig, ...config }

  useEffect(() => {
    if (!finalConfig.enabled || !finalConfig.trackPageViews) {
      return
    }

    trackPageView(pathname, finalConfig.debug)
  }, [pathname, finalConfig.enabled, finalConfig.trackPageViews, finalConfig.debug])

  return {
    trackEvent: (event: string, data?: Record<string, any>) => {
      if (finalConfig.enabled) {
        trackCustomEvent(event, data, finalConfig.debug)
      }
    },
    trackPageView: (page?: string) => {
      if (finalConfig.enabled) {
        trackPageView(page || pathname, finalConfig.debug)
      }
    }
  }
}

async function trackPageView(page: string, debug = false) {
  try {
    const trackingData = {
      page: page,
      referrer: document.referrer || undefined,
      userAgent: navigator.userAgent
    }

    if (debug) {
      console.log('Tracking page view:', trackingData)
    }

    const response = await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trackingData)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (debug) {
      console.log('Page view tracked successfully')
    }

  } catch (error) {
    if (debug) {
      console.error('Failed to track page view:', error)
    }
    // Silently fail in production to not disrupt user experience
  }
}

async function trackCustomEvent(event: string, data: Record<string, any> = {}, debug = false) {
  try {
    const eventData = {
      event,
      page: window.location.pathname,
      data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || undefined
    }

    if (debug) {
      console.log('Tracking custom event:', eventData)
    }

    // For now, we'll log custom events to console
    // In a full implementation, you might want to store these in the database
    console.log('Custom event tracked:', eventData)

    // TODO: Implement custom event tracking endpoint if needed
    // const response = await fetch('/api/analytics/events', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(eventData)
    // })

  } catch (error) {
    if (debug) {
      console.error('Failed to track custom event:', error)
    }
  }
}

// Utility function to track specific actions
export const analytics = {
  // Track form submissions
  trackFormSubmission: (formName: string, success: boolean) => {
    trackCustomEvent('form_submission', { formName, success })
  },

  // Track button clicks
  trackButtonClick: (buttonName: string, location: string) => {
    trackCustomEvent('button_click', { buttonName, location })
  },

  // Track file downloads
  trackDownload: (fileName: string, fileType: string) => {
    trackCustomEvent('download', { fileName, fileType })
  },

  // Track external link clicks
  trackExternalLink: (url: string) => {
    trackCustomEvent('external_link', { url })
  },

  // Track search queries
  trackSearch: (query: string, resultsCount: number) => {
    trackCustomEvent('search', { query, resultsCount })
  },

  // Track video plays
  trackVideoPlay: (videoId: string, videoTitle: string) => {
    trackCustomEvent('video_play', { videoId, videoTitle })
  }
}

export default useAnalytics