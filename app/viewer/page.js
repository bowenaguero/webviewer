"use client";

import { Box, Center, Spinner } from "@chakra-ui/react";
import { useState, Suspense } from "react";
import HistoryTable from "@/components/table/HistoryTable";

export default function ViewerPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ViewerContent />
    </Suspense>
  );
}

function ViewerContent() {
  const storedData = typeof window !== 'undefined' ? localStorage.getItem("browserHistory") : null;
  const parsedData = storedData ? JSON.parse(storedData) : null;
  const [data] = useState(parsedData);
  const [history] = useState(parsedData?.history || null);

  if (!data) {
    return (
      <Box p={8} textAlign="center">
        No history data available. Please upload a history file from the home
        page.
      </Box>
    );
  }

  return (
    <Center>
      <Box w="90%">
        <HistoryTable
          history={history}
        />
      </Box>
    </Center>
  );
}

function LoadingSpinner() {
  return (
    <Center h="100vh">
      <Spinner size="xl" />
    </Center>
  );
}
