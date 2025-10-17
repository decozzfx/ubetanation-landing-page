import { test, expect } from '@playwright/test'

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('should display contact form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /get in touch/i })).toBeVisible()
    
    // Check all form fields are present
    await expect(page.getByLabel(/name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/phone/i)).toBeVisible()
    await expect(page.getByLabel(/company/i)).toBeVisible()
    await expect(page.getByLabel(/project type/i)).toBeVisible()
    await expect(page.getByLabel(/budget/i)).toBeVisible()
    await expect(page.getByLabel(/timeline/i)).toBeVisible()
    await expect(page.getByLabel(/project description/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /send message/i })).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: /send message/i }).click()
    
    // Should show validation errors
    await expect(page.getByText(/name is required/i)).toBeVisible()
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/project description is required/i)).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    await page.getByLabel(/email/i).fill('invalid-email')
    await page.getByRole('button', { name: /send message/i }).click()
    
    await expect(page.getByText(/please enter a valid email address/i)).toBeVisible()
  })

  test('should submit form with valid data', async ({ page }) => {
    // Fill out the form
    await page.getByLabel(/name/i).fill('John Doe')
    await page.getByLabel(/email/i).fill('john@example.com')
    await page.getByLabel(/phone/i).fill('+1234567890')
    await page.getByLabel(/company/i).fill('Test Company')
    
    // Select project type
    await page.getByLabel(/project type/i).click()
    await page.getByText('Web Development').click()
    
    // Select budget
    await page.getByLabel(/budget/i).click()
    await page.getByText('$10,000 - $25,000').click()
    
    // Select timeline
    await page.getByLabel(/timeline/i).click()
    await page.getByText('3-6 months').click()
    
    await page.getByLabel(/project description/i).fill('This is a test project description for e2e testing.')
    
    // Mock the API call to prevent actual submission
    await page.route('/api/contact', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Message sent successfully!' })
      })
    })
    
    await page.getByRole('button', { name: /send message/i }).click()
    
    // Should show success message
    await expect(page.getByText(/message sent successfully/i)).toBeVisible()
  })

  test('should handle form submission error', async ({ page }) => {
    // Fill out minimal required fields
    await page.getByLabel(/name/i).fill('John Doe')
    await page.getByLabel(/email/i).fill('john@example.com')
    await page.getByLabel(/project description/i).fill('Test description')
    
    // Mock API error
    await page.route('/api/contact', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' })
      })
    })
    
    await page.getByRole('button', { name: /send message/i }).click()
    
    // Should show error message
    await expect(page.getByText(/failed to send message/i)).toBeVisible()
  })

  test('should display contact information', async ({ page }) => {
    // Check that contact info is displayed
    await expect(page.getByText(/contact information/i)).toBeVisible()
    await expect(page.getByText(/business hours/i)).toBeVisible()
  })

  test('should be accessible @a11y', async ({ page }) => {
    // Basic accessibility checks
    await expect(page.getByRole('main')).toBeVisible()
    
    // Check form labels are properly associated
    const nameField = page.getByLabel(/name/i)
    await expect(nameField).toBeVisible()
    await expect(nameField).toHaveAttribute('id')
    
    // Check for proper heading hierarchy
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toBeVisible()
  })

  test('should work on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Form should still be accessible and usable on mobile
    await expect(page.getByRole('heading', { name: /get in touch/i })).toBeVisible()
    await expect(page.getByLabel(/name/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /send message/i })).toBeVisible()
    
    // Form fields should be properly sized for mobile
    const nameField = page.getByLabel(/name/i)
    const boundingBox = await nameField.boundingBox()
    expect(boundingBox?.width).toBeGreaterThan(200) // Should be reasonably sized
  })
})