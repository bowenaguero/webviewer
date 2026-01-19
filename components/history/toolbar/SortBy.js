'use client';

import { memo } from 'react';
import { Button } from '../../ui/button';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

const SortBy = memo(function SortBy({ sortBy, setSortBy }) {
  const Icon = sortBy === 'asc' ? FaChevronUp : FaChevronDown;

  return (
    <Button
      variant="ghost"
      className="text-gray-500 hover:bg-gray-800"
      onClick={() => {
        setSortBy(sortBy === 'asc' ? 'desc' : 'asc');
      }}
    >
      {sortBy === 'asc' ? 'Oldest first' : 'Newest first'}
      <Icon className="size-3 ml-1" />
    </Button>
  );
});

export default SortBy;
