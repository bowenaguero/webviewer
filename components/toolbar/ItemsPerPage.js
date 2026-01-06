'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { FaChevronDown } from 'react-icons/fa';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function ItemsPerPage({ itemsPerPage, setItemsPerPage }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-gray-500 hover:bg-gray-800"
        >
          {`${itemsPerPage} items per page`}
          <FaChevronDown className="size-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {PAGE_SIZE_OPTIONS.map((size) => (
          <DropdownMenuItem
            key={size}
            onClick={() => setItemsPerPage(size)}
          >
            {size} items per page
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
