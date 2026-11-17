import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
})

test.describe('US4: Submit Claim to Payer', () => {
  test('Test 1 — Submit from card', async ({ page }) => {
    await page.goto('/claims')

    // Find "Submit Claim" button (all-passing Ready for Review card)
    const submitBtn = page.getByRole('button', { name: 'Submit Claim' }).first()
    await expect(submitBtn).toBeVisible()

    // Get the parent card to track it
    const card = page.locator('[data-testid="claim-card"]').filter({ has: page.getByRole('button', { name: 'Submit Claim' }) }).first()
    const patientName = await card.locator('[data-testid="patient-name"]').textContent()

    // Click Submit
    await submitBtn.click()

    // Card badge should now say "Submitted"
    const updatedCard = page.locator('[data-testid="claim-card"]').filter({ hasText: patientName! }).first()
    await expect(updatedCard.locator('.mantine-Badge-root')).toHaveText('Submitted')

    // Submit button no longer present on this card
    await expect(updatedCard.getByRole('button', { name: 'Submit Claim' })).not.toBeVisible()

    // Reload — status persists
    await page.reload()
    const reloadedCard = page.locator('[data-testid="claim-card"]').filter({ hasText: patientName! }).first()
    await expect(reloadedCard.locator('.mantine-Badge-root')).toHaveText('Submitted')
  })
})
