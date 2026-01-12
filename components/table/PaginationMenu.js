'use client';

import { Button } from '../ui/button';
import { PAGINATION } from './config';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function PaginationMenu({
  page,
  setPage,
  itemsPerPage,
  count,
  style,
}) {
  const totalPages = Math.ceil(count / itemsPerPage);
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  const handleFirst = () => setPage(1);
  const handlePrev = () => {
    if (canGoPrev) setPage(page - 1);
  };
  const handleNext = () => {
    if (canGoNext) setPage(page + 1);
  };
  const handleLast = () => setPage(totalPages);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = PAGINATION.maxVisiblePages;

    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleFirst}
        disabled={!canGoPrev}
        className="text-gray-400 hover:bg-gray-800"
      >
        <ChevronFirst className="size-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handlePrev}
        disabled={!canGoPrev}
        className="text-gray-400 hover:bg-gray-800"
      >
        <ChevronLeft className="size-4" />
      </Button>

      {style !== 'compact' && (
        <>
          {getPageNumbers().map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === page ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setPage(pageNum)}
              className={
                pageNum === page
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:bg-gray-800'
              }
            >
              {pageNum}
            </Button>
          ))}
        </>
      )}

      {style === 'compact' && (
        <span className="text-gray-500 text-sm px-2">{page}</span>
      )}

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleNext}
        disabled={!canGoNext}
        className="text-gray-400 hover:bg-gray-800"
      >
        <ChevronRight className="size-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleLast}
        disabled={!canGoNext}
        className="text-gray-400 hover:bg-gray-800"
      >
        <ChevronLast className="size-4" />
      </Button>
    </div>
  );
}
