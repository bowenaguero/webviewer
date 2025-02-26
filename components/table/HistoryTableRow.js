import { useState } from "react";
import { Collapsible, Flex, Box, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import Event from "../event/EventIcon";
import EventDetails from "../event/EventDetails";

export default function HistoryTableRow({ item, index, truncateText }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (details) => {
    setIsOpen(details.open);
  };

  return (
    <Collapsible.Root
      open={isOpen}
      onOpenChange={handleOpenChange}
      border={isOpen ? "1px solid" : "none"}
      borderColor={"gray.700"}
      borderRadius={"md"}
      key={index}
      w="100%"
    >
      <Collapsible.Trigger asChild>
        <Flex
          w="100%"
          gap={5}
          p={3}
          _hover={{
            bg: isOpen ? "gray.700" : "gray.800",
            borderRadius: "sm",
            cursor: "pointer",
            transition: "background-color 0.1s",
          }}
          height="50px"
          alignItems="center"
          bg={isOpen ? "gray.800" : "transparent"}
        >
          <Box>
            <Event
              eventItem={item.url}
              eventType={item.eventType}
              truncateText={truncateText}
            />
          </Box>
          <Box fontSize={["xs", "xs", "sm", "md"]} textAlign="center">
            <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
              {format(new Date(item.lastVisitTime), "MM/dd/yyyy HH:mm aa")}
            </Text>
          </Box>
          <Box
            fontSize={["xs", "xs", "sm", "md"]}
            w={"40%"}
            textAlign="left"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {item.url}
          </Box>
          <Box fontSize={["xs", "xs", "sm", "md"]} w={"40%"} textAlign="left">
            <Text
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {item.title}
            </Text>
          </Box>
        </Flex>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Box>
          <EventDetails item={item} />
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
