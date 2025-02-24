import { createListCollection } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { FaEye, FaDownload, FaBookmark, FaICursor } from "react-icons/fa";
import { HStack, Icon } from "@chakra-ui/react";

export default function FilterBy() {
  const eventTypes = createListCollection({
    items: [
      { label: "Visits", value: "visits", icon: FaEye },
      { label: "Downloads", value: "downloads", icon: FaDownload },
      { label: "Bookmarks", value: "bookmarks", icon: FaBookmark },
      { label: "Autofills", value: "autofills", icon: FaICursor },
    ],
  });

  const iconColor = {
    visits: "blue.400",
    downloads: "green.400",
    bookmarks: "orange.400",
    autofills: "purple.400",
  };

  return (
    <SelectRoot
      variant="subtle"
      border={"2px solid"}
      h="100%"
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
      borderRadius={"md"}
      multiple
      collection={eventTypes}
    >
      <SelectTrigger>
        <SelectValueText placeholder="Filter by" />
      </SelectTrigger>
      <SelectContent>
        {eventTypes.items.map((eventType) => (
          <SelectItem item={eventType} key={eventType.value}>
            <HStack>
              <Icon as={eventType.icon} color={iconColor[eventType.value]} />
              {eventType.label}
            </HStack>
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
