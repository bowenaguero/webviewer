import { CloseButton } from '../ui/close-button';
import { InputGroup } from '../ui/input-group';
import { Input } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar({ setSearch, setSearching, search }) {
  const [inputValue, setInputValue] = useState('');

  const handleChange = useMemo(() => {
    let timeoutId;

    return (e) => {
      const value = e.target.value;
      setInputValue(value);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      setSearching(true);
      timeoutId = setTimeout(() => {
        setSearch(value);
        setSearching(false);
        timeoutId = null;
      }, 650);
    };
  }, [setSearch, setSearching]);

  const handleClear = () => {
    setInputValue('');
    setSearch('');
    setSearching(false);
  };

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
