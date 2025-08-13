import Navbar from '@/components/topbar/Navbar';
import Socials from '@/components/topbar/Socials';
import { Box } from '@chakra-ui/react';

export default function Topbar() {
  return (
    <Box
      transition={'all 0.2s'}
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      p={5}
      bg="gray.900"
    >
      <Navbar />
      <Socials />
    </Box>
  );
}
