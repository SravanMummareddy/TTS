import { execSync } from 'node:child_process'
import { expect, test, type Page } from '@playwright/test'

function reseedFixtures() {
  execSync('npm run seed', {
    stdio: 'ignore',
    env: process.env,
  })
}

async function openLibrary(page: Page) {
  await expect(page.getByText('Loading...')).toHaveCount(0, { timeout: 20_000 })
  const mobileTab = page.getByTestId('mobile-tab-library')
  if (await mobileTab.count()) {
    await mobileTab.click()
    return
  }

  await page.getByTestId('sidebar-tab-library').click()
}

async function openHistory(page: Page) {
  await expect(page.getByText('Loading...')).toHaveCount(0, { timeout: 20_000 })
  const mobileTab = page.getByTestId('mobile-tab-calendar')
  if (await mobileTab.count()) {
    await mobileTab.click()
    return
  }

  await page.getByTestId('sidebar-tab-calendar').click()
}

test.beforeEach(async ({ page }) => {
  reseedFixtures()
  await page.goto('/routines')
  await expect(page.getByText('Loading...')).toHaveCount(0, { timeout: 20_000 })
  await expect(page.getByText('Morning Reset')).toBeVisible()
})

test('seeded routines render in today and history views', async ({ page }) => {
  await expect(page.getByText('Morning Reset')).toBeVisible()
  await expect(page.getByText('Training Split QA')).toBeVisible()

  await openHistory(page)

  await expect(page.getByText('Last 14 Days')).toBeVisible()
  await expect(page.getByText('complete')).toBeVisible()
  await expect(page.getByText('skipped')).toBeVisible()
  await expect(page.getByText('Evening Shutdown')).toBeVisible()
})

test('today flow updates progress and supports skip plus restore', async ({ page }) => {
  const morningCard = page.locator('[data-testid^="today-routine-"]').filter({ hasText: 'Morning Reset' }).first()
  await expect(morningCard).toContainText('0/3 required')

  await morningCard.click()
  await morningCard.locator('[data-testid^="routine-item-"]').first().click()
  await expect(morningCard).toContainText('1/3 required')

  const skipButton = morningCard.getByRole('button', { name: 'Skip' })
  await skipButton.click()
  await expect(morningCard.getByRole('button', { name: 'Restore' })).toBeVisible()

  await morningCard.getByRole('button', { name: 'Restore' }).click()
  await expect(morningCard.getByRole('button', { name: 'Skip' })).toBeVisible()
})

test('library create, edit, and delete flows persist after reload', async ({ page }) => {
  await openLibrary(page)

  await page.getByTestId('library-new-routine').click()
  await expect(page.getByTestId('routine-modal')).toBeVisible()

  await page.getByTestId('routine-name-input').fill('QA Flow Routine')
  await page.getByPlaceholder('Add a step...').first().fill('Step one')
  await page.getByRole('button', { name: 'Add' }).first().click()
  await page.getByTestId('routine-save').click()
  await expect(page.getByTestId('routine-modal')).toHaveCount(0)

  const createdCard = page.locator('[data-testid^="library-routine-"]').filter({ hasText: 'QA Flow Routine' }).first()
  await expect(createdCard).toBeVisible()

  await createdCard.getByRole('button', { name: 'Edit' }).click()
  await page.getByTestId('routine-name-input').fill('QA Flow Routine Updated')
  await page.getByPlaceholder('Add a step...').first().fill('Step two')
  await page.getByRole('button', { name: 'Add' }).first().click()
  await page.getByTestId('routine-save').click()
  await expect(page.getByTestId('routine-modal')).toHaveCount(0)
  await expect(page.locator('[data-testid^="library-routine-"]').filter({ hasText: 'QA Flow Routine Updated' }).first()).toBeVisible()

  await page.reload()
  await openLibrary(page)

  const updatedCard = page.locator('[data-testid^="library-routine-"]').filter({ hasText: 'QA Flow Routine Updated' }).first()
  await expect(updatedCard).toBeVisible()
  await expect(updatedCard).toContainText('2 steps')

  await updatedCard.getByRole('button', { name: 'Edit' }).click()
  await expect(page.getByTestId('routine-delete')).toBeVisible()
  await page.getByTestId('routine-delete').click()

  await expect(page.getByText('QA Flow Routine Updated')).toHaveCount(0)
})

test('editing a seeded routine persists variant and step changes after reload', async ({ page }) => {
  await openLibrary(page)

  const card = page.locator('[data-testid^="library-routine-"]').filter({ hasText: 'Training Split QA' }).first()
  await card.getByRole('button', { name: 'Edit' }).click()

  await page.getByTestId('routine-name-input').fill('Training Split QA Updated')
  const conditioningVariant = page.getByTestId('routine-variant-1')
  await expect(conditioningVariant).toBeVisible()
  await conditioningVariant.getByPlaceholder('Label (optional, e.g. Heavy Day)').fill('Conditioning Updated')
  await conditioningVariant.getByPlaceholder('Add a step...').fill('Tempo drills')
  await conditioningVariant.getByRole('button', { name: 'Add' }).click()

  await page.getByTestId('routine-save').click()
  await expect(page.getByTestId('routine-modal')).toHaveCount(0)
  await expect(page.locator('[data-testid^="library-routine-"]').filter({ hasText: 'Training Split QA Updated' }).first()).toBeVisible()

  await page.reload()
  await openLibrary(page)

  const updatedCard = page.locator('[data-testid^="library-routine-"]').filter({ hasText: 'Training Split QA Updated' }).first()
  await expect(updatedCard).toBeVisible()
  await updatedCard.getByRole('button', { name: 'Edit' }).click()

  await expect(page.locator('input[value="Conditioning Updated"]')).toBeVisible()
  await expect(page.getByText('Tempo drills')).toBeVisible()
})

test('mobile modal keeps save and cancel reachable above the bottom nav', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes('mobile'), 'mobile viewport only')

  await openLibrary(page)
  await page.getByTestId('library-new-routine').click()

  const modal = page.getByTestId('routine-modal')
  await expect(modal).toBeVisible()
  await expect(page.getByTestId('routine-save')).toBeVisible()
  await expect(page.getByTestId('routine-cancel')).toBeVisible()

  await page.getByTestId('routine-name-input').fill('Mobile Modal Check')
  await page.getByTestId('routine-save').scrollIntoViewIfNeeded()
  await page.getByTestId('routine-save').click()

  await expect(page.getByTestId('routine-modal')).toHaveCount(0)
})
