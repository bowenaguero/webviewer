import { IconButton } from "@chakra-ui/react";
import { FaFileExport } from "react-icons/fa";

export default function ExportResults() {
    return (
        <IconButton variant="outline">
            <FaFileExport/>
        </IconButton>
    )
}
