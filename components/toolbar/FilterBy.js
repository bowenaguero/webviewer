'use client';

import { useHistory } from '../context/HistoryContext';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { DEFAULT_RANGE_FILTERS, RANGE_FILTER_FIELDS } from '../lib/rangeFilters';
import EventTypeFilter from './EventTypeFilter';
import RangeSliderFilter from './RangeSliderFilter';
import { X } from 'lucide-react';
import { FaFilter } from 'react-icons/fa';

export default function FilterBy() {
  const {
    eventTypes,
    filteredEventTypes,
    setFilteredEventTypes,
    rangeFilters,
    setRangeFilters,
    statsBounds,
    setPage,
  } = useHistory();
  const selectedTypes = filteredEventTypes.value || [];
  const hasTypeFilters = selectedTypes.length > 0;
  const hasRangeFilters = Object.values(rangeFilters).some(
    (r) => r.min !== null || r.max !== null,
  );
  const hasFilters = hasTypeFilters || hasRangeFilters;

  const activeFilterCount =
    selectedTypes.length +
    Object.values(rangeFilters).filter((r) => r.min !== null || r.max !== null)
      .length;

  const handleToggle = (eventType) => {
    const newValue = selectedTypes.includes(eventType)
      ? selectedTypes.filter((t) => t !== eventType)
      : [...selectedTypes, eventType];
    setFilteredEventTypes({ value: newValue });
    setPage(1);
  };

  const handleSliderChange = (key, values) => {
    const bounds = statsBounds[key];
    setRangeFilters((prev) => ({
      ...prev,
      [key]: {
        min: values[0] === bounds.min ? null : values[0],
        max: values[1] === bounds.max ? null : values[1],
      },
    }));
    setPage(1);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setFilteredEventTypes({ value: [] });
    setRangeFilters(DEFAULT_RANGE_FILTERS);
    setPage(1);
  };

  return (
    <Popover>
      <div className="flex items-center gap-1">
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={`justify-between gap-2 ${
              hasFilters
                ? 'border-gray-300 text-gray-300'
                : 'border-gray-800 text-gray-500'
            } hover:border-gray-700 hover:bg-transparent`}
          >
            <FaFilter className="size-3" />
            {hasFilters && <span>{activeFilterCount} active</span>}
          </Button>
        </PopoverTrigger>
        {hasFilters && (
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
      <PopoverContent className="w-64 p-3">
        <div className="space-y-4">
          <EventTypeFilter
            eventTypes={eventTypes}
            selectedTypes={selectedTypes}
            onToggle={handleToggle}
          />

          <div className="space-y-5 pt-2 border-t border-gray-800">
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              Visits
            </span>
            {RANGE_FILTER_FIELDS.map(({ key, label }) => {
              const bounds = statsBounds[key];
              const current = rangeFilters[key];
              const value = [
                current.min ?? bounds.min,
                current.max ?? bounds.max,
              ];
              const isActive = current.min !== null || current.max !== null;

              return (
                <RangeSliderFilter
                  key={key}
                  label={label}
                  bounds={bounds}
                  value={value}
                  isActive={isActive}
                  onChange={(v) => handleSliderChange(key, v)}
                />
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
