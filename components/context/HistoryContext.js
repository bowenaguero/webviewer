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

const filterByRanges = (items, rangeFilters) => {
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
  const [rangeFilters, setRangeFilters] = useState({
    url_count: { min: null, max: null },
    domain_count: { min: null, max: null },
    domain_unique_urls: { min: null, max: null },
    apex_domain_count: { min: null, max: null },
    apex_domain_unique_urls: { min: null, max: null },
    apex_domain_unique_subdomains: { min: null, max: null },
  });

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

  // Calculate statistics bounds for range sliders
  const statsBounds = useMemo(() => {
    if (history.length === 0) {
      return {
        url_count: { min: 0, max: 100 },
        domain_count: { min: 0, max: 100 },
        domain_unique_urls: { min: 0, max: 100 },
        apex_domain_count: { min: 0, max: 100 },
        apex_domain_unique_urls: { min: 0, max: 100 },
        apex_domain_unique_subdomains: { min: 0, max: 100 },
      };
    }

    let urlMin = Infinity,
      urlMax = 0;
    let domainMin = Infinity,
      domainMax = 0;
    let uniqueUrlsMin = Infinity,
      uniqueUrlsMax = 0;
    let apexCountMin = Infinity,
      apexCountMax = 0;
    let apexUrlsMin = Infinity,
      apexUrlsMax = 0;
    let apexSubdomainsMin = Infinity,
      apexSubdomainsMax = 0;

    for (const item of history) {
      if (item.url_count < urlMin) urlMin = item.url_count;
      if (item.url_count > urlMax) urlMax = item.url_count;
      if (item.domain_count < domainMin) domainMin = item.domain_count;
      if (item.domain_count > domainMax) domainMax = item.domain_count;
      if (item.domain_unique_urls < uniqueUrlsMin)
        uniqueUrlsMin = item.domain_unique_urls;
      if (item.domain_unique_urls > uniqueUrlsMax)
        uniqueUrlsMax = item.domain_unique_urls;
      if (item.apex_domain_count < apexCountMin)
        apexCountMin = item.apex_domain_count;
      if (item.apex_domain_count > apexCountMax)
        apexCountMax = item.apex_domain_count;
      if (item.apex_domain_unique_urls < apexUrlsMin)
        apexUrlsMin = item.apex_domain_unique_urls;
      if (item.apex_domain_unique_urls > apexUrlsMax)
        apexUrlsMax = item.apex_domain_unique_urls;
      if (item.apex_domain_unique_subdomains < apexSubdomainsMin)
        apexSubdomainsMin = item.apex_domain_unique_subdomains;
      if (item.apex_domain_unique_subdomains > apexSubdomainsMax)
        apexSubdomainsMax = item.apex_domain_unique_subdomains;
    }

    return {
      url_count: { min: urlMin, max: urlMax },
      domain_count: { min: domainMin, max: domainMax },
      domain_unique_urls: { min: uniqueUrlsMin, max: uniqueUrlsMax },
      apex_domain_count: { min: apexCountMin, max: apexCountMax },
      apex_domain_unique_urls: { min: apexUrlsMin, max: apexUrlsMax },
      apex_domain_unique_subdomains: {
        min: apexSubdomainsMin,
        max: apexSubdomainsMax,
      },
    };
  }, [history]);

  // Process history with filters
  const processedHistory = useMemo(() => {
    // Start with pre-sorted data (desc) or reverse for asc
    let filtered =
      sortBy === 'desc' ? sortedHistory : [...sortedHistory].reverse();
    filtered = filterByEventTypes(filtered, filteredEventTypes);
    filtered = filterBySearch(filtered, deferredSearch);
    filtered = filterByDate(filtered, startDate, endDate);
    filtered = filterByRanges(filtered, rangeFilters);
    return filtered;
  }, [
    sortedHistory,
    sortBy,
    filteredEventTypes,
    deferredSearch,
    startDate,
    endDate,
    rangeFilters,
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
    statsBounds,
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
    rangeFilters,
    setRangeFilters,
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
