import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
})

test.describe('US2: View and Edit Claim Detail', () => {
  test('Test 1 — Navigate to detail', async ({ page }) => {
    await page.goto('/claims')

    // Click first claim card
    const firstCard = page.locator('[data-testid="claim-card"]').first()
    await firstCard.click()

    // URL should match /claims/<id>
    await expect(page).toHaveURL(/\/claims\/clm-/)

    // Content header with back button and patient name
    await expect(page.getByRole('link', { name: 'Back to Claims' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible()

    // Sections visible
    await expect(page.getByText('Patient Information')).toBeVisible()
    await expect(page.getByText('Diagnoses')).toBeVisible()
    await expect(page.getByText('Service Lines')).toBeVisible()
    await expect(page.getByText('Payer & Provider')).toBeVisible()
  })

  test('Test 2 — Auto-save with notification', async ({ page }) => {
    await page.goto('/claims')

    // Click first claim card
    await page.locator('[data-testid="claim-card"]').first().click()
    await expect(page).toHaveURL(/\/claims\/clm-/)

    // Find NPI field and change it
    const npiField = page.getByLabel('Attending Physician NPI')
    await npiField.clear()
    await npiField.fill('9999999999')

    // Wait for debounce + notification
    await expect(page.getByText('Saved')).toBeVisible({ timeout: 3000 })

    // Reload and verify persistence
    await page.reload()
    await expect(page.getByLabel('Attending Physician NPI')).toHaveValue('9999999999')
  })

  test('Test 3 — Diagnoses with descriptions', async ({ page }) => {
    await page.goto('/claims')

    // Click first claim card
    await page.locator('[data-testid="claim-card"]').first().click()
    await expect(page).toHaveURL(/\/claims\/clm-/)

    // Check diagnoses section has ICD-10 codes and descriptions
    const diagSection = page.locator('[data-testid="diagnoses-section"]')
    await expect(diagSection).toBeVisible()

    // First diagnosis should show code and description
    const firstDiag = diagSection.locator('[data-testid="diagnosis-row"]').first()
    await expect(firstDiag.locator('[data-testid="icd10-code"]')).toBeVisible()
    await expect(firstDiag.locator('[data-testid="icd10-description"]')).toBeVisible()
  })
})
