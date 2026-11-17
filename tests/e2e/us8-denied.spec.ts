import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
})

test.describe('US8: Manage Denied Claims', () => {
  test('Test 1 — Denial info display', async ({ page }) => {
    await page.goto('/claims')

    const deniedCard = page.locator('[data-testid="claim-card"]').filter({ has: page.locator('.mantine-Badge-root', { hasText: 'Denied' }) }).first()
    await expect(deniedCard).toBeVisible()

    // Shows denial info
    await expect(deniedCard.locator('[data-testid="denial-reason"]')).toBeVisible()

    // Two action buttons
    await expect(deniedCard.getByRole('button', { name: 'Appeal' })).toBeVisible()
    await expect(deniedCard.getByRole('button', { name: 'Write Off' })).toBeVisible()
  })

  test('Test 2 — Appeal navigates', async ({ page }) => {
    await page.goto('/claims')

    const deniedCard = page.locator('[data-testid="claim-card"]').filter({ has: page.locator('.mantine-Badge-root', { hasText: 'Denied' }) }).first()
    await deniedCard.getByRole('button', { name: 'Appeal' }).click()

    await expect(page).toHaveURL(/\/claims\/clm-/)
  })

  test('Test 3 — Write Off', async ({ page }) => {
    await page.goto('/claims')

    // Find second denied card to avoid the one we might Appeal
    const deniedCards = page.locator('[data-testid="claim-card"]').filter({ has: page.locator('.mantine-Badge-root', { hasText: 'Denied' }) })
    const targetCard = deniedCards.last()
    const patientName = await targetCard.locator('[data-testid="patient-name"]').textContent()

    await targetCard.getByRole('button', { name: 'Write Off' }).click()

    // Status should change to Written Off
    const updatedCard = page.locator('[data-testid="claim-card"]').filter({ hasText: patientName! }).filter({ has: page.locator('.mantine-Badge-root', { hasText: 'Written Off' }) }).first()
    await expect(updatedCard).toBeVisible()

    // Reload — persists
    await page.reload()
    const reloaded = page.locator('[data-testid="claim-card"]').filter({ hasText: patientName! }).filter({ has: page.locator('.mantine-Badge-root', { hasText: 'Written Off' }) })
    await expect(reloaded.first()).toBeVisible()
  })
})
