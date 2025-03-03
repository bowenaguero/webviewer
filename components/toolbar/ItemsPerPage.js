"use client";

import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { Button } from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa";

export default function ItemsPerPage({ itemsPerPage, setItemsPerPage }) {
  return (
    <MenuRoot onSelect={(e) => setItemsPerPage(e.value)}>
      <MenuTrigger asChild>
        <Button
          variant="transparent"
          color="gray.500"
          _hover={{ bg: "gray.800" }}
        >
          {`${itemsPerPage} items per page`}
          <FaChevronDown />
        </Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem value={15}>15 items per page</MenuItem>
        <MenuItem value={25}>25 items per page</MenuItem>
        <MenuItem value={50}>50 items per page</MenuItem>
        <MenuItem value={100}>100 items per page</MenuItem>
      </MenuContent>
    </MenuRoot>
  );
}
