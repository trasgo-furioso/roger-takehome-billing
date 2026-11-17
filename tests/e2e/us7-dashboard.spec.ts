import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
})

test.describe('US7: Billing Dashboard', () => {
  test('Test 1 — Tiles render', async ({ page }) => {
    await page.goto('/')

    // Status tiles
    for (const status of ['Ready for Review', 'Submitted', 'Rejected', 'Denied', 'Paid']) {
      await expect(page.locator('[data-testid="summary-tile"]', { hasText: status })).toBeVisible()
    }

    // Aging tiles
    for (const bucket of ['0-30', '31-60', '61-90', '90+']) {
      await expect(page.locator('[data-testid="summary-tile"]', { hasText: bucket })).toBeVisible()
    }

    // Each tile shows a count and dollar amount
    const firstTile = page.locator('[data-testid="summary-tile"]').first()
    await expect(firstTile.locator('[data-testid="tile-count"]')).toBeVisible()
    await expect(firstTile.locator('[data-testid="tile-total"]')).toBeVisible()
  })

  test('Test 2 — Tile navigation', async ({ page }) => {
    await page.goto('/')

    // Click Rejected tile
    await page.locator('[data-testid="summary-tile"]', { hasText: 'Rejected' }).click()
    await expect(page).toHaveURL(/status=Rejected/)

    // Only rejected claims shown — check each card has "Rejected" in its first badge
    const cards = page.locator('[data-testid="claim-card"]')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i).locator('.mantine-Badge-root').first()).toHaveText('Rejected')
    }

    // Go back to dashboard
    await page.goto('/')

    // Click 31-60 aging tile
    await page.locator('[data-testid="summary-tile"]', { hasText: '31-60' }).click()
    await expect(page).toHaveURL(/aging=31-60/)
  })
})
