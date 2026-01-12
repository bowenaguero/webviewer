// Optimized filter using Set for O(1) lookups
export const filterByEventTypes = (items, filteredEventTypes) => {
  if (filteredEventTypes.value.length === 0) return items;
  const typeSet = new Set(filteredEventTypes.value);
  return items.filter((item) => typeSet.has(item.eventType));
};

export const filterBySearch = (items, search) => {
  if (!search) return items;

  const searchLower = search.toLowerCase();

  // Try regex first
  let regex;
  try {
    regex = new RegExp(search, 'i');
  } catch {
    regex = null;
  }

  return items.filter((item) => {
    if (regex) {
      return (
        regex.test(item.url) ||
        regex.test(item.title || '') ||
        regex.test(item.eventType) ||
        regex.test(item.eventEntity || '')
      );
    }
    // Fallback to simple string matching
    return (
      item.url.toLowerCase().includes(searchLower) ||
      (item.title && item.title.toLowerCase().includes(searchLower)) ||
      item.eventType.toLowerCase().includes(searchLower) ||
      (item.eventEntity && item.eventEntity.toLowerCase().includes(searchLower))
    );
  });
};

export const sortByDate = (items, sortBy) => {
  const sorted = [...items];
  const multiplier = sortBy === 'desc' ? -1 : 1;
  return sorted.sort((a, b) => multiplier * (a.visitTime - b.visitTime));
};

export const filterByDate = (items, startDate, endDate) => {
  if (!startDate || !endDate) return items;
  return items.filter(
    (item) => item.visitTime >= startDate && item.visitTime <= endDate,
  );
};

export const filterByRanges = (items, rangeFilters) => {
  const activeFilters = Object.entries(rangeFilters).filter(
    ([, range]) => range.min !== null || range.max !== null,
  );
  if (activeFilters.length === 0) return items;

  return items.filter((item) => {
    for (const [field, range] of activeFilters) {
      const value = item[field];
      if (range.min !== null && value < range.min) return false;
      if (range.max !== null && value > range.max) return false;
    }
    return true;
  });
};
