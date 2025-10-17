import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Basic health check
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      node_version: process.version,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100
      },
      checks: {
        database: 'unknown',
        filesystem: 'unknown'
      }
    }

    // Database health check
    try {
      await prisma.$queryRaw`SELECT 1`
      healthCheck.checks.database = 'healthy'
    } catch (error) {
      healthCheck.checks.database = 'unhealthy'
      healthCheck.status = 'degraded'
    }

    // Filesystem health check (check if uploads directory is writable)
    try {
      const fs = require('fs')
      const path = require('path')
      const uploadsDir = path.join(process.cwd(), 'uploads')
      
      // Ensure uploads directory exists
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }
      
      // Test write access
      const testFile = path.join(uploadsDir, '.health-check')
      fs.writeFileSync(testFile, Date.now().toString())
      fs.unlinkSync(testFile)
      
      healthCheck.checks.filesystem = 'healthy'
    } catch (error) {
      healthCheck.checks.filesystem = 'unhealthy'
      healthCheck.status = 'degraded'
    }

    // Return appropriate status code
    const statusCode = healthCheck.status === 'healthy' ? 200 : 503

    return NextResponse.json(healthCheck, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Internal health check error',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  }
}

// Also support HEAD requests for simple availability checks
export async function HEAD() {
  try {
    // Quick database ping
    await prisma.$queryRaw`SELECT 1`
    return new NextResponse(null, { status: 200 })
  } catch (error) {
    return new NextResponse(null, { status: 503 })
  }
}