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
      color="gray.500"
      _hover={{ bg: "gray.800" }}
      onClick={() => {
        setSortBy(sortBy === "asc" ? "desc" : "asc");
      }}
    >
      {sortBy === "asc" ? `Oldest first` : `Newest first`}
      <Icon />
    </Button>
  );
}
