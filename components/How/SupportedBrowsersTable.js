import { Table, VStack, Heading, Text } from "@chakra-ui/react";

const supportedBrowsers = [
    {
      name: "Chromium",
      supported: true,
      fileName: "History",
      filePath: [
        "Windows: AppData/Local/Google/Chrome/User Data/Default/History",
        "macOS: Library/Application Support/Google/Chrome/Default/History",
      ],
    },
    {
      name: "Firefox",
      supported: true,
      fileName: "places.sqlite",
      filePath: [
        "Windows: AppData/Local/Mozilla/Firefox/Profiles/Default/places.sqlite",
        "macOS: Library/Application Support/Mozilla/Firefox/Profiles/Default/places.sqlite",
      ],
    },
    {
      name: "Edge",
      supported: true,
      fileName: "History",
      filePath: [
        "Windows: AppData/Local/Microsoft/Edge/User Data/Default/History",
        "macOS: Library/Application Support/Microsoft/Edge/Default/History",
      ],
    },
    {
      name: "Safari",
      supported: false,
      fileName: "History",
      filePath: [
        "Windows: AppData/Local/Apple Computer/Safari/History",
        "macOS: Library/Application Support/Apple/Safari/History",
      ],
    },
    {
      name: "Opera (Not Tested)",
      supported: false,
      fileName: "History",
      filePath: [
        "Windows: AppData/Local/Opera Software/Opera Stable/History",
        "macOS: Library/Application Support/Opera Software/Opera Stable/History",
      ],
    },
    {
      name: "Brave (Not Tested)",
      supported: false,
      fileName: "History",
      filePath: [
        "Windows: AppData/Local/BraveSoftware/Brave-Browser/User Data/Default/History",
        "macOS: Library/Application Support/BraveSoftware/Brave-Browser/Default/History",
      ],
    },
  ];

export default function SupportedBrowsersTable() {
  return (
    <VStack alignItems="start" gap={5}>
      <VStack gap={2} alignItems="start">
        <Heading size="3xl">Supported Browsers</Heading>
        <Text color="gray.500" fontSize="sm">
          Additional browsers are planned for the future.
        </Text>
      </VStack>
      <Table.Root
        border="2px solid"
        borderColor="gray.700"
        borderRadius="sm"
        showColumnBorder
      >
        <Table.Header>
          <Table.Row bg="gray.950">
            <Table.ColumnHeader p={4} w="12%">
              Browser
            </Table.ColumnHeader>
            <Table.ColumnHeader p={4} w="10%">
              Supported
            </Table.ColumnHeader>
            <Table.ColumnHeader p={4} w="15%">
              File Name
            </Table.ColumnHeader>
            <Table.ColumnHeader p={4} w="40%">
              File Path
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {supportedBrowsers.map((browser) => (
            <Table.Row key={browser.name} bg="gray.950">
              <Table.Cell>{browser.name}</Table.Cell>
              <Table.Cell color={browser.supported ? "green.500" : "red.500"}>{browser.supported ? "Yes" : "No"}</Table.Cell>
              <Table.Cell>{browser.fileName}</Table.Cell>
              <Table.Cell whiteSpace="pre-wrap">
                <code>{browser.filePath.join("\n")}</code>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </VStack>
  );
}
