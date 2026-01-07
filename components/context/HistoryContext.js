'use client';

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useDeferredValue,
  useTransition,
} from 'react';

const HistoryContext = createContext(null);

// Optimized filter functions - avoid unnecessary array copies
const filterByEventTypes = (items, filteredEventTypes) => {
  if (filteredEventTypes.value.length === 0) return items;
  const typeSet = new Set(filteredEventTypes.value);
  return items.filter((item) => typeSet.has(item.eventType));
};

const filterBySearch = (items, search) => {
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

const filterByDate = (items, startDate, endDate) => {
  if (!startDate || !endDate) return items;
  return items.filter(
    (item) => item.visitTime >= startDate && item.visitTime <= endDate,
  );
};

export function HistoryProvider({ children, history }) {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [sortBy, setSortBy] = useState('desc');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredEventTypes, setFilteredEventTypes] = useState({ value: [] });
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Defer the search value to keep UI responsive
  const deferredSearch = useDeferredValue(search);

  // Pre-sort the history once (most queries want desc order)
  const sortedHistory = useMemo(() => {
    const sorted = [...history];
    sorted.sort((a, b) => b.visitTime - a.visitTime);
    return sorted;
  }, [history]);

  // Calculate date range from raw history (O(n) but only once)
  const dateRange = useMemo(() => {
    if (history.length === 0) {
      return { minDate: new Date(), maxDate: new Date() };
    }
    let min = Infinity;
    let max = -Infinity;
    for (const item of history) {
      if (item.visitTime < min) min = item.visitTime;
      if (item.visitTime > max) max = item.visitTime;
    }
    return {
      minDate: new Date(min),
      maxDate: new Date(max),
    };
  }, [history]);

  // Extract unique event types once
  const eventTypes = useMemo(() => {
    const types = new Set();
    for (const item of history) {
      types.add(item.eventType);
    }
    return [...types];
  }, [history]);

  // Process history with filters
  const processedHistory = useMemo(() => {
    // Start with pre-sorted data (desc) or reverse for asc
    let filtered =
      sortBy === 'desc' ? sortedHistory : [...sortedHistory].reverse();
    filtered = filterByEventTypes(filtered, filteredEventTypes);
    filtered = filterBySearch(filtered, deferredSearch);
    filtered = filterByDate(filtered, startDate, endDate);
    return filtered;
  }, [
    sortedHistory,
    sortBy,
    filteredEventTypes,
    deferredSearch,
    startDate,
    endDate,
  ]);

  const totalCount = processedHistory.length;
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = processedHistory.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Wrap setSearch to use transition
  const handleSetSearch = (value) => {
    setSearching(true);
    startTransition(() => {
      setSearch(value);
      setSearching(false);
    });
  };

  const value = {
    history,
    processedHistory,
    currentItems,
    totalCount,
    eventTypes,
    dateRange,
    page,
    setPage,
    itemsPerPage,
    setItemsPerPage,
    sortBy,
    setSortBy,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    filteredEventTypes,
    setFilteredEventTypes,
    search,
    setSearch: handleSetSearch,
    searching: searching || isPending,
    setSearching,
  };

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
