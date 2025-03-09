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
import { capitalizeFirstLetter } from "../utils/helpers";

export default function FilterBy({ eventTypes, setFilteredEventTypes, filteredEventTypes, setPage }) {
  const eventTypeMap = createListCollection({
    items: eventTypes.map(type => ({
      label: capitalizeFirstLetter(type),
      value: type
    }))
  });

  const handleValueChange = (value) => {
    setFilteredEventTypes(value);
    setPage(1);
  };

  return (
    <SelectRoot
      borderRadius="sm"
      border="1px solid"
      borderColor={filteredEventTypes.value.length > 0 ? "gray.300" : "gray.800"}
      multiple
      collection={eventTypeMap}
      height="100%"
      onValueChange={handleValueChange}
      _hover={{ borderColor: "gray.700" }}
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
