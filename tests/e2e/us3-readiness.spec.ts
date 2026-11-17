import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
})

test.describe('US3: Verify Claim Readiness', () => {
  test('Test 1 — Expand readiness checklist', async ({ page }) => {
    await page.goto('/claims')

    // Find the card that has the "Review" button (failing readiness)
    const reviewBtn = page.getByRole('button', { name: 'Review' })
    await expect(reviewBtn.first()).toBeVisible()

    // Get the parent card
    const card = page.locator('[data-testid="claim-card"]').filter({ has: page.getByRole('button', { name: 'Review' }) }).first()

    // Click Review
    await card.getByRole('button', { name: 'Review' }).click()

    // Checklist should expand with 7 visible items within this card
    const checklistItems = card.locator('[data-testid="readiness-item"]')
    await expect(checklistItems.first()).toBeVisible({ timeout: 2000 })
    const count = await checklistItems.count()
    expect(count).toBe(7)

    // Each item has a label and pass/fail indicator
    for (let i = 0; i < count; i++) {
      await expect(checklistItems.nth(i).locator('[data-testid="readiness-label"]')).toBeVisible()
      await expect(checklistItems.nth(i).locator('[data-testid="readiness-icon"]')).toBeVisible()
    }
  })

  test('Test 2 — All passing shows Submit', async ({ page }) => {
    await page.goto('/claims')

    // clm-001 and clm-002 have allPassing readiness — should show "Submit Claim"
    const submitButtons = page.getByRole('button', { name: 'Submit Claim' })
    await expect(submitButtons.first()).toBeVisible()
  })

  test('Test 3 — Failing shows Review', async ({ page }) => {
    await page.goto('/claims')

    // clm-003 has failing readiness — should show "Review"
    const reviewButtons = page.getByRole('button', { name: 'Review' })
    await expect(reviewButtons.first()).toBeVisible()
  })
})
