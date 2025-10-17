import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
// import { verifyToken } from '@/lib/auth' // Uncomment when auth is implemented

interface AnalyticsQuery {
  period?: 'day' | 'week' | 'month' | 'year'
  startDate?: string
  endDate?: string
}

export async function GET(request: NextRequest) {
  try {
    // Uncomment when auth is implemented
    // const authResult = await verifyToken(request)
    // if (!authResult.success) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') as AnalyticsQuery['period'] || 'month'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Calculate date range
    const dateRange = getDateRange(period, startDate || undefined, endDate || undefined)

    // Get analytics data
    const [
      totalViews,
      uniqueVisitors,
      topPages,
      referrers,
      countries,
      dailyViews,
      pageViews
    ] = await Promise.all([
      getTotalViews(dateRange),
      getUniqueVisitors(dateRange),
      getTopPages(dateRange),
      getTopReferrers(dateRange),
      getTopCountries(dateRange),
      getDailyViews(dateRange),
      getPageViews(dateRange)
    ])

    const analytics = {
      summary: {
        totalViews,
        uniqueVisitors,
        period,
        dateRange
      },
      topPages,
      referrers,
      countries,
      dailyViews,
      pageViews
    }

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

function getDateRange(period: string, startDate?: string, endDate?: string) {
  const end = endDate ? new Date(endDate) : new Date()
  let start: Date

  if (startDate) {
    start = new Date(startDate)
  } else {
    switch (period) {
      case 'day':
        start = new Date()
        start.setHours(0, 0, 0, 0)
        break
      case 'week':
        start = new Date()
        start.setDate(start.getDate() - 7)
        break
      case 'month':
        start = new Date()
        start.setDate(start.getDate() - 30)
        break
      case 'year':
        start = new Date()
        start.setDate(start.getDate() - 365)
        break
      default:
        start = new Date()
        start.setDate(start.getDate() - 30)
    }
  }

  return { start, end }
}

async function getTotalViews(dateRange: { start: Date; end: Date }) {
  const result = await prisma.analytics.aggregate({
    _sum: { views: true },
    where: {
      date: { gte: dateRange.start, lte: dateRange.end }
    }
  })
  return result._sum.views || 0
}

async function getUniqueVisitors(dateRange: { start: Date; end: Date }) {
  const result = await prisma.analytics.groupBy({
    by: ['ip'],
    where: {
      date: { gte: dateRange.start, lte: dateRange.end }
    }
  })
  return result.length
}

async function getTopPages(dateRange: { start: Date; end: Date }) {
  const result = await prisma.analytics.groupBy({
    by: ['page'],
    _sum: { views: true },
    where: {
      date: { gte: dateRange.start, lte: dateRange.end }
    },
    orderBy: { _sum: { views: 'desc' } },
    take: 10
  })

  return result.map(item => ({
    page: item.page,
    views: item._sum.views || 0
  }))
}

async function getTopReferrers(dateRange: { start: Date; end: Date }) {
  const result = await prisma.analytics.groupBy({
    by: ['referrer'],
    _sum: { views: true },
    where: {
      date: { gte: dateRange.start, lte: dateRange.end },
      referrer: { not: null }
    },
    orderBy: { _sum: { views: 'desc' } },
    take: 10
  })

  return result.map(item => ({
    referrer: item.referrer || 'Direct',
    views: item._sum.views || 0
  }))
}

async function getTopCountries(dateRange: { start: Date; end: Date }) {
  const result = await prisma.analytics.groupBy({
    by: ['country'],
    _sum: { views: true },
    where: {
      date: { gte: dateRange.start, lte: dateRange.end },
      country: { not: null }
    },
    orderBy: { _sum: { views: 'desc' } },
    take: 10
  })

  return result.map(item => ({
    country: item.country || 'Unknown',
    views: item._sum.views || 0
  }))
}

async function getDailyViews(dateRange: { start: Date; end: Date }) {
  const result = await prisma.$queryRaw<Array<{ date: string; views: number }>>`
    SELECT 
      DATE(date) as date,
      SUM(views) as views
    FROM analytics 
    WHERE date >= ${dateRange.start} AND date <= ${dateRange.end}
    GROUP BY DATE(date)
    ORDER BY date ASC
  `

  return result.map(item => ({
    date: item.date,
    views: Number(item.views)
  }))
}

async function getPageViews(dateRange: { start: Date; end: Date }) {
  const result = await prisma.analytics.findMany({
    where: {
      date: { gte: dateRange.start, lte: dateRange.end }
    },
    orderBy: { date: 'desc' },
    take: 100,
    select: {
      page: true,
      views: true,
      referrer: true,
      country: true,
      date: true
    }
  })

  return result
}