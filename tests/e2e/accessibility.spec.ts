import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests @a11y', () => {
  const pages = [
    { name: 'Homepage', url: '/' },
    { name: 'About', url: '/about' },
    { name: 'Services', url: '/services' },
    { name: 'Contact', url: '/contact' },
    { name: 'Blog', url: '/blog' },
  ]

  pages.forEach(({ name, url }) => {
    test(`should not have accessibility violations on ${name}`, async ({ page }) => {
      await page.goto(url)
      
      // Wait for the page to be fully loaded
      await page.waitForLoadState('networkidle')
      
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
      
      expect(accessibilityScanResults.violations).toEqual([])
    })
  })

  test('should have proper keyboard navigation', async ({ page }) => {
    await page.goto('/')
    
    // Test tab navigation through interactive elements
    let tabCount = 0
    const maxTabs = 20 // Prevent infinite loop
    
    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab')
      
      // Check if focused element is visible and focusable
      const focusedElement = page.locator(':focus')
      
      if (await focusedElement.count() > 0) {
        const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase())
        const isInteractive = ['a', 'button', 'input', 'select', 'textarea'].includes(tagName)
        
        if (isInteractive) {
          // Focused element should be visible
          await expect(focusedElement).toBeVisible()
          
          // Should have visible focus indicator
          const hasOutline = await focusedElement.evaluate(el => {
            const styles = window.getComputedStyle(el)
            return styles.outline !== 'none' || styles.outlineWidth !== '0px' || 
                   styles.boxShadow !== 'none'
          })
          
          // This is more lenient as some custom focus styles might not be detected
          if (!hasOutline) {
            console.warn(`Element ${tagName} might not have visible focus indicator`)
          }
        }
      }
      
      tabCount++
      
      // Break if we've returned to body or first element
      const activeElement = await page.evaluate(() => document.activeElement?.tagName)
      if (tabCount > 5 && activeElement === 'BODY') {
        break
      }
    }
    
    expect(tabCount).toBeGreaterThan(3) // Should have at least a few focusable elements
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    const pagesToCheck = ['/', '/about', '/services', '/contact']
    
    for (const url of pagesToCheck) {
      await page.goto(url)
      await page.waitForLoadState('networkidle')
      
      // Get all headings
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
      
      if (headings.length > 0) {
        const headingLevels = []
        for (const heading of headings) {
          const tagName = await heading.evaluate(el => el.tagName)
          const level = parseInt(tagName.charAt(1))
          headingLevels.push(level)
        }
        
        // Should start with h1
        expect(headingLevels[0]).toBe(1)
        
        // Check that heading levels don't skip (no h1 -> h3 without h2)
        for (let i = 1; i < headingLevels.length; i++) {
          const currentLevel = headingLevels[i]
          const previousLevel = headingLevels[i - 1]
          
          // Allow same level or one level deeper, or any level shallower
          if (currentLevel > previousLevel) {
            expect(currentLevel - previousLevel).toBeLessThanOrEqual(1)
          }
        }
      }
    }
  })

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const images = await page.locator('img').all()
    
    for (const image of images) {
      const alt = await image.getAttribute('alt')
      const src = await image.getAttribute('src')
      
      // Images should have alt text (can be empty for decorative images)
      expect(alt).not.toBeNull()
      
      // If image is not decorative, alt should be meaningful
      if (alt && alt.length > 0) {
        expect(alt.length).toBeGreaterThan(2)
      }
      
      console.log(`Image: ${src} - Alt: "${alt}"`)
    }
  })

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/')
    
    // Use axe-core to check color contrast
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa', 'wcag21aa'])
      .analyze()
    
    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    )
    
    expect(contrastViolations).toEqual([])
  })

  test('should support screen readers', async ({ page }) => {
    await page.goto('/contact')
    
    // Check for proper ARIA labels and roles
    const form = page.getByRole('form').first()
    if (await form.count() > 0) {
      // Form should be accessible
      await expect(form).toBeVisible()
    }
    
    // Check that interactive elements have accessible names
    const buttons = await page.getByRole('button').all()
    for (const button of buttons) {
      const accessibleName = await button.getAttribute('aria-label') || 
                            await button.textContent()
      expect(accessibleName?.trim().length).toBeGreaterThan(0)
    }
    
    // Check that form inputs have labels
    const inputs = await page.locator('input[type="text"], input[type="email"], textarea').all()
    for (const input of inputs) {
      const id = await input.getAttribute('id')
      if (id) {
        const label = page.locator(`label[for="${id}"]`)
        await expect(label).toBeVisible()
      }
    }
  })

  test('should handle focus management in modals', async ({ page }) => {
    await page.goto('/')
    
    // Look for any modal triggers
    const modalTriggers = await page.locator('[data-modal], [aria-haspopup="dialog"]').all()
    
    for (const trigger of modalTriggers.slice(0, 2)) { // Test first 2 modals only
      if (await trigger.isVisible()) {
        await trigger.click()
        
        // Wait for modal to appear
        await page.waitForTimeout(500)
        
        // Check if a modal/dialog is open
        const modal = page.locator('[role="dialog"], .modal, [data-modal-content]').first()
        
        if (await modal.count() > 0) {
          // Focus should be trapped in modal
          const focusableElements = await modal.locator('button, input, select, textarea, a[href]').all()
          
          if (focusableElements.length > 0) {
            // First focusable element should be focused
            await expect(focusableElements[0]).toBeFocused()
            
            // Test tab cycling
            await page.keyboard.press('Tab')
            if (focusableElements.length > 1) {
              await expect(focusableElements[1]).toBeFocused()
            }
          }
          
          // ESC should close modal
          await page.keyboard.press('Escape')
          await page.waitForTimeout(500)
          
          // Modal should be closed
          await expect(modal).not.toBeVisible()
        }
      }
    }
  })
})