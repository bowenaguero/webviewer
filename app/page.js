"use client";

import { useState } from "react";
import FileUpload from "@/components/fileupload/FileUpload";
import { Box, Text, VStack, IconButton, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FaRegQuestionCircle } from "react-icons/fa";
import Link from "next/link";
import Supports from "@/components/fileupload/Supports";

export default function Home() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState(null);

  const handleHistoryLoaded = () => {
    router.push("/viewer");
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
            <ProcessingSpinner processingStatus={processingStatus} />
          ) : (
            <FileUpload
              onHistoryLoaded={handleHistoryLoaded}
              setIsProcessing={setIsProcessing}
              setProcessingStatus={setProcessingStatus}
            />
          )}
        </Box>
        <Box display="flex" alignItems="center">
          <Supports />
        </Box>
      </VStack>
    </Box>
  );
}

function ProcessingSpinner({ processingStatus }) {
  return (
    <VStack display="flex" justifyContent="center" m={5} gap={5}>
      <Spinner size="sm" />
      <Text fontSize={["xs", "sm"]}>{processingStatus}</Text>
    </VStack>
  );
}