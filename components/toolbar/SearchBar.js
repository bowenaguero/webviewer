import { Box, Input } from "@chakra-ui/react";
import { InputGroup } from "@/components/ui/input-group";
import ExportResults from "./ExportResults";
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  return (
      <InputGroup 
        flex={1} 
        startElement={<FaSearch />} 
        endElement={<ExportResults />}
        w="100%"
      >
        <Input
          variant="subtle"
          placeholder="Search"
          border="1px solid"
          borderColor={{ base: "gray.200", _dark: "gray.700" }}
          borderRadius="sm"
        />
      </InputGroup>
  );
}
