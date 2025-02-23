import { Heading, HStack, Icon } from "@chakra-ui/react";
import { FaEye } from "react-icons/fa";

export default function Event({ eventItem }) {
  return (
      <HStack gap={4}>
        <Icon as={FaEye} color="blue.400" />
        <Heading fontSize={["xs", "xs", "sm", "md"]}>
          https://example.com/this-is-a-test
        </Heading>
      </HStack>
  );
}
