'use client';

import db from '@/lib/db';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useHistoryWorker() {
  const workerRef = useRef(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    workerRef.current = new Worker('/historyParser.worker.js');

    workerRef.current.onmessage = async (event) => {
      const { type, payload } = event.data;

      switch (type) {
        case 'PROGRESS':
          setProgress(payload);
          break;

        case 'CHUNK':
          try {
            await db.history.bulkAdd(payload.items);
          } catch (e) {
            if (!e.message?.includes('Key already exists')) {
              console.error('IndexedDB write error:', e);
            }
          }
          setProgress({
            stage: 'processing',
            message: `Processed ${payload.processedRows.toLocaleString()} rows...`,
            percent: payload.progress,
            processedRows: payload.processedRows,
            totalRows: payload.totalRows,
          });
          break;

        case 'COMPLETE':
          setProgress({
            stage: 'complete',
            message: 'Processing complete!',
            percent: 100,
            processedRows: payload.totalProcessed,
          });
          setIsProcessing(false);
          break;

        case 'CANCELLED':
          setProgress(null);
          setIsProcessing(false);
          break;

        case 'ERROR':
          setError(payload);
          setIsProcessing(false);
          break;
      }
    };

    workerRef.current.onerror = (error) => {
      console.error('Worker error:', error);
      setError({ message: error.message || 'Worker error occurred' });
      setIsProcessing(false);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const parseHistory = useCallback(async (file) => {
    if (!workerRef.current) return;

    setIsProcessing(true);
    setError(null);
    setProgress({ stage: 'reading', message: 'Reading file...', percent: 0 });

    await db.history.clear();

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const wasmUrl = `${window.location.origin}/sql-wasm.wasm`;

    workerRef.current.postMessage({
      type: 'PARSE_HISTORY',
      payload: { data: uint8Array, wasmUrl },
    });
  }, []);

  const cancel = useCallback(() => {
    workerRef.current?.postMessage({ type: 'CANCEL' });
    setIsProcessing(false);
    setProgress(null);
  }, []);

  return {
    parseHistory,
    cancel,
    progress,
    error,
    isProcessing,
  };
}
