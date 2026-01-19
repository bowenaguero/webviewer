'use client';

import { memo, useCallback, useEffect } from 'react';
import { useHistoryWorker } from '@/hooks/useHistoryWorker';
import { useDropzone } from 'react-dropzone';
import { FaUpload } from 'react-icons/fa';
import { toast } from 'sonner';
import HomeNavBar from './HomeNavBar';

const FileUpload = memo(function FileUpload({
  onHistoryLoaded,
  setIsProcessing,
  setProgress,
}) {
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
      toast.error('Error', {
        description: error.message || 'Error processing file',
      });
    }
  }, [error]);

  const onDrop = useCallback(
    async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        toast.error('Error', {
          description: 'Invalid file type',
        });
        return;
      }

      if (acceptedFiles.length === 0) {
        toast.error('Error', {
          description: 'No file selected',
        });
        return;
      }

      const file = acceptedFiles[0];
      await parseHistory(file);
    },
    [parseHistory],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/x-sqlite3': ['.db', '.sqlite'],
    },
    multiple: false,
  });

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        {...getRootProps()}
        className="w-[300px] sm:w-[400px] md:w-[500px] h-[200px] sm:h-[250px] md:h-[300px] border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-900 transition-all duration-200 flex items-center justify-center"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <FaUpload size={40} />
        </div>
      </div>
      <HomeNavBar />
    </div>
  );
});

export default FileUpload;
