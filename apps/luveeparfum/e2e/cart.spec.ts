import { test, expect } from '@playwright/test';

test.describe('Cart', () => {
  test('cart page shows empty state when no items', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.getByRole('heading', { name: /carrinho vazio/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /explorar produtos/i })).toBeVisible();
  });

  test('cart page has correct structure when empty', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.getByText(/você ainda não adicionou nenhum produto/i)).toBeVisible();
  });

  test('empty cart link navigates to products', async ({ page }) => {
    await page.goto('/cart');
    await page.getByRole('link', { name: /explorar produtos/i }).click();
    await expect(page).toHaveURL('/products');
  });
});
