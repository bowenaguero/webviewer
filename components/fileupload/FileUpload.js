"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Text, VStack } from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa";
import { queryBrowserHistory, readSqlDatabase, clearHistory, storeHistory } from "@/components/utils/processBrowserHistory";
import { showToast } from "../utils/helpers";

export default function FileUpload({ onHistoryLoaded, setIsProcessing, setProcessingStatus }) {

  const processFile = useCallback(async (file) => {
    clearHistory();
    setIsProcessing(true);

    setProcessingStatus("Reading your history...");
    let db = await readSqlDatabase(file);

    setProcessingStatus("Processing your history...");
    const results = await queryBrowserHistory(db);

    setProcessingStatus("Storing your history...");
    storeHistory(results);
    
    setProcessingStatus("Done!");
    onHistoryLoaded();
  }, [onHistoryLoaded, setProcessingStatus, setIsProcessing]);

  const onDrop = useCallback(
    async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        showToast("Error", "Invalid file type", "error");
        return;
      } else if (acceptedFiles.length === 0) {
        showToast("Error", "No file selected", "error");
        return;
      }
      
      const file = acceptedFiles[0];
      processFile(file);
    },
    [processFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/x-sqlite3": [".db", ".sqlite"],
    },
    multiple: false,
  });

  return (
    <Box
      {...getRootProps()}
      width={["300px", "400px", "500px"]}
      height="300px"
      borderWidth={2}
      borderRadius="lg"
      borderStyle="dashed"
      cursor="pointer"
      _hover={{
        borderColor: "blue.500",
        backgroundColor: { base: "gray.100", _dark: "gray.900" },
      }}
      transition="all 0.2s"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <input {...getInputProps()} />
      <VStack gap={3}>
        <FaUpload size={40} />
        <Text color="gray.500" fontSize={["xs", "sm"]}>
          {isDragActive
            ? "Drop to analyze"
            : "Drag and drop or click to upload"}
        </Text>
      </VStack>
    </Box>
  );
}
