/**
 * Script to generate a sample Chrome History SQLite file for E2E testing.
 *
 * Run with: node e2e/fixtures/generate-chrome-history.js
 */

import Database from 'better-sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'chrome-history-sample.db');

// Chrome uses Windows FILETIME epoch (microseconds since Jan 1, 1601)
// To convert from Unix timestamp (ms): unixMs * 1000 + 11644473600000000
const CHROME_EPOCH_OFFSET = 11644473600000000n;

function unixMsToChrome(unixMs) {
  return BigInt(unixMs) * 1000n + CHROME_EPOCH_OFFSET;
}

// Generate timestamps for the last 30 days
function getRecentTimestamp(daysAgo, hoursAgo = 0) {
  const now = Date.now();
  const offset = (daysAgo * 24 + hoursAgo) * 60 * 60 * 1000;
  return unixMsToChrome(now - offset);
}

// Sample URL data
const testUrls = [
  { url: 'https://github.com', title: 'GitHub: Let\'s build from here', visits: 15 },
  { url: 'https://github.com/anthropics/claude-code', title: 'anthropics/claude-code - GitHub', visits: 8 },
  { url: 'https://google.com', title: 'Google', visits: 25 },
  { url: 'https://google.com/search?q=playwright+testing', title: 'playwright testing - Google Search', visits: 3 },
  { url: 'https://stackoverflow.com', title: 'Stack Overflow - Where Developers Learn', visits: 12 },
  { url: 'https://stackoverflow.com/questions/12345', title: 'How to test with Playwright? - Stack Overflow', visits: 2 },
  { url: 'https://developer.mozilla.org', title: 'MDN Web Docs', visits: 8 },
  { url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', title: 'JavaScript | MDN', visits: 5 },
  { url: 'https://nextjs.org', title: 'Next.js by Vercel', visits: 10 },
  { url: 'https://nextjs.org/docs', title: 'Getting Started | Next.js', visits: 7 },
  { url: 'https://react.dev', title: 'React', visits: 6 },
  { url: 'https://tailwindcss.com', title: 'Tailwind CSS', visits: 4 },
  { url: 'https://vitest.dev', title: 'Vitest | A Vite-native testing framework', visits: 3 },
  { url: 'https://playwright.dev', title: 'Playwright', visits: 5 },
  { url: 'https://vercel.com', title: 'Vercel: Build and deploy the best web experiences', visits: 6 },
  { url: 'https://anthropic.com', title: 'Anthropic', visits: 4 },
  { url: 'https://claude.ai', title: 'Claude', visits: 20 },
  { url: 'https://docs.anthropic.com', title: 'Anthropic Documentation', visits: 3 },
  { url: 'https://news.ycombinator.com', title: 'Hacker News', visits: 8 },
  { url: 'https://reddit.com', title: 'Reddit', visits: 5 },
  { url: 'https://twitter.com', title: 'X (formerly Twitter)', visits: 7 },
  { url: 'https://youtube.com', title: 'YouTube', visits: 12 },
  { url: 'https://youtube.com/watch?v=abc123', title: 'Learn Playwright in 10 minutes - YouTube', visits: 2 },
  { url: 'https://npmjs.com', title: 'npm', visits: 6 },
  { url: 'https://gitlab.com', title: 'GitLab', visits: 2 },
];

// Create the database
console.log('Creating Chrome History test fixture...');
const db = new Database(dbPath);

// Create Chrome History schema (simplified but functional)
db.exec(`
  -- URLs table
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    title TEXT,
    visit_count INTEGER DEFAULT 0,
    typed_count INTEGER DEFAULT 0,
    last_visit_time INTEGER NOT NULL,
    hidden INTEGER DEFAULT 0
  );

  -- Visits table
  CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url INTEGER NOT NULL,
    visit_time INTEGER NOT NULL,
    from_visit INTEGER DEFAULT 0,
    transition INTEGER DEFAULT 0,
    segment_id INTEGER DEFAULT 0,
    visit_duration INTEGER DEFAULT 0,
    incremented_omnibox_typed_score INTEGER DEFAULT 0,
    opener_visit INTEGER DEFAULT 0,
    originator_cache_guid TEXT,
    originator_visit_id INTEGER DEFAULT 0,
    originator_from_visit INTEGER DEFAULT 0,
    originator_opener_visit INTEGER DEFAULT 0,
    is_known_to_sync INTEGER DEFAULT 0,
    consider_for_ntp_most_visited INTEGER DEFAULT 1,
    visited_link_id INTEGER DEFAULT 0,
    app_id TEXT,
    external_referrer_url TEXT DEFAULT '',
    FOREIGN KEY (url) REFERENCES urls(id)
  );

  -- Downloads table (for testing download events)
  CREATE TABLE IF NOT EXISTS downloads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guid TEXT NOT NULL,
    current_path TEXT,
    target_path TEXT,
    start_time INTEGER NOT NULL,
    received_bytes INTEGER DEFAULT 0,
    total_bytes INTEGER DEFAULT 0,
    state INTEGER DEFAULT 0,
    danger_type INTEGER DEFAULT 0,
    interrupt_reason INTEGER DEFAULT 0,
    hash BLOB,
    end_time INTEGER,
    opened INTEGER DEFAULT 0,
    last_access_time INTEGER,
    transient INTEGER DEFAULT 0,
    referrer TEXT DEFAULT '',
    site_url TEXT,
    tab_url TEXT,
    tab_referrer_url TEXT DEFAULT '',
    http_method TEXT DEFAULT 'GET',
    by_ext_id TEXT,
    by_ext_name TEXT,
    etag TEXT DEFAULT '',
    last_modified TEXT DEFAULT '',
    mime_type TEXT DEFAULT '',
    original_mime_type TEXT DEFAULT ''
  );

  -- Content annotations table (for keyword search)
  CREATE TABLE IF NOT EXISTS content_annotations (
    visit_id INTEGER PRIMARY KEY,
    visibility_score REAL DEFAULT 1.0,
    floc_protected_score REAL DEFAULT -1,
    categories TEXT,
    page_topics_model_version INTEGER DEFAULT 0,
    annotation_flags INTEGER DEFAULT 0,
    entities TEXT,
    related_searches TEXT,
    search_normalized_url TEXT,
    search_terms TEXT,
    alternative_title TEXT,
    page_language TEXT,
    password_state INTEGER DEFAULT 0,
    has_url_keyed_image INTEGER DEFAULT 0
  );

  -- Create indexes for performance
  CREATE INDEX IF NOT EXISTS urls_url ON urls(url);
  CREATE INDEX IF NOT EXISTS visits_url ON visits(url);
  CREATE INDEX IF NOT EXISTS visits_time ON visits(visit_time);
`);

// Insert URLs
const insertUrl = db.prepare(`
  INSERT INTO urls (url, title, visit_count, typed_count, last_visit_time)
  VALUES (?, ?, ?, ?, ?)
`);

const insertVisit = db.prepare(`
  INSERT INTO visits (url, visit_time, transition, external_referrer_url)
  VALUES (?, ?, ?, ?)
`);

const insertDownload = db.prepare(`
  INSERT INTO downloads (guid, target_path, start_time, received_bytes, total_bytes, state, tab_url, tab_referrer_url, mime_type, original_mime_type)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertContentAnnotation = db.prepare(`
  INSERT INTO content_annotations (visit_id, search_terms)
  VALUES (?, ?)
`);

let visitId = 1;

// Insert URLs and visits
for (let i = 0; i < testUrls.length; i++) {
  const { url, title, visits } = testUrls[i];
  const lastVisitTime = getRecentTimestamp(i % 10, i % 24);

  // Insert URL
  const urlResult = insertUrl.run(url, title, visits, Math.floor(visits / 3), lastVisitTime.toString());
  const urlId = urlResult.lastInsertRowid;

  // Insert multiple visits for each URL
  for (let v = 0; v < visits; v++) {
    const visitTime = getRecentTimestamp(v % 30, (v * 2) % 24);
    const transition = v % 3 === 0 ? 1 : 0; // Some typed, some linked
    const referrer = v % 2 === 0 ? '' : 'https://google.com';
    insertVisit.run(urlId, visitTime.toString(), transition, referrer);
    visitId++;
  }
}

// Insert some downloads
const downloads = [
  { path: '/Users/test/Downloads/document.pdf', url: 'https://example.com/document.pdf', mime: 'application/pdf', size: 1024000 },
  { path: '/Users/test/Downloads/image.png', url: 'https://example.com/image.png', mime: 'image/png', size: 512000 },
  { path: '/Users/test/Downloads/archive.zip', url: 'https://github.com/repo/archive.zip', mime: 'application/zip', size: 2048000 },
];

for (let i = 0; i < downloads.length; i++) {
  const d = downloads[i];
  const startTime = getRecentTimestamp(i + 1, i);
  insertDownload.run(
    `download-${i}`,
    d.path,
    startTime.toString(),
    d.size,
    d.size,
    1, // Complete
    d.url,
    '',
    d.mime,
    d.mime
  );
}

// Insert some keyword search annotations
const searchTerms = [
  { visitId: 4, term: 'playwright testing' },
  { visitId: 6, term: 'javascript async await' },
  { visitId: 10, term: 'nextjs app router' },
];

for (const search of searchTerms) {
  insertContentAnnotation.run(search.visitId, search.term);
}

db.close();

console.log(`Created Chrome History test fixture at: ${dbPath}`);
console.log(`  - ${testUrls.length} URLs`);
console.log(`  - ${visitId - 1} visits`);
console.log(`  - ${downloads.length} downloads`);
console.log(`  - ${searchTerms.length} search keywords`);
