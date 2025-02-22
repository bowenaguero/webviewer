import { createListCollection } from "@chakra-ui/react"
import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText
} from "@/components/ui/select"
import { FaSearch, FaDownload } from "react-icons/fa"
import { HStack, Icon } from "@chakra-ui/react"

export default function FilterBy() {

    const eventTypes = createListCollection({
        items: [
            {label: "visits", value: "visits", icon: FaSearch},
            {label: "downloads", value: "downloads", icon: FaDownload},
        ],
    })

    return (
        <SelectRoot variant="subtle" multiple collection={eventTypes}>
            <SelectTrigger>
                <SelectValueText placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
                {eventTypes.items.map((eventType) => (
                    <SelectItem item={eventType} key={eventType.value}>
                        <HStack>
                            <eventType.icon />
                            {eventType.label}
                        </HStack>
                    </SelectItem>
                ))}
            </SelectContent>
        </SelectRoot>
    )
}
