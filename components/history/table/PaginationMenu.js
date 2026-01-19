'use client';

import { memo, useCallback, useMemo } from 'react';
import { Button } from '../../ui/button';
import { PAGINATION } from './config';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const PaginationMenu = memo(function PaginationMenu({
  page,
  setPage,
  itemsPerPage,
  count,
  style,
}) {
  const totalPages = Math.ceil(count / itemsPerPage);
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  const handleFirst = useCallback(() => setPage(1), [setPage]);
  const handlePrev = useCallback(() => {
    if (page > 1) setPage(page - 1);
  }, [page, setPage]);
  const handleNext = useCallback(() => {
    if (page < totalPages) setPage(page + 1);
  }, [page, totalPages, setPage]);
  const handleLast = useCallback(() => setPage(totalPages), [setPage, totalPages]);
  const handlePageClick = useCallback(
    (e) => {
      const pageNum = Number(e.currentTarget.dataset.page);
      setPage(pageNum);
    },
    [setPage],
  );

  // Memoize page numbers calculation
  const pageNumbers = useMemo(() => {
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
  }, [page, totalPages]);

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
          {pageNumbers.map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === page ? 'secondary' : 'ghost'}
              size="sm"
              data-page={pageNum}
              onClick={handlePageClick}
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
});

export default PaginationMenu;
