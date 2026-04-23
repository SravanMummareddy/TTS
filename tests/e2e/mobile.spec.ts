import { expect, test } from '@playwright/test'

test('login page renders correctly on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/login')
  
  await expect(page.getByText('Welcome back')).toBeVisible()
  await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
  await expect(page.getByPlaceholder('••••••••')).toBeVisible()
  await expect(page.getByRole('button', { name: /Enter My System/i })).toBeVisible()
})

test('dashboard renders correctly on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/dashboard')
  
  await expect(page.getByText(/Good morning/)).toBeVisible()
  await expect(page.getByText('Fasting', { exact: true }).first()).toBeVisible()
  await expect(page.getByText('Steps', { exact: true }).first()).toBeVisible()
})

test('bottom navigation is visible on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/dashboard')
  
  const nav = page.locator('nav').last()
  await expect(nav.getByText('Home')).toBeVisible()
  await expect(nav.getByText('Tasks')).toBeVisible()
  await expect(nav.getByText('Routines')).toBeVisible()
  await expect(nav.getByText('Journal')).toBeVisible()
  await expect(nav.getByText('Settings')).toBeVisible()
})