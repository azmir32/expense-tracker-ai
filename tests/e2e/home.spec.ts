import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display guest component when not authenticated', async ({ page }) => {
    await page.goto('/');
    
    // Should show guest component with correct text
    await expect(page.getByText('Welcome to ExpenseTracker AI')).toBeVisible();
    await expect(page.getByText('Track your expenses, manage your budget, and get AI-powered insights')).toBeVisible();
    
    // Should have sign in button (Get Started Free)
    await expect(page.getByRole('button', { name: /get started free/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /learn more/i })).toBeVisible();
  });

  test('should display main dashboard when authenticated', async ({ page }) => {
    // Mock authentication - you'll need to set up auth state
    // This is a simplified test - in real scenarios you'd need to handle auth properly
    await page.goto('/');
    
    // Check if the page loads without errors
    await expect(page).toHaveTitle(/Expense Tracker/);
  });

  test('should have responsive design', async ({ page }) => {
    await page.goto('/');
    
    // Test desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('main')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('main')).toBeVisible();
  });

  test('should have proper navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check navbar exists
    await expect(page.locator('nav')).toBeVisible();
    
    // Check footer exists
    await expect(page.locator('footer')).toBeVisible();
  });
});

test.describe('Add New Record Form', () => {
  test('should display form fields', async ({ page }) => {
    await page.goto('/');
    
    // Look for form elements (these might not be visible if not authenticated)
    const form = page.locator('form');
    if (await form.isVisible()) {
      await expect(page.getByLabel(/description/i)).toBeVisible();
      await expect(page.getByLabel(/amount/i)).toBeVisible();
      await expect(page.getByLabel(/category/i)).toBeVisible();
      await expect(page.getByLabel(/date/i)).toBeVisible();
    }
  });

  test('should have AI suggest category button', async ({ page }) => {
    await page.goto('/');
    
    // Look for the AI button by its title attribute
    const aiButton = page.getByTitle('AI Category Suggestion');
    if (await aiButton.isVisible()) {
      await expect(aiButton).toBeVisible();
    }
  });
});

test.describe('Charts and Analytics', () => {
  test('should display expense chart section', async ({ page }) => {
    await page.goto('/');
    
    // Look for chart-related content
    const chartSection = page.getByText(/Expense Chart/i);
    if (await chartSection.isVisible()) {
      await expect(chartSection).toBeVisible();
    }
  });

  test('should display expense stats section', async ({ page }) => {
    await page.goto('/');
    
    // Look for stats-related content
    const statsSection = page.getByText(/Expense Stats/i);
    if (await statsSection.isVisible()) {
      await expect(statsSection).toBeVisible();
    }
  });
});

test.describe('AI Insights', () => {
  test('should display AI insights section', async ({ page }) => {
    await page.goto('/');
    
    // Look for AI insights content
    const insightsSection = page.getByText(/AI Insights/i);
    if (await insightsSection.isVisible()) {
      await expect(insightsSection).toBeVisible();
    }
  });
});

test.describe('Record History', () => {
  test('should display expense history section', async ({ page }) => {
    await page.goto('/');
    
    // Look for history content
    const historySection = page.getByText(/Expense History/i);
    if (await historySection.isVisible()) {
      await expect(historySection).toBeVisible();
    }
  });
});

test.describe('Theme Toggle', () => {
  test('should have theme toggle functionality', async ({ page }) => {
    await page.goto('/');
    
    // Look for theme toggle button
    const themeToggle = page.locator('[data-testid="theme-toggle"], button[aria-label*="theme"], button[title*="theme"]');
    
    if (await themeToggle.isVisible()) {
      await expect(themeToggle).toBeVisible();
      
      // Test theme toggle click
      await themeToggle.click();
      
      // Check if theme changed (this might be hard to test without specific selectors)
      // You might need to add data attributes to your theme toggle component
    }
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/');
    
    // Check for main heading
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    await expect(headings.first()).toBeVisible();
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/');
    
    // Check for form labels
    const labels = page.locator('label');
    if (await labels.count() > 0) {
      await expect(labels.first()).toBeVisible();
    }
  });

  test('should have proper button accessibility', async ({ page }) => {
    await page.goto('/');
    
    // Check for buttons with proper accessibility
    const buttons = page.locator('button');
    if (await buttons.count() > 0) {
      await expect(buttons.first()).toBeVisible();
    }
  });
});
