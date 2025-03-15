import { Timeline, VStack, Heading, Text, Icon, HStack } from "@chakra-ui/react";
import { FaInfoCircle, FaFileDownload, FaUpload, FaEye } from "react-icons/fa";

const instructions = [
    {
      title: "Fetch your browser history file",
      description: "Supported browser history files are listed below.",
      gif: "/images/fetch-browser-history-file.gif",
      icon: <FaFileDownload />,
    },
    {
      title: "Upload your browser history file",
      description: "Upload your browser history file to WebViewer.",
      gif: "/images/upload-browser-history-file.gif",
      icon: <FaUpload />,
    },
    {
      title: "View your browser history",
      description:
        "Browser history is displayed in a table format, which can be filtered by date, event type, and more.",
      gif: "/images/view-browser-history.gif",
      icon: <FaEye />,
    },
  ];

export default function HowToTimeline() {
  return (
    <VStack gap={7} alignItems="start">
      <VStack gap={2} alignItems="start">
        <Heading size="3xl">How To Use</Heading>
        <Text color="gray.500" fontSize="sm">
          This tool was designed to be simple to use.
        </Text>
      </VStack>
      <VStack gap={2} alignItems="start">
        <Timeline.Root size="xl">
          {instructions.map((instruction, index) => (
            <Timeline.Item key={instruction.title}>
              <Timeline.Connector>
                <Timeline.Separator />
                <Timeline.Indicator>{instruction.icon}</Timeline.Indicator>
              </Timeline.Connector>
              <Timeline.Content>
                <Timeline.Title fontSize="md">{instruction.title}</Timeline.Title>
                <Timeline.Description>
                  {instruction.description}
                </Timeline.Description>
              </Timeline.Content>
            </Timeline.Item>
          ))}
        </Timeline.Root>
        <HStack gap={2} alignItems="center">
          <Icon color="orange.500">
            <FaInfoCircle />
          </Icon>
          <Text fontSize="sm" fontWeight="medium">
            You will need to append .db or .sqlite to the end of the file
            name to upload it.
          </Text>
        </HStack>
        <HStack gap={2} alignItems="center">
          <Icon color="orange.500">
            <FaInfoCircle />
          </Icon>
          <Text fontSize="sm" fontWeight="medium">
            Browser history files are trimmed to the most recent 25,000 entries.
          </Text>
        </HStack>
      </VStack>
    </VStack>
  );
}
