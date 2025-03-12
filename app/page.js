"use client";

import { useState } from "react";
import FileUpload from "@/components/general/FileUpload";
import { Box, Text, VStack, IconButton, Spinner, Icon } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FaRegQuestionCircle, FaChrome, FaFirefox, FaSafari } from "react-icons/fa";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleHistoryLoaded = (data) => {
    try {
      const dataString = JSON.stringify(data);
      localStorage.setItem("browserHistory", dataString);
      toaster.create({
        title: "History loaded",
        description: "You can now view your browser history",
        type: "info",
      });
      router.push("/viewer");
    } catch (error) {
      console.error("Error processing history:", error);
      toaster.create({
        title: "Error",
        description: "Error processing history",
        type: "error",
      });
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
          <Box display="flex" alignItems="center">
            <Link href="/learn-how">
              <IconButton
                color="gray.500"
                _hover={{ color: "gray.700" }}
                variant="ghost"
                size={["xs", "sm"]}
              >
                <FaRegQuestionCircle />
              </IconButton>
            </Link>
            <Text fontSize={["xs", "sm", "md", "lg"]}>
              Upload your browser history file for secure, local analysis.
            </Text>
          </Box>
        </Box>
        <Box>
          {isProcessing ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <Spinner size="sm" />
            </Box>
          ) : (
            <FileUpload
              onHistoryLoaded={handleHistoryLoaded}
              setIsProcessing={setIsProcessing}
            />
          )}
        </Box>
        <Box display="flex" justifyContent="center" gap={2} alignItems="center">
          <Text fontSize={["xs"]} color="gray.500">
            Supports:{" "}
          </Text>
          <Tooltip content="Chromium (Supported)">
            <Icon color="gray.500" opacity={0.8} as={FaChrome} />
          </Tooltip>
          <Tooltip content="Firefox (Supported)">
            <Icon color="gray.500" opacity={0.8} as={FaFirefox} />
          </Tooltip>
          <Tooltip content="Safari (Not Supported)">
            <Icon color="gray.500" opacity={0.1} as={FaSafari} />
          </Tooltip>
        </Box>
      </VStack>
    </Box>
  );
}
