import {
  Box,
  Text,
  VStack,
  Heading,
  Center,
  Link,
  List,
} from "@chakra-ui/react";

export default function How() {
  return (
    <Center w="100%">
      <Box w={["100%", "70%", "50%"]}>
        <VStack align="flex-start" gap={11}>
          <VStack align="flex-start" gap={3} m={5}>
            <Heading size="3xl">⚙️ How It Works</Heading>
            <Text>
              WebViewer uses{" "}
              <Link
                href="https://github.com/sql-js/sql.js/"
                color="blue.500"
                target="_blank"
              >
                sql.js
              </Link>{" "}
              to process browser history databases directly in your browser.
            </Text>
            <Text color="green.500">
              All processing occurs locally in your
              browser using{" "}
              <Link
                href="https://webassembly.org/"
                color="green.700"
                target="_blank"
              >
                WebAssembly
              </Link>
              . Your data never leaves your device.
            </Text>
          </VStack>

          <VStack align="flex-start" gap={3} m={5}>
            <Heading size="3xl">👁️ Supported Browsers</Heading>
            <Text>
              WebViewer currently supports databases from the following
              browsers:
            </Text>
            <List.Root spacing={3} pl={4}>
              <List.Item>
                <Link
                  color="blue.500"
                  href="https://www.foxtonforensics.com/browser-history-examiner/firefox-history-location"
                  target="_blank"
                >
                  Firefox (places.sqlite)
                </Link>
              </List.Item>
              <List.Item>
                <Link
                  color="blue.500"
                  href="https://www.foxtonforensics.com/browser-history-examiner/chrome-history-location"
                  target="_blank"
                >
                  Chromium (History)
                </Link>
              </List.Item>
              {/* <List.Item>
                <Link
                  color="blue.500"
                  href="https://www.foxtonforensics.com/browser-history-examiner/safari-history-location"
                  target="_blank"
                >
                  Safari - History
                </Link>
              </List.Item> */}
            </List.Root>
          </VStack>

          <VStack align="flex-start" gap={3} m={5}>
            <Heading size="3xl">💻 Getting Started</Heading>
            <Text>To view your browser history:</Text>
            <List.Root spacing={3} pl={4}>
              <List.Item>
                Locate your browser&apos;s history database file (see supported
                browsers above)
              </List.Item>
              <List.Item>
                Drag and drop the file, or click to browse and upload
              </List.Item>
              <List.Item>
                WebViewer will automatically analyze and display your history
              </List.Item>
            </List.Root>
          </VStack>
        </VStack>
      </Box>
    </Center>
  );
}
