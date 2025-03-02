import { useState } from "react";
import { Flex, Box, IconButton, Text } from "@chakra-ui/react";
import SearchBar from "./SearchBar";
import FilterBy from "./FilterBy";
import ItemsPerPage from "./ItemsPerPage";
import SortBy from "./SortBy";
import PaginationMenu from "../table/PaginationMenu";
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
  handleDateChange,
  minDate,
  maxDate,
  eventTypes,
  capitalizeFirstLetter,
  setFilteredEventTypes,
  setSearch,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const beginDate = startDate;

  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setStartDate(beginDate);
    setEndDate(null);
    setIsOpen(false);
  };

  return (
    <Flex
      justifyContent="space-between"
      gap={5}
      p={5}
      alignItems="center"
      justifyItems="center"
      bg="gray.950"
      border={"2px solid"}
      borderColor="gray.800"
      borderRadius={"md"}
    >
      <Box w="30%" display="flex" justifyContent="flex-start" gap={3}>
        <ItemsPerPage
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
        <SortBy sortBy={sortBy} setSortBy={setSortBy} />
      </Box>
      <Box w="30%" display="flex" justifyContent="center" gap={3}>
        <SearchBar setSearch={setSearch} />
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
              onClick={handleClick}
              variant="ghost"
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
                  onClick={handleClose}
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
              bg="white"
              boxShadow="md"
              p={2}
            >
              <DatePicker
                inline
                isClearable
                selected={startDate}
                onChange={handleDateChange}
                startDate={startDate}
                endDate={endDate}
                dateFormat="MM/dd/yyyy"
                shouldCloseOnSelect={false}
                selectsRange
                minDate={minDate}
                maxDate={maxDate}
                excludeDateIntervals={[
                  {
                    start: new Date(0),
                    end: new Date(minDate.getTime() - 86400000),
                  },
                  {
                    start: new Date(maxDate.getTime() + 86400000),
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
            capitalizeFirstLetter={capitalizeFirstLetter}
            setFilteredEventTypes={setFilteredEventTypes}
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
