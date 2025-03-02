import { FaGithub, FaCoffee } from "react-icons/fa";
import { Box, Flex, Link, Text, Icon } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box
      as="footer"
      position="relative"
      bottom={0}
      width="100%"
      py={4}
      textAlign={"center"}
      alignItems={"center"}
      bg="gray.900"
    >
      <Flex color={"gray.500"} justifyContent={"center"} gap={4}>
        <Link href={"https://buymeacoffee.com/bowenaguero"} color={"gray.700"}>
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <Icon>
              <FaCoffee size={14} />
            </Icon>
            <Text fontSize="sm">Coffee</Text>
          </Box>
        </Link>
        <Text fontSize="sm">{"//"}</Text>
        <Link
          href={"https://github.com/bowenaguero/webviewer"}
          color={"gray.700"}
        >
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <Icon>
              <FaGithub size={14} />
            </Icon>
            <Text fontSize="sm">Source</Text>
          </Box>
        </Link>
      </Flex>
    </Box>
  );
}
