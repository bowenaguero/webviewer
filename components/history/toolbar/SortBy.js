'use client';

import { memo, useCallback } from 'react';
import { Button } from '../../ui/button';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

const SortBy = memo(function SortBy({ sortBy, setSortBy }) {
  const Icon = sortBy === 'asc' ? FaChevronUp : FaChevronDown;

  const handleToggle = useCallback(() => {
    setSortBy((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, [setSortBy]);

  return (
    <Button
      variant="ghost"
      className="text-gray-500 hover:bg-gray-800"
      onClick={handleToggle}
    >
      {sortBy === 'asc' ? 'Oldest first' : 'Newest first'}
      <Icon className="size-3 ml-1" />
    </Button>
  );
});

export default SortBy;
