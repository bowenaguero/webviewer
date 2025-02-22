import { HStack, Box } from "@chakra-ui/react";
import SearchBar from "./SearchBar";
import ExportResults from "./ExportResults";
import FilterBy from "./FilterBy";
export default function ToolBar() {
    return (
        <HStack justifyContent="flex-end" gap={5}>
            <Box width="20%" minWidth="200px">
                <SearchBar />
            </Box>
            <Box width="8%" minWidth="150px">
                <FilterBy />
            </Box>
            <Box>
                <ExportResults />
            </Box>
        </HStack>
    )
}
