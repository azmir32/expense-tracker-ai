import { test, expect } from '@playwright/test';

test.describe('Basic Functionality', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    
    // Check if page loads
    await expect(page).toHaveTitle(/Expense Tracker/);
    
    // Check if the main heading is visible (this is what we know works)
    await expect(page.getByText('Welcome to ExpenseTracker AI')).toBeVisible();
  });

  test('should display guest component when not authenticated', async ({ page }) => {
    await page.goto('/');
    
    // Check main heading
    await expect(page.getByText('Welcome to ExpenseTracker AI')).toBeVisible();
    
    // Check CTA button
    await expect(page.getByRole('button', { name: /get started free/i })).toBeVisible();
  });

  test('should have navigation elements', async ({ page }) => {
    await page.goto('/');
    
    // Check navbar exists
    await expect(page.locator('nav')).toBeVisible();
    
    // Check footer exists
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    await page.goto('/');
    
    // Test different viewport sizes
    const viewports = [
      { width: 1280, height: 720 }, // Desktop
      { width: 768, height: 1024 },  // Tablet
      { width: 375, height: 667 }    // Mobile
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await expect(page.getByText('Welcome to ExpenseTracker AI')).toBeVisible();
    }
  });
});
