import { Box, Table, Text, Spinner } from "@chakra-ui/react";
import EventIcon from "../event/EventIcon";
import { Tooltip } from "../ui/tooltip";
import ActionsMenu from "./ActionsMenu";
import { capitalizeFirstLetter } from "../utils/helpers";

export default function HistoryTable2({ currentItems, searching }) {

  return (
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
                      {item.visitTimeFormatted}
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
  );
}
