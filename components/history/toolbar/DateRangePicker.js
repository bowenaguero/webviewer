'use client';

import dynamic from 'next/dynamic';
import {
  useHistoryData,
  useHistoryFilters,
  useHistoryPagination,
} from '../context/HistoryContext';
import { Button } from '../../ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui/popover';
import { CalendarIcon, X } from 'lucide-react';

const Calendar = dynamic(
  () => import('../../ui/calendar').then((m) => m.Calendar),
  { ssr: false },
);

export default function DateRangePicker() {
  const { dateRange } = useHistoryData();
  const { startDate, setStartDate, endDate, setEndDate } = useHistoryFilters();
  const { setPage } = useHistoryPagination();
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
