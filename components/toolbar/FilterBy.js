import { createListCollection } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import EventIcon from "../event/EventIcon";
import { HStack } from "@chakra-ui/react";

export default function FilterBy({ eventTypes, capitalizeFirstLetter, setFilteredEventTypes }) {
  const eventTypeMap = createListCollection({
    items: eventTypes.map(type => ({
      label: capitalizeFirstLetter(type),
      value: type
    }))
  });

  return (
    <SelectRoot
      borderRadius="sm"
      border="1px solid"
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
      multiple
      collection={eventTypeMap}
      height="100%"
      onValueChange={setFilteredEventTypes}
    >
      <SelectTrigger clearable>
        <SelectValueText placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        {eventTypeMap.items.map((item) => (
          <SelectItem key={item.value} item={item}>
            <HStack>
              <EventIcon eventType={item.value} size="sm" />
              {item.label}
            </HStack>
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
