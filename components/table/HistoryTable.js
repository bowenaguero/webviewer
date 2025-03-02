"use client";

import { useState, useMemo } from "react";
import { HStack, Box, Table, Text, Icon } from "@chakra-ui/react";
import PaginationMenu from "./PaginationMenu";
import EventIcon from "../event/EventIcon";
import ToolBar from "../toolbar/ToolBar";
import { FaEllipsisV } from "react-icons/fa";

export default function HistoryTable2({ history }) {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [sortBy, setSortBy] = useState("desc");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredEventTypes, setFilteredEventTypes] = useState({ value: [] });
  const [search, setSearch] = useState("");

  const processedHistory = useMemo(() => {
    let filtered = [...history];

    if (filteredEventTypes.value.length > 0) {
      filtered = filtered.filter((item) =>
        filteredEventTypes.value.includes(item.eventType)
      );
    }

    if (search) {
      try {
        const regex = new RegExp(search, "i");
        filtered = filtered.filter(
          (item) =>
            regex.test(item.url) ||
            regex.test(item.title) ||
            regex.test(item.eventType)
        );
      } catch (e) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.url.toLowerCase().includes(searchLower) ||
            (item.title && item.title.toLowerCase().includes(searchLower)) ||
            item.eventType.toLowerCase().includes(searchLower)
        );
      }
    }

    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a.lastVisitTime);
      const dateB = new Date(b.lastVisitTime);
      return sortBy === "desc" ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  }, [history, sortBy, filteredEventTypes, search]);

  const dateFilteredHistory = useMemo(() => {
    return startDate && endDate
      ? processedHistory.filter((item) => {
          const timestamp = new Date(item.lastVisitTime);
          return (
            timestamp.getTime() >= startDate.getTime() &&
            timestamp.getTime() <= endDate.getTime()
          );
        })
      : processedHistory;
  }, [processedHistory, startDate, endDate]);

  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = dateFilteredHistory.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalCount = dateFilteredHistory.length;

  const dateRange = useMemo(() => {
    const dates = processedHistory.map((item) => new Date(item.lastVisitTime));
    return {
      minDate: new Date(Math.min(...dates)),
      maxDate: new Date(Math.max(...dates)),
    };
  }, [processedHistory]);

  function capitalizeFirstLetter(str) {
    if (!str) {
      return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setPage(1);
  };

  const eventTypes = useMemo(() => {
    const uniqueEventTypes = new Set();
    history.forEach((item) => {
      uniqueEventTypes.add(item.eventType);
    });
    return Array.from(uniqueEventTypes);
  }, [history]);

  return (
    <>
      <Box w="100%" h="100%" mb={5}>
        <ToolBar
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          sortBy={sortBy}
          setSortBy={setSortBy}
          page={page}
          setPage={setPage}
          count={totalCount}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          handleDateChange={handleDateChange}
          minDate={dateRange.minDate}
          maxDate={dateRange.maxDate}
          eventTypes={eventTypes}
          capitalizeFirstLetter={capitalizeFirstLetter}
          filteredEventTypes={filteredEventTypes}
          setFilteredEventTypes={setFilteredEventTypes}
          setSearch={setSearch}
        />
      </Box>
      <Box
        bg="gray.900"
        border={"2px solid"}
        borderColor="gray.800"
        borderRadius={"md"}
      >
        <Table.Root tableLayout="fixed">
          <Table.Header>
            <Table.Row bg="gray.950">
              <Table.ColumnHeader w="3%">
              </Table.ColumnHeader>
              <Table.ColumnHeader
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                color="gray.500"
                px={5}
                w="12%"
              >
                Time
              </Table.ColumnHeader>
              <Table.ColumnHeader
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                color="gray.500"
                px={5}
                w="8%"
              >
                Type
              </Table.ColumnHeader>
              <Table.ColumnHeader
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                color="gray.500"
                px={5}
                w="45%"
              >
                URL
              </Table.ColumnHeader>
              <Table.ColumnHeader
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                color="gray.500"
                px={5}
                w="45%"
              >
                Title
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {currentItems.map((item, index) => (
              <Table.Row key={index} bg="gray.950" _hover={{ bg: "gray.900" }}>
                <Table.Cell color="gray.500" p={5}>
                  <Icon as={FaEllipsisV} />
                </Table.Cell>
                <Table.Cell color="gray.500" p={5}>
                  <Box
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    fontSize="sm"
                  >
                    {new Date(item.lastVisitTime).toLocaleString()}
                  </Box>
                </Table.Cell>
                <Table.Cell color="gray.500" p={5}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <EventIcon size="sm" eventType={item.eventType} />
                    <Text
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {capitalizeFirstLetter(item.eventType)}
                    </Text>
                  </Box>
                </Table.Cell>
                <Table.Cell p={5}>
                  <Box>
                    <Text
                      fontSize="sm"
                      fontWeight={"medium"}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {item.url}
                    </Text>
                  </Box>
                </Table.Cell>
                <Table.Cell color="gray.500" p={5}>
                  <Box>
                    <Text
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      fontSize="sm"
                      fontWeight={"medium"}
                    >
                      {item.title || "Untitled"}
                    </Text>
                  </Box>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
      <HStack justifyContent="space-between" mt={5} mb={5}>
        <Box />
        <Box>
          <PaginationMenu
            page={page}
            setPage={setPage}
            itemsPerPage={itemsPerPage}
            count={totalCount}
          />
        </Box>
        <Box />
      </HStack>
    </>
  );
}
