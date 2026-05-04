import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('loads and shows hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('link', { name: /explorar aromas/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /ver kits/i })).toBeVisible();
  });

  test('shows header with navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /luvée parfum/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /sabonetes/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /velas/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /perfumes/i })).toBeVisible();
  });

  test('shows footer', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toBeVisible();
  });

  test('navigates to products page', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveURL('/products');
    await expect(page.locator('main')).toBeVisible();
  });

  test('navigates to courses page', async ({ page }) => {
    await page.goto('/courses');
    await expect(page).toHaveURL('/courses');
    await expect(page.locator('main')).toBeVisible();
  });
});
