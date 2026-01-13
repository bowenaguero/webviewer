import { describe, it, expect } from 'vitest';
import {
  filterByEventTypes,
  filterBySearch,
  sortByDate,
  filterByDate,
  filterByRanges,
} from './filters';

describe('filterByEventTypes', () => {
  const mockItems = [
    { eventType: 'Visit', url: 'https://example.com' },
    { eventType: 'Download', url: 'https://example.com/file.zip' },
    { eventType: 'Bookmark', url: 'https://saved.com' },
    { eventType: 'Visit', url: 'https://another.com' },
  ];

  it('returns all items when filter value is empty', () => {
    const result = filterByEventTypes(mockItems, { value: [] });
    expect(result).toEqual(mockItems);
  });

  it('filters items by single event type', () => {
    const result = filterByEventTypes(mockItems, { value: ['Visit'] });
    expect(result).toHaveLength(2);
    expect(result.every((item) => item.eventType === 'Visit')).toBe(true);
  });

  it('filters items by multiple event types', () => {
    const result = filterByEventTypes(mockItems, {
      value: ['Visit', 'Download'],
    });
    expect(result).toHaveLength(3);
  });

  it('returns empty array when no matches found', () => {
    const result = filterByEventTypes(mockItems, { value: ['Search'] });
    expect(result).toHaveLength(0);
  });

  it('handles empty items array', () => {
    const result = filterByEventTypes([], { value: ['Visit'] });
    expect(result).toHaveLength(0);
  });
});

describe('filterBySearch', () => {
  const mockItems = [
    {
      url: 'https://google.com',
      title: 'Google Search',
      eventType: 'Visit',
      eventEntity: null,
    },
    {
      url: 'https://github.com',
      title: 'GitHub',
      eventType: 'Visit',
      eventEntity: 'code',
    },
    {
      url: 'https://example.com/file.pdf',
      title: 'Document',
      eventType: 'Download',
      eventEntity: 'file.pdf',
    },
  ];

  it('returns all items when search is empty string', () => {
    expect(filterBySearch(mockItems, '')).toEqual(mockItems);
  });

  it('returns all items when search is null', () => {
    expect(filterBySearch(mockItems, null)).toEqual(mockItems);
  });

  it('returns all items when search is undefined', () => {
    expect(filterBySearch(mockItems, undefined)).toEqual(mockItems);
  });

  it('filters by URL match (case-insensitive)', () => {
    const result = filterBySearch(mockItems, 'github');
    expect(result).toHaveLength(1);
    expect(result[0].url).toBe('https://github.com');
  });

  it('filters by title match', () => {
    const result = filterBySearch(mockItems, 'Google');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Google Search');
  });

  it('filters by eventType match', () => {
    const result = filterBySearch(mockItems, 'Download');
    expect(result).toHaveLength(1);
    expect(result[0].eventType).toBe('Download');
  });

  it('filters by eventEntity match', () => {
    const result = filterBySearch(mockItems, 'file.pdf');
    expect(result).toHaveLength(1);
    expect(result[0].eventEntity).toBe('file.pdf');
  });

  it('supports regex patterns', () => {
    const result = filterBySearch(mockItems, 'g[io]t');
    expect(result).toHaveLength(1);
    expect(result[0].url).toBe('https://github.com');
  });

  it('falls back to string matching for invalid regex', () => {
    // Invalid regex: unclosed bracket
    const result = filterBySearch(mockItems, '[invalid');
    expect(result).toHaveLength(0);
  });

  it('handles items with null title gracefully', () => {
    const itemsWithNull = [
      { url: 'https://test.com', title: null, eventType: 'Visit', eventEntity: null },
    ];
    const result = filterBySearch(itemsWithNull, 'test');
    expect(result).toHaveLength(1);
  });

  it('handles items with null eventEntity gracefully', () => {
    const result = filterBySearch(mockItems, 'nonexistent');
    expect(result).toHaveLength(0);
  });
});

describe('sortByDate', () => {
  const mockItems = [
    { visitTime: 1000 },
    { visitTime: 3000 },
    { visitTime: 2000 },
  ];

  it('sorts ascending when sortBy is "asc"', () => {
    const result = sortByDate(mockItems, 'asc');
    expect(result[0].visitTime).toBe(1000);
    expect(result[1].visitTime).toBe(2000);
    expect(result[2].visitTime).toBe(3000);
  });

  it('sorts descending when sortBy is "desc"', () => {
    const result = sortByDate(mockItems, 'desc');
    expect(result[0].visitTime).toBe(3000);
    expect(result[1].visitTime).toBe(2000);
    expect(result[2].visitTime).toBe(1000);
  });

  it('does not mutate original array', () => {
    const original = [...mockItems];
    sortByDate(mockItems, 'asc');
    expect(mockItems).toEqual(original);
  });

  it('handles empty array', () => {
    const result = sortByDate([], 'asc');
    expect(result).toEqual([]);
  });

  it('handles single item array', () => {
    const single = [{ visitTime: 1000 }];
    const result = sortByDate(single, 'asc');
    expect(result).toEqual(single);
  });
});

describe('filterByDate', () => {
  const mockItems = [
    { visitTime: 1000 },
    { visitTime: 2000 },
    { visitTime: 3000 },
    { visitTime: 4000 },
  ];

  it('returns all items when startDate is null', () => {
    expect(filterByDate(mockItems, null, 3000)).toEqual(mockItems);
  });

  it('returns all items when endDate is null', () => {
    expect(filterByDate(mockItems, 1000, null)).toEqual(mockItems);
  });

  it('returns all items when both dates are null', () => {
    expect(filterByDate(mockItems, null, null)).toEqual(mockItems);
  });

  it('filters items within date range (inclusive)', () => {
    const result = filterByDate(mockItems, 2000, 3000);
    expect(result).toHaveLength(2);
    expect(result[0].visitTime).toBe(2000);
    expect(result[1].visitTime).toBe(3000);
  });

  it('returns empty array when no items in range', () => {
    const result = filterByDate(mockItems, 5000, 6000);
    expect(result).toHaveLength(0);
  });

  it('handles single item in range', () => {
    const result = filterByDate(mockItems, 2000, 2000);
    expect(result).toHaveLength(1);
    expect(result[0].visitTime).toBe(2000);
  });

  it('handles empty items array', () => {
    const result = filterByDate([], 1000, 2000);
    expect(result).toEqual([]);
  });
});

describe('filterByRanges', () => {
  const mockItems = [
    { url_count: 5, domain_count: 10 },
    { url_count: 15, domain_count: 20 },
    { url_count: 25, domain_count: 30 },
  ];

  it('returns all items when no active filters', () => {
    const filters = { url_count: { min: null, max: null } };
    expect(filterByRanges(mockItems, filters)).toEqual(mockItems);
  });

  it('returns all items when filters object is empty', () => {
    expect(filterByRanges(mockItems, {})).toEqual(mockItems);
  });

  it('filters by minimum value', () => {
    const filters = { url_count: { min: 10, max: null } };
    const result = filterByRanges(mockItems, filters);
    expect(result).toHaveLength(2);
    expect(result[0].url_count).toBe(15);
    expect(result[1].url_count).toBe(25);
  });

  it('filters by maximum value', () => {
    const filters = { url_count: { min: null, max: 20 } };
    const result = filterByRanges(mockItems, filters);
    expect(result).toHaveLength(2);
    expect(result[0].url_count).toBe(5);
    expect(result[1].url_count).toBe(15);
  });

  it('filters by both min and max', () => {
    const filters = { url_count: { min: 10, max: 20 } };
    const result = filterByRanges(mockItems, filters);
    expect(result).toHaveLength(1);
    expect(result[0].url_count).toBe(15);
  });

  it('filters by multiple fields', () => {
    const filters = {
      url_count: { min: 10, max: null },
      domain_count: { min: null, max: 25 },
    };
    const result = filterByRanges(mockItems, filters);
    expect(result).toHaveLength(1);
    expect(result[0].url_count).toBe(15);
    expect(result[0].domain_count).toBe(20);
  });

  it('handles inclusive boundaries', () => {
    const filters = { url_count: { min: 15, max: 15 } };
    const result = filterByRanges(mockItems, filters);
    expect(result).toHaveLength(1);
    expect(result[0].url_count).toBe(15);
  });

  it('handles empty items array', () => {
    const filters = { url_count: { min: 10, max: null } };
    const result = filterByRanges([], filters);
    expect(result).toEqual([]);
  });
});
