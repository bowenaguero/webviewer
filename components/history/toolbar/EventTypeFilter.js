'use client';

import { memo } from 'react';
import EventIcon from '../../event/EventIcon';
import { Checkbox } from '../../ui/checkbox';
import { capitalizeFirstLetter } from '@/lib/helpers';

const EventTypeFilter = memo(function EventTypeFilter({ eventTypes, selectedTypes, onToggle }) {
  return (
    <div className="space-y-1">
      <span className="text-xs text-fg-secondary uppercase tracking-wide">
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
              onCheckedChange={() => onToggle(type)}
            />
            <EventIcon eventType={type} size="sm" />
            <span className="text-sm">{capitalizeFirstLetter(type)}</span>
          </label>
        ))}
      </div>
    </div>
  );
});

export default EventTypeFilter;
