import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
})

test.describe('US9: Claim Lifecycle Timeline', () => {
  test('Test 1 — Timeline renders', async ({ page }) => {
    // Navigate to a claim with timeline events
    await page.goto('/claims/clm-004') // Submitted claim with timeline

    await expect(page.getByText('Claim Timeline')).toBeVisible()
    const timelineItems = page.locator('[data-testid="timeline-entry"]')
    await expect(timelineItems.first()).toBeVisible()
    const count = await timelineItems.count()
    expect(count).toBeGreaterThan(0)
  })

  test('Test 2 — Submitted entry', async ({ page }) => {
    await page.goto('/claims/clm-004') // Has Submitted event

    const entries = page.locator('[data-testid="timeline-entry"]')
    await expect(entries.filter({ hasText: 'Submitted' }).first()).toBeVisible()
  })

  test('Test 3 — Rejected entry with reason', async ({ page }) => {
    await page.goto('/claims/clm-008') // Rejected claim

    const entries = page.locator('[data-testid="timeline-entry"]')
    const rejectedEntry = entries.filter({ hasText: 'Rejected' }).first()
    await expect(rejectedEntry).toBeVisible()
    // Should include rejection reason text
    await expect(rejectedEntry).toContainText(/NPI|Duplicate|invalid/i)
  })

  test('Test 4 — Paid entry with amount', async ({ page }) => {
    await page.goto('/claims/clm-013') // Paid claim

    const entries = page.locator('[data-testid="timeline-entry"]')
    const paidEntry = entries.filter({ hasText: 'Paid' }).first()
    await expect(paidEntry).toBeVisible()
    await expect(paidEntry).toContainText('$')
  })

  test('Test 5 — Resubmission after rejection', async ({ page }) => {
    await page.goto('/claims/clm-016') // Has rejected → resubmitted → paid timeline

    const entries = page.locator('[data-testid="timeline-entry"]')
    // Both Rejected and Resubmitted should appear
    await expect(entries.filter({ hasText: 'Rejected' }).first()).toBeVisible()
    await expect(entries.filter({ hasText: 'Resubmitted' }).first()).toBeVisible()
  })
})
