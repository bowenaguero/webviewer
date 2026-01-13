import { describe, it, expect } from 'vitest';
import { processHistoryResults } from './processing';
import db from './db';

// Note: db mock is provided by vitest.setup.js

describe('processHistoryResults', () => {

  describe('URL and domain processing', () => {
    it('extracts domain from valid URL', () => {
      const results = {
        columns: ['url', 'lastVisitTime', 'title', 'eventType'],
        values: [
          ['https://example.com/page', 1000000000000, 'Example', 'Visit'],
        ],
      };

      const history = processHistoryResults(results);

      expect(history[0].url).toBe('https://example.com/page');
      expect(history[0].domain).toBe('example.com');
    });

    it('extracts domain from URL with subdomain', () => {
      const results = {
        columns: ['url', 'lastVisitTime', 'title', 'eventType'],
        values: [
          ['https://sub.example.com/page', 1000000000000, 'Example', 'Visit'],
        ],
      };

      const history = processHistoryResults(results);

      expect(history[0].domain).toBe('sub.example.com');
    });

    it('returns "Unknown" for invalid URL', () => {
      const results = {
        columns: ['url', 'lastVisitTime', 'title', 'eventType'],
        values: [['not-a-valid-url', 1000000000000, 'Example', 'Visit']],
      };

      const history = processHistoryResults(results);

      expect(history[0].domain).toBe('Unknown');
    });

    it('returns "Unknown" for empty URL', () => {
      const results = {
        columns: ['url', 'lastVisitTime', 'title', 'eventType'],
        values: [['', 1000000000000, 'Example', 'Visit']],
      };

      const history = processHistoryResults(results);

      expect(history[0].domain).toBe('Unknown');
    });
  });

  describe('timestamp processing', () => {
    it('converts Chrome/Edge timestamp (Windows FILETIME epoch)', () => {
      // Chrome timestamp: microseconds since Jan 1, 1601
      // Example: 13350000000000000 represents a date in 2023
      const chromeTimestamp = 13350000000000000;
      const results = {
        columns: ['url', 'lastVisitTime', 'title', 'eventType'],
        values: [
          ['https://example.com', chromeTimestamp, 'Example', 'Visit'],
        ],
      };

      const history = processHistoryResults(results);

      // Should be converted to milliseconds since Unix epoch
      expect(history[0].visitTime).toBeLessThan(chromeTimestamp);
      expect(typeof history[0].visitTime).toBe('number');
      expect(history[0].visitTimeFormatted).toBeDefined();
    });

    it('converts Firefox timestamp (Unix microseconds)', () => {
      // Firefox timestamp: microseconds since Unix epoch
      // Example: 1700000000000000 (microseconds)
      const firefoxTimestamp = 1700000000000000;
      const results = {
        columns: ['url', 'lastVisitTime', 'title', 'eventType'],
        values: [
          ['https://example.com', firefoxTimestamp, 'Example', 'Visit'],
        ],
      };

      const history = processHistoryResults(results);

      // Should be divided by 1000 to get milliseconds
      expect(history[0].visitTime).toBe(firefoxTimestamp / 1000);
    });

    it('converts Safari timestamp (Mac absolute time)', () => {
      // Safari timestamp: seconds since Jan 1, 2001
      // Example: 700000000 (a date around 2023)
      const safariTimestamp = 700000000;
      const results = {
        columns: ['url', 'lastVisitTime', 'title', 'eventType'],
        values: [['https://example.com', safariTimestamp, 'Example', 'Visit']],
      };

      const history = processHistoryResults(results);

      // Should be converted: (timestamp + 978307200) * 1000
      const expectedMs = (safariTimestamp + 978307200) * 1000;
      expect(history[0].visitTime).toBe(expectedMs);
    });

    it('returns non-numeric timestamp as-is', () => {
      const results = {
        columns: ['url', 'lastVisitTime', 'title', 'eventType'],
        values: [['https://example.com', 'invalid', 'Example', 'Visit']],
      };

      const history = processHistoryResults(results);

      expect(history[0].visitTime).toBe('invalid');
    });

    it('handles timestamp in the gap between Safari and Firefox thresholds', () => {
      // A timestamp between 1 billion and 1 trillion falls through to return as-is
      // This represents a value that doesn't match any browser-specific format
      const gapTimestamp = 5000000000; // 5 billion (between 1B Safari and 1T Firefox)
      const results = {
        columns: ['url', 'lastVisitTime', 'title', 'eventType'],
        values: [['https://example.com', gapTimestamp, 'Example', 'Visit']],
      };

      const history = processHistoryResults(results);

      // Falls through all conditions, returned as-is
      expect(history[0].visitTime).toBe(gapTimestamp);
    });
  });

  describe('column mapping', () => {
    it('maps standard columns correctly', () => {
      const results = {
        columns: ['url', 'lastVisitTime', 'title', 'eventType', 'eventEntity', 'browser', 'eventEntityType'],
        values: [
          [
            'https://example.com',
            1700000000000,
            'Example Title',
            'Download',
            'file.pdf',
            'Chrome',
            'File Name',
          ],
        ],
      };

      const history = processHistoryResults(results);

      expect(history[0].title).toBe('Example Title');
      expect(history[0].eventType).toBe('Download');
      expect(history[0].eventEntity).toBe('file.pdf');
      expect(history[0].browser).toBe('Chrome');
      expect(history[0].eventEntityType).toBe('File Name');
    });

    it('skips empty referrer column', () => {
      const results = {
        columns: ['url', 'lastVisitTime', 'title', 'eventType', 'referrer'],
        values: [
          ['https://example.com', 1700000000000, 'Example', 'Visit', ''],
        ],
      };

      const history = processHistoryResults(results);

      expect(history[0].referrer).toBeUndefined();
    });

    it('includes non-empty referrer in additionalFields', () => {
      const results = {
        columns: ['url', 'lastVisitTime', 'title', 'eventType', 'referrer'],
        values: [
          [
            'https://example.com',
            1700000000000,
            'Example',
            'Visit',
            'https://google.com',
          ],
        ],
      };

      const history = processHistoryResults(results);

      expect(history[0].additionalFields.referrer).toBe('https://google.com');
    });

    it('stores unmapped columns in additionalFields', () => {
      const results = {
        columns: ['url', 'lastVisitTime', 'title', 'eventType', 'customField', 'anotherField'],
        values: [
          [
            'https://example.com',
            1700000000000,
            'Example',
            'Visit',
            'custom value',
            123,
          ],
        ],
      };

      const history = processHistoryResults(results);

      expect(history[0].additionalFields.customField).toBe('custom value');
      expect(history[0].additionalFields.anotherField).toBe(123);
    });
  });

  describe('stats calculation', () => {
    it('calculates url_count for duplicate URLs', () => {
      const results = {
        columns: ['url', 'lastVisitTime', 'title', 'eventType'],
        values: [
          ['https://example.com/page1', 1700000000000, 'Page 1', 'Visit'],
          ['https://example.com/page1', 1700000000001, 'Page 1', 'Visit'],
          ['https://example.com/page2', 1700000000002, 'Page 2', 'Visit'],
        ],
      };

      const history = processHistoryResults(results);

      expect(history[0].url_count).toBe(2);
      expect(history[1].url_count).toBe(2);
      expect(history[2].url_count).toBe(1);
    });

    it('calculates domain_count for URLs with same domain', () => {
      const results = {
        columns: ['url', 'lastVisitTime', 'title', 'eventType'],
        values: [
          ['https://example.com/page1', 1700000000000, 'Page 1', 'Visit'],
          ['https://example.com/page2', 1700000000001, 'Page 2', 'Visit'],
          ['https://other.com/page', 1700000000002, 'Other', 'Visit'],
        ],
      };

      const history = processHistoryResults(results);

      expect(history[0].domain_count).toBe(2);
      expect(history[1].domain_count).toBe(2);
      expect(history[2].domain_count).toBe(1);
    });
  });

  describe('database integration', () => {
    it('calls db.history.add for each processed item', () => {
      const results = {
        columns: ['url', 'lastVisitTime', 'title', 'eventType'],
        values: [
          ['https://example1.com', 1700000000000, 'Example 1', 'Visit'],
          ['https://example2.com', 1700000000001, 'Example 2', 'Visit'],
        ],
      };

      processHistoryResults(results);

      expect(db.history.add).toHaveBeenCalledTimes(2);
    });
  });

  describe('edge cases', () => {
    it('handles empty results', () => {
      const results = {
        columns: ['url', 'lastVisitTime', 'title', 'eventType'],
        values: [],
      };

      const history = processHistoryResults(results);

      expect(history).toEqual([]);
      expect(db.history.add).not.toHaveBeenCalled();
    });

    it('handles single row', () => {
      const results = {
        columns: ['url', 'lastVisitTime', 'title', 'eventType'],
        values: [['https://example.com', 1700000000000, 'Example', 'Visit']],
      };

      const history = processHistoryResults(results);

      expect(history).toHaveLength(1);
      expect(history[0].url).toBe('https://example.com');
    });

    it('handles null title', () => {
      const results = {
        columns: ['url', 'lastVisitTime', 'title', 'eventType'],
        values: [['https://example.com', 1700000000000, null, 'Visit']],
      };

      const history = processHistoryResults(results);

      expect(history[0].title).toBeNull();
    });

    it('handles null eventEntity', () => {
      const results = {
        columns: ['url', 'lastVisitTime', 'title', 'eventType', 'eventEntity'],
        values: [
          ['https://example.com', 1700000000000, 'Example', 'Visit', null],
        ],
      };

      const history = processHistoryResults(results);

      expect(history[0].eventEntity).toBeNull();
    });
  });
});
