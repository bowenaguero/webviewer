import { Box, IconButton } from '@chakra-ui/react';
import Link from 'next/link';
import { FaGithub, FaCoffee } from 'react-icons/fa';

export default function Socials() {
  return (
    <Box display={'flex'} gap={1} alignItems={'center'}>
      <Link href={'https://github.com/bowenaguero/webviewer'} target="_blank">
        <IconButton
          _hover={{ opacity: 0.8 }}
          color={'gray.500'}
          variant={'ghost'}
          size={'sm'}
        >
          <FaGithub />
        </IconButton>
      </Link>
      <Link href={'https://buymeacoffee.com/bowenaguero'} target="_blank">
        <IconButton
          _hover={{ opacity: 0.8 }}
          color={'gray.500'}
          variant={'ghost'}
          size={'sm'}
        >
          <FaCoffee />
        </IconButton>
      </Link>
    </Box>
  );
}
