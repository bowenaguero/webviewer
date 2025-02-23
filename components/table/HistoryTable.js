"use client";

import { useState, useMemo, useEffect } from "react";
import { Table, HStack, Box, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import EventType from "./EventTypeTag";
import PaginationMenu from "./PaginationMenu";
import ItemsPerPage from "./ItemsPerPage";
import SortBy from "./SortBy";
import ContextMenu from "../general/ContextMenu";
import Event from "./Event";

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

  console.log(history)

  return (
    <>
      <Table.Root 
        interactive
        variant="surface"
        style={{
          tableLayout: "fixed",
        }}
        border={"1px solid"}
        borderColor={{base: "gray.200", _dark: "gray.700"}}
        backgroundColor={{base: "white", _dark: "gray.900"}}
        mt={5}
      >
        <Table.Header>
          <Table.Row bg="transparent" fontSize={["xs","xs", "sm", "md"]} fontWeight={"bold"}>
            <Table.ColumnHeader width={["20%", "18%", "10%"]} fontWeight={"bold"}>Type</Table.ColumnHeader>
            <Table.ColumnHeader width={["25%", "18%", "10%"]} fontWeight={"bold"}>Time</Table.ColumnHeader>
            <Table.ColumnHeader width={["20%", "30%", "50%"]} fontWeight={"bold"}>URL</Table.ColumnHeader>
            <Table.ColumnHeader width={["10%", "20%", "40%"]} fontWeight={"bold"}>
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
              <Table.Cell style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                <EventType eventType="visit" />
              </Table.Cell>
              <Table.Cell fontSize={["xs", "xs", "sm", "md"]} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                <ContextMenu item={format(new Date(item.lastVisitTime), "MM/dd/yyyy HH:mm:ss")} type="time" handleAlert={handleAlert} setShowAlert={setShowAlert}/>
              </Table.Cell>
              <Table.Cell fontSize={["xs", "xs", "sm", "md"]} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                <ContextMenu item={item.url} valueText={<Event eventItem={item.url}/>} type="url" handleAlert={handleAlert} setShowAlert={setShowAlert}/>
              </Table.Cell>
              <Table.Cell fontSize={["xs", "xs", "sm", "md"]} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                <ContextMenu item={item.title} type="title" handleAlert={handleAlert} setShowAlert={setShowAlert} />
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
      <Event eventItem={history[0].url} />
    </>
  );
}
