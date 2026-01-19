// Browser-related constants for parsing history databases

// Query limit for browser history (worker processes in chunks so higher limit is OK)
export const QUERY_ROW_LIMIT = 500000;

// Chunk size for streaming results from worker to main thread
export const WORKER_CHUNK_SIZE = 1000;

// Chrome/Edge: Windows FILETIME epoch (microseconds since Jan 1, 1601)
export const CHROME_EPOCH_OFFSET = 11644473600000000;

// Firefox: uses microseconds, divide by 1000 to get milliseconds
export const FIREFOX_PRECISION_DIVISOR = 1000;

// Safari: Mac absolute time (seconds since Jan 1, 2001)
export const SAFARI_EPOCH_OFFSET = 978307200;

// Browser name mappings
export const BROWSER_NAMES = new Map([
  ['chrome', 'Chrome'],
  ['firefox', 'Firefox'],
  ['safari', 'Safari'],
  ['edge', 'Edge'],
  ['opera', 'Opera'],
  ['brave', 'Brave'],
  ['vivaldi', 'Vivaldi'],
]);
