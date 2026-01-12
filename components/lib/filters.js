export const filterByEventTypes = (items, filteredEventTypes) => {
  if (filteredEventTypes.value.length === 0) {
    return items;
  }
  return items.filter((item) =>
    filteredEventTypes.value.includes(item.eventType)
  );
};

export const filterBySearch = (items, search) => {
  if (!search) {
    return items;
  }

  try {
    const regex = new RegExp(search, 'i');
    return items.filter(
      (item) =>
        regex.test(item.url) ||
        regex.test(item.title || '') ||
        regex.test(item.eventType) ||
        regex.test(JSON.stringify(item.additionalFields))
    );
  } catch {
    // Invalid regex - fall back to simple string matching
    const searchLower = search.toLowerCase();
    return items.filter(
      (item) =>
        item.url.toLowerCase().includes(searchLower) ||
        (item.title && item.title.toLowerCase().includes(searchLower)) ||
        item.eventType.toLowerCase().includes(searchLower)
    );
  }
};

export const sortByDate = (items, sortBy) => {
  const sorted = [...items];
  const multiplier = sortBy === 'desc' ? -1 : 1;
  return sorted.sort((a, b) => multiplier * (a.visitTime - b.visitTime));
};

export const filterByDate = (items, startDate, endDate) => {
  if (!startDate || !endDate) {
    return items;
  }
  return items.filter(
    (item) => item.visitTime >= startDate && item.visitTime <= endDate
  );
};
