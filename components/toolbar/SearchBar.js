import { CloseButton } from '../ui/close-button';
import { InputGroup } from '../ui/input-group';
import { SEARCH_DEBOUNCE_MS } from '../utils/constants';
import { Input } from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar({ setSearch, setSearching, search }) {
  const [inputValue, setInputValue] = useState('');
  const timeoutRef = useRef(null);

  const handleChange = useCallback(
    (e) => {
      const value = e.target.value;
      setInputValue(value);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setSearching(true);
      timeoutRef.current = setTimeout(() => {
        setSearch(value);
        setSearching(false);
      }, SEARCH_DEBOUNCE_MS);
    },
    [setSearch, setSearching]
  );

  const handleClear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setInputValue('');
    setSearch('');
    setSearching(false);
  }, [setSearch, setSearching]);

  return (
    <InputGroup
      flex={1}
      startElement={<FaSearch />}
      endElement={
        inputValue ? (
          <CloseButton
            variant="transparent"
            _hover={{ opacity: 0.5 }}
            onClick={handleClear}
          />
        ) : null
      }
    >
      <Input
        value={inputValue}
        variant="subtle"
        placeholder="Search"
        border="2px solid"
        borderColor={search ? 'gray.300' : 'gray.800'}
        borderRadius="sm"
        onChange={handleChange}
        _hover={{ borderColor: 'gray.700' }}
      />
    </InputGroup>
  );
}
