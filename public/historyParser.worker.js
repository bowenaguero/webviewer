// Web Worker for parsing browser history SQLite files

// Constants
const CHROME_EPOCH_OFFSET = 11644473600000000;
const FIREFOX_PRECISION_DIVISOR = 1000;
const SAFARI_EPOCH_OFFSET = 978307200;
const QUERY_ROW_LIMIT = 500000;
const CHUNK_SIZE = 1000;

// Browser-specific SQL queries
const BROWSER_QUERIES = {
  firefox: {
    downloads: `
      SELECT
        moz_places.last_visit_date AS lastVisitTime,
        moz_places.url,
        moz_places.title,
        moz_annos.content AS eventEntity,
        'File Name' AS eventEntityType,
        'Download' AS eventType,
        'Firefox' as browser
      FROM
        moz_places
      JOIN
        moz_annos ON moz_places.id = moz_annos.place_id
      WHERE
        moz_annos.content NOT LIKE '%deleted%'
      ORDER BY moz_places.last_visit_date DESC
      LIMIT ${QUERY_ROW_LIMIT}
    `,
    visits: `
      SELECT
        moz_historyvisits.visit_date as lastVisitTime,
        moz_places.url,
        moz_places.title,
        moz_places.url as eventEntity,
        'URL' AS eventEntityType,
        'Visit' AS eventType,
        'Firefox' as browser
      FROM
        moz_places
      JOIN
        moz_historyvisits ON moz_places.id = moz_historyvisits.place_id
      ORDER BY moz_historyvisits.visit_date DESC
      LIMIT ${QUERY_ROW_LIMIT}
    `,
    autofill: `
      SELECT
        moz_places.last_visit_date AS lastVisitTime,
        moz_places.url,
        moz_places.title,
        moz_inputhistory.input AS eventEntity,
        'Input' AS eventEntityType,
        'Autofill' AS eventType,
        'Firefox' as browser
      FROM
        moz_places
      JOIN
        moz_inputhistory ON moz_places.id = moz_inputhistory.place_id
      ORDER BY moz_places.last_visit_date DESC
      LIMIT ${QUERY_ROW_LIMIT}
    `,
    bookmarks: `
      SELECT
        moz_places.last_visit_date AS lastVisitTime,
        moz_places.url,
        moz_places.title,
        moz_bookmarks.title AS eventEntity,
        'Bookmark Name' AS eventEntityType,
        'Bookmark' AS eventType,
        'Firefox' as browser
      FROM
        moz_places
      JOIN
        moz_bookmarks ON moz_places.id = moz_bookmarks.fk
      WHERE
        moz_bookmarks.fk IS NOT NULL
      ORDER BY moz_places.last_visit_date DESC
      LIMIT ${QUERY_ROW_LIMIT}
    `,
  },
  chrome: {
    downloads: `
      SELECT
        start_time as lastVisitTime,
        target_path as eventEntity,
        tab_url as url,
        tab_referrer_url as tabReferrerUrl,
        referrer as referrer,
        mime_type as mimeType,
        original_mime_type as originalMimeType,
        received_bytes as receivedBytes,
        total_bytes as totalBytes,
        'File Name' AS eventEntityType,
        'Download' as eventType,
        'Chrome' as browser
      FROM
        downloads
      ORDER BY start_time DESC
      LIMIT ${QUERY_ROW_LIMIT}
    `,
    visits: `
      SELECT
        visits.visit_time as lastVisitTime,
        urls.url as url,
        urls.title,
        urls.url as eventEntity,
        visits.external_referrer_url as referrer,
        'URL' as eventEntityType,
        'Visit' as eventType,
        'Chrome' as browser
      FROM
        visits
      JOIN
        urls ON visits.url = urls.id
      ORDER BY visits.visit_time DESC
      LIMIT ${QUERY_ROW_LIMIT}
    `,
    keyword_search: `
      SELECT
        content_annotations.search_terms as eventEntity,
        visits.visit_time as lastVisitTime,
        urls.url,
        urls.title,
        'Keyword' as eventEntityType,
        'Keyword' as eventType,
        'Chrome' as browser
      FROM
        content_annotations
      JOIN
        visits ON content_annotations.visit_id = visits.id
      JOIN
        urls ON urls.id = visits.url
      WHERE content_annotations.search_terms IS NOT ""
      ORDER BY visits.visit_time DESC
      LIMIT ${QUERY_ROW_LIMIT}
    `,
  },
};

// Column mapping for standardized output
const columnMap = {
  lastVisitTime: 'visitTime',
  title: 'title',
  eventType: 'eventType',
  eventEntity: 'eventEntity',
  browser: 'browser',
  eventEntityType: 'eventEntityType',
};

// Helper functions
const urlToDomain = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return 'Unknown';
  }
};

const processVisitTimestamp = (timestamp) => {
  if (typeof timestamp !== 'number') {
    return timestamp;
  }

  if (timestamp > CHROME_EPOCH_OFFSET) {
    return (timestamp - CHROME_EPOCH_OFFSET) / 1000;
  }

  if (timestamp > 1000000000000) {
    return timestamp / FIREFOX_PRECISION_DIVISOR;
  }

  if (timestamp < 1000000000) {
    return (timestamp + SAFARI_EPOCH_OFFSET) * 1000;
  }

  return timestamp;
};

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

const transformRow = (row, columns, stats) => {
  const historyObject = { additionalFields: {} };

  columns.forEach((column, index) => {
    const value = row[index];

    if (column === 'url') {
      const domain = urlToDomain(value);
      historyObject.url = value;
      historyObject.domain = domain;
      stats.set(domain, (stats.get(domain) || 0) + 1);
      stats.set(value, (stats.get(value) || 0) + 1);
    } else if (column === 'lastVisitTime') {
      historyObject.visitTime = processVisitTimestamp(value);
      historyObject.visitTimeFormatted = formatDate(historyObject.visitTime);
    } else if (column === 'referrer' && value === '') {
      return;
    } else if (columnMap[column]) {
      historyObject[columnMap[column]] = value;
    } else {
      historyObject.additionalFields[column] = value;
    }
  });

  return historyObject;
};

// Estimate total rows for progress calculation
const estimateTotalRows = (db) => {
  let total = 0;
  const countQueries = [
    'SELECT COUNT(*) FROM moz_historyvisits',
    'SELECT COUNT(*) FROM visits',
    'SELECT COUNT(*) FROM moz_places',
    'SELECT COUNT(*) FROM urls',
    'SELECT COUNT(*) FROM downloads',
  ];

  for (const query of countQueries) {
    try {
      const result = db.exec(query)[0];
      if (result && result.values[0]) {
        total += result.values[0][0];
      }
    } catch {
      // Table doesn't exist for this browser type
    }
  }

  return Math.max(total, 100);
};

// Process query results in chunks
const processQueryResultsInChunks = async (
  result,
  stats,
  processedRows,
  totalRows,
  onChunk
) => {
  const { columns, values } = result;
  let chunk = [];
  let currentProcessed = processedRows;

  for (let i = 0; i < values.length; i++) {
    const row = values[i];
    const processed = transformRow(row, columns, stats);
    chunk.push(processed);
    currentProcessed++;

    if (chunk.length >= CHUNK_SIZE) {
      chunk.forEach((item) => {
        item.domain_count = stats.get(item.domain) || 0;
        item.url_count = stats.get(item.url) || 0;
      });

      onChunk(chunk, currentProcessed, totalRows);
      chunk = [];

      // Yield to allow message processing
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  // Send remaining items
  if (chunk.length > 0) {
    chunk.forEach((item) => {
      item.domain_count = stats.get(item.domain) || 0;
      item.url_count = stats.get(item.url) || 0;
    });
    onChunk(chunk, currentProcessed, totalRows);
  }

  return currentProcessed;
};

// Global SQL instance
let SQL = null;

// Main parsing function
const parseHistory = async (data, wasmUrl) => {
  const uint8Array = data instanceof Uint8Array ? data : new Uint8Array(data);

  try {
    self.postMessage({
      type: 'PROGRESS',
      payload: { stage: 'init', message: 'Initializing database engine...', percent: 0 },
    });

    if (!SQL) {
      importScripts('https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/sql-wasm.js');
      SQL = await initSqlJs({
        locateFile: () => wasmUrl,
      });
    }

    const db = new SQL.Database(uint8Array);

    self.postMessage({
      type: 'PROGRESS',
      payload: { stage: 'counting', message: 'Analyzing database...', percent: 2 },
    });

    const totalRows = estimateTotalRows(db);
    let processedRows = 0;
    const stats = new Map();

    self.postMessage({
      type: 'PROGRESS',
      payload: {
        stage: 'processing',
        message: 'Processing history...',
        percent: 5,
        totalRows,
      },
    });

    for (const [browserKey, queries] of Object.entries(BROWSER_QUERIES)) {
      for (const [queryKey, query] of Object.entries(queries)) {
        try {
          const result = db.exec(query)[0];
          if (result && result.values.length > 0) {
            processedRows = await processQueryResultsInChunks(
              result,
              stats,
              processedRows,
              totalRows,
              (chunk, currentProcessed, total) => {
                const progress = Math.min(
                  99,
                  5 + Math.round((currentProcessed / total) * 94)
                );

                self.postMessage({
                  type: 'CHUNK',
                  payload: {
                    items: chunk,
                    progress,
                    processedRows: currentProcessed,
                    totalRows: total,
                  },
                });
              }
            );
          }
        } catch {
          // Query failed for this browser type - continue with others
        }
      }
    }

    db.close();

    self.postMessage({
      type: 'COMPLETE',
      payload: { totalProcessed: processedRows },
    });
  } catch (error) {
    let message = error.message;

    if (message.includes('not a database') || message.includes('file is not a database')) {
      message = 'Invalid database file. Please upload a valid browser history file.';
    } else if (message.includes('WASM')) {
      message = 'Failed to load database engine. Please refresh and try again.';
    }

    self.postMessage({
      type: 'ERROR',
      payload: { message, stack: error.stack },
    });
  }
};

// Message handler
self.onmessage = function(event) {
  const { type, payload } = event.data;

  if (type === 'PARSE_HISTORY') {
    parseHistory(payload.data, payload.wasmUrl)
      .catch(err => {
        self.postMessage({
          type: 'ERROR',
          payload: { message: err.message, stack: err.stack },
        });
      });
  } else if (type === 'CANCEL') {
    // Cancellation not implemented yet
  }
};
