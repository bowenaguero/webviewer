import db from './db';
import { transformRow } from './browser-parser';

export const processHistoryResults = (results) => {
  const stats = new Map();

  // Use callback to track stats during transformation
  const onUrlStats = (url, domain) => {
    stats.set(domain, (stats.get(domain) || 0) + 1);
    stats.set(url, (stats.get(url) || 0) + 1);
  };

  const historyArray = results.values.map((row) =>
    transformRow(row, results.columns, { onUrlStats })
  );

  historyArray.forEach((item) => {
    item.domain_count = stats.get(item.domain);
    item.url_count = stats.get(item.url);
    db.history.add(item);
  });

  return historyArray;
};

// Re-export shared functions for backwards compatibility
export {
  urlToDomain,
  processVisitTimestamp,
  formatDate,
  transformRow,
  COLUMN_MAP,
} from './browser-parser';
