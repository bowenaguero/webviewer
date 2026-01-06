'use client';

import FileUpload from '@/components/fileupload/FileUpload';
import Supports from '@/components/fileupload/Supports';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] text-center">
      <div className="flex flex-col items-center gap-5">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Browser History Viewer
          </h1>
          <div className="flex items-center">
            <Link href="/learn-how">
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <FaRegQuestionCircle className="size-4" />
              </Button>
            </Link>
            <span className="text-xs sm:text-sm md:text-base lg:text-lg">
              Upload your browser history file for secure, local analysis.
            </span>
          </div>
        </div>
        <div>
          {/* Keep FileUpload mounted to preserve worker, just hide it */}
          <div className={isProcessing ? 'hidden' : 'block'}>
            <FileUpload
              onHistoryLoaded={handleHistoryLoaded}
              setIsProcessing={setIsProcessing}
              setProgress={setProgress}
            />
          </div>
          {isProcessing && <ProcessingProgress progress={progress} />}
        </div>
        <div className="flex items-center">
          <Supports />
        </div>
      </div>
    </div>
  );
}

function ProcessingProgress({ progress }) {
  const percent = progress?.percent || 0;
  const message = progress?.message || 'Processing your history...';
  const processedRows = progress?.processedRows;
  const totalRows = progress?.totalRows;

  return (
    <div className="flex flex-col items-center justify-center m-5 gap-4 w-[300px] sm:w-[400px] md:w-[500px]">
      <Progress value={percent} className="w-full" />
      <span className="text-xs sm:text-sm text-gray-400">
        {message}
      </span>
      {processedRows !== undefined && (
        <span className="text-xs text-gray-500">
          {processedRows.toLocaleString()}
          {totalRows ? ` / ${totalRows.toLocaleString()}` : ''} rows
        </span>
      )}
    </div>
  );
}
