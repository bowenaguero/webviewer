'use client';

import { memo, useMemo } from 'react';
import { GeistMono } from 'geist/font/mono';
import { TableCell, TableRow } from '../ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { capitalizeFirstLetter } from '@/lib/helpers';
import EventIcon from '../event/EventIcon';
import ActionsMenu from './ActionsMenu';
import { COL_WIDTHS } from './config';
import { useItemDetails } from './useItemDetails';

const HistoryRow = memo(function HistoryRow({ item }) {
  const { hasEventDetails, hasAdditionalFields, hasDetails, detailsText } =
    useItemDetails(item);

  // Pre-compute formatted dates for tooltip to avoid creating Date objects in render
  const tooltipDates = useMemo(
    () => ({
      firstSeen: item.url_first_visit
        ? new Date(item.url_first_visit).toLocaleDateString()
        : '—',
      lastSeen: item.url_last_visit
        ? new Date(item.url_last_visit).toLocaleDateString()
        : '—',
    }),
    [item.url_first_visit, item.url_last_visit],
  );

  return (
    <TableRow
      className={`bg-transparent border-gray-800 hover:bg-gray-800/50 font-medium ${GeistMono.className}`}
    >
      <TableCell className={`${COL_WIDTHS.actions} px-2 py-1.5`}>
        <ActionsMenu event={item} />
      </TableCell>
      <TableCell
        className={`${COL_WIDTHS.time} text-gray-500 text-sm px-3 py-1.5`}
      >
        <span className="truncate block">{item.visitTimeFormatted}</span>
      </TableCell>
      <TableCell className={`${COL_WIDTHS.type} px-2 py-1.5`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-default">
              <EventIcon size="sm" eventType={item.eventType} />
            </span>
          </TooltipTrigger>
          <TooltipContent side="right">
            {capitalizeFirstLetter(item.eventType)}
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell className={`${COL_WIDTHS.url} px-3 py-1.5`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={'text-sm text-gray-300 truncate block cursor-default'}
            >
              {item.url}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xl">
            <div className="space-y-2">
              <p className="break-all text-sm">{item.url}</p>
              <div className="border-t border-gray-700 pt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>
                  <span className="text-gray-400">URL Visits:</span>{' '}
                  <span>{item.url_count || 0}</span>
                </div>
                <div>
                  <span className="text-gray-400">Domain Visits:</span>{' '}
                  <span>{item.domain_count || 0}</span>
                </div>
                <div>
                  <span className="text-gray-400">First Seen:</span>{' '}
                  <span>{tooltipDates.firstSeen}</span>
                </div>
                <div>
                  <span className="text-gray-400">Domain URLs:</span>{' '}
                  <span>{item.domain_unique_urls || 0}</span>
                </div>
                <div>
                  <span className="text-gray-400">Last Seen:</span>{' '}
                  <span>{tooltipDates.lastSeen}</span>
                </div>
                <div>
                  <span className="text-gray-400">Domain:</span>{' '}
                  <span className="truncate">{item.domain}</span>
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell className={`${COL_WIDTHS.title} px-3 py-1.5`}>
        <div className="min-w-0">
          {/* Line 1: Title */}
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={
                  'text-sm text-gray-400 truncate block cursor-default'
                }
              >
                {item.title || 'Untitled'}
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-lg">
              <p className="break-all">{item.title || 'Untitled'}</p>
            </TooltipContent>
          </Tooltip>
          {/* Line 2: Details (if any) */}
          {hasDetails && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className={
                    'text-[10px] text-gray-600 truncate block cursor-default mt-0.5'
                  }
                >
                  {detailsText}
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-lg">
                <div className="space-y-1">
                  {hasEventDetails && item.eventEntity && (
                    <p>
                      <span className="text-gray-400">
                        {item.eventEntityType}:{' '}
                      </span>
                      <span className="break-all">{item.eventEntity}</span>
                    </p>
                  )}
                  {hasAdditionalFields &&
                    Object.entries(item.additionalFields).map(
                      ([key, value]) => (
                        <p key={key}>
                          <span className="text-gray-400">{key}: </span>
                          <span className="break-all">{String(value)}</span>
                        </p>
                      ),
                    )}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
});

export default HistoryRow;
