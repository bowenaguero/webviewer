// Barrel export for lib utilities
// Uses explicit named exports for better tree-shaking

// Constants (from lib/constants/)
export {
  QUERY_ROW_LIMIT,
  WORKER_CHUNK_SIZE,
  CHROME_EPOCH_OFFSET,
  FIREFOX_PRECISION_DIVISOR,
  SAFARI_EPOCH_OFFSET,
  BROWSER_NAMES,
  SEARCH_DEBOUNCE_MS,
  MS_PER_DAY,
  EVENT_TYPE_COLORS,
  ICON_SIZES,
  EXTERNAL_URLS,
} from './constants';

// Helpers
export { capitalizeFirstLetter } from './helpers';

// Filters
export {
  filterByEventTypes,
  filterBySearch,
  sortByDate,
  filterByDate,
  filterByRanges,
  combinedFilter,
} from './filters';

// Range filters (from config)
export {
  RANGE_FILTER_FIELDS,
  DEFAULT_RANGE_FILTERS,
  DEFAULT_STATS_BOUNDS,
} from '../config/filters';

// Utils
export { cn } from './utils';

// Database
export { default as db } from './db';

// Queries and processing
export { queryBrowserHistory, BROWSER_QUERIES } from './queries';
export { processHistoryResults } from './processing';

// Browser parser (new shared module)
export {
  COLUMN_MAP,
  urlToDomain,
  domainToApex,
  processVisitTimestamp,
  formatDate,
  transformRow,
} from './browser-parser';
