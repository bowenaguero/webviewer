'use client';

import { useHistory } from '../context/HistoryContext';
import PaginationMenu from '../table/PaginationMenu';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import FilterBy from './FilterBy';
import ItemsPerPage from './ItemsPerPage';
import SearchBar from './SearchBar';
import SortBy from './SortBy';
import { CalendarIcon, X } from 'lucide-react';

export default function ToolBar() {
  const {
    itemsPerPage,
    setItemsPerPage,
    sortBy,
    setSortBy,
    page,
    setPage,
    totalCount,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setFilteredEventTypes,
    setSearch,
    search,
    filteredEventTypes,
    eventTypes,
    dateRange,
    rangeFilters,
    setRangeFilters,
    statsBounds,
  } = useHistory();

  return (
    <div className="flex justify-between gap-5 mt-5 items-center">
      <div className="w-[30%] flex justify-start gap-3">
        <ItemsPerPage
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
        <SortBy sortBy={sortBy} setSortBy={setSortBy} />
      </div>
      <div className="w-[30%] flex justify-center gap-3">
        <SearchBar setSearch={setSearch} search={search} />
      </div>
      <div className="flex justify-end items-center gap-5 w-[30%]">
        <DateRangePicker
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          dateRange={dateRange}
          setPage={setPage}
        />
        <FilterBy
          eventTypes={eventTypes}
          setFilteredEventTypes={setFilteredEventTypes}
          filteredEventTypes={filteredEventTypes}
          rangeFilters={rangeFilters}
          setRangeFilters={setRangeFilters}
          statsBounds={statsBounds}
          setPage={setPage}
        />
        <PaginationMenu
          page={page}
          setPage={setPage}
          itemsPerPage={itemsPerPage}
          count={totalCount}
          style="compact"
        />
      </div>
    </div>
  );
}

function DateRangePicker({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  dateRange,
  setPage,
}) {
  const hasDateFilter = startDate && endDate;

  const handleSelect = (range) => {
    setStartDate(range?.from || null);
    setEndDate(range?.to || null);
    setPage(1);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setStartDate(null);
    setEndDate(null);
    setPage(1);
  };

  return (
    <Popover>
      <div className="flex items-center gap-1">
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={`justify-between gap-2 ${
              hasDateFilter
                ? 'border-gray-300 text-gray-300'
                : 'border-gray-800 text-gray-500'
            } hover:border-gray-700 hover:bg-transparent`}
          >
            <CalendarIcon className="size-4" />
            {hasDateFilter && (
              <span>{`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}</span>
            )}
          </Button>
        </PopoverTrigger>
        {hasDateFilter && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-200"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={{ from: startDate, to: endDate }}
          onSelect={handleSelect}
          fromDate={dateRange.minDate}
          toDate={dateRange.maxDate}
          numberOfMonths={1}
        />
      </PopoverContent>
    </Popover>
  );
}
