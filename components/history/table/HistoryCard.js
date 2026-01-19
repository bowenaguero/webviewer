'use client';

import { memo } from 'react';
import { GeistMono } from 'geist/font/mono';
import EventIcon from '../../event/EventIcon';
import ActionsMenu from './ActionsMenu';
import { useItemDetails } from '@/hooks';
import { capitalizeFirstLetter } from '@/lib/helpers';

const HistoryCard = memo(function HistoryCard({ item }) {
  const { hasDetails, detailsText } = useItemDetails(item);

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
