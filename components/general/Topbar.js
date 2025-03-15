import { Box } from "@chakra-ui/react";
import Socials from "@/components/Socials/Socials";
import Navbar from "@/components/Navbar/Navbar";

export default function Topbar() {
  return (
    <Box
      transition={"all 0.2s"}
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      p={5}
      bg="gray.900"
    >
      <Navbar />
      <Socials />
    </Box>
  );
}
