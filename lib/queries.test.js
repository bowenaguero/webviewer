import { describe, it, expect, vi } from 'vitest';
import { queryBrowserHistory } from './queries';
import db from './db';

// Note: db mock is provided by vitest.setup.js

describe('queryBrowserHistory', () => {

  const createMockSqlDb = (execResults) => ({
    exec: vi.fn((query) => {
      // Return different results based on query content
      for (const [pattern, result] of Object.entries(execResults)) {
        if (query.includes(pattern)) {
          return result;
        }
      }
      return [];
    }),
  });

  describe('Firefox queries', () => {
    it('processes Firefox visits query results', () => {
      const mockSqlDb = createMockSqlDb({
        moz_historyvisits: [
          {
            columns: [
              'lastVisitTime',
              'url',
              'title',
              'eventEntity',
              'eventEntityType',
              'eventType',
              'browser',
            ],
            values: [
              [
                1700000000000000,
                'https://firefox-test.com',
                'Firefox Test',
                'https://firefox-test.com',
                'URL',
                'Visit',
                'Firefox',
              ],
            ],
          },
        ],
      });

      const result = queryBrowserHistory(mockSqlDb);

      expect(result.history.length).toBeGreaterThan(0);
      expect(db.history.clear).toHaveBeenCalled();
    });

    it('processes Firefox downloads query results', () => {
      const mockSqlDb = createMockSqlDb({
        moz_annos: [
          {
            columns: [
              'lastVisitTime',
              'url',
              'title',
              'eventEntity',
              'eventEntityType',
              'eventType',
              'browser',
            ],
            values: [
              [
                1700000000000000,
                'https://firefox-download.com/file.zip',
                'Download',
                'file.zip',
                'File Name',
                'Download',
                'Firefox',
              ],
            ],
          },
        ],
      });

      const result = queryBrowserHistory(mockSqlDb);

      expect(result.history.length).toBeGreaterThan(0);
    });
  });

  describe('Chrome queries', () => {
    it('processes Chrome visits query results', () => {
      const mockSqlDb = createMockSqlDb({
        'FROM\n      visits': [
          {
            columns: [
              'lastVisitTime',
              'url',
              'title',
              'eventEntity',
              'referrer',
              'eventEntityType',
              'eventType',
              'browser',
            ],
            values: [
              [
                13350000000000000,
                'https://chrome-test.com',
                'Chrome Test',
                'https://chrome-test.com',
                '',
                'URL',
                'Visit',
                'Chrome',
              ],
            ],
          },
        ],
      });

      const result = queryBrowserHistory(mockSqlDb);

      expect(result.history.length).toBeGreaterThan(0);
    });

    it('processes Chrome downloads query results', () => {
      const mockSqlDb = createMockSqlDb({
        'FROM\n        downloads': [
          {
            columns: [
              'lastVisitTime',
              'eventEntity',
              'url',
              'tabReferrerUrl',
              'referrer',
              'mimeType',
              'originalMimeType',
              'receivedBytes',
              'totalBytes',
              'eventEntityType',
              'eventType',
              'browser',
            ],
            values: [
              [
                13350000000000000,
                '/path/to/file.pdf',
                'https://chrome-download.com',
                '',
                '',
                'application/pdf',
                'application/pdf',
                1024,
                1024,
                'File Name',
                'Download',
                'Chrome',
              ],
            ],
          },
        ],
      });

      const result = queryBrowserHistory(mockSqlDb);

      expect(result.history.length).toBeGreaterThan(0);
    });
  });

  describe('Safari queries', () => {
    it('processes Safari visits query results', () => {
      const mockSqlDb = createMockSqlDb({
        history_visits: [
          {
            columns: [
              'lastVisitTime',
              'url',
              'title',
              'eventEntity',
              'referrer',
              'eventEntityType',
              'eventType',
              'browser',
            ],
            values: [
              [
                700000000,
                'https://safari-test.com',
                'Safari Test',
                'https://safari-test.com',
                '',
                'URL',
                'Visit',
                'Safari',
              ],
            ],
          },
        ],
      });

      const result = queryBrowserHistory(mockSqlDb);

      expect(result.history.length).toBeGreaterThan(0);
    });
  });

  describe('combined results', () => {
    it('combines results from multiple browser queries', () => {
      const mockSqlDb = {
        exec: vi.fn((query) => {
          if (query.includes('moz_historyvisits')) {
            return [
              {
                columns: [
                  'lastVisitTime',
                  'url',
                  'title',
                  'eventEntity',
                  'eventEntityType',
                  'eventType',
                  'browser',
                ],
                values: [
                  [
                    1700000000000000,
                    'https://firefox.com',
                    'Firefox',
                    'https://firefox.com',
                    'URL',
                    'Visit',
                    'Firefox',
                  ],
                ],
              },
            ];
          }
          if (query.includes('FROM\n      visits')) {
            return [
              {
                columns: [
                  'lastVisitTime',
                  'url',
                  'title',
                  'eventEntity',
                  'referrer',
                  'eventEntityType',
                  'eventType',
                  'browser',
                ],
                values: [
                  [
                    13350000000000000,
                    'https://chrome.com',
                    'Chrome',
                    'https://chrome.com',
                    '',
                    'URL',
                    'Visit',
                    'Chrome',
                  ],
                ],
              },
            ];
          }
          return [];
        }),
      };

      const result = queryBrowserHistory(mockSqlDb);

      expect(result.history.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('error handling', () => {
    it('continues processing when a query fails', () => {
      let callCount = 0;
      const mockSqlDb = {
        exec: vi.fn((query) => {
          callCount++;
          // First few queries throw, but later ones succeed
          if (callCount <= 3) {
            throw new Error('Query failed');
          }
          if (query.includes('history_visits')) {
            return [
              {
                columns: [
                  'lastVisitTime',
                  'url',
                  'title',
                  'eventEntity',
                  'referrer',
                  'eventEntityType',
                  'eventType',
                  'browser',
                ],
                values: [
                  [
                    700000000,
                    'https://safari.com',
                    'Safari',
                    'https://safari.com',
                    '',
                    'URL',
                    'Visit',
                    'Safari',
                  ],
                ],
              },
            ];
          }
          return [];
        }),
      };

      // Should not throw even though some queries fail
      expect(() => queryBrowserHistory(mockSqlDb)).not.toThrow();

      const result = queryBrowserHistory(mockSqlDb);
      expect(result.history).toBeDefined();
    });

    it('returns empty history when all queries fail', () => {
      const mockSqlDb = {
        exec: vi.fn(() => {
          throw new Error('Query failed');
        }),
      };

      const result = queryBrowserHistory(mockSqlDb);

      expect(result.history).toEqual([]);
    });
  });

  describe('empty database', () => {
    it('returns empty history when database has no data', () => {
      const mockSqlDb = {
        exec: vi.fn(() => []),
      };

      const result = queryBrowserHistory(mockSqlDb);

      expect(result.history).toEqual([]);
    });

    it('clears existing history before processing', () => {
      const mockSqlDb = {
        exec: vi.fn(() => []),
      };

      queryBrowserHistory(mockSqlDb);

      expect(db.history.clear).toHaveBeenCalled();
    });
  });
});
