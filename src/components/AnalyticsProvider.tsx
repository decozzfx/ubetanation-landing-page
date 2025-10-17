"use client"

import { useAnalytics } from '@/hooks/useAnalytics'

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  // Initialize analytics tracking
  useAnalytics({
    enabled: true,
    trackPageViews: true,
    debug: process.env.NODE_ENV === 'development'
  })

  return <>{children}</>
}