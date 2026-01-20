'use client';

import { memo, useCallback } from 'react';
import {
  useHistoryData,
  useHistoryFilters,
  useHistoryPagination,
} from '../context/HistoryContext';
import { Button } from '../../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { DEFAULT_RANGE_FILTERS, RANGE_FILTER_FIELDS } from '@/config/filters';
import EventTypeFilter from './EventTypeFilter';
import RangeSliderFilter from './RangeSliderFilter';
import { X } from 'lucide-react';
import { FaFilter } from 'react-icons/fa';

const FilterBy = memo(function FilterBy() {
  const { eventTypes, statsBounds } = useHistoryData();
  const {
    filteredEventTypes,
    setFilteredEventTypes,
    rangeFilters,
    setRangeFilters,
  } = useHistoryFilters();
  const { setPage } = useHistoryPagination();
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

  const handleToggle = useCallback(
    (eventType) => {
      const newValue = selectedTypes.includes(eventType)
        ? selectedTypes.filter((t) => t !== eventType)
        : [...selectedTypes, eventType];
      setFilteredEventTypes({ value: newValue });
      setPage(1);
    },
    [selectedTypes, setFilteredEventTypes, setPage],
  );

  const handleSliderChange = useCallback(
    (key, values) => {
      const bounds = statsBounds[key];
      setRangeFilters((prev) => ({
        ...prev,
        [key]: {
          min: values[0] === bounds.min ? null : values[0],
          max: values[1] === bounds.max ? null : values[1],
        },
      }));
      setPage(1);
    },
    [statsBounds, setRangeFilters, setPage],
  );

  const handleClear = useCallback(
    (e) => {
      e.stopPropagation();
      setFilteredEventTypes({ value: [] });
      setRangeFilters(DEFAULT_RANGE_FILTERS);
      setPage(1);
    },
    [setFilteredEventTypes, setRangeFilters, setPage],
  );

  return (
    <Popover>
      <div className="flex items-center gap-1">
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={`justify-between gap-2 ${
              hasFilters
                ? 'border-stroke-active text-fg-primary'
                : 'border-stroke-default text-fg-secondary'
            } hover:border-stroke-subtle hover:bg-transparent`}
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
            className="text-fg-muted hover:text-fg-emphasis"
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

          <div className="space-y-5 pt-2 border-t border-stroke-default">
            <span className="text-xs text-fg-secondary uppercase tracking-wide">
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
});

export default FilterBy;
