import { vi } from 'vitest';

/**
 * Global test setup for Vitest
 *
 * This file runs before each test file. Common mocks are centralized here
 * to avoid duplication across test files.
 */

// Global mock for Dexie (IndexedDB wrapper)
// Used by lib/db.js - mocked to prevent IndexedDB operations during tests
vi.mock('@/lib/db', () => ({
  default: {
    history: {
      add: vi.fn(),
      clear: vi.fn(),
      toArray: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
      bulkAdd: vi.fn(),
      where: vi.fn().mockReturnValue({
        equals: vi.fn().mockReturnValue({
          toArray: vi.fn().mockResolvedValue([]),
        }),
      }),
    },
  },
}));

// Reset all mocks before each test to ensure clean state
beforeEach(() => {
  vi.clearAllMocks();
});
