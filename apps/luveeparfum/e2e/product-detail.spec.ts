import { test, expect } from '@playwright/test';

test.describe('Product Detail', () => {
  test('product detail page loads from products list', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByRole('heading', { name: 'PRODUTOS' })).toBeVisible();
    // Clica no primeiro produto (link ou card)
    const firstProductLink = page.locator('a[href^="/products/"]').first();
    if ((await firstProductLink.count()) > 0) {
      await firstProductLink.click();
      await expect(page).toHaveURL(/\/products\/.+/);
      await expect(page.locator('main')).toBeVisible();
    }
  });

  test('product detail has add to cart or buy button', async ({ page }) => {
    // Usa handle de mock (la-vie-en-rose-edp)
    await page.goto('/products/la-vie-en-rose-edp');
    const addButton = page.getByRole('button', {
      name: /adicionar ao carrinho|comprar agora/i,
    });
    await expect(addButton.first()).toBeVisible({ timeout: 10000 });
  });
});
