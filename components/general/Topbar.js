import { Box, Flex, Heading, Button } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import { ColorModeButton } from "@/components/ui/color-mode";

export default function Topbar() {
    return (
        <Box 
        bg={{base: "gray.200", _dark: "gray.900"}}
        shadow={"sm"}
        borderBottom={"1px"}
        transition={"all 0.2s"}
        px={4}
        >
            <Flex 
            justifyContent={"space-between"}
            h={16}
            alignItems={"center"}
            >
                <Box>
                    <Link href={"/"}>
                        <Heading _hover={{opacity: 0.8}}>WebViewer</Heading>
                    </Link>
                </Box>
                <Box>
                    <ColorModeButton bg={{base: "gray.200", _dark: "gray.900"}} />
                </Box>
            </Flex>
        </Box>
    )
}
