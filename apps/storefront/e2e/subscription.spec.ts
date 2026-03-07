import { test, expect } from '@playwright/test';

test.describe('Subscription / Planos', () => {
  test('subscription redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/subscription');
    await expect(page).toHaveURL(/\/login/);
  });
});
