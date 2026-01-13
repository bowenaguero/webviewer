import path from 'path';

// Use relative path from the test file location
const fixturesDir = path.resolve(process.cwd(), 'e2e/fixtures');

export const fixtures = {
  chromeHistory: path.join(fixturesDir, 'chrome-history-sample.db'),
  firefoxPlaces: path.join(fixturesDir, 'firefox-places-sample.sqlite'),
};

/**
 * Helper to wait for navigation after file upload
 */
export async function waitForProcessingComplete(page) {
  // Wait for progress bar to appear (processing started)
  try {
    await page.locator('[role="progressbar"], [class*="progress"]').waitFor({ state: 'visible', timeout: 5000 });
  } catch {
    // Processing might be too fast to see
  }

  // Wait for processing to complete (progress disappears or we're on viewer page)
  try {
    await page.waitForURL(/\/viewer/, { timeout: 60000 });
  } catch {
    // Try waiting for progress to disappear
    await page.locator('[role="progressbar"], [class*="progress"]').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  }
}

/**
 * Helper to clear IndexedDB before tests
 */
export async function clearIndexedDB(page) {
  await page.evaluate(async () => {
    const databases = await indexedDB.databases();
    for (const db of databases) {
      if (db.name) {
        indexedDB.deleteDatabase(db.name);
      }
    }
  });
}

/**
 * Helper to get the current number of visible table rows (excluding header)
 * Since the UI doesn't show "of X" counts, we count actual rows
 */
export async function getVisibleRowCount(page) {
  try {
    // Wait for table to be present
    await page.locator('table tbody tr, [role="row"]').first().waitFor({ timeout: 5000 });

    // Count table rows (excluding header row in thead)
    const rows = page.locator('table tbody tr');
    return await rows.count();
  } catch {
    // Try card view for mobile
    const cards = page.locator('[class*="card"], [data-testid*="history-card"]');
    const cardCount = await cards.count();
    if (cardCount > 0) return cardCount;

    return 0;
  }
}

/**
 * Helper to check if we have any history data loaded
 */
export async function hasHistoryData(page) {
  const rowCount = await getVisibleRowCount(page);
  return rowCount > 0;
}

/**
 * Wait for table data to load
 */
export async function waitForTableLoad(page) {
  // Wait for loading spinner to disappear
  try {
    const spinner = page.locator('[class*="animate-spin"], [class*="loader"]');
    await spinner.waitFor({ state: 'hidden', timeout: 10000 });
  } catch {
    // No spinner or already hidden
  }

  // Wait for at least one row to appear
  await page.locator('table tbody tr').first().waitFor({ timeout: 10000 }).catch(() => {});
}
