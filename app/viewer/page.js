"use client";

import { useState, useMemo } from "react";
import { Box, Center, Spinner, Text, VStack, HStack } from "@chakra-ui/react";
import { Suspense } from "react";
import HistoryTable from "@/components/table/HistoryTable";
import indexedDb from "@/components/utils/indexedDb";
import { useLiveQuery } from "dexie-react-hooks";
import ToolBar from "@/components/toolbar/ToolBar";
import PaginationMenu from "@/components/table/PaginationMenu";
import {
  filterByEventTypes,
  filterBySearch,
  sortByDate,
  filterByDate,
} from "@/components/utils/filterBrowserHistory";

export default function ViewerPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ViewerContent />
    </Suspense>
  );
}

function ViewerContent() {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("desc");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredEventTypes, setFilteredEventTypes] = useState({ value: [] });
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const history = useLiveQuery(() => {
    return indexedDb.history.toArray();
  }, []);

  const filteredByEventTypes = useMemo(() => {
    return filterByEventTypes(history, filteredEventTypes);
  }, [history, filteredEventTypes]);

  const filteredBySearch = useMemo(() => {
    return filterBySearch(filteredByEventTypes, search);
  }, [filteredByEventTypes, search]);

  const filteredByDate = useMemo(() => {
    return filterByDate(filteredBySearch, startDate, endDate);
  }, [filteredBySearch, startDate, endDate]);

  const sortedByDate = useMemo(() => {
    return sortByDate(filteredByDate, sortBy);
  }, [filteredByDate, sortBy]);

  if (!history) {
    return <LoadingSpinner />;
  }

  const currentItems = sortedByDate.slice(startIndex, endIndex);
  const totalCount = sortedByDate.length;

  return (
    <Center>
      <Box w="90%">
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
            processedHistory={sortedByDate}
          />
        </Box>
        <HistoryTable currentItems={currentItems} searching={searching} />
        <Box my={5} w="100%" display="flex" justifyContent="center">
          <PaginationMenu
            page={page}
            setPage={setPage}
            itemsPerPage={itemsPerPage}
            count={totalCount}
          />
        </Box>
      </Box>
    </Center>
  );
}

function LoadingSpinner() {
  return (
    <Center h="calc(100vh - 120px)">
      <VStack gap={5}>
        <Spinner size="xl" />
        <Text fontSize={["xs", "sm"]}>Loading your history...</Text>
      </VStack>
    </Center>
  );
}
