import { IconButton, Center } from "@chakra-ui/react";
import { FaFileExport } from "react-icons/fa";

export default function ExportResults() {
    return (
        <IconButton variant="subtle" border={"2px solid"} borderColor={{ base: "gray.200", _dark: "gray.700" }} borderRadius={"md"} h="100%">
            <Center>
                <FaFileExport/>
            </Center>
        </IconButton>
    )
}
