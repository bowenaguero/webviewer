'use client';

import { useMemo } from 'react';
import { DEFAULT_STATS_BOUNDS } from '@/lib/rangeFilters';

/**
 * Calculate min/max bounds for all stats fields in history data
 * Used by range slider filters in the toolbar
 */
export function useStatsBounds(history) {
  return useMemo(() => {
    if (history.length === 0) {
      return DEFAULT_STATS_BOUNDS;
    }

    // Fields to calculate bounds for
    const fields = [
      'url_count',
      'domain_count',
      'domain_unique_urls',
      'apex_domain_count',
      'apex_domain_unique_urls',
      'apex_domain_unique_subdomains',
    ];

    // Initialize bounds trackers
    const bounds = {};
    for (const field of fields) {
      bounds[field] = { min: Infinity, max: 0 };
    }

    // Single pass through history to calculate all bounds
    for (const item of history) {
      for (const field of fields) {
        const value = item[field];
        if (value < bounds[field].min) bounds[field].min = value;
        if (value > bounds[field].max) bounds[field].max = value;
      }
    }

    return bounds;
  }, [history]);
}
