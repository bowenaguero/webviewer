import { FaGithub, FaCoffee } from "react-icons/fa";
import { Box, Flex, Link, Text } from "@chakra-ui/react";

export default function Footer() {
    return (
        <Box as="footer"
            position="relative"
            bottom={0}
            width="100%"
            py={4}
            textAlign={"center"}
            alignItems={"center"}
        >
            <Flex justifyContent={"center"} gap={4}>
                <Link href={"https://buymeacoffee.com/bowenaguero"}>
                    <Box display={"flex"} alignItems={"center"} gap={2}>
                    <FaCoffee />
                        <Text>Coffee</Text>
                    </Box>
                </Link>
                <Text>{"//"}</Text>
                <Link href={"https://github.com/bowenaguero/webviewer"}>
                    <Box display={"flex"} alignItems={"center"} gap={2}>
                    <FaGithub />
                        <Text>Source</Text>
                    </Box>
                </Link>
            </Flex>
        </Box>
    )
}
