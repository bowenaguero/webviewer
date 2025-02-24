import { Text, HStack, Icon } from "@chakra-ui/react";
import { FaEye, FaDownload, FaICursor, FaBookmark, FaQuestion } from "react-icons/fa";

export default function Event({ eventItem, eventType, truncateText }) {

  const icons = {
    visit: FaEye,
    download: FaDownload,
    autofill: FaICursor,
    bookmark: FaBookmark,
  }

  const iconColor = { 
    visit: "blue.400",
    download: "green.400",
    autofill: "purple.400",
    bookmark: "orange.400",
  }
  
  return (
      <HStack gap={4}>
        <Icon as={icons[eventType]} color={iconColor[eventType]} />
        <Text fontSize={["xs", "xs", "sm", "md"]} color={iconColor[eventType]}>
          {truncateText(eventItem, 50)}
        </Text>
      </HStack>
  );
}
