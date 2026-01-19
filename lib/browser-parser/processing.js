// Shared processing functions for browser history parsing
// SINGLE SOURCE OF TRUTH - used by both lib/ and web worker

import {
  CHROME_EPOCH_OFFSET,
  FIREFOX_PRECISION_DIVISOR,
  SAFARI_EPOCH_OFFSET,
} from '../constants/browser';

// Column mapping for standardized output
export const COLUMN_MAP = {
  lastVisitTime: 'visitTime',
  title: 'title',
  eventType: 'eventType',
  eventEntity: 'eventEntity',
  browser: 'browser',
  eventEntityType: 'eventEntityType',
};

/**
 * Extract hostname from URL
 */
export const urlToDomain = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return 'Unknown';
  }
};

/**
 * Extract apex domain from FQDN using PSL library
 * Note: psl must be available in the calling context (global in worker, imported in main thread)
 */
export const domainToApex = (domain, pslInstance = null) => {
  if (domain === 'Unknown') return 'Unknown';

  // Use provided psl instance or try global
  const pslLib = pslInstance || (typeof psl !== 'undefined' ? psl : null);

  if (pslLib) {
    try {
      const parsed = pslLib.parse(domain);
      return parsed.domain || domain;
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback: return last two parts
  const parts = domain.split('.');
  return parts.length <= 2 ? domain : parts.slice(-2).join('.');
};

/**
 * Convert browser-specific timestamp to JavaScript milliseconds
 * Handles Chrome/Edge, Firefox, and Safari epoch differences
 */
export const processVisitTimestamp = (timestamp) => {
  if (typeof timestamp !== 'number') {
    return timestamp;
  }

  // Chrome/Edge: Windows FILETIME epoch (microseconds since Jan 1, 1601)
  if (timestamp > CHROME_EPOCH_OFFSET) {
    return (timestamp - CHROME_EPOCH_OFFSET) / 1000;
  }

  // Firefox: Unix timestamp in microseconds
  if (timestamp > 1000000000000) {
    return timestamp / FIREFOX_PRECISION_DIVISOR;
  }

  // Safari: Mac absolute time (seconds since Jan 1, 2001)
  if (timestamp < 1000000000) {
    return (timestamp + SAFARI_EPOCH_OFFSET) * 1000;
  }

  return timestamp;
};

/**
 * Format timestamp to locale string
 */
export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

/**
 * Transform a raw database row into a standardized history object
 * @param {Array} row - Raw row values from SQL query
 * @param {Array} columns - Column names from SQL query
 * @param {Object} options - Optional configuration
 * @param {Function} options.onUrlStats - Callback to track URL/domain stats (for legacy processing.js compatibility)
 * @param {Object} options.psl - PSL library instance for apex domain parsing
 */
export const transformRow = (row, columns, options = {}) => {
  const { onUrlStats, psl: pslInstance } = options;
  const historyObject = { additionalFields: {} };

  columns.forEach((column, index) => {
    const value = row[index];

    if (column === 'url') {
      const domain = urlToDomain(value);
      const apexDomain = domainToApex(domain, pslInstance);
      historyObject.url = value;
      historyObject.domain = domain;
      historyObject.apexDomain = apexDomain;

      // Call stats callback if provided (for legacy compatibility)
      if (onUrlStats) {
        onUrlStats(value, domain);
      }
    } else if (column === 'lastVisitTime') {
      historyObject.visitTime = processVisitTimestamp(value);
      historyObject.visitTimeFormatted = formatDate(historyObject.visitTime);
    } else if (column === 'referrer' && value === '') {
      return;
    } else if (COLUMN_MAP[column]) {
      historyObject[COLUMN_MAP[column]] = value;
    } else {
      historyObject.additionalFields[column] = value;
    }
  });

  return historyObject;
};
