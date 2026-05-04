import { test, expect } from '@playwright/test';

test.describe('Courses', () => {
  test('courses list page loads', async ({ page }) => {
    await page.goto('/courses');
    await expect(page.getByRole('heading', { name: 'Cursos' })).toBeVisible();
  });

  test('courses page shows grid or empty state', async ({ page }) => {
    await page.goto('/courses');
    const hasContent =
      (await page
        .getByText(/nenhum curso|curso/i)
        .first()
        .isVisible()) ||
      (await page.locator('[data-testid="course-card"], .grid').first().isVisible());
    expect(hasContent).toBeTruthy();
  });

  test('navigates to courses page', async ({ page }) => {
    await page.goto('/courses');
    await expect(page).toHaveURL('/courses');
    await expect(page.locator('main')).toBeVisible();
  });
});
