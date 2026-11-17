import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
})

test.describe('US5: Handle Rejected Claims', () => {
  test('Test 1 — Rejection reason display', async ({ page }) => {
    await page.goto('/claims')

    // Find a Rejected card
    const rejectedCard = page.locator('[data-testid="claim-card"]').filter({ has: page.locator('.mantine-Badge-root', { hasText: 'Rejected' }) }).first()
    await expect(rejectedCard).toBeVisible()

    // Shows rejection reason
    await expect(rejectedCard.locator('[data-testid="rejection-reason"]')).toBeVisible()

    // Has Fix button
    await expect(rejectedCard.getByRole('button', { name: 'Fix' })).toBeVisible()
  })

  test('Test 2 — Fix navigates to detail', async ({ page }) => {
    await page.goto('/claims')

    const rejectedCard = page.locator('[data-testid="claim-card"]').filter({ has: page.locator('.mantine-Badge-root', { hasText: 'Rejected' }) }).first()
    await rejectedCard.getByRole('button', { name: 'Fix' }).click()

    // Should navigate to detail page
    await expect(page).toHaveURL(/\/claims\/clm-/)
  })

  test('Test 3 — Resubmit after correction', async ({ page }) => {
    await page.goto('/claims')

    // Find a rejected card with all-passing readiness (clm-008, clm-009, clm-010 all have allPassing)
    const rejectedCard = page.locator('[data-testid="claim-card"]').filter({ has: page.locator('.mantine-Badge-root', { hasText: 'Rejected' }) }).first()
    const patientName = await rejectedCard.locator('[data-testid="patient-name"]').textContent()

    // Click Fix to go to detail
    await rejectedCard.getByRole('button', { name: 'Fix' }).click()
    await expect(page).toHaveURL(/\/claims\/clm-/)

    // Header should show "Resubmit Claim" button (all readiness passing)
    const resubmitBtn = page.getByRole('button', { name: 'Resubmit Claim' })
    await expect(resubmitBtn).toBeVisible()

    // Click Resubmit
    await resubmitBtn.click()

    // Should navigate back to claims
    await expect(page).toHaveURL('/claims')

    // Find the card — should now be Submitted
    const updatedCard = page.locator('[data-testid="claim-card"]').filter({ hasText: patientName! }).first()
    await expect(updatedCard.locator('.mantine-Badge-root')).toHaveText('Submitted')
  })
})
