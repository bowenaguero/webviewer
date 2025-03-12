import { Box, Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";

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
            <Heading _hover={{ opacity: 0.8 }} fontSize={"4xl"} fontStyle={"italic"}>BHV</Heading>
          </Link>
        </Box>
      </Flex>
    </Box>
  );
}
