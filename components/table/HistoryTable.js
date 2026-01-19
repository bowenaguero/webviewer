'use client';

import {
  HistoryProvider,
  useHistoryData,
  useHistoryPagination,
} from '../context/HistoryContext';
import ToolBar from '../toolbar/ToolBar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { COL_WIDTHS } from './config';
import HistoryCard from './HistoryCard';
import HistoryRow from './HistoryRow';
import PaginationMenu from './PaginationMenu';
import { Loader2 } from 'lucide-react';

// Hoisted static component - avoids recreation on parent re-renders
const SearchingRow = (
  <TableRow>
    <TableCell colSpan={5} className="py-8 bg-gray-900">
      <div className="flex justify-center items-center">
        <Loader2 className="size-6 text-gray-500 animate-spin" />
      </div>
    </TableCell>
  </TableRow>
);

const MobileSearchingSpinner = (
  <div className="flex justify-center py-8">
    <Loader2 className="size-6 text-gray-500 animate-spin" />
  </div>
);

export default function HistoryTable({ history }) {
  return (
    <HistoryProvider history={history}>
      <HistoryTableContent />
    </HistoryProvider>
  );
}

function HistoryTableContent() {
  const { currentItems, totalCount, searching } = useHistoryData();
  const { page, setPage, itemsPerPage } = useHistoryPagination();

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
            {searching
              ? SearchingRow
              : currentItems.map((item, index) => (
                  <HistoryRow
                    key={`${item.url}-${item.visitTime}-${index}`}
                    item={item}
                  />
                ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: Card view (below md) */}
      <div className="md:hidden space-y-3">
        {searching
          ? MobileSearchingSpinner
          : currentItems.map((item, index) => (
              <HistoryCard
                key={`card-${item.url}-${item.visitTime}-${index}`}
                item={item}
              />
            ))}
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
