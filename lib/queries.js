import db from './db';
import { processHistoryResults } from './processing';
import { BROWSER_QUERIES } from './browser-parser';

export const queryBrowserHistory = (sqlDb) => {
  db.history.clear();
  const allResults = [];

  Object.keys(BROWSER_QUERIES).forEach((browserKey) => {
    Object.keys(BROWSER_QUERIES[browserKey]).forEach((queryKey) => {
      try {
        const queryResult = sqlDb.exec(BROWSER_QUERIES[browserKey][queryKey])[0];
        if (queryResult) {
          const processedResult = processHistoryResults(queryResult);
          allResults.push(...processedResult);
        }
      } catch (error) {
        // Query failed for this browser type - continue with others
      }
    });
  });

  return { history: allResults };
};

// Re-export for backwards compatibility
export { BROWSER_QUERIES };
