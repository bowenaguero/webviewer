'use client';

import EventIcon from '../event/EventIcon';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Slider } from '../ui/slider';
import { capitalizeFirstLetter } from '../utils/helpers';
import { X } from 'lucide-react';
import { FaFilter } from 'react-icons/fa';

const RANGE_FILTER_CONFIG = [
  { key: 'url_count', label: 'URL', group: 'url' },
  { key: 'domain_count', label: 'FQDN', group: 'domain' },
  // { key: 'domain_unique_urls', label: 'Subdomain URLs', group: 'domain' },
  { key: 'apex_domain_count', label: 'Apex', group: 'apex' },
  // { key: 'apex_domain_unique_urls', label: 'Apex URLs', group: 'apex' },
  // {
  //   key: 'apex_domain_unique_subdomains',
  //   label: 'Apex Subdomains',
  //   group: 'apex',
  // },
];

export default function FilterBy({
  eventTypes,
  setFilteredEventTypes,
  filteredEventTypes,
  rangeFilters,
  setRangeFilters,
  statsBounds,
  setPage,
}) {
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
    setRangeFilters({
      url_count: { min: null, max: null },
      domain_count: { min: null, max: null },
      domain_unique_urls: { min: null, max: null },
      apex_domain_count: { min: null, max: null },
      apex_domain_unique_urls: { min: null, max: null },
      apex_domain_unique_subdomains: { min: null, max: null },
    });
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
          {/* Event Type Filters */}
          <div className="space-y-1">
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              Event Type
            </span>
            <div className="flex flex-col gap-1">
              {eventTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer"
                >
                  <Checkbox
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() => handleToggle(type)}
                  />
                  <EventIcon eventType={type} size="sm" />
                  <span className="text-sm">{capitalizeFirstLetter(type)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Range Filters */}
          <div className="space-y-5 pt-2 border-t border-gray-800">
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              Visits
            </span>
            {RANGE_FILTER_CONFIG.map(({ key, label }) => {
              const bounds = statsBounds[key];
              const current = rangeFilters[key];
              const value = [
                current.min ?? bounds.min,
                current.max ?? bounds.max,
              ];
              const isActive = current.min !== null || current.max !== null;

              const handleInputChange = (index, inputValue) => {
                const num = parseInt(inputValue, 10);
                if (isNaN(num)) return;
                const clamped = Math.max(bounds.min, Math.min(bounds.max, num));
                const newValue = [...value];
                newValue[index] = clamped;
                if (index === 0 && clamped > value[1]) newValue[1] = clamped;
                if (index === 1 && clamped < value[0]) newValue[0] = clamped;
                handleSliderChange(key, newValue);
              };

              return (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span
                      className={isActive ? 'text-gray-200' : 'text-gray-400'}
                    >
                      {label}
                    </span>
                    <div className="flex items-center gap-1 tabular-nums">
                      <input
                        type="number"
                        value={value[0]}
                        min={bounds.min}
                        max={bounds.max}
                        onChange={(e) => handleInputChange(0, e.target.value)}
                        className="w-12 px-1 py-0.5 text-right text-gray-300 bg-gray-800 border border-gray-700 rounded text-xs focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-gray-600">–</span>
                      <input
                        type="number"
                        value={value[1]}
                        min={bounds.min}
                        max={bounds.max}
                        onChange={(e) => handleInputChange(1, e.target.value)}
                        className="w-12 px-1 py-0.5 text-right text-gray-300 bg-gray-800 border border-gray-700 rounded text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <Slider
                    value={value}
                    min={bounds.min}
                    max={bounds.max}
                    step={1}
                    onValueChange={(v) => handleSliderChange(key, v)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
