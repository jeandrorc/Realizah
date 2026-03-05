import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('loads and shows hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText('Ver Cursos')).toBeVisible();
    await expect(page.getByText('Ver Planos')).toBeVisible();
  });

  test('shows header with navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Realizah' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Loja' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cursos' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Planos' })).toBeVisible();
  });

  test('shows footer', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toBeVisible();
  });

  test('navigates to products page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Loja' }).click();
    await expect(page).toHaveURL('/products');
  });

  test('navigates to courses page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Cursos' }).click();
    await expect(page).toHaveURL('/courses');
  });
});
