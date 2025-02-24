import { Button } from "@chakra-ui/react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

export default function SortBy({ sortBy, setSortBy }) {
    const icons = {
        asc: FaChevronUp,
        desc: FaChevronDown,
    }

    const Icon = icons[sortBy];

  return (
    <Button
      variant="transparent"
      fontSize={["xs", "xs", "sm", "md"]}
      bg={{ base: "gray.100", _dark: "gray.900" }}
      border={"2px solid"}
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
      _hover={{ bg: "gray.800" }}
      onClick={() => {
        setSortBy(sortBy === "asc" ? "desc" : "asc");
        console.log(sortBy);
      }}
    >
      {sortBy === "asc" ? `Oldest first` : `Newest first`}
      <Icon />
    </Button>
  );
}
