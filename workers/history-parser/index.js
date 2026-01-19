// Web Worker for parsing browser history SQLite files
// This is the source file that gets bundled to public/historyParser.worker.js

import { WORKER_CHUNK_SIZE } from '../../lib/constants/index';
import { BROWSER_QUERIES, transformRow } from '../../lib/browser-parser';
import { estimateTotalRows, buildStats, attachStats } from './stats';

// Global SQL instance
let SQL = null;

// PSL library loaded flag
let pslLoaded = false;

const loadPsl = () => {
  if (!pslLoaded) {
    importScripts('https://cdn.jsdelivr.net/npm/psl@1.9.0/dist/psl.min.js');
    pslLoaded = true;
  }
};

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

    // Load PSL library for apex domain parsing
    loadPsl();

    const db = new SQL.Database(uint8Array);

    self.postMessage({
      type: 'PROGRESS',
      payload: { stage: 'counting', message: 'Analyzing database...', percent: 2 },
    });

    const totalRows = estimateTotalRows(db);

    self.postMessage({
      type: 'PROGRESS',
      payload: {
        stage: 'collecting',
        message: 'Collecting history data...',
        percent: 5,
        totalRows,
      },
    });

    // PASS 1: Collect all rows
    const allRows = [];
    let collectedRows = 0;

    for (const [browserKey, queries] of Object.entries(BROWSER_QUERIES)) {
      for (const [queryKey, query] of Object.entries(queries)) {
        try {
          const result = db.exec(query)[0];
          if (result && result.values.length > 0) {
            const { columns, values } = result;
            for (const row of values) {
              const transformed = transformRow(row, columns);
              allRows.push(transformed);
              collectedRows++;

              // Update progress periodically
              if (collectedRows % 5000 === 0) {
                const progress = Math.min(45, 5 + Math.round((collectedRows / totalRows) * 40));
                self.postMessage({
                  type: 'PROGRESS',
                  payload: {
                    stage: 'collecting',
                    message: 'Collecting history data...',
                    percent: progress,
                    processedRows: collectedRows,
                    totalRows,
                  },
                });
              }
            }
          }
        } catch {
          // Query failed for this browser type - continue with others
        }
      }
    }

    db.close();

    self.postMessage({
      type: 'PROGRESS',
      payload: {
        stage: 'stats',
        message: 'Calculating statistics...',
        percent: 50,
        processedRows: collectedRows,
        totalRows: collectedRows,
      },
    });

    // Build statistics from all collected rows
    const { urlStats, domainStats, apexDomainStats } = buildStats(allRows);

    self.postMessage({
      type: 'PROGRESS',
      payload: {
        stage: 'streaming',
        message: 'Processing results...',
        percent: 55,
        processedRows: 0,
        totalRows: allRows.length,
      },
    });

    // PASS 2: Stream rows with stats attached
    let streamedRows = 0;
    let chunk = [];

    for (const row of allRows) {
      attachStats(row, urlStats, domainStats, apexDomainStats);
      chunk.push(row);
      streamedRows++;

      if (chunk.length >= WORKER_CHUNK_SIZE) {
        const progress = Math.min(99, 55 + Math.round((streamedRows / allRows.length) * 44));

        self.postMessage({
          type: 'CHUNK',
          payload: {
            items: chunk,
            progress,
            processedRows: streamedRows,
            totalRows: allRows.length,
          },
        });

        chunk = [];

        // Yield to allow message processing
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    // Send remaining items
    if (chunk.length > 0) {
      self.postMessage({
        type: 'CHUNK',
        payload: {
          items: chunk,
          progress: 99,
          processedRows: streamedRows,
          totalRows: allRows.length,
        },
      });
    }

    self.postMessage({
      type: 'COMPLETE',
      payload: { totalProcessed: streamedRows },
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
