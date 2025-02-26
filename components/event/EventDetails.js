import { Box, VStack, Heading, Text, HStack } from "@chakra-ui/react";
import Event from "./EventIcon";

export default function EventDetails({ item, truncateText }) {
  const getHostname = (text) => {
    const uri = new URL(text);
    return uri.hostname;
  };

  function capitalizeFirstLetter(str) {
    if (!str) {
      return ""; // Handle empty or null strings
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <HStack p={5} gap={5}>
        <Box h="100%" w="52%">
          <VStack
            display={"flex-start"}
            gap={2}
            p={5}
        >
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <Event
              eventItem={item.url}
              eventType={item.eventType}
              truncateText={truncateText}
            />
            <Heading
              overflow={"hidden"}
              textOverflow={"ellipsis"}
              whiteSpace={"nowrap"}
            >
              {capitalizeFirstLetter(item.eventType)}
            </Heading>
          </Box>
          <Box display={"flex"} gap={2}>
            <Text color={"gray.500"}>Name:</Text>
            <Text
              overflow={"hidden"}
              textOverflow={"ellipsis"}
              whiteSpace={"nowrap"}
            >
              {item.eventEntity}
            </Text>
          </Box>
          {/* <Box display={"flex"} gap={2}>
            <Text color={"gray.500"}>Last Visited:</Text>
            <Text
              overflow={"hidden"}
              textOverflow={"ellipsis"}
              whiteSpace={"nowrap"}
            >
              {item.lastVisitTime}
            </Text>
          </Box> */}
        </VStack>
      </Box>
      <Box>
        <VStack
          display={"flex-start"}
          gap={2}
          p={5}
        >
          <Box>
            <Heading
              overflow={"hidden"}
              textOverflow={"ellipsis"}
              whiteSpace={"nowrap"}
            >
              {getHostname(item.url)}
            </Heading>
          </Box>
          <Box display={"flex"} gap={2}>
            <Text
              color={"gray.500"}
              overflow={"hidden"}
              textOverflow={"ellipsis"}
              whiteSpace={"nowrap"}
            >
              URL Visits:
            </Text>
            <Text>{item.visitCount}</Text>
          </Box>
          <Box display={"flex"} gap={2}>
            <Text
              color={"gray.500"}
              overflow={"hidden"}
              textOverflow={"ellipsis"}
              whiteSpace={"nowrap"}
            >
              Domain Visits:
            </Text>
            <Text>{item.visitCount}</Text>
          </Box>
        </VStack>
      </Box>
    </HStack>
  );
}
