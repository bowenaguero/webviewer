'use client';

import { useHistoryWorker } from '@/components/hooks/useHistoryWorker';
import { Box, Text, VStack } from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUpload } from 'react-icons/fa';

import { toaster } from '../ui/toaster';

export default function FileUpload({ onHistoryLoaded, setIsProcessing, setProgress }) {
  const { parseHistory, progress, error, isProcessing } = useHistoryWorker();

  // Propagate processing state to parent
  useEffect(() => {
    setIsProcessing?.(isProcessing);
  }, [isProcessing, setIsProcessing]);

  // Propagate progress to parent
  useEffect(() => {
    setProgress?.(progress);
  }, [progress, setProgress]);

  // Handle completion
  useEffect(() => {
    if (progress?.stage === 'complete') {
      onHistoryLoaded?.();
    }
  }, [progress, onHistoryLoaded]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toaster.create({
        title: 'Error',
        description: error.message || 'Error processing file',
        type: 'error',
      });
    }
  }, [error]);

  const onDrop = useCallback(
    async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        toaster.create({
          title: 'Error',
          description: 'Invalid file type',
          type: 'error',
        });
        return;
      }

      if (acceptedFiles.length === 0) {
        toaster.create({
          title: 'Error',
          description: 'No file selected',
          type: 'error',
        });
        return;
      }

      const file = acceptedFiles[0];
      await parseHistory(file);
    },
    [parseHistory]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/x-sqlite3': ['.db', '.sqlite'],
    },
    multiple: false,
  });

  return (
    <Box
      {...getRootProps()}
      width={['300px', '400px', '500px']}
      height="300px"
      borderWidth={2}
      borderRadius="lg"
      borderStyle="dashed"
      cursor="pointer"
      _hover={{
        borderColor: 'blue.500',
        backgroundColor: { base: 'gray.100', _dark: 'gray.900' },
      }}
      transition="all 0.2s"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <input {...getInputProps()} />
      <VStack gap={3}>
        <FaUpload size={40} />
        <Text color="gray.500" fontSize={['xs', 'sm']}>
          {isDragActive
            ? 'Drop to analyze'
            : 'Drag and drop or click to upload'}
        </Text>
      </VStack>
    </Box>
  );
}
