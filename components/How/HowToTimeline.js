import { Timeline, VStack, Heading, Text, Icon, HStack } from "@chakra-ui/react";
import { FaInfoCircle } from "react-icons/fa";

export default function HowToTimeline({ instructions }) {
  return (
    <VStack gap={7} alignItems="start">
      <VStack gap={2} alignItems="start">
        <Heading size="3xl">How To Use WebViewer</Heading>
        <Text color="gray.500" fontSize="sm">
          This tool was designed to be simple to use.
        </Text>
      </VStack>
      <VStack gap={2} alignItems="start">
        <Timeline.Root size="lg">
          {instructions.map((instruction, index) => (
            <Timeline.Item key={instruction.title}>
              <Timeline.Connector>
                <Timeline.Separator />
                <Timeline.Indicator>{instruction.icon}</Timeline.Indicator>
              </Timeline.Connector>
              <Timeline.Content>
                <Timeline.Title>{instruction.title}</Timeline.Title>
                <Timeline.Description>
                  {instruction.description}
                </Timeline.Description>
              </Timeline.Content>
            </Timeline.Item>
          ))}
        </Timeline.Root>
        <HStack gap={2} alignItems="center">
          <Icon color="gray.500">
            <FaInfoCircle />
          </Icon>
          <Text fontSize="sm" color="gray.500">
            You will need to append .db or .sqlite to the end of the file
            name to upload it.
          </Text>
        </HStack>
      </VStack>
    </VStack>
  );
}
