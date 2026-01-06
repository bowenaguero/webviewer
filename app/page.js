'use client';

import FileUpload from '@/components/fileupload/FileUpload';
import Supports from '@/components/fileupload/Supports';
import { Box, Text, VStack, IconButton, Progress } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaRegQuestionCircle } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(null);

  const handleHistoryLoaded = () => {
    router.push('/viewer');
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
          {/* Keep FileUpload mounted to preserve worker, just hide it */}
          <Box display={isProcessing ? 'none' : 'block'}>
            <FileUpload
              onHistoryLoaded={handleHistoryLoaded}
              setIsProcessing={setIsProcessing}
              setProgress={setProgress}
            />
          </Box>
          {isProcessing && <ProcessingProgress progress={progress} />}
        </Box>
        <Box display="flex" alignItems="center">
          <Supports />
        </Box>
      </VStack>
    </Box>
  );
}

function ProcessingProgress({ progress }) {
  const percent = progress?.percent || 0;
  const message = progress?.message || 'Processing your history...';
  const processedRows = progress?.processedRows;
  const totalRows = progress?.totalRows;

  return (
    <VStack
      display="flex"
      justifyContent="center"
      m={5}
      gap={4}
      width={['300px', '400px', '500px']}
    >
      <Progress.Root value={percent} width="100%" size="md">
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
      <Text fontSize={['xs', 'sm']} color="gray.400">
        {message}
      </Text>
      {processedRows !== undefined && (
        <Text fontSize="xs" color="gray.500">
          {processedRows.toLocaleString()}
          {totalRows ? ` / ${totalRows.toLocaleString()}` : ''} rows
        </Text>
      )}
    </VStack>
  );
}
