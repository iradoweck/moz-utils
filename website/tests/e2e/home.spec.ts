import { test, expect } from '@playwright/test';

test('homepage has correct title and renders simulators', async ({ page }) => {
  await page.goto('/');

  // Check the title of the website
  await expect(page).toHaveTitle(/moz-utils/i);

  // Check that the main hero heading is visible
  const heading = page.locator('h1').filter({ hasText: /moz-utils/i });
  await expect(heading).toBeVisible();

  // Make sure the simulator loads by checking for the input field with placeholder "..."
  await expect(page.getByPlaceholder('...').first()).toBeVisible();
});
