'use client';

import EventIcon from '../event/EventIcon';
import ToolBar from '../toolbar/ToolBar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui/tooltip';
import { capitalizeFirstLetter } from '../utils/helpers';
import ActionsMenu from './ActionsMenu';
import PaginationMenu from './PaginationMenu';
import { HistoryProvider, useHistory } from '../context/HistoryContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { memo } from 'react';
import { Loader2 } from 'lucide-react';

// Column width definitions (must add up to 100%)
const COL_WIDTHS = {
  actions: 'w-[4%]',
  time: 'w-[14%]',
  type: 'w-[10%]',
  url: 'w-[30%]',
  title: 'w-[27%]',
  details: 'w-[15%]',
};

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
      <div className="w-full mb-5">
        <ToolBar />
      </div>
      <div className="bg-gray-950 border-2 border-gray-800 rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-transparent border-gray-800 hover:bg-transparent">
              <TableHead className={COL_WIDTHS.actions} />
              <TableHead className={`${COL_WIDTHS.time} text-gray-500 px-4`}>
                Time
              </TableHead>
              <TableHead className={`${COL_WIDTHS.type} text-gray-500 px-4`}>
                Type
              </TableHead>
              <TableHead className={`${COL_WIDTHS.url} text-gray-500 px-4`}>
                URL
              </TableHead>
              <TableHead className={`${COL_WIDTHS.title} text-gray-500 px-4`}>
                Title
              </TableHead>
              <TableHead className={`${COL_WIDTHS.details} text-gray-500 px-4`}>
                Details
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
      <div className="flex justify-center mt-5 mb-5">
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
      <TableCell colSpan={6} className="p-5 bg-gray-950">
        <div className="flex justify-center items-center h-full">
          <Loader2 className="size-8 text-gray-500 animate-spin" />
        </div>
      </TableCell>
    </TableRow>
  );
}

const HistoryRow = memo(function HistoryRow({ item }) {
  return (
    <TableRow className="bg-transparent border-gray-800 hover:bg-gray-800">
      <TableCell className={`${COL_WIDTHS.actions} text-gray-500 px-4 py-3`}>
        <ActionsMenu event={item} />
      </TableCell>
      <TableCell className={`${COL_WIDTHS.time} text-gray-500 px-4 py-3`}>
        <span className="text-sm truncate block">{item.visitTimeFormatted}</span>
      </TableCell>
      <TableCell className={`${COL_WIDTHS.type} text-gray-500 px-4 py-3`}>
        <div className="flex items-center gap-2 min-w-0">
          <EventIcon size="sm" eventType={item.eventType} />
          <span className="truncate">
            {capitalizeFirstLetter(item.eventType)}
          </span>
        </div>
      </TableCell>
      <TableCell className={`${COL_WIDTHS.url} px-4 py-3`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm font-medium truncate block cursor-default">
              {item.url}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-lg">
            <p className="break-all">{item.url}</p>
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell className={`${COL_WIDTHS.title} text-gray-500 px-4 py-3`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm font-medium truncate block cursor-default">
              {item.title || 'Untitled'}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-lg">
            <p className="break-all">{item.title || 'Untitled'}</p>
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell className={`${COL_WIDTHS.details} text-gray-500 px-4 py-3`}>
        <DetailsCell item={item} />
      </TableCell>
    </TableRow>
  );
});

const DetailsCell = memo(function DetailsCell({ item }) {
  const hasEventDetails = item.eventType !== 'Visit';
  const hasAdditionalFields = Object.keys(item.additionalFields || {}).length > 0;

  if (!hasEventDetails && !hasAdditionalFields) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="min-w-0 cursor-default">
          {hasEventDetails && (
            <div className="truncate text-sm">
              <span className="text-gray-500">{item.eventEntityType}: </span>
              <span className="text-gray-300">{item.eventEntity}</span>
            </div>
          )}
          {hasAdditionalFields && (
            <div className="truncate text-sm">
              {Object.entries(item.additionalFields).slice(0, 1).map(([key, value]) => (
                <span key={key}>
                  <span className="text-gray-500">{key}: </span>
                  <span className="text-gray-300">{String(value)}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-lg">
        <div className="space-y-1">
          {hasEventDetails && (
            <p>
              <span className="text-gray-400">{item.eventEntityType}: </span>
              <span className="break-all">{item.eventEntity}</span>
            </p>
          )}
          {hasAdditionalFields && (
            Object.entries(item.additionalFields).map(([key, value]) => (
              <p key={key}>
                <span className="text-gray-400">{key}: </span>
                <span className="break-all">{String(value)}</span>
              </p>
            ))
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
});
