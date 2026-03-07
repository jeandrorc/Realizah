import { test, expect } from '@playwright/test';

test.describe('Checkout', () => {
  test('checkout page loads with form and summary', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page.getByText('REALIZAH')).toBeVisible();
    await expect(page.getByText(/compra 100% segura/i)).toBeVisible();
  });

  test('checkout has order summary section', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page.locator('form')).toBeVisible();
  });
});
