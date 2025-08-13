import { Box, Flex, Link, Text, Icon } from '@chakra-ui/react';
import { FaGithub, FaCoffee } from 'react-icons/fa';

export default function Footer() {
  return (
    <Box
      as="footer"
      position="relative"
      bottom={0}
      width="100%"
      py={4}
      textAlign={'center'}
      alignItems={'center'}
      bg="gray.900"
    >
      <Flex bg={'gray.900'} justifyContent={'center'} gap={4}>
        <Link
          href={'https://buymeacoffee.com/bowenaguero'}
          target="_blank"
          color={'gray.700'}
        >
          <Box display={'flex'} alignItems={'center'} gap={2}>
            <Icon>
              <FaCoffee size={14} />
            </Icon>
            <Text fontSize="sm">Coffee</Text>
          </Box>
        </Link>
      </Flex>
    </Box>
  );
}
