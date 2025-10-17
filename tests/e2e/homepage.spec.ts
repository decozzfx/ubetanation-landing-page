import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the main hero section', async ({ page }) => {
    // Check for main hero content
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByText(/modern it solutions/i)).toBeVisible()
  })

  test('should have working navigation', async ({ page }) => {
    // Test navigation links
    await page.getByRole('link', { name: /services/i }).click()
    await expect(page).toHaveURL(/.*services/)
    
    await page.goBack()
    
    await page.getByRole('link', { name: /about/i }).click()
    await expect(page).toHaveURL(/.*about/)
    
    await page.goBack()
    
    await page.getByRole('link', { name: /contact/i }).click()
    await expect(page).toHaveURL(/.*contact/)
  })

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('should have proper meta tags', async ({ page }) => {
    // Check for proper meta tags
    await expect(page).toHaveTitle(/ubetanation/i)
    
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /.+/)
    
    // Check for Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toHaveAttribute('content', /.+/)
  })

  test('should load without console errors', async ({ page }) => {
    const consoleErrors: string[] = []
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Allow some time for any async operations
    await page.waitForTimeout(2000)
    
    // Filter out known acceptable errors (like network errors in dev mode)
    const significantErrors = consoleErrors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('_next/static') &&
      !error.includes('verifyToken') &&
      !error.includes('auth')
    )
    
    expect(significantErrors).toEqual([])
  })

  test('should have working call-to-action buttons', async ({ page }) => {
    // Check for CTA buttons and their functionality
    const ctaButtons = page.getByRole('button', { name: /get started|contact us|learn more/i })
    const firstCta = ctaButtons.first()
    
    if (await firstCta.isVisible()) {
      await firstCta.click()
      // Should navigate to contact or relevant page
      await expect(page).toHaveURL(/.*(contact|about|services).*/)
    }
  })
})