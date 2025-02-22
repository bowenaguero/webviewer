'use client'

import { Badge } from "@chakra-ui/react"
import { FaSearch, FaDownload, FaQuestion } from "react-icons/fa"

export default function EventType({ eventType }) {

    const icons = {
        visit: FaSearch,
        download: FaDownload,
    }

    const iconColor = {
        visit: "blue",
        download: "green",
    }

    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const Icon = icons[eventType] || FaQuestion;
    
    return (
        <>
            <Badge gap={2} colorPalette={iconColor[eventType]} fontSize={["sm", "md"]}>
                <Icon />
                {capitalize(eventType)}
            </Badge>
        </>
    )
}