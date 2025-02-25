import { IconButton, Center } from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";

export default function ExportResults() {
  return (
    <IconButton
      variant="transparent"
      borderRadius={"sm"}
      h="70%"
      _hover={{bg: "gray.800"}}
    >
        <FaBars />
    </IconButton>
  );
}
