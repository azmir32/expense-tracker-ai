import { test as base } from '@playwright/test';

// Extend the test type to include authentication state
export const test = base.extend({
  // Authenticated state
  authenticatedPage: async ({ page }, use) => {
    // This would be where you set up authentication state
    // For now, we'll just use the regular page
    // In a real scenario, you might:
    // 1. Set up auth cookies
    // 2. Mock authentication
    // 3. Use test user credentials
    
    await use(page);
  },
  
  // Guest state (not authenticated)
  guestPage: async ({ page }, use) => {
    // Ensure we're not authenticated by clearing any auth state
    await page.context().clearCookies();
    await use(page);
  },
});

export { expect } from '@playwright/test';
