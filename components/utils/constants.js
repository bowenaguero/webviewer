// Query limit for browser history (prevents memory issues with large DBs)
export const QUERY_ROW_LIMIT = 25000;

// Debounce delay for search input (milliseconds)
export const SEARCH_DEBOUNCE_MS = 650;

// Milliseconds in a day
export const MS_PER_DAY = 86400000;

// Chrome/Edge: Windows FILETIME epoch (microseconds since Jan 1, 1601)
export const CHROME_EPOCH_OFFSET = 11644473600000000;

// Firefox: uses microseconds, divide by 1000 to get milliseconds
export const FIREFOX_PRECISION_DIVISOR = 1000;

// Safari: Mac absolute time (seconds since Jan 1, 2001)
export const SAFARI_EPOCH_OFFSET = 978307200;

// External service URLs for "Send to" feature
export const EXTERNAL_URLS = {
  virustotal: (domain) => `https://www.virustotal.com/gui/domain/${domain}`,
  browserling: (url) => `https://www.browserling.com/browse/win10/chrome/${url}`,
  urlscan: (domain) => `https://urlscan.io/search/#${domain}`,
};

// Event type colors for icons
export const EVENT_TYPE_COLORS = {
  Visit: '#AA4586',
  Download: '#1B998B',
  Autofill: '#F2DC5D',
  Bookmark: '#F46036',
  Keyword: '#468C98',
};

// Icon size mappings
export const ICON_SIZES = {
  sm: '14px',
  md: '18px',
  lg: '26px',
  xl: '32px',
  default: '16px',
};

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
