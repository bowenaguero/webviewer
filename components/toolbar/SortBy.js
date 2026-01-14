'use client';

import { Button } from '../ui/button';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

export default function SortBy({ sortBy, setSortBy }) {
  const Icon = sortBy === 'asc' ? FaChevronUp : FaChevronDown;

  return (
    <Button
      variant="ghost"
      className="text-muted-foreground hover:bg-muted"
      onClick={() => {
        setSortBy(sortBy === 'asc' ? 'desc' : 'asc');
      }}
    >
      {sortBy === 'asc' ? 'Oldest first' : 'Newest first'}
      <Icon className="size-3 ml-1" />
    </Button>
  );
}
