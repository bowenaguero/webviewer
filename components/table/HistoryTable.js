"use client";

import { useState, useMemo, useEffect } from "react";
import { Table, HStack, Box, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import EventType from "./EventTypeTag";
import PaginationMenu from "./PaginationMenu";
import ItemsPerPage from "./ItemsPerPage";
import SortBy from "./SortBy";
import ContextMenu from "../general/ContextMenu";

export default function HistoryTable2({ history }) {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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

  return (
    <>
      <Table.Root interactive size={["lg", "md", "sm"]}>
        <Table.Header>
          <Table.Row bg="transparent">
            <Table.ColumnHeader fontWeight={"bold"}>Type</Table.ColumnHeader>
            <Table.ColumnHeader fontWeight={"bold"}>Time</Table.ColumnHeader>
            <Table.ColumnHeader fontWeight={"bold"}>URL</Table.ColumnHeader>
            <Table.ColumnHeader fontWeight={"bold"}>
              <HStack justifyContent="space-between">
                <Box>Title</Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <SortBy sortBy={sortBy} setSortBy={setSortBy} />
                  <ItemsPerPage
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                  />
                </Box>
              </HStack>
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentItems.map((item, index) => (
            <Table.Row 
              key={index}
            >
              <Table.Cell minWidth="50px">
                <EventType eventType="visit" />
              </Table.Cell>
              <Table.Cell fontWeight={"bold"} minWidth="70px">
                {format(new Date(item.lastVisitTime), "MM/dd/yyyy HH:mm:ss")}
              </Table.Cell>
              <Table.Cell minWidth="200px">
                <ContextMenu item={item.url} />
              </Table.Cell>
              <Table.Cell minWidth="150px">
                <ContextMenu item={item.title} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
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
