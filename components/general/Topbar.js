import { Box, Flex, Text, IconButton } from "@chakra-ui/react";
import { FaGithub, FaCoffee } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function Topbar() {
  return (
    <Box transition={"all 0.2s"} p={5} bg="gray.900">
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Box display={"flex"} gap={5} alignItems={"center"}>
          <Link href={"/"}>
            <Flex alignItems={"center"}>
              <Image src={"/v_logo.png"} alt="BHV" width={30} height={30} />
            </Flex>
          </Link>
          <Link href={"/"}>
            <Text
              _hover={{ opacity: 0.8 }}
              fontWeight={"medium"}
              fontSize={"sm"}
              color={"gray.500"}
            >
              Home
            </Text>
          </Link>
          <Link href={"/viewer"}>
            <Text
              _hover={{ opacity: 0.8 }}
              fontWeight={"medium"}
              fontSize={"sm"}
              color={"gray.500"}
            >
              Viewer
            </Text>
          </Link>
          <Link href={"/learn-how"}>
            <Text
              _hover={{ opacity: 0.8 }}
              fontWeight={"medium"}
              fontSize={"sm"}
              color={"gray.500"}
            >
              Learn
            </Text>
          </Link>
          {/* <Link href={"/about"}>
            <Text _hover={{ opacity: 0.8 }} fontWeight={"bold"} fontSize={"sm"} color={"gray.500"}>
              About
            </Text>
          </Link> */}
        </Box>
        <Box display={"flex"} gap={1} alignItems={"center"}>
          <Link href={"https://github.com/bowenaguero/webviewer"} target="_blank">
            <IconButton
              _hover={{ opacity: 0.8 }}
              color={"gray.500"}
              variant={"ghost"}
              size={"sm"}
            >
              <FaGithub />
            </IconButton>
          </Link>
          <Link href={"https://buymeacoffee.com/bowenaguero"} target="_blank">
            <IconButton
              _hover={{ opacity: 0.8 }}
              color={"gray.500"}
              variant={"ghost"}
              size={"sm"}
            >
              <FaCoffee />
            </IconButton>
          </Link>
        </Box>
      </Flex>
    </Box>
  );
}
