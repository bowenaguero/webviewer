'use client'

import { 
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger
} from "@/components/ui/menu"
import { Button } from "@chakra-ui/react"
import { FaChevronDown } from "react-icons/fa"

export default function ItemsPerPage2({itemsPerPage, setItemsPerPage}) {
    return (
        <MenuRoot onSelect={(e) => setItemsPerPage(e.value)}>
            <MenuTrigger asChild>
                <Button variant="transparent">
                    {`${itemsPerPage} items per page`}
                    <FaChevronDown />
                </Button>
            </MenuTrigger>
            <MenuContent>
                <MenuItem value={25}>
                    25 items per page
                </MenuItem>
                <MenuItem value={50}>
                    50 items per page
                </MenuItem>
                <MenuItem value={100}>
                    100 items per page
                </MenuItem>
                <MenuItem value={200}>
                    200 items per page
                </MenuItem>
            </MenuContent>
        </MenuRoot>
    )
}