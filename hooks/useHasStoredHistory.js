'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import db from '@/lib/db';

export default function useHasStoredHistory() {
  const count = useLiveQuery(() => db.history.count());
  return {
    hasData: count > 0,
    isLoading: count === undefined,
  };
}
