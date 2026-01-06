'use client';

import { useHistory } from '../context/HistoryContext';
import PaginationMenu from '../table/PaginationMenu';
import { Button } from '../ui/button';
import { MS_PER_DAY } from '../utils/constants';
import FilterBy from './FilterBy';
import ItemsPerPage from './ItemsPerPage';
import SearchBar from './SearchBar';
import SortBy from './SortBy';
import { X } from 'lucide-react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';

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
  const [isOpen, setIsOpen] = useState(false);

  const handleCalendarClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleClearDate = () => {
    setStartDate(null);
    setEndDate(null);
    setIsOpen(false);
    setPage(1);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setPage(1);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleCalendarClick}
          className="text-gray-400 hover:bg-gray-800"
        >
          <FaCalendarAlt className="size-4" />
        </Button>
        {startDate && endDate && (
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-gray-400 text-sm whitespace-nowrap">
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleClearDate}
              className="hover:bg-gray-800"
            >
              <X className="size-3" />
            </Button>
          </div>
        )}
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 z-[1000] bg-gray-950 p-2">
          <DatePicker
            inline
            selectsRange
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            dateFormat="MM/dd/yyyy"
            minDate={dateRange.minDate}
            maxDate={dateRange.maxDate}
            excludeDateIntervals={[
              {
                start: new Date(0),
                end: new Date(dateRange.minDate.getTime() - MS_PER_DAY),
              },
              {
                start: new Date(dateRange.maxDate.getTime() + MS_PER_DAY),
                end: new Date(2099, 11, 31),
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}
