import { useState, useMemo } from "react";
import { Flex, Box, IconButton, Text } from "@chakra-ui/react";
import SearchBar from "./SearchBar";
import FilterBy from "./FilterBy";
import ItemsPerPage from "./ItemsPerPage";
import SortBy from "./SortBy";
import PaginationMenu from "../Table/PaginationMenu";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { CloseButton } from "@chakra-ui/react";

export default function ToolBar({
  itemsPerPage,
  setItemsPerPage,
  sortBy,
  setSortBy,
  page,
  setPage,
  count,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  setFilteredEventTypes,
  setSearch,
  setSearching,
  search,
  filteredEventTypes,
  history,
  processedHistory,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const beginDate = startDate;

  const handleCalendarClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleClearDate = () => {
    setStartDate(beginDate);
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

  const dateRange = useMemo(() => {
    const dates = processedHistory.map((item) => new Date(item.visitTime));
    return {
      minDate: new Date(Math.min(...dates)),
      maxDate: new Date(Math.max(...dates)),
    };
  }, [processedHistory]);

  const eventTypes = useMemo(() => {
    const uniqueEventTypes = new Set();
    history.forEach((item) => {
      uniqueEventTypes.add(item.eventType);
    });
    return Array.from(uniqueEventTypes);
  }, [history]);

  return (
    <Flex
      justifyContent="space-between"
      gap={5}
      mt={5}
      alignItems="center"
      justifyItems="center"
    >
      <Box w="30%" display="flex" justifyContent="flex-start" gap={3}>
        <ItemsPerPage
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
        <SortBy sortBy={sortBy} setSortBy={setSortBy} />
      </Box>
      <Box w="30%" display="flex" justifyContent="center" gap={3}>
        <SearchBar setSearch={setSearch} setSearching={setSearching} search={search} />
      </Box>
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        gap={5}
        w="30%"
      >
        <Box position="relative">
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton
              onClick={handleCalendarClick}
              variant="ghost"
              _hover={{ bg: "gray.800" }}
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
                  _hover={{ bg: "gray.800" }}
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
                    end: new Date(dateRange.minDate.getTime() - 86400000),
                  },
                  {
                    start: new Date(dateRange.maxDate.getTime() + 86400000),
                    end: new Date(2099, 11, 31),
                  },
                ]}
              />
            </Box>
          )}
        </Box>
        <Box w="40%">
          <FilterBy
            eventTypes={eventTypes}
            setFilteredEventTypes={setFilteredEventTypes}
            filteredEventTypes={filteredEventTypes}
            setPage={setPage}
          />
        </Box>
        <Box>
          <PaginationMenu
            page={page}
            setPage={setPage}
            itemsPerPage={itemsPerPage}
            count={count}
            style="compact"
          />
        </Box>
      </Box>
    </Flex>
  );
}
