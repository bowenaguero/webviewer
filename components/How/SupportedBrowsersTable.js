import { Table, VStack, Heading, Text } from "@chakra-ui/react";

export default function SupportedBrowsersTable({ supportedBrowsers }) {
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
