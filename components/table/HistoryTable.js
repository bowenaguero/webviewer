"use client";

import { useState, useMemo } from "react";
import { HStack, Box, Table, Text, Spinner } from "@chakra-ui/react";
import PaginationMenu from "./PaginationMenu";
import EventIcon from "../event/EventIcon";
import ToolBar from "../toolbar/ToolBar";
import { Tooltip } from "../ui/tooltip";
import ActionsMenu from "./ActionsMenu";
import { filterByEventTypes, filterBySearch, sortByDate, filterByDate } from "../utils/filterBrowserHistory";
import { capitalizeFirstLetter } from "../utils/helpers";

export default function HistoryTable2({ history }) {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("desc");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredEventTypes, setFilteredEventTypes] = useState({ value: [] });
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  const processedHistory = useMemo(() => {
    let filtered = [...history];
    filtered = filterByEventTypes(filtered, filteredEventTypes);
    filtered = filterBySearch(filtered, search);
    filtered = filterByDate(filtered, startDate, endDate);
    filtered = sortByDate(filtered, sortBy);

    return filtered;
  }, [history, sortBy, filteredEventTypes, search, startDate, endDate]);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = processedHistory.slice(startIndex, endIndex);
  const totalCount = processedHistory.length;

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
          filteredEventTypes={filteredEventTypes}
          setFilteredEventTypes={setFilteredEventTypes}
          setSearch={setSearch}
          setSearching={setSearching}
          search={search}
          history={history}
          processedHistory={processedHistory}
        />
      </Box>
      <Box
        bg="gray.950"
        border={"2px solid"}
        borderColor="gray.800"
        borderRadius={"md"}
      >
        <Table.Root tableLayout="fixed">
          <Table.Header>
            <Table.Row bg="transparent">
              <Table.ColumnHeader w="3%"></Table.ColumnHeader>
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
                w="30%"
              >
                URL
              </Table.ColumnHeader>
              <Table.ColumnHeader
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                color="gray.500"
                px={5}
                w="30%"
              >
                Title
              </Table.ColumnHeader>
              <Table.ColumnHeader
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                color="gray.500"
                px={5}
                w="20%"
              >
                Details
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {searching ? (
              <Table.Row>
                <Table.Cell p={5} colSpan={7} bg="gray.950">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    h="100%"
                  >
                    <Spinner size="lg" color="gray.500" />
                  </Box>
                </Table.Cell>
              </Table.Row>
            ) : (
              currentItems.map((item, index) => (
                <Table.Row
                  key={index}
                  bg="transparent"
                  _hover={{ bg: "gray.800" }}
                >
                  <Table.Cell color="gray.500" p={5}>
                    <ActionsMenu event={item} />
                  </Table.Cell>
                  <Table.Cell color="gray.500" p={5}>
                    <Box
                      fontSize="sm"
                    >
                      {new Date(item.visitTime).toLocaleString()}
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
                      <Tooltip content={item.url}>
                        <Text
                          fontSize="sm"
                          fontWeight={"medium"}
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                        >
                          {item.url}
                        </Text>
                      </Tooltip>
                    </Box>
                  </Table.Cell>
                  <Table.Cell color="gray.500" p={5}>
                    <Box>
                      <Tooltip content={item.title || "Untitled"}>
                        <Text
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                          fontSize="sm"
                          fontWeight={"medium"}
                        >
                          {item.title || "Untitled"}
                        </Text>
                      </Tooltip>
                    </Box>
                  </Table.Cell>
                  <Table.Cell color="gray.500" p={5}>
                    <Box>
                      <Text color="gray.300">
                        {item.eventType != "Visit" && (
                          <>
                            <Text color="gray.500">{item.eventEntityType}:</Text>
                            <Text color="gray.300">{item.eventEntity}</Text>
                          </>
                        )}
                      </Text>
                      {Object.keys(item.additionalFields).length > 0 && (
                        <Text
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                          fontSize="sm"
                        >
                          {Object.keys(item.additionalFields).map((key) => (
                            <Box key={key}>
                              <Text color="gray.500">{key}:</Text>
                              <Text color="gray.300">{item.additionalFields[key]}</Text>
                            </Box>
                          ))}
                        </Text>
                      )}
                    </Box>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
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
