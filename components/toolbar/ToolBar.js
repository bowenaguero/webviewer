import { HStack, Box } from "@chakra-ui/react";
import SearchBar from "./SearchBar";
import ExportResults from "./ExportResults";
import FilterBy from "./FilterBy";
import ItemsPerPage from "./ItemsPerPage";
import SortBy from "./SortBy";

export default function ToolBar({ itemsPerPage, setItemsPerPage, sortBy, setSortBy }) {
    return (
        <HStack justifyContent="space-between" gap={5}>
            <Box w="50%" display="flex" justifyContent="flex-start" gap={3}>
                <ItemsPerPage itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} />
                <SortBy sortBy={sortBy} setSortBy={setSortBy} />
            </Box>
            <Box w="50%" display="flex" justifyContent="flex-end" gap={3}>
                <Box w="65%">
                    <SearchBar />
                </Box>
                <Box w="35%">
                    <FilterBy />
                </Box>
                <Box flex="1">
                    <ExportResults />
                </Box>
            </Box>
        </HStack>
    )
}
