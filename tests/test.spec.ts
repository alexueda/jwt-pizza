import { test, expect } from '@playwright/test';

test('home page', async ({ page }) => {
    await page.goto('/');
  
    expect(await page.title()).toBe('JWT Pizza');
  });

  test('login', async ({ page }) => {
    await page.goto('chrome-error://chromewebdata/');
  });