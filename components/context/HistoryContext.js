'use client';

import { createContext, useContext, useState, useMemo } from 'react';
import {
  filterByEventTypes,
  filterBySearch,
  sortByDate,
  filterByDate,
} from '../utils/filterBrowserHistory';

const HistoryContext = createContext(null);

export function HistoryProvider({ children, history }) {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('desc');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredEventTypes, setFilteredEventTypes] = useState({ value: [] });
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);

  const processedHistory = useMemo(() => {
    let filtered = [...history];
    filtered = filterByEventTypes(filtered, filteredEventTypes);
    filtered = filterBySearch(filtered, search);
    filtered = filterByDate(filtered, startDate, endDate);
    filtered = sortByDate(filtered, sortBy);
    return filtered;
  }, [history, sortBy, filteredEventTypes, search, startDate, endDate]);

  const eventTypes = useMemo(() => {
    return [...new Set(history.map((item) => item.eventType))];
  }, [history]);

  const dateRange = useMemo(() => {
    const dates = processedHistory.map((item) => new Date(item.visitTime));
    if (dates.length === 0) {
      return { minDate: new Date(), maxDate: new Date() };
    }
    return {
      minDate: new Date(Math.min(...dates)),
      maxDate: new Date(Math.max(...dates)),
    };
  }, [processedHistory]);

  const totalCount = processedHistory.length;
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = processedHistory.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
    setSearch,
    searching,
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
