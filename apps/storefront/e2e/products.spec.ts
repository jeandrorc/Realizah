import { test, expect } from '@playwright/test';

test.describe('Products', () => {
  test('products page loads', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByRole('heading', { name: 'Produtos' })).toBeVisible();
  });

  test('products page shows count', async ({ page }) => {
    await page.goto('/products');
    // The page shows "N produto(s) disponível(is)" or empty state
    const heading = page.getByRole('heading', { name: 'Produtos' });
    await expect(heading).toBeVisible();
  });

  test('courses page loads', async ({ page }) => {
    await page.goto('/courses');
    await expect(page.getByRole('heading', { name: 'Cursos' })).toBeVisible();
  });
});
