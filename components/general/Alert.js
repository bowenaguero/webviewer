import { Alert, Button, Text } from "@chakra-ui/react";
import { CloseButton } from "@/components/ui/close-button";
import { Box, VStack, Center } from "@chakra-ui/react";

export default function _Alert({ alertItem, setShowAlert }) {
    const goToUrl = (alertItem) => {
        window.open(alertItem, '_blank');
        setShowAlert(false);
    }

  return (
    <Alert.Root colorPalette={"gray"} variant="surface">
      <CloseButton
        position="absolute"
        top={2}
        right={2}
        onClick={() => setShowAlert(false)}
      />
      <VStack align="stretch" spacing={4}>
        <Box display="flex" alignItems="flex-start" gap={2}>
            <Alert.Indicator colorPalette={"red"} />
            <Alert.Title fontWeight={"bold"}>Are you sure?</Alert.Title>
        </Box>
        <Center>
            <Box>
            <Alert.Content>
                <Alert.Description>
                <Box wordBreak="break-all">
                    You are about to navigate to <Text fontWeight={"bold"}>{alertItem}</Text>
                </Box>
                </Alert.Description>
            </Alert.Content>
            </Box>
        </Center>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant={"subtle"} colorPalette={"green"} onClick={() => goToUrl(alertItem)}>Go</Button>
        </Box>
      </VStack>
    </Alert.Root>
  );
}
