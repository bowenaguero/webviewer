"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  HStack,
  Box,
  VStack,
} from "@chakra-ui/react";
import PaginationMenu from "./PaginationMenu";
import ToolBar from "../toolbar/ToolBar";
import HistoryTableRow from "./HistoryTableRow";

export default function HistoryTable2({ history }) {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [localHistory, setLocalHistory] = useState(history);
  const currentItems = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return localHistory.slice(startIndex, endIndex);
  }, [localHistory, page, itemsPerPage]);

  const [sortBy, setSortBy] = useState("desc");
  useEffect(() => {
    const sortedHistory = [...history].sort((a, b) => {
      const dateA = new Date(a.lastVisitTime);
      const dateB = new Date(b.lastVisitTime);

      if (sortBy === "desc") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    setLocalHistory(sortedHistory);
  }, [sortBy, history]);

  const iconRef = useRef(null);

  const truncateText = (text, length) => {
    if (text.length <= length) return text;
    return text.slice(0, length) + "...";
  };

  return (
    <>
      <Box
        bg={{ base: "white", _dark: "gray.900" }}
        border={"1px solid"}
        borderColor={{ base: "gray.200", _dark: "gray.700" }}
        borderRadius={"md"}
        p={5}
        mt={4}
      >
        <Box mb={5}>
          <ToolBar
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            sortBy={sortBy}
            setSortBy={setSortBy}
            page={page}
            setPage={setPage}
          />
        </Box>
        <VStack>
          {currentItems.map((item, index) => (
            <HistoryTableRow item={item} index={index} key={index} truncateText={truncateText} />
          ))}
        </VStack>
      </Box>
      <HStack justifyContent="space-between" mt={5} mb={5}>
        <Box />
        <Box>
          <PaginationMenu
            page={page}
            setPage={setPage}
            itemsPerPage={itemsPerPage}
            count={history.length}
          />
        </Box>
        <Box />
      </HStack>
    </>
  );
}
