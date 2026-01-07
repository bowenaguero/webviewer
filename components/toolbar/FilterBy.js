'use client';

import EventIcon from '../event/EventIcon';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { capitalizeFirstLetter } from '../utils/helpers';
import { X } from 'lucide-react';
import { FaFilter } from 'react-icons/fa';

export default function FilterBy({
  eventTypes,
  setFilteredEventTypes,
  filteredEventTypes,
  setPage,
}) {
  const selectedTypes = filteredEventTypes.value || [];
  const hasFilters = selectedTypes.length > 0;

  const handleToggle = (eventType) => {
    const newValue = selectedTypes.includes(eventType)
      ? selectedTypes.filter((t) => t !== eventType)
      : [...selectedTypes, eventType];

    setFilteredEventTypes({ value: newValue });
    setPage(1);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setFilteredEventTypes({ value: [] });
    setPage(1);
  };

  return (
    <Popover>
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
          {hasFilters && (
            <>
              <span>{`${selectedTypes.length} selected`}</span>
              <X className="size-4 hover:opacity-70" onClick={handleClear} />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="flex flex-col gap-2">
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
      </PopoverContent>
    </Popover>
  );
}
