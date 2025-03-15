import { Box } from "@chakra-ui/react";
import Socials from "@/components/topbar/Socials";
import Navbar from "@/components/topbar/Navbar";

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
