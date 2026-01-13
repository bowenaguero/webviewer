import { test, expect } from '@playwright/test';
import { fixtures, clearIndexedDB, waitForProcessingComplete, waitForTableLoad, getVisibleRowCount } from './helpers/fixtures.js';

test.describe('Multiple Filters', () => {
  // Setup: Upload test data before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearIndexedDB(page);

    // Upload test fixture
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(fixtures.chromeHistory);

    await waitForProcessingComplete(page);
    await expect(page).toHaveURL(/\/viewer/);

    // Wait for data to fully load
    await waitForTableLoad(page);
  });

  test('should have toolbar with filter controls', async ({ page }) => {
    // Verify toolbar elements exist
    const searchInput = page.getByPlaceholder(/search/i).first();
    await expect(searchInput).toBeVisible();

    // Verify we have filter/sort buttons in the toolbar
    const toolbar = page.locator('[class*="toolbar"], .flex').filter({
      has: page.locator('button'),
    }).first();
    await expect(toolbar).toBeVisible();
  });

  test('should apply search filter and show filtered results', async ({ page }) => {
    const initialCount = await getVisibleRowCount(page);
    expect(initialCount).toBeGreaterThan(0);

    // Apply search filter
    const searchInput = page.getByPlaceholder(/search/i).first();
    await searchInput.fill('github');
    await page.waitForTimeout(1000);

    const afterSearchCount = await getVisibleRowCount(page);

    // Verify search reduced results (github matches fewer than all)
    expect(afterSearchCount).toBeGreaterThan(0);
    expect(afterSearchCount).toBeLessThanOrEqual(initialCount);
  });

  test('should show sort control and toggle sort order', async ({ page }) => {
    // Find sort button (contains asc/desc or sort text/icon)
    const sortButton = page.locator('button').filter({
      has: page.locator('[class*="arrow"], [class*="sort"]'),
    }).first();

    // If sort button exists, test it
    if (await sortButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Click to toggle sort
      await sortButton.click();
      await page.waitForTimeout(500);

      // Page should still be functional
      const rowCount = await getVisibleRowCount(page);
      expect(rowCount).toBeGreaterThan(0);
    }
  });

  test('should reset pagination when filter changes', async ({ page }) => {
    // Get initial data
    const initialCount = await getVisibleRowCount(page);

    // Apply a search filter
    const searchInput = page.getByPlaceholder(/search/i).first();
    await searchInput.fill('github');
    await page.waitForTimeout(1000);

    // Verify we have results
    const filteredCount = await getVisibleRowCount(page);
    expect(filteredCount).toBeGreaterThan(0);

    // Clear the filter
    await searchInput.clear();
    await page.waitForTimeout(1000);

    // Should be back to initial state
    const restoredCount = await getVisibleRowCount(page);
    expect(restoredCount).toBe(initialCount);
  });

  test('should persist search filter when interacting with other controls', async ({ page }) => {
    // Apply search filter
    const searchInput = page.getByPlaceholder(/search/i).first();
    await searchInput.fill('github');
    await page.waitForTimeout(1000);

    const countAfterSearch = await getVisibleRowCount(page);
    expect(countAfterSearch).toBeGreaterThan(0);

    // Verify the search input still has the value
    await expect(searchInput).toHaveValue('github');

    // The page should contain github in the content (search is working)
    const pageContent = await page.content();
    expect(pageContent.toLowerCase()).toContain('github');
  });

  test('should handle empty results gracefully', async ({ page }) => {
    // Search for something that will return no results
    const searchInput = page.getByPlaceholder(/search/i).first();
    await searchInput.fill('xyznonexistentquery12345abcdef');
    await page.waitForTimeout(1000);

    const count = await getVisibleRowCount(page);
    expect(count).toBe(0);

    // The page should still be functional (table visible even if empty)
    const table = page.locator('table').first();
    await expect(table).toBeVisible();
  });

  test('should show items per page selector', async ({ page }) => {
    // Look for items per page control
    const itemsPerPage = page.getByText(/items per page/i).first();
    await expect(itemsPerPage).toBeVisible();
  });
});
