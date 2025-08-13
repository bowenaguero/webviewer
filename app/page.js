'use client';

import FileUpload from '@/components/fileupload/FileUpload';
import Supports from '@/components/fileupload/Supports';
import { toaster } from '@/components/ui/toaster';
import { Box, Text, VStack, IconButton, Spinner } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaRegQuestionCircle } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleHistoryLoaded = (data) => {
    try {
      router.push('/viewer');
    } catch (error) {
      console.error('Error processing history:', error);
      toaster.create({
        title: 'Error',
        description: 'Error processing history',
        type: 'error',
      });
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="calc(100vh - 120px)"
      textAlign="center"
    >
      <VStack gap={5}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Text
            fontSize={['3xl', '4xl', '5xl']}
            fontWeight="bold"
            letterSpacing="tight"
          >
            Browser History Viewer
          </Text>
          <Box display="flex" alignItems="center">
            <Link href="/learn-how">
              <IconButton
                color="gray.500"
                _hover={{ color: 'gray.700' }}
                variant="ghost"
                size={['xs', 'sm']}
              >
                <FaRegQuestionCircle />
              </IconButton>
            </Link>
            <Text fontSize={['xs', 'sm', 'md', 'lg']}>
              Upload your browser history file for secure, local analysis.
            </Text>
          </Box>
        </Box>
        <Box>
          {isProcessing ? (
            <ProcessingSpinner />
          ) : (
            <FileUpload
              onHistoryLoaded={handleHistoryLoaded}
              setIsProcessing={setIsProcessing}
            />
          )}
        </Box>
        <Box display="flex" alignItems="center">
          <Supports />
        </Box>
      </VStack>
    </Box>
  );
}

function ProcessingSpinner() {
  return (
    <VStack display="flex" justifyContent="center" m={5} gap={5}>
      <Spinner size="sm" />
      <Text fontSize={['xs', 'sm']}>Processing your history...</Text>
    </VStack>
  );
}
