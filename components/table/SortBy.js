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
      color="gray.200"
      bg="transparent"
      border="none"
      _hover={{ bg: "gray.900" }}
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
