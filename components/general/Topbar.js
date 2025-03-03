import { Box, Flex, Heading, Button } from "@chakra-ui/react";
import Link from "next/link";
import { ColorModeButton } from "@/components/ui/color-mode";

export default function Topbar() {
  return (
    <Box
      transition={"all 0.2s"}
      p={5}
      bg="gray.900"
    >
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Box>
          <Link href={"/"}>
            <Heading _hover={{ opacity: 0.8 }} fontSize={"2xl"}>// WebViewer</Heading>
          </Link>
        </Box>
        <Box>
          {/* <ColorModeButton bg={{ base: "gray.200", _dark: "gray.900" }} /> */}
        </Box>
      </Flex>
    </Box>
  );
}
