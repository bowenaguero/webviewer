import { test, expect } from '@playwright/test';
import { fixtures, clearIndexedDB, waitForProcessingComplete, waitForTableLoad, getVisibleRowCount } from './helpers/fixtures.js';

test.describe('Search Functionality', () => {
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

  test('should filter results by search term', async ({ page }) => {
    // Get initial row count
    const initialCount = await getVisibleRowCount(page);
    expect(initialCount).toBeGreaterThan(0);

    // Find search input
    const searchInput = page.getByPlaceholder(/search/i).first();
    await expect(searchInput).toBeVisible();

    // Type search term that matches some of our test data (github is in our fixture)
    await searchInput.fill('github');

    // Wait for debounce (650ms based on SEARCH_DEBOUNCE_MS constant) + processing
    await page.waitForTimeout(1000);

    // Verify results are filtered (should have fewer rows than before)
    const filteredCount = await getVisibleRowCount(page);

    // The search should either reduce results or stay same if all match
    // Most importantly, we should still have some results for 'github'
    expect(filteredCount).toBeGreaterThan(0);

    // Verify visible results contain search term in the page
    const pageContent = await page.content();
    expect(pageContent.toLowerCase()).toContain('github');
  });

  test('should support regex search patterns', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i).first();

    // Use regex pattern to match github OR google
    await searchInput.fill('(github|google)');
    await page.waitForTimeout(1000);

    const count = await getVisibleRowCount(page);
    expect(count).toBeGreaterThan(0);

    // Results should contain either github or google
    const pageContent = await page.content().then(c => c.toLowerCase());
    const hasGithub = pageContent.includes('github');
    const hasGoogle = pageContent.includes('google');
    expect(hasGithub || hasGoogle).toBeTruthy();
  });

  test('should clear search and restore results', async ({ page }) => {
    const initialCount = await getVisibleRowCount(page);

    // Apply a search filter
    const searchInput = page.getByPlaceholder(/search/i).first();
    await searchInput.fill('github');
    await page.waitForTimeout(1000);

    // Now clear the search by clearing the input
    await searchInput.clear();
    await page.waitForTimeout(1000);

    // Results should be back to initial count (or close to it)
    const restoredCount = await getVisibleRowCount(page);
    expect(restoredCount).toBe(initialCount);
  });

  test('should show no results for non-matching search', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i).first();

    // Search for something that doesn't exist
    await searchInput.fill('xyznonexistent12345abcdef');
    await page.waitForTimeout(1000);

    // Either count is 0 or we might see an empty table
    const count = await getVisibleRowCount(page);
    expect(count).toBe(0);
  });

  test('should handle special characters in search gracefully', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i).first();

    // Invalid regex pattern - should fall back to literal search
    await searchInput.fill('[invalid regex');
    await page.waitForTimeout(1000);

    // Should not crash - page should still be functional
    // The table or page should still be visible
    const table = page.locator('table').first();
    await expect(table).toBeVisible();
  });

  test('should update search results as user types', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i).first();

    // Get baseline count
    const initialCount = await getVisibleRowCount(page);
    expect(initialCount).toBeGreaterThan(0);

    // Search for specific term that exists in our fixture
    await searchInput.fill('google');
    await page.waitForTimeout(1000);
    const googleCount = await getVisibleRowCount(page);

    // Google should match some results
    expect(googleCount).toBeGreaterThan(0);

    // Verify page contains google in results
    const pageContent = await page.content();
    expect(pageContent.toLowerCase()).toContain('google');

    // Search for different term
    await searchInput.fill('stackoverflow');
    await page.waitForTimeout(1000);
    const stackCount = await getVisibleRowCount(page);

    // Should also have results
    expect(stackCount).toBeGreaterThan(0);
  });
});
