'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import indexedDb from '@/components/utils/indexedDb';

export default function useHasStoredHistory() {
  const count = useLiveQuery(() => indexedDb.history.count());
  return {
    hasData: count > 0,
    isLoading: count === undefined,
  };
}
