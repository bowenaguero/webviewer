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
            <Badge 
            gap={2} 
            height={["10px", "20px", "30px", "40px"]} 
            width={["80px", "100px", "120px", "160px"]} 
            colorPalette={iconColor[eventType]} 
            fontSize={["xs", "sm", "lg"]}
            display="flex"
            alignItems="center"
            justifyContent="center">
                <Icon />
                {capitalize(eventType)}
            </Badge>
        </>
    )
}