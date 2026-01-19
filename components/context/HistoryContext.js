'use client';

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useDeferredValue,
  useTransition,
  useCallback,
} from 'react';
import { combinedFilter } from '@/lib/filters';
import { DEFAULT_RANGE_FILTERS } from '@/lib/rangeFilters';
import { useStatsBounds } from './useStatsBounds';

// Split contexts to minimize re-renders
const HistoryDataContext = createContext(null);
const HistoryFiltersContext = createContext(null);
const HistoryPaginationContext = createContext(null);

export function HistoryProvider({ children, history }) {
  // Pagination state
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Filter state
  const [sortBy, setSortBy] = useState('desc');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredEventTypes, setFilteredEventTypes] = useState({ value: [] });
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [rangeFilters, setRangeFilters] = useState(DEFAULT_RANGE_FILTERS);

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
  const statsBounds = useStatsBounds(history);

  // Process history with combined filter (single iteration)
  const processedHistory = useMemo(() => {
    // Start with pre-sorted data (desc) or reverse for asc
    const source = sortBy === 'desc' ? sortedHistory : [...sortedHistory].reverse();
    return combinedFilter(source, {
      eventTypes: filteredEventTypes,
      search: deferredSearch,
      startDate,
      endDate,
      rangeFilters,
    });
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
  const handleSetSearch = useCallback((value) => {
    setSearching(true);
    startTransition(() => {
      setSearch(value);
      setSearching(false);
    });
  }, []);

  // Stable setters wrapped in useCallback
  const stableSetPage = useCallback((v) => setPage(v), []);
  const stableSetItemsPerPage = useCallback((v) => setItemsPerPage(v), []);
  const stableSetSortBy = useCallback((v) => setSortBy(v), []);
  const stableSetStartDate = useCallback((v) => setStartDate(v), []);
  const stableSetEndDate = useCallback((v) => setEndDate(v), []);
  const stableSetFilteredEventTypes = useCallback((v) => setFilteredEventTypes(v), []);
  const stableSetRangeFilters = useCallback((v) => setRangeFilters(v), []);

  // Memoize context values to prevent unnecessary re-renders
  const dataValue = useMemo(
    () => ({
      history,
      processedHistory,
      currentItems,
      totalCount,
      eventTypes,
      dateRange,
      statsBounds,
      searching: searching || isPending,
    }),
    [
      history,
      processedHistory,
      currentItems,
      totalCount,
      eventTypes,
      dateRange,
      statsBounds,
      searching,
      isPending,
    ],
  );

  const filtersValue = useMemo(
    () => ({
      sortBy,
      setSortBy: stableSetSortBy,
      startDate,
      setStartDate: stableSetStartDate,
      endDate,
      setEndDate: stableSetEndDate,
      filteredEventTypes,
      setFilteredEventTypes: stableSetFilteredEventTypes,
      rangeFilters,
      setRangeFilters: stableSetRangeFilters,
      search,
      setSearch: handleSetSearch,
    }),
    [
      sortBy,
      stableSetSortBy,
      startDate,
      stableSetStartDate,
      endDate,
      stableSetEndDate,
      filteredEventTypes,
      stableSetFilteredEventTypes,
      rangeFilters,
      stableSetRangeFilters,
      search,
      handleSetSearch,
    ],
  );

  const paginationValue = useMemo(
    () => ({
      page,
      setPage: stableSetPage,
      itemsPerPage,
      setItemsPerPage: stableSetItemsPerPage,
    }),
    [page, stableSetPage, itemsPerPage, stableSetItemsPerPage],
  );

  return (
    <HistoryDataContext.Provider value={dataValue}>
      <HistoryFiltersContext.Provider value={filtersValue}>
        <HistoryPaginationContext.Provider value={paginationValue}>
          {children}
        </HistoryPaginationContext.Provider>
      </HistoryFiltersContext.Provider>
    </HistoryDataContext.Provider>
  );
}

// Hook for components that only need data (read-only)
export function useHistoryData() {
  const context = useContext(HistoryDataContext);
  if (!context) {
    throw new Error('useHistoryData must be used within a HistoryProvider');
  }
  return context;
}

// Hook for components that need filter controls
export function useHistoryFilters() {
  const context = useContext(HistoryFiltersContext);
  if (!context) {
    throw new Error('useHistoryFilters must be used within a HistoryProvider');
  }
  return context;
}

// Hook for components that need pagination controls
export function useHistoryPagination() {
  const context = useContext(HistoryPaginationContext);
  if (!context) {
    throw new Error('useHistoryPagination must be used within a HistoryProvider');
  }
  return context;
}
