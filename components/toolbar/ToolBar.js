import PaginationMenu from '../table/PaginationMenu';
import FilterBy from './FilterBy';
import ItemsPerPage from './ItemsPerPage';
import SearchBar from './SearchBar';
import SortBy from './SortBy';
import { useHistory } from '../context/HistoryContext';
import { MS_PER_DAY } from '../utils/constants';
import { Flex, Box, IconButton, Text, CloseButton } from '@chakra-ui/react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';

export default function ToolBar() {
  const {
    itemsPerPage,
    setItemsPerPage,
    sortBy,
    setSortBy,
    page,
    setPage,
    totalCount,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setFilteredEventTypes,
    setSearch,
    setSearching,
    search,
    filteredEventTypes,
    eventTypes,
    dateRange,
  } = useHistory();

  return (
    <Flex justifyContent="space-between" gap={5} mt={5} alignItems="center">
      <Box w="30%" display="flex" justifyContent="flex-start" gap={3}>
        <ItemsPerPage
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
        <SortBy sortBy={sortBy} setSortBy={setSortBy} />
      </Box>
      <Box w="30%" display="flex" justifyContent="center" gap={3}>
        <SearchBar
          setSearch={setSearch}
          setSearching={setSearching}
          search={search}
        />
      </Box>
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        gap={5}
        w="30%"
      >
        <DateRangePicker
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          dateRange={dateRange}
          setPage={setPage}
        />
        <Box w="40%">
          <FilterBy
            eventTypes={eventTypes}
            setFilteredEventTypes={setFilteredEventTypes}
            filteredEventTypes={filteredEventTypes}
            setPage={setPage}
          />
        </Box>
        <PaginationMenu
          page={page}
          setPage={setPage}
          itemsPerPage={itemsPerPage}
          count={totalCount}
          style="compact"
        />
      </Box>
    </Flex>
  );
}

function DateRangePicker({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  dateRange,
  setPage,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCalendarClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleClearDate = () => {
    setStartDate(null);
    setEndDate(null);
    setIsOpen(false);
    setPage(1);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setPage(1);
  };

  return (
    <Box position="relative">
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton
          onClick={handleCalendarClick}
          variant="ghost"
          _hover={{ bg: 'gray.800' }}
          size="sm"
          color="gray.400"
        >
          <FaCalendarAlt />
        </IconButton>
        {startDate && endDate && (
          <Box display="flex" alignItems="center" gap={2} whiteSpace="nowrap">
            <Text color="gray.400" fontSize="sm" whiteSpace="nowrap">
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </Text>
            <CloseButton
              size="xs"
              onClick={handleClearDate}
              _hover={{ bg: 'gray.800' }}
            />
          </Box>
        )}
      </Box>
      {isOpen && (
        <Box
          position="absolute"
          top="100%"
          left="0"
          zIndex="1000"
          bg="gray.950"
          p={2}
        >
          <DatePicker
            inline
            selectsRange
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            dateFormat="MM/dd/yyyy"
            minDate={dateRange.minDate}
            maxDate={dateRange.maxDate}
            excludeDateIntervals={[
              {
                start: new Date(0),
                end: new Date(dateRange.minDate.getTime() - MS_PER_DAY),
              },
              {
                start: new Date(dateRange.maxDate.getTime() + MS_PER_DAY),
                end: new Date(2099, 11, 31),
              },
            ]}
          />
        </Box>
      )}
    </Box>
  );
}
