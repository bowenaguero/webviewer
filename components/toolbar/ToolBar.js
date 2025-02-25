import { HStack, Box } from "@chakra-ui/react";
import SearchBar from "./SearchBar";
import ExportResults from "./ExportResults";
import FilterBy from "./FilterBy";
import ItemsPerPage from "./ItemsPerPage";
import SortBy from "./SortBy";
import PaginationMenu from "../table/PaginationMenu";
export default function ToolBar({
  itemsPerPage,
  setItemsPerPage,
  sortBy,
  setSortBy,
  page,
  setPage,
  count,
}) {
  return (
    <HStack
      justifyContent="space-between"
      gap={5}
      h="40px"
      alignItems="center"
      justifyItems="center"
    >
      <Box w="30%" display="flex" justifyContent="flex-start" gap={3}>
        <ItemsPerPage
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
        <SortBy sortBy={sortBy} setSortBy={setSortBy} />
      </Box>
      <Box w="30%" display="flex" justifyContent="center" gap={3}>
        <SearchBar />
      </Box>
      <Box
        display="flex"
        justifyContent="flex-end"
        gap={5}
        h="100%"
        w="30%"
      >
        <PaginationMenu
          page={page}
          setPage={setPage}
          itemsPerPage={itemsPerPage}
          count={count}
          style="compact"
        />
      </Box>
    </HStack>
  );
}
