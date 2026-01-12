'use client';

import { memo } from 'react';
import { GeistMono } from 'geist/font/mono';
import EventIcon from '../event/EventIcon';
import ActionsMenu from './ActionsMenu';
import { capitalizeFirstLetter } from '../utils/helpers';

const HistoryCard = memo(function HistoryCard({ item }) {
  const hasEventDetails = item.eventType !== 'Visit';
  const hasAdditionalFields =
    Object.keys(item.additionalFields || {}).length > 0;
  const hasDetails = hasEventDetails || hasAdditionalFields;

  // Build details string
  const detailsParts = [];
  if (hasEventDetails && item.eventEntity) {
    detailsParts.push(`${item.eventEntityType}: ${item.eventEntity}`);
  }
  if (hasAdditionalFields) {
    Object.entries(item.additionalFields).forEach(([key, value]) => {
      detailsParts.push(`${key}: ${String(value)}`);
    });
  }
  const detailsText = detailsParts.join(' · ');

  return (
    <div
      className={`bg-gray-950 border border-gray-800 rounded-lg p-4 space-y-3 ${GeistMono.className}`}
    >
      {/* Header: Event type + Time + Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EventIcon size="sm" eventType={item.eventType} />
          <span className="text-xs text-gray-500">
            {capitalizeFirstLetter(item.eventType)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{item.visitTimeFormatted}</span>
          <ActionsMenu event={item} />
        </div>
      </div>

      {/* Title */}
      <div className="min-w-0">
        <p className="text-sm text-gray-300 truncate">
          {item.title || 'Untitled'}
        </p>
      </div>

      {/* URL */}
      <div className="min-w-0">
        <p className="text-xs text-gray-500 truncate">{item.url}</p>
      </div>

      {/* Details (if any) */}
      {hasDetails && (
        <div className="pt-2 border-t border-gray-800">
          <p className="text-[10px] text-gray-600 truncate">{detailsText}</p>
        </div>
      )}
    </div>
  );
});

export default HistoryCard;
