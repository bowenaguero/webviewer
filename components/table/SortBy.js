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
