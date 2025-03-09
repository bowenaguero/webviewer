"use client";

import FileUpload from "@/components/general/FileUpload";
import { Box, Text, VStack, Icon } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FaRegQuestionCircle } from "react-icons/fa";
import Link from "next/link";
export default function Home() {
  const router = useRouter();

  const handleHistoryLoaded = (data) => {
    try {
      const dataString = JSON.stringify(data);
      localStorage.setItem("browserHistory", dataString);
      router.push("/viewer");
    } catch (error) {
      console.error("Error processing history:", error);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="calc(100vh - 120px)"
      textAlign="center"
    >
        <VStack gap={5}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Text
              fontSize={["3xl", "4xl", "5xl"]}
              fontWeight="bold"
              letterSpacing="tight"
            >
              Browser History Viewer
            </Text>
            <Box display="flex" gap={2}>
              <Link href="/learn-how" target="_blank">
                <Icon
                  color="gray.500"
                  _hover={{ color: "gray.700" }}
                  size={["xs","sm"]}
                  as={FaRegQuestionCircle}
                />
              </Link>
              <Text fontSize={["sm", "md", "lg"]}>
                Upload your browser history file for secure, local analysis.
              </Text>
            </Box>
          </Box>
          <Box>
          <FileUpload onHistoryLoaded={handleHistoryLoaded} />
        </Box>
      </VStack>
    </Box>
  );
}
