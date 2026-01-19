'use client';

import { memo, useCallback } from 'react';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { FaChevronDown } from 'react-icons/fa';

const PAGE_SIZE_OPTIONS = [15, 25, 50, 100];

const ItemsPerPage = memo(function ItemsPerPage({ itemsPerPage, setItemsPerPage }) {
  const handleSizeClick = useCallback(
    (e) => {
      const size = Number(e.currentTarget.dataset.size);
      setItemsPerPage(size);
    },
    [setItemsPerPage],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-gray-500 hover:bg-gray-800">
          {`${itemsPerPage} items per page`}
          <FaChevronDown className="size-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {PAGE_SIZE_OPTIONS.map((size) => (
          <DropdownMenuItem key={size} data-size={size} onClick={handleSizeClick}>
            {size} items per page
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default ItemsPerPage;
