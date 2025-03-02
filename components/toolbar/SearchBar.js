import { Box, Input } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

export default function SearchBar({ setSearch }) {
  return (
      <Input
        variant="subtle"
        placeholder="Search"
        border="2px solid"
        borderColor={{ base: "gray.200", _dark: "gray.700" }}
        borderRadius="sm"
        onChange={(e) => setSearch(e.target.value)}
      />
  );
}
