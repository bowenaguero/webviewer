'use client';

import HistoryTable from '@/components/table/HistoryTable';
import indexedDb from '@/components/utils/indexedDb';
import { useLiveQuery } from 'dexie-react-hooks';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

export default function ViewerPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ViewerContent />
    </Suspense>
  );
}

function ViewerContent() {
  const history = useLiveQuery(() => indexedDb.history.toArray());

  if (!history) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex justify-center px-3 md:px-0">
      <div className="w-full md:w-[90%]">
        <HistoryTable history={history} />
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-120px)]">
      <div className="flex flex-col items-center gap-5">
        <Loader2 className="size-12 animate-spin" />
        <span className="text-xs sm:text-sm">Loading your history...</span>
      </div>
    </div>
  );
}
