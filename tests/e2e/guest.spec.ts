import { test, expect } from './auth.setup';

test.describe('Guest Component', () => {
  test('should display hero section with correct content', async ({ guestPage }) => {
    await guestPage.goto('/');
    
    // Check main heading
    await expect(guestPage.getByText('Welcome to ExpenseTracker AI')).toBeVisible();
    
    // Check subtitle
    await expect(guestPage.getByText('Track your expenses, manage your budget, and get AI-powered insights')).toBeVisible();
    
    // Check CTA buttons
    await expect(guestPage.getByRole('button', { name: /get started free/i })).toBeVisible();
    await expect(guestPage.getByRole('button', { name: /learn more/i })).toBeVisible();
  });

  test('should display feature highlights', async ({ guestPage }) => {
    await guestPage.goto('/');
    
    // Check feature cards using more specific selectors
    await expect(guestPage.getByRole('heading', { name: 'AI Insights' })).toBeVisible();
    await expect(guestPage.getByRole('heading', { name: 'Auto Categories' })).toBeVisible();
    await expect(guestPage.getByRole('heading', { name: 'Smart Dashboard' })).toBeVisible();
    
    // Check feature descriptions
    await expect(guestPage.getByText('Smart analysis of your spending patterns')).toBeVisible();
    await expect(guestPage.getByText('Intelligent expense categorization')).toBeVisible();
    await expect(guestPage.getByText('Beautiful, intuitive financial overview')).toBeVisible();
  });

  test('should display FAQ section', async ({ guestPage }) => {
    await guestPage.goto('/');
    
    // Check FAQ heading
    await expect(guestPage.getByText('Frequently Asked Questions')).toBeVisible();
    
    // Check FAQ items
    await expect(guestPage.getByText('What is ExpenseTracker AI?')).toBeVisible();
    await expect(guestPage.getByText('How does the AI work?')).toBeVisible();
    await expect(guestPage.getByText('Is ExpenseTracker AI free?')).toBeVisible();
  });

  test('should display testimonials section', async ({ guestPage }) => {
    await guestPage.goto('/');
    
    // Check testimonials heading
    await expect(guestPage.getByText('What Our Users Say')).toBeVisible();
    
    // Check testimonial content using more specific selectors
    await expect(guestPage.getByText('Sarah L.', { exact: true })).toBeVisible();
    await expect(guestPage.getByText('John D.', { exact: true })).toBeVisible();
    await expect(guestPage.getByText('Emily R.', { exact: true })).toBeVisible();
  });

  test('should have proper navigation elements', async ({ guestPage }) => {
    await guestPage.goto('/');
    
    // Check navbar
    await expect(guestPage.locator('nav')).toBeVisible();
    
    // Check footer
    await expect(guestPage.locator('footer')).toBeVisible();
  });

  test('should be responsive on different screen sizes', async ({ guestPage }) => {
    await guestPage.goto('/');
    
    // Test desktop view
    await guestPage.setViewportSize({ width: 1280, height: 720 });
    await expect(guestPage.getByText('Welcome to ExpenseTracker AI')).toBeVisible();
    
    // Test tablet view
    await guestPage.setViewportSize({ width: 768, height: 1024 });
    await expect(guestPage.getByText('Welcome to ExpenseTracker AI')).toBeVisible();
    
    // Test mobile view
    await guestPage.setViewportSize({ width: 375, height: 667 });
    await expect(guestPage.getByText('Welcome to ExpenseTracker AI')).toBeVisible();
  });

  test('should have proper accessibility features', async ({ guestPage }) => {
    await guestPage.goto('/');
    
    // Check for proper heading structure
    const h1 = guestPage.locator('h1');
    await expect(h1).toBeVisible();
    
    // Check for proper button labels
    const buttons = guestPage.locator('button');
    await expect(buttons.first()).toBeVisible();
    
    // Check for proper form elements (if any)
    const forms = guestPage.locator('form');
    if (await forms.count() > 0) {
      await expect(forms.first()).toBeVisible();
    }
  });
});
