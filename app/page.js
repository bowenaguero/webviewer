'use client';

import FileUpload from '@/components/fileupload/FileUpload';
import { Progress } from '@/components/ui/progress';
import { GeistMono } from 'geist/font/mono';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
        <div className="flex flex-col items-center p-5">
          <h1
            className={`text-5xl md:text-6xl font-bold tracking-tight ${GeistMono.className}`}
          >
            // Viewer
          </h1>
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
      <span className="text-xs sm:text-sm text-fg-muted">{message}</span>
      {processedRows !== undefined && (
        <span className="text-xs text-fg-secondary">
          {processedRows.toLocaleString()}
          {totalRows ? ` / ${totalRows.toLocaleString()}` : ''} rows
        </span>
      )}
    </div>
  );
}
