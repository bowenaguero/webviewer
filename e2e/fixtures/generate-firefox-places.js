/**
 * Script to generate a sample Firefox places.sqlite file for E2E testing.
 *
 * Run with: node e2e/fixtures/generate-firefox-places.js
 */

import Database from 'better-sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'firefox-places-sample.sqlite');

// Firefox uses Unix microseconds (Unix ms * 1000)
function unixMsToFirefox(unixMs) {
  return BigInt(unixMs) * 1000n;
}

// Generate timestamps for the last 30 days
function getRecentTimestamp(daysAgo, hoursAgo = 0) {
  const now = Date.now();
  const offset = (daysAgo * 24 + hoursAgo) * 60 * 60 * 1000;
  return unixMsToFirefox(now - offset);
}

// Sample URL data
const testUrls = [
  { url: 'https://github.com/', title: 'GitHub: Let\'s build from here', visits: 12 },
  { url: 'https://github.com/anthropics/claude-code', title: 'anthropics/claude-code - GitHub', visits: 6 },
  { url: 'https://google.com/', title: 'Google', visits: 20 },
  { url: 'https://google.com/search?q=firefox+testing', title: 'firefox testing - Google Search', visits: 3 },
  { url: 'https://stackoverflow.com/', title: 'Stack Overflow - Where Developers Learn', visits: 10 },
  { url: 'https://stackoverflow.com/questions/98765', title: 'How to use Firefox DevTools? - Stack Overflow', visits: 2 },
  { url: 'https://developer.mozilla.org/', title: 'MDN Web Docs', visits: 15 },
  { url: 'https://developer.mozilla.org/en-US/docs/Web/CSS', title: 'CSS | MDN', visits: 8 },
  { url: 'https://nextjs.org/', title: 'Next.js by Vercel', visits: 7 },
  { url: 'https://react.dev/', title: 'React', visits: 5 },
  { url: 'https://tailwindcss.com/', title: 'Tailwind CSS', visits: 4 },
  { url: 'https://mozilla.org/', title: 'Mozilla', visits: 6 },
  { url: 'https://firefox.com/', title: 'Firefox Browser', visits: 3 },
  { url: 'https://addons.mozilla.org/', title: 'Firefox Add-ons', visits: 4 },
  { url: 'https://anthropic.com/', title: 'Anthropic', visits: 5 },
  { url: 'https://claude.ai/', title: 'Claude', visits: 18 },
  { url: 'https://news.ycombinator.com/', title: 'Hacker News', visits: 7 },
  { url: 'https://reddit.com/', title: 'Reddit', visits: 4 },
  { url: 'https://youtube.com/', title: 'YouTube', visits: 10 },
  { url: 'https://npmjs.com/', title: 'npm', visits: 5 },
  { url: 'https://rust-lang.org/', title: 'Rust Programming Language', visits: 3 },
  { url: 'https://python.org/', title: 'Python.org', visits: 4 },
  { url: 'https://nodejs.org/', title: 'Node.js', visits: 6 },
  { url: 'https://deno.land/', title: 'Deno - A modern runtime for JavaScript', visits: 2 },
  { url: 'https://bun.sh/', title: 'Bun - Fast JavaScript runtime', visits: 3 },
];

// Create the database
console.log('Creating Firefox places.sqlite test fixture...');
const db = new Database(dbPath);

// Create Firefox places.sqlite schema (simplified but functional)
db.exec(`
  -- moz_places: Main table for URLs
  CREATE TABLE IF NOT EXISTS moz_places (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    title TEXT,
    rev_host TEXT,
    visit_count INTEGER DEFAULT 0,
    hidden INTEGER DEFAULT 0,
    typed INTEGER DEFAULT 0,
    frecency INTEGER DEFAULT -1,
    last_visit_date INTEGER,
    guid TEXT,
    foreign_count INTEGER DEFAULT 0,
    url_hash INTEGER DEFAULT 0,
    description TEXT,
    preview_image_url TEXT,
    site_name TEXT,
    origin_id INTEGER
  );

  -- moz_historyvisits: Visit records
  CREATE TABLE IF NOT EXISTS moz_historyvisits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_visit INTEGER DEFAULT 0,
    place_id INTEGER NOT NULL,
    visit_date INTEGER NOT NULL,
    visit_type INTEGER DEFAULT 1,
    session INTEGER DEFAULT 0,
    source INTEGER DEFAULT 0,
    triggeringPlaceId INTEGER,
    FOREIGN KEY (place_id) REFERENCES moz_places(id)
  );

  -- moz_bookmarks: Bookmarks
  CREATE TABLE IF NOT EXISTS moz_bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type INTEGER DEFAULT 1,
    fk INTEGER,
    parent INTEGER,
    position INTEGER DEFAULT 0,
    title TEXT,
    keyword_id INTEGER,
    folder_type TEXT,
    dateAdded INTEGER,
    lastModified INTEGER,
    guid TEXT,
    syncStatus INTEGER DEFAULT 0,
    syncChangeCounter INTEGER DEFAULT 1,
    FOREIGN KEY (fk) REFERENCES moz_places(id)
  );

  -- moz_annos: Annotations (used for downloads and other metadata)
  CREATE TABLE IF NOT EXISTS moz_annos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    place_id INTEGER NOT NULL,
    anno_attribute_id INTEGER,
    content TEXT,
    flags INTEGER DEFAULT 0,
    expiration INTEGER DEFAULT 4,
    type INTEGER DEFAULT 3,
    dateAdded INTEGER,
    lastModified INTEGER,
    FOREIGN KEY (place_id) REFERENCES moz_places(id)
  );

  -- moz_anno_attributes: Annotation attribute names
  CREATE TABLE IF NOT EXISTS moz_anno_attributes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  -- moz_origins: Origin domains
  CREATE TABLE IF NOT EXISTS moz_origins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prefix TEXT NOT NULL,
    host TEXT NOT NULL,
    frecency INTEGER DEFAULT 0,
    recalc_frecency INTEGER DEFAULT 0,
    alt_frecency INTEGER,
    recalc_alt_frecency INTEGER DEFAULT 0
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS moz_places_url ON moz_places(url);
  CREATE INDEX IF NOT EXISTS moz_historyvisits_place ON moz_historyvisits(place_id);
  CREATE INDEX IF NOT EXISTS moz_historyvisits_date ON moz_historyvisits(visit_date);
  CREATE INDEX IF NOT EXISTS moz_bookmarks_fk ON moz_bookmarks(fk);
`);

// Helper to reverse host (Firefox stores rev_host for fast domain lookups)
function reverseHost(url) {
  try {
    const u = new URL(url);
    return u.hostname.split('.').reverse().join('.') + '.';
  } catch {
    return '';
  }
}

// Helper to generate GUID
function generateGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Insert URL
const insertPlace = db.prepare(`
  INSERT INTO moz_places (url, title, rev_host, visit_count, typed, frecency, last_visit_date, guid)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

// Insert visit
const insertVisit = db.prepare(`
  INSERT INTO moz_historyvisits (place_id, visit_date, visit_type, from_visit)
  VALUES (?, ?, ?, ?)
`);

// Insert bookmark
const insertBookmark = db.prepare(`
  INSERT INTO moz_bookmarks (type, fk, parent, position, title, dateAdded, lastModified, guid)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

// Insert annotation
const insertAnno = db.prepare(`
  INSERT INTO moz_annos (place_id, anno_attribute_id, content, dateAdded, lastModified)
  VALUES (?, ?, ?, ?, ?)
`);

// Insert annotation attribute
const insertAnnoAttr = db.prepare(`
  INSERT OR IGNORE INTO moz_anno_attributes (name) VALUES (?)
`);

// Add download annotation attribute
insertAnnoAttr.run('downloads/destinationFileURI');
insertAnnoAttr.run('downloads/metaData');

let visitId = 1;
let bookmarkCount = 0;

// Insert URLs and visits
for (let i = 0; i < testUrls.length; i++) {
  const { url, title, visits } = testUrls[i];
  const lastVisitDate = getRecentTimestamp(i % 10, i % 24);

  // Insert place (URL)
  const placeResult = insertPlace.run(
    url,
    title,
    reverseHost(url),
    visits,
    Math.floor(visits / 4),
    visits * 100,
    lastVisitDate.toString(),
    generateGuid()
  );
  const placeId = placeResult.lastInsertRowid;

  // Insert multiple visits for each URL
  for (let v = 0; v < visits; v++) {
    const visitDate = getRecentTimestamp(v % 30, (v * 3) % 24);
    const visitType = v % 4 === 0 ? 2 : 1; // 2 = typed, 1 = link
    const fromVisit = v > 0 ? visitId - 1 : 0;
    insertVisit.run(placeId, visitDate.toString(), visitType, fromVisit);
    visitId++;
  }

  // Add some bookmarks (every 5th URL)
  if (i % 5 === 0) {
    const bookmarkDate = getRecentTimestamp(i, 0);
    insertBookmark.run(
      1, // type: bookmark
      placeId,
      2, // parent: bookmarks menu
      bookmarkCount,
      title,
      bookmarkDate.toString(),
      bookmarkDate.toString(),
      generateGuid()
    );
    bookmarkCount++;
  }
}

// Add some download annotations
const downloadUrls = [
  { url: 'https://example.com/report.pdf', title: 'Annual Report PDF' },
  { url: 'https://github.com/repo/releases/download/v1.0/app.zip', title: 'App Download' },
  { url: 'https://nodejs.org/dist/v20.0.0/node-v20.0.0.pkg', title: 'Node.js Installer' },
];

for (let i = 0; i < downloadUrls.length; i++) {
  const { url, title } = downloadUrls[i];
  const downloadDate = getRecentTimestamp(i + 1, i * 2);

  // Insert place for download
  const placeResult = insertPlace.run(
    url,
    title,
    reverseHost(url),
    1,
    0,
    100,
    downloadDate.toString(),
    generateGuid()
  );
  const placeId = placeResult.lastInsertRowid;

  // Add download annotation
  const filePath = 'file:///Users/test/Downloads/' + title.replace(/\s+/g, '_');
  insertAnno.run(
    placeId,
    1, // downloads/destinationFileURI attribute
    filePath,
    downloadDate.toString(),
    downloadDate.toString()
  );
}

db.close();

console.log('Created Firefox places.sqlite test fixture at: ' + dbPath);
console.log('  - ' + (testUrls.length + downloadUrls.length) + ' places (URLs)');
console.log('  - ' + (visitId - 1) + ' visits');
console.log('  - ' + bookmarkCount + ' bookmarks');
console.log('  - ' + downloadUrls.length + ' downloads');
