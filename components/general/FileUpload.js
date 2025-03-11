"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Text, VStack } from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa";
import initSqlJs from "sql.js";
import { queryBrowserHistory } from "@/components/utils/queryBrowserHistory";

export default function FileUpload({ onHistoryLoaded }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      setIsProcessing(true);
      try {
        const file = acceptedFiles[0];
        const arrayBuffer = await file.arrayBuffer();

        const SQL = await initSqlJs({
          locateFile: (file) => `/${file}`,
        });

        const db = new SQL.Database(new Uint8Array(arrayBuffer));
        const { history } = await queryBrowserHistory(db);

        onHistoryLoaded({ history });
      } catch (error) {
        console.error("Error processing file:", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [onHistoryLoaded]
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
        <Text fontSize={["xs", "sm", "md"]}>
          {isDragActive ? "Drop to analyze" : "PRIVATE + SECURE"}
        </Text>
        <Text fontSize={["2xs", "xs", "sm"]}>
          {"DATA NEVER LEAVES YOUR BROWSER"}
        </Text>
      </VStack>
    </Box>
  );
}
