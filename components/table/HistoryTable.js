"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  HStack,
  Box,
  Text,
  VStack,
  Collapsible,
  Icon,
} from "@chakra-ui/react";
import { format } from "date-fns";
import PaginationMenu from "./PaginationMenu";
import Event from "../event/Event";
import ToolBar from "../toolbar/ToolBar";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";

export default function HistoryTable2({ history, handleAlert, setShowAlert }) {
  console.log(history);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
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
          <ToolBar itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} sortBy={sortBy} setSortBy={setSortBy} page={page} setPage={setPage} />
        </Box>
        <VStack>
          {currentItems.map((item, index) => (
            <Collapsible.Root key={index} w="100%">
              <HStack justify="space-between">
                <Collapsible.Trigger asChild>
                  <HStack
                    as="button"
                    w="100%"
                    gap={4}
                    _hover={{ bg: "gray.800" }}
                  >
                    <Box>
                      <Icon
                        as={open ? FaChevronRight : FaChevronDown}
                        ref={iconRef}
                      />
                    </Box>
                    <Box
                      fontSize={["xs", "xs", "sm", "md"]}
                      w="10%"
                      textAlign="left"
                    >
                      <Text>{format(
                        new Date(item.lastVisitTime),
                        "MM/dd/yyyy HH:mm"
                      )}</Text>
                    </Box>
                    <Box 
                      fontSize={["xs", "xs", "sm", "md"]} 
                      w={"45%"}
                      textAlign="left"
                    >
                      <Event eventItem={item.url} eventType={item.eventType} truncateText={truncateText} />
                    </Box>
                    <Box 
                      fontSize={["xs", "xs", "sm", "md"]} 
                      w={"45%"}
                      textAlign="left"
                    >
                      <Text color={{base: "blue.800", _dark: "blue.400"}}>{truncateText(item.title, 50)}</Text>
                    </Box>
                  </HStack>
                </Collapsible.Trigger>
              </HStack>

              <Collapsible.Content>
                <Box textAlign="left">
                  <Text fontSize="sm" wordBreak="break-all">
                    {item.url}
                  </Text>
                </Box>
              </Collapsible.Content>
            </Collapsible.Root>
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
