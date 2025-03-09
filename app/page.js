"use client";

import FileUpload from "@/components/general/FileUpload";
import { Box, Text, VStack } from "@chakra-ui/react";
import { InfoTip, ToggleTip } from "@/components/ui/toggle-tip";
import { useRouter } from "next/navigation";

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
      <VStack spacing={6} mb={12}>
        <Text
          fontSize={["3xl", "4xl", "5xl"]}
          fontWeight="bold"
          letterSpacing="tight"
        >
          Browser History Viewer
        </Text>
        <Box display="flex" alignItems="center" gap={1}>
          <Text fontSize={["sm", "md", "lg"]}>
            Upload your browser history file for secure, local analysis.
          </Text>
          <InfoTip content="Currently only supports Chromium and Firefox sqlite databases. Upload history.db or places.sqlite." />
        </Box>
      </VStack>
      <FileUpload onHistoryLoaded={handleHistoryLoaded} />
    </Box>
  );
}
