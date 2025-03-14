"use client";

import { Box, Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { Suspense } from "react";
import HistoryTable from "@/components/table/HistoryTable";
import indexedDb from "@/components/utils/indexedDb";
import { useLiveQuery } from "dexie-react-hooks";
import { toaster } from "@/components/ui/toaster";

export default function ViewerPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ViewerContent />
    </Suspense>
  );
}

function ViewerContent() {
  const history = useLiveQuery(() => indexedDb.history.toArray());

  if (!history) {
    return <LoadingSpinner />;
  } else {
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
}

function LoadingSpinner() {
  return (
    <Center h="calc(100vh - 120px)">
      <VStack gap={5}>
        <Spinner size="xl" />
        <Text fontSize={["xs", "sm"]}>
          Loading your history...
        </Text>
      </VStack>
    </Center>
  );
}
