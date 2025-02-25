import { createListCollection } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { FaEye, FaDownload, FaBookmark, FaICursor, FaFilter } from "react-icons/fa";
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
      borderRadius={"sm"}
      border={"2px solid"}
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
      multiple
      collection={eventTypes}
      height="100%"
    >
      <SelectTrigger clearable>
        <SelectValueText placeholder="Filter" />
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
