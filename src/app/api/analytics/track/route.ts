import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface TrackingData {
  page: string
  referrer?: string
  userAgent?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as TrackingData
    const { page, referrer, userAgent } = body

    // Get client IP
    const ip = getClientIP(request)
    
    // Get country from IP (simplified - in production, use a proper GeoIP service)
    const country = await getCountryFromIP(ip)

    // Check if we already have analytics for this page today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const existingAnalytics = await prisma.analytics.findFirst({
      where: {
        page: page,
        date: {
          gte: today,
          lt: tomorrow
        },
        ip: ip
      }
    })

    if (existingAnalytics) {
      // Update existing record
      await prisma.analytics.update({
        where: { id: existingAnalytics.id },
        data: {
          views: { increment: 1 },
          referrer: referrer || existingAnalytics.referrer,
          userAgent: userAgent || existingAnalytics.userAgent,
          country: country || existingAnalytics.country
        }
      })
    } else {
      // Create new record
      await prisma.analytics.create({
        data: {
          page,
          referrer,
          userAgent,
          ip,
          country,
          views: 1
        }
      })
    }

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    )
  }
}

function getClientIP(request: NextRequest): string {
  // Try to get IP from various headers
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP
  }

  return (request as any).ip || 'unknown'
}

async function getCountryFromIP(ip: string): Promise<string | null> {
  // In a production environment, you would use a service like:
  // - MaxMind GeoIP2
  // - IP-API
  // - CloudFlare's CF-IPCountry header
  // - AWS CloudFront geolocation headers
  
  // For demo purposes, we'll return a placeholder
  if (ip === 'unknown' || ip === '127.0.0.1' || ip === '::1') {
    return 'Local'
  }

  try {
    // Example with ip-api.com (free tier)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country`)
    const data = await response.json()
    
    if (data.status === 'success') {
      return data.country
    }
  } catch (error) {
    console.error('GeoIP lookup failed:', error)
  }

  return null
}