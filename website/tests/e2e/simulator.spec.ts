import { test, expect } from '@playwright/test';

test.describe('Unified Simulator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('validates NUIT correctly', async ({ page }) => {
    const input = page.getByPlaceholder('...').first();
    await input.fill('401626638');
    await expect(page.locator('text=Válido')).toBeVisible();
  });

  test('validates BI correctly', async ({ page }) => {
    // switch to BI tab
    await page.getByRole('button', { name: 'B.I' }).click();
    const input = page.getByPlaceholder('...').first();
    await input.fill('110101234567A');
    await expect(page.locator('text=Válido')).toBeVisible();
  });

  test('validates Phone number correctly', async ({ page }) => {
    // switch to Phone tab (Outros -> Telefone)
    await page.getByRole('button', { name: 'Outros' }).click();
    await page.getByRole('button', { name: 'Telefone' }).click();
    const input = page.getByPlaceholder('...').first();
    await input.fill('841234567');
    await expect(page.locator('text=Vodacom')).toBeVisible();
  });

  test('formats Currency correctly', async ({ page }) => {
    await page.getByRole('button', { name: 'Outros' }).click();
    await page.getByRole('button', { name: 'Moeda' }).click();
    const input = page.getByPlaceholder('...').first();
    await input.fill('1500');
    await expect(page.locator('text=1 500,00 MT')).toBeVisible();
  });
});
