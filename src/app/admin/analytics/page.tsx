"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  Users, 
  Eye, 
  Globe, 
  TrendingUp,
  Calendar,
  ExternalLink,
  RefreshCw
} from 'lucide-react'

interface AnalyticsData {
  summary: {
    totalViews: number
    uniqueVisitors: number
    period: string
    dateRange: {
      start: string
      end: string
    }
  }
  topPages: Array<{ page: string; views: number }>
  referrers: Array<{ referrer: string; views: number }>
  countries: Array<{ country: string; views: number }>
  dailyViews: Array<{ date: string; views: number }>
  pageViews: Array<{
    page: string
    views: number
    referrer: string | null
    country: string | null
    date: string
  }>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month')
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/admin/analytics?period=${period}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      
      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Analytics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-2 mb-6">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <h1 className="text-3xl font-bold">Analytics</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Analytics</h1>
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading analytics: {error}</p>
              <Button onClick={fetchAnalytics} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Analytics</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No analytics data available</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Analytics</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={fetchAnalytics} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Last {period === 'day' ? '24 hours' : period}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Unique IP addresses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Countries</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.countries.length}</div>
            <p className="text-xs text-muted-foreground">
              {data.countries[0]?.country || 'N/A'} leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Views/Day</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.dailyViews.length > 0 
                ? Math.round(data.summary.totalViews / Math.max(data.dailyViews.length, 1))
                : 0
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Daily average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topPages.slice(0, 10).map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm text-muted-foreground w-6">
                      #{index + 1}
                    </span>
                    <span className="truncate text-sm font-medium">
                      {page.page === '/' ? 'Home' : page.page}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{page.views}</span>
                    <div 
                      className="h-2 bg-primary rounded-full"
                      style={{ 
                        width: `${Math.max(4, (page.views / Math.max(...data.topPages.map(p => p.views))) * 60)}px` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Referrers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.referrers.length > 0 ? (
                data.referrers.slice(0, 10).map((referrer, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-sm text-muted-foreground w-6">
                        #{index + 1}
                      </span>
                      <div className="flex items-center gap-2 min-w-0">
                        {referrer.referrer !== 'Direct' && (
                          <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className="truncate text-sm font-medium">
                          {referrer.referrer || 'Direct'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{referrer.views}</span>
                      <div 
                        className="h-2 bg-primary rounded-full"
                        style={{ 
                          width: `${Math.max(4, (referrer.views / Math.max(...data.referrers.map(r => r.views))) * 60)}px` 
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No referrer data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Countries */}
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.countries.length > 0 ? (
                data.countries.slice(0, 10).map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-sm text-muted-foreground w-6">
                        #{index + 1}
                      </span>
                      <span className="text-sm font-medium">{country.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{country.views}</span>
                      <div 
                        className="h-2 bg-primary rounded-full"
                        style={{ 
                          width: `${Math.max(4, (country.views / Math.max(...data.countries.map(c => c.views))) * 60)}px` 
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No geographic data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Daily Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Views</CardTitle>
          </CardHeader>
          <CardContent>
            {data.dailyViews.length > 0 ? (
              <div className="space-y-2">
                {data.dailyViews.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {new Date(day.date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{day.views}</span>
                      <div 
                        className="h-2 bg-primary rounded-full"
                        style={{ 
                          width: `${Math.max(4, (day.views / Math.max(...data.dailyViews.map(d => d.views))) * 100)}px` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No daily data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Page Views */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Page Views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Page</th>
                  <th className="text-left p-2">Views</th>
                  <th className="text-left p-2">Referrer</th>
                  <th className="text-left p-2">Country</th>
                  <th className="text-left p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.pageViews.slice(0, 20).map((view, index) => (
                  <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-2 font-medium">
                      {view.page === '/' ? 'Home' : view.page}
                    </td>
                    <td className="p-2">{view.views}</td>
                    <td className="p-2 text-muted-foreground">
                      {view.referrer || 'Direct'}
                    </td>
                    <td className="p-2 text-muted-foreground">
                      {view.country || 'Unknown'}
                    </td>
                    <td className="p-2 text-muted-foreground">
                      {new Date(view.date).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}