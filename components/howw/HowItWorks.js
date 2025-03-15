import { VStack, Heading, Text, Box, List } from "@chakra-ui/react";

export default function HowItWorks() {
  return (
    <VStack alignItems="start" gap={2}>
      <VStack gap={2} alignItems="start">
        <Heading size="3xl">How It Works</Heading>
        <Text color="gray.500" fontSize="sm">
          This tool uses WebAssembly to read and parse the browser history file.
        </Text>
      </VStack>
      <Box p={3}>
        <List.Root gap={1}>
          <List.Item>
            Sql.js WASM is used to read the browser history file.
          </List.Item>
          <List.Item>
            The data is stored in your browser&apos;s native storage, IndexedDB.
          </List.Item>
          <List.Item>
            The local database is then read from IndexedDB and displayed in the GUI.
          </List.Item>
          <List.Item>
            Aisde from Vercel analytics, no data ever leaves your browser.
          </List.Item>
        </List.Root>
      </Box>
    </VStack>
  );
}
