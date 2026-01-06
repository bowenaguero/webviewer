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

// Column widths (5 columns, must add up to 100%)
const COL_WIDTHS = {
  actions: 'w-[3%]',
  time: 'w-[15%]',
  type: 'w-[5%]',
  url: 'w-[40%]',
  title: 'w-[37%]',
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
      <div className="w-full mb-4">
        <ToolBar />
      </div>
      <div className="bg-gray-950 border border-gray-800 rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-transparent border-gray-800 hover:bg-transparent">
              <TableHead className={COL_WIDTHS.actions} />
              <TableHead className={`${COL_WIDTHS.time} text-gray-500 text-xs px-3`}>
                Time
              </TableHead>
              <TableHead className={`${COL_WIDTHS.type} text-gray-500 text-xs px-2`}>
                Type
              </TableHead>
              <TableHead className={`${COL_WIDTHS.url} text-gray-500 text-xs px-3`}>
                URL
              </TableHead>
              <TableHead className={`${COL_WIDTHS.title} text-gray-500 text-xs px-3`}>
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
      <TableCell colSpan={5} className="py-8 bg-gray-950">
        <div className="flex justify-center items-center">
          <Loader2 className="size-6 text-gray-500 animate-spin" />
        </div>
      </TableCell>
    </TableRow>
  );
}

const HistoryRow = memo(function HistoryRow({ item }) {
  const hasEventDetails = item.eventType !== 'Visit';
  const hasAdditionalFields = Object.keys(item.additionalFields || {}).length > 0;
  const hasDetails = hasEventDetails || hasAdditionalFields;

  // Build details string for second line
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
    <TableRow className="bg-transparent border-gray-800 hover:bg-gray-800/50">
      <TableCell className={`${COL_WIDTHS.actions} px-2 py-1.5`}>
        <ActionsMenu event={item} />
      </TableCell>
      <TableCell className={`${COL_WIDTHS.time} text-gray-500 text-xs px-3 py-1.5`}>
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
            <span className="text-xs truncate block cursor-default">
              {item.url}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-lg">
            <p className="break-all">{item.url}</p>
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell className={`${COL_WIDTHS.title} px-3 py-1.5`}>
        <div className="min-w-0">
          {/* Line 1: Title */}
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-xs text-gray-500 truncate block cursor-default">
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
                <span className="text-[10px] text-gray-600 truncate block cursor-default mt-0.5">
                  {detailsText}
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-lg">
                <div className="space-y-1">
                  {hasEventDetails && item.eventEntity && (
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
          )}
        </div>
      </TableCell>
    </TableRow>
  );
});
