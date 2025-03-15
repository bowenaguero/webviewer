import { Center, VStack, Separator } from "@chakra-ui/react";
import HowToTimeline from "@/components/how/HowToTimeline";
import SupportedBrowsersTable from "@/components/how/SupportedBrowsersTable";
import HowItWorks from "@/components/how/HowItWorks";

export default function How() {
  return (
    <Center p={10}>
      <VStack gap={10} p={10} alignItems="start">
        <HowToTimeline />
        <Separator />
        <SupportedBrowsersTable />
        <Separator />
        <HowItWorks />
      </VStack>
    </Center>
  );
}
