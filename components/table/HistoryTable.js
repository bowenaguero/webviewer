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
import EventType from "./EventTypeTag";
import PaginationMenu from "./PaginationMenu";
import ContextMenu from "../general/ContextMenu";
import Event from "./Event";
import ToolBar from "../toolbar/ToolBar";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";

export default function HistoryTable2({ history, handleAlert, setShowAlert }) {
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
      <ToolBar itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} sortBy={sortBy} setSortBy={setSortBy} />
      <Box
        bg={{ base: "white", _dark: "gray.900" }}
        border={"2px solid"}
        borderColor={{ base: "gray.200", _dark: "gray.700" }}
        borderRadius={"md"}
        p={2}
        mt={4}
      >
        <VStack>
          {currentItems.map((item, index) => (
            <Collapsible.Root key={index} w="100%">
              <HStack w="100%" justify="space-between">
                <Collapsible.Trigger asChild>
                  <HStack
                    as="button"
                    w="100%"
                    gap={4}
                    p={1}
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
                      <Event eventItem={item.url} eventType={"visit"} truncateText={truncateText} />
                    </Box>
                    <Box 
                      fontSize={["xs", "xs", "sm", "md"]} 
                      w={"45%"}
                      textAlign="left"
                    >
                      <Text color={{base: "purple.800", _dark: "purple.400"}} fontWeight={"bold"}>{truncateText(item.title, 50)}</Text>
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
      {/* <Table.Root
        interactive
        variant="surface"
        style={{
          tableLayout: "fixed",
        }}
        border={"1px solid"}
        borderColor={{ base: "gray.200", _dark: "gray.700" }}
        backgroundColor={{ base: "white", _dark: "gray.900" }}
        mt={5}
      >
        <HStack justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <SortBy sortBy={sortBy} setSortBy={setSortBy} />
            <ItemsPerPage
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
            />
          </Box>
        </HStack>
        <Table.Header>
          <Table.Row bg="transparent" fontSize={["xs","xs", "sm", "md"]} fontWeight={"bold"}>
            <Table.ColumnHeader width={["20%", "18%", "10%"]} fontWeight={"bold"}>Type</Table.ColumnHeader>
            <Table.ColumnHeader width={["25%", "18%", "10%"]} fontWeight={"bold"}>Time</Table.ColumnHeader>
            <Table.ColumnHeader width={["20%", "30%", "50%"]} fontWeight={"bold"}>URL</Table.ColumnHeader>
            <Table.ColumnHeader width={["10%", "20%", "40%"]} fontWeight={"bold"}>
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentItems.map((item, index) => (
            <Table.Row key={index}>
              <Table.Cell
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <EventType eventType="visit" />
              </Table.Cell>
              <Table.Cell
                fontSize={["xs", "xs", "sm", "md"]}
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <ContextMenu
                  item={format(
                    new Date(item.lastVisitTime),
                    "MM/dd/yyyy HH:mm:ss"
                  )}
                  type="time"
                  handleAlert={handleAlert}
                  setShowAlert={setShowAlert}
                />
              </Table.Cell>
              <Table.Cell
                fontSize={["xs", "xs", "sm", "md"]}
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <ContextMenu
                  item={item.url}
                  valueText={<Event eventItem={item.url} />}
                  type="url"
                  handleAlert={handleAlert}
                  setShowAlert={setShowAlert}
                />
              </Table.Cell>
              <Table.Cell
                fontSize={["xs", "xs", "sm", "md"]}
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <ContextMenu
                  item={item.title}
                  type="title"
                  handleAlert={handleAlert}
                  setShowAlert={setShowAlert}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root> */}
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
