import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // Clear localStorage to get fresh seed data
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
})

test.describe('US1: Browse and Filter Claim List', () => {
  test('Test 1 — Cards render with correct data', async ({ page }) => {
    await page.goto('/claims')

    // Multiple cards should be visible
    const cards = page.locator('[data-testid="claim-card"]')
    await expect(cards.first()).toBeVisible()
    const count = await cards.count()
    expect(count).toBeGreaterThan(1)

    // Each card should contain key elements
    const firstCard = cards.first()
    // Patient name (prominent text)
    await expect(firstCard.locator('[data-testid="patient-name"]')).toBeVisible()
    // Period date range
    await expect(firstCard.locator('[data-testid="period-dates"]')).toBeVisible()
    // Payer
    await expect(firstCard.locator('[data-testid="payer-name"]')).toBeVisible()
    // Status badge
    await expect(firstCard.locator('.mantine-Badge-root')).toBeVisible()
    // Dollar amount
    await expect(firstCard.locator('[data-testid="amount"]')).toBeVisible()
    // Days in status
    await expect(firstCard.locator('[data-testid="days-in-status"]')).toBeVisible()
  })

  test('Test 2 — Filter by status', async ({ page }) => {
    await page.goto('/claims')

    // Click Filter button
    await page.getByRole('button', { name: 'Filter' }).click()

    // Select "Ready for Review" from status dropdown
    await page.getByRole('combobox', { name: 'Status' }).click()
    await page.getByRole('option', { name: 'Ready for Review' }).click()

    // URL should contain status param
    await expect(page).toHaveURL(/status=Ready/)

    // Only "Ready for Review" cards should be visible
    const badges = page.locator('[data-testid="claim-card"] .mantine-Badge-root')
    const badgeCount = await badges.count()
    expect(badgeCount).toBeGreaterThan(0)
    for (let i = 0; i < badgeCount; i++) {
      await expect(badges.nth(i)).toHaveText('Ready for Review')
    }

    // Close filter panel — chip should appear
    await page.getByRole('button', { name: 'Filter' }).click()
    await expect(page.locator('[data-testid="filter-chip"]').first()).toBeVisible()
  })

  test('Test 3 — Multiple filters', async ({ page }) => {
    await page.goto('/claims')

    await page.getByRole('button', { name: 'Filter' }).click()

    // Set status to Submitted
    await page.getByRole('combobox', { name: 'Status' }).click()
    await page.getByRole('option', { name: 'Submitted' }).click()

    // Type patient name "Garcia"
    await page.getByRole('textbox', { name: 'Patient' }).fill('Garcia')

    // URL should contain both params
    await expect(page).toHaveURL(/status=Submitted/)
    await expect(page).toHaveURL(/patient=Garcia/)

    // Only matching cards shown
    const cards = page.locator('[data-testid="claim-card"]')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)

    // All visible cards should have "Submitted" badge and patient name containing "Garcia"
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i).locator('.mantine-Badge-root')).toHaveText('Submitted')
      await expect(cards.nth(i).locator('[data-testid="patient-name"]')).toContainText('Garcia')
    }
  })

  test('Test 4 — Patient name search', async ({ page }) => {
    await page.goto('/claims')

    await page.getByRole('button', { name: 'Filter' }).click()
    await page.getByRole('textbox', { name: 'Patient' }).fill('Thompson')

    // Only Thompson cards shown
    const cards = page.locator('[data-testid="claim-card"]')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i).locator('[data-testid="patient-name"]')).toContainText('Thompson')
    }
  })

  test('Test 5 — Clear one filter', async ({ page }) => {
    await page.goto('/claims')

    // Apply two filters
    await page.getByRole('button', { name: 'Filter' }).click()
    await page.getByRole('combobox', { name: 'Status' }).click()
    await page.getByRole('option', { name: 'Submitted' }).click()
    await page.getByRole('textbox', { name: 'Patient' }).fill('Garcia')

    // Collapse filter panel
    await page.getByRole('button', { name: 'Filter' }).click()

    // Dismiss status chip
    const statusChip = page.locator('[data-testid="filter-chip"]').filter({ hasText: 'Submitted' })
    await statusChip.click()

    // Status param gone, patient still there
    await expect(page).not.toHaveURL(/status=/)
    await expect(page).toHaveURL(/patient=Garcia/)
  })

  test('Test 6 — Clear all filters', async ({ page }) => {
    await page.goto('/claims')

    // Apply filters
    await page.getByRole('button', { name: 'Filter' }).click()
    await page.getByRole('combobox', { name: 'Status' }).click()
    await page.getByRole('option', { name: 'Submitted' }).click()
    await page.getByRole('textbox', { name: 'Patient' }).fill('Garcia')

    // Click Clear All
    await page.getByRole('button', { name: 'Clear All' }).click()

    // URL should have no search params
    await expect(page).toHaveURL('/claims')

    // Full list restored
    const cards = page.locator('[data-testid="claim-card"]')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(10) // seed data has 18 claims
  })
})
