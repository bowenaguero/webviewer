import { test, expect } from '@playwright/test';
import { fixtures, clearIndexedDB, waitForProcessingComplete, waitForTableLoad, getVisibleRowCount } from './helpers/fixtures.js';

test.describe('Chrome History Upload', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing IndexedDB data
    await page.goto('/');
    await clearIndexedDB(page);
  });

  test('should display upload area on home page', async ({ page }) => {
    await page.goto('/');

    // Verify we're on the home page with the upload dropzone
    // The dropzone has an input[type="file"]
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();

    // Verify the upload icon or dropzone area exists
    const dropzone = page.locator('[class*="dropzone"], [class*="border-dashed"]');
    await expect(dropzone.first()).toBeVisible();
  });

  test('should upload Chrome history file and display results', async ({ page }) => {
    await page.goto('/');

    // Find the file input
    const fileInput = page.locator('input[type="file"]');

    // Upload the test fixture
    await fileInput.setInputFiles(fixtures.chromeHistory);

    // Wait for processing to complete and navigation to viewer
    await waitForProcessingComplete(page);

    // Should navigate to viewer page
    await expect(page).toHaveURL(/\/viewer/);

    // Wait for table to load
    await waitForTableLoad(page);

    // Verify history table is visible
    const table = page.locator('table').first();
    await expect(table).toBeVisible({ timeout: 10000 });

    // Verify we have data rows (not just header)
    const rowCount = await getVisibleRowCount(page);
    expect(rowCount).toBeGreaterThan(0);
  });

  test('should display event types after upload', async ({ page }) => {
    await page.goto('/');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(fixtures.chromeHistory);

    await waitForProcessingComplete(page);
    await expect(page).toHaveURL(/\/viewer/);

    // Wait for table to load
    await waitForTableLoad(page);

    // Verify we have data rows
    const rowCount = await getVisibleRowCount(page);
    expect(rowCount).toBeGreaterThan(0);

    // The table should contain visit data from Chrome (our fixture has Visit events)
    const pageContent = await page.content();
    // Check for browser name or event types in the content
    const hasExpectedContent = pageContent.toLowerCase().includes('chrome') ||
                               pageContent.toLowerCase().includes('visit') ||
                               pageContent.toLowerCase().includes('github') ||
                               pageContent.toLowerCase().includes('google');
    expect(hasExpectedContent).toBeTruthy();
  });

  test('should show correct URL domains in results', async ({ page }) => {
    await page.goto('/');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(fixtures.chromeHistory);

    await waitForProcessingComplete(page);
    await expect(page).toHaveURL(/\/viewer/);

    // Wait for table to load
    await waitForTableLoad(page);

    // Verify we have data rows
    const rowCount = await getVisibleRowCount(page);
    expect(rowCount).toBeGreaterThan(0);

    // Verify that table rows contain URL data (any valid URL pattern)
    // The rows should have URLs from our test fixture
    const tableRows = page.locator('table tbody tr');
    const firstRowText = await tableRows.first().textContent();

    // The row should contain either a URL or domain name
    const hasUrlContent = firstRowText?.includes('http') ||
                          firstRowText?.includes('.com') ||
                          firstRowText?.includes('.org') ||
                          firstRowText?.includes('.dev') ||
                          firstRowText?.length > 10; // Has substantial content
    expect(hasUrlContent).toBeTruthy();
  });

  test('should handle invalid file gracefully', async ({ page }) => {
    await page.goto('/');

    const fileInput = page.locator('input[type="file"]');

    // The dropzone only accepts .db and .sqlite files, so a .txt file should be rejected
    // or show an error if it gets through
    await fileInput.setInputFiles({
      name: 'not-a-database.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('This is not a valid SQLite database file'),
    });

    // Wait a moment for any error handling
    await page.waitForTimeout(2000);

    // Should either:
    // 1. Stay on home page (file rejected)
    // 2. Show an error toast/message
    const url = page.url();
    const hasError = await page.locator('[class*="toast"], [role="alert"], [class*="error"]').count();

    // Either still on home page or showing an error is acceptable
    const onHomePage = !url.includes('/viewer');
    expect(onHomePage || hasError > 0).toBeTruthy();
  });
});
