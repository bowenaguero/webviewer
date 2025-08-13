import { Box, Text, Link, Flex, Image } from '@chakra-ui/react';

export default function Navbar() {
  return (
    <Box display={'flex'} gap={5} alignItems={'center'}>
      <Link href={'/'}>
        <Flex alignItems={'center'}>
          <Image src={'/v_logo.png'} alt="BHV" width={30} height={30} />
        </Flex>
      </Link>
      <Link href={'/'}>
        <Text
          _hover={{ opacity: 0.8 }}
          fontWeight={'medium'}
          fontSize={'sm'}
          color={'gray.500'}
        >
          Home
        </Text>
      </Link>
      <Link href={'/viewer'}>
        <Text
          _hover={{ opacity: 0.8 }}
          fontWeight={'medium'}
          fontSize={'sm'}
          color={'gray.500'}
        >
          Viewer
        </Text>
      </Link>
      <Link href={'/learn-how'}>
        <Text
          _hover={{ opacity: 0.8 }}
          fontWeight={'medium'}
          fontSize={'sm'}
          color={'gray.500'}
        >
          Learn
        </Text>
      </Link>
      {/* <Link href={"/about"}>
          <Text _hover={{ opacity: 0.8 }} fontWeight={"bold"} fontSize={"sm"} color={"gray.500"}>
            About
          </Text>
        </Link> */}
    </Box>
  );
}
