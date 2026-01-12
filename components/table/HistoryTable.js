'use client';

import { HistoryProvider, useHistory } from '../context/HistoryContext';
import EventIcon from '../event/EventIcon';
import ToolBar from '../toolbar/ToolBar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { capitalizeFirstLetter } from '../lib/helpers';
import ActionsMenu from './ActionsMenu';
import { COL_WIDTHS } from './config';
import HistoryCard from './HistoryCard';
import PaginationMenu from './PaginationMenu';
import { useItemDetails } from './useItemDetails';
import { GeistMono } from 'geist/font/mono';
import { Loader2 } from 'lucide-react';
import { memo } from 'react';

export default function HistoryTable({ history }) {
  return (
    <HistoryProvider history={history}>
      <HistoryTableContent />
    </HistoryProvider>
  );
}

function HistoryTableContent() {
  const { currentItems, totalCount, searching, page, setPage, itemsPerPage } =
    useHistory();

  return (
    <>
      <div className="w-full mb-4">
        <ToolBar />
      </div>

      {/* Desktop: Table view (md and up) */}
      <div className="hidden md:block bg-gray-950 border border-gray-800 rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-transparent border-gray-800 hover:bg-transparent">
              <TableHead className={COL_WIDTHS.actions} />
              <TableHead
                className={`${COL_WIDTHS.time} text-gray-500 text-sm px-3`}
              >
                Time
              </TableHead>
              <TableHead
                className={`${COL_WIDTHS.type} text-gray-500 text-sm px-2`}
              >
                Type
              </TableHead>
              <TableHead
                className={`${COL_WIDTHS.url} text-gray-500 text-sm px-3`}
              >
                URL
              </TableHead>
              <TableHead
                className={`${COL_WIDTHS.title} text-gray-500 text-sm px-3`}
              >
                Title
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {searching ? (
              <SearchingRow />
            ) : (
              currentItems.map((item, index) => (
                <HistoryRow
                  key={`${item.url}-${item.visitTime}-${index}`}
                  item={item}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: Card view (below md) */}
      <div className="md:hidden space-y-3">
        {searching ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-6 text-gray-500 animate-spin" />
          </div>
        ) : (
          currentItems.map((item, index) => (
            <HistoryCard
              key={`card-${item.url}-${item.visitTime}-${index}`}
              item={item}
            />
          ))
        )}
      </div>

      <div className="flex justify-center mt-4 mb-4">
        <PaginationMenu
          page={page}
          setPage={setPage}
          itemsPerPage={itemsPerPage}
          count={totalCount}
        />
      </div>
    </>
  );
}

function SearchingRow() {
  return (
    <TableRow>
      <TableCell colSpan={5} className="py-8 bg-gray-900">
        <div className="flex justify-center items-center">
          <Loader2 className="size-6 text-gray-500 animate-spin" />
        </div>
      </TableCell>
    </TableRow>
  );
}

const HistoryRow = memo(function HistoryRow({ item }) {
  const { hasEventDetails, hasAdditionalFields, hasDetails, detailsText } =
    useItemDetails(item);

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
                  <span>{item.url_first_visit ? new Date(item.url_first_visit).toLocaleDateString() : '—'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Domain URLs:</span>{' '}
                  <span>{item.domain_unique_urls || 0}</span>
                </div>
                <div>
                  <span className="text-gray-400">Last Seen:</span>{' '}
                  <span>{item.url_last_visit ? new Date(item.url_last_visit).toLocaleDateString() : '—'}</span>
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
