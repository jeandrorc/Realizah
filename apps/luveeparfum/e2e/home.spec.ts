import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('loads and shows hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(
      page.locator('main').getByRole('link', { name: /explorar aromas/i }),
    ).toBeVisible();
    await expect(page.locator('main').getByRole('link', { name: /ver kits/i })).toBeVisible();
  });

  test('shows header with brand logo', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('header').getByText(/luvée parfum/i)).toBeVisible();
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
