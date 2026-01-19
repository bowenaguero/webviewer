'use client';

import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants';
import { useCallback, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { X } from 'lucide-react';

export default function SearchBar({ setSearch, search }) {
  const [inputValue, setInputValue] = useState('');
  const timeoutRef = useRef(null);

  const handleChange = useCallback(
    (e) => {
      const value = e.target.value;
      setInputValue(value);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setSearch(value);
      }, SEARCH_DEBOUNCE_MS);
    },
    [setSearch]
  );

  const handleClear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setInputValue('');
    setSearch('');
  }, [setSearch]);

  return (
    <div className="relative flex-1">
      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
      <Input
        value={inputValue}
        placeholder="Search"
        className={`pl-9 pr-9 border-2 rounded-sm bg-transparent ${
          search ? 'border-gray-300' : 'border-gray-800'
        } hover:border-gray-700 focus-visible:border-gray-600`}
        onChange={handleChange}
      />
      {inputValue && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-transparent hover:opacity-50"
          onClick={handleClear}
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}
