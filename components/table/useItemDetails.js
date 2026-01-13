import { useMemo } from 'react';

/**
 * Hook to compute item details for history items
 * Shared between HistoryRow (desktop) and HistoryCard (mobile)
 */
export function useItemDetails(item) {
  return useMemo(() => {
    const hasEventDetails = item.eventType !== 'Visit';
    const hasAdditionalFields =
      Object.keys(item.additionalFields || {}).length > 0;
    const hasDetails = hasEventDetails || hasAdditionalFields;

    // Build details string
    const detailsParts = [];
    if (hasEventDetails && item.eventEntity) {
      detailsParts.push(`${item.eventEntityType}: ${item.eventEntity}`);
    }
    if (hasAdditionalFields) {
      Object.entries(item.additionalFields).forEach(([key, value]) => {
        detailsParts.push(`${key}: ${String(value)}`);
      });
    }
    const detailsText = detailsParts.join(' · ');

    return {
      hasEventDetails,
      hasAdditionalFields,
      hasDetails,
      detailsText,
    };
  }, [item]);
}
