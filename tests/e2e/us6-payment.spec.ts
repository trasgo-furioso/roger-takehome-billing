import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
})

test.describe('US6: Post Payment', () => {
  test('Test 1 — Pay action visible', async ({ page }) => {
    await page.goto('/claims')

    const submittedCard = page.locator('[data-testid="claim-card"]').filter({ has: page.locator('.mantine-Badge-root', { hasText: 'Submitted' }) }).first()
    await expect(submittedCard).toBeVisible()
    await expect(submittedCard.getByRole('button', { name: 'Pay' })).toBeVisible()
  })

  test('Test 2 — Payment form expands', async ({ page }) => {
    await page.goto('/claims')

    const submittedCard = page.locator('[data-testid="claim-card"]').filter({ has: page.locator('.mantine-Badge-root', { hasText: 'Submitted' }) }).first()
    await submittedCard.getByRole('button', { name: 'Pay' }).click()

    // Payment fields should be visible
    await expect(submittedCard.getByLabel('Payment Amount')).toBeVisible()
    await expect(submittedCard.getByLabel('Contractual Adjustment')).toBeVisible()
    await expect(submittedCard.getByRole('button', { name: 'Confirm Payment' })).toBeVisible()
  })

  test('Test 3 — Confirm payment', async ({ page }) => {
    await page.goto('/claims')

    const submittedCard = page.locator('[data-testid="claim-card"]').filter({ has: page.locator('.mantine-Badge-root', { hasText: 'Submitted' }) }).first()
    const patientName = await submittedCard.locator('[data-testid="patient-name"]').textContent()

    // Click Pay
    await submittedCard.getByRole('button', { name: 'Pay' }).click()

    // Fill payment amount
    const paymentField = submittedCard.getByLabel('Payment Amount')
    await paymentField.clear()
    await paymentField.fill('3200')

    const adjField = submittedCard.getByLabel('Contractual Adjustment')
    await adjField.clear()
    await adjField.fill('642')

    // Confirm
    await submittedCard.getByRole('button', { name: 'Confirm Payment' }).click()

    // The card that was just paid should show Paid badge and remittance
    // Filter by patient name AND Paid badge to avoid picking up other cards for same patient
    const updatedCard = page.locator('[data-testid="claim-card"]')
      .filter({ hasText: patientName! })
      .filter({ has: page.locator('.mantine-Badge-root', { hasText: 'Paid' }) })
      .filter({ has: page.locator('[data-testid="remittance-summary"]') })
      .first()
    await expect(updatedCard).toBeVisible()
    await expect(updatedCard.locator('[data-testid="remittance-summary"]')).toContainText('$3,200.00')

    // Reload — persists
    await page.reload()
    const reloadedCard = page.locator('[data-testid="claim-card"]')
      .filter({ hasText: patientName! })
      .filter({ has: page.locator('[data-testid="remittance-summary"]') })
      .first()
    await expect(reloadedCard.locator('.mantine-Badge-root')).toHaveText('Paid')
  })
})
