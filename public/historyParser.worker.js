(() => {
  // lib/constants/browser.js
  var QUERY_ROW_LIMIT = 5e5;
  var WORKER_CHUNK_SIZE = 1e3;
  var CHROME_EPOCH_OFFSET = 116444736e8;
  var FIREFOX_PRECISION_DIVISOR = 1e3;
  var SAFARI_EPOCH_OFFSET = 978307200;

  // lib/browser-parser/queries.js
  var BROWSER_QUERIES = {
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
    `
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
    `
    },
    safari: {
      visits: `
    SELECT
      history_visits.visit_time as lastVisitTime,
      history_items.url,
      history_visits.title,
      history_items.url as eventEntity,
      history_visits.origin as referrer,
      'URL' as eventEntityType,
      'Visit' as eventType,
      'Safari' as browser
    FROM
      history_visits
    JOIN
      history_items ON history_visits.history_item = history_items.id
    ORDER BY history_visits.visit_time DESC
    LIMIT ${QUERY_ROW_LIMIT}
    `
    }
  };

  // lib/browser-parser/processing.js
  var COLUMN_MAP = {
    lastVisitTime: "visitTime",
    title: "title",
    eventType: "eventType",
    eventEntity: "eventEntity",
    browser: "browser",
    eventEntityType: "eventEntityType"
  };
  var urlToDomain = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return "Unknown";
    }
  };
  var domainToApex = (domain, pslInstance = null) => {
    if (domain === "Unknown") return "Unknown";
    const pslLib = pslInstance || (typeof psl !== "undefined" ? psl : null);
    if (pslLib) {
      try {
        const parsed = pslLib.parse(domain);
        return parsed.domain || domain;
      } catch {
      }
    }
    const parts = domain.split(".");
    return parts.length <= 2 ? domain : parts.slice(-2).join(".");
  };
  var processVisitTimestamp = (timestamp) => {
    if (typeof timestamp !== "number") {
      return timestamp;
    }
    if (timestamp > CHROME_EPOCH_OFFSET) {
      return (timestamp - CHROME_EPOCH_OFFSET) / 1e3;
    }
    if (timestamp > 1e12) {
      return timestamp / FIREFOX_PRECISION_DIVISOR;
    }
    if (timestamp < 1e9) {
      return (timestamp + SAFARI_EPOCH_OFFSET) * 1e3;
    }
    return timestamp;
  };
  var formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };
  var transformRow = (row, columns, options = {}) => {
    const { onUrlStats, psl: pslInstance } = options;
    const historyObject = { additionalFields: {} };
    columns.forEach((column, index) => {
      const value = row[index];
      if (column === "url") {
        const domain = urlToDomain(value);
        const apexDomain = domainToApex(domain, pslInstance);
        historyObject.url = value;
        historyObject.domain = domain;
        historyObject.apexDomain = apexDomain;
        if (onUrlStats) {
          onUrlStats(value, domain);
        }
      } else if (column === "lastVisitTime") {
        historyObject.visitTime = processVisitTimestamp(value);
        historyObject.visitTimeFormatted = formatDate(historyObject.visitTime);
      } else if (column === "referrer" && value === "") {
        return;
      } else if (COLUMN_MAP[column]) {
        historyObject[COLUMN_MAP[column]] = value;
      } else {
        historyObject.additionalFields[column] = value;
      }
    });
    return historyObject;
  };

  // workers/history-parser/stats.js
  var estimateTotalRows = (db) => {
    let total = 0;
    const countQueries = [
      "SELECT COUNT(*) FROM moz_historyvisits",
      "SELECT COUNT(*) FROM visits",
      "SELECT COUNT(*) FROM moz_places",
      "SELECT COUNT(*) FROM urls",
      "SELECT COUNT(*) FROM downloads",
      "SELECT COUNT(*) FROM history_visits"
    ];
    for (const query of countQueries) {
      try {
        const result = db.exec(query)[0];
        if (result && result.values[0]) {
          total += result.values[0][0];
        }
      } catch {
      }
    }
    return Math.max(total, 100);
  };
  var buildStats = (allRows) => {
    const urlStats = /* @__PURE__ */ new Map();
    const domainStats = /* @__PURE__ */ new Map();
    const apexDomainStats = /* @__PURE__ */ new Map();
    for (const row of allRows) {
      const { url, domain, apexDomain, visitTime } = row;
      if (!urlStats.has(url)) {
        urlStats.set(url, {
          count: 0,
          first_visit: Infinity,
          last_visit: 0
        });
      }
      const uStats = urlStats.get(url);
      uStats.count++;
      if (visitTime < uStats.first_visit) uStats.first_visit = visitTime;
      if (visitTime > uStats.last_visit) uStats.last_visit = visitTime;
      if (!domainStats.has(domain)) {
        domainStats.set(domain, {
          count: 0,
          first_visit: Infinity,
          last_visit: 0,
          unique_urls: /* @__PURE__ */ new Set()
        });
      }
      const dStats = domainStats.get(domain);
      dStats.count++;
      dStats.unique_urls.add(url);
      if (visitTime < dStats.first_visit) dStats.first_visit = visitTime;
      if (visitTime > dStats.last_visit) dStats.last_visit = visitTime;
      if (!apexDomainStats.has(apexDomain)) {
        apexDomainStats.set(apexDomain, {
          count: 0,
          first_visit: Infinity,
          last_visit: 0,
          unique_urls: /* @__PURE__ */ new Set(),
          unique_subdomains: /* @__PURE__ */ new Set()
        });
      }
      const aStats = apexDomainStats.get(apexDomain);
      aStats.count++;
      aStats.unique_urls.add(url);
      aStats.unique_subdomains.add(domain);
      if (visitTime < aStats.first_visit) aStats.first_visit = visitTime;
      if (visitTime > aStats.last_visit) aStats.last_visit = visitTime;
    }
    return { urlStats, domainStats, apexDomainStats };
  };
  var attachStats = (row, urlStats, domainStats, apexDomainStats) => {
    const uStats = urlStats.get(row.url);
    const dStats = domainStats.get(row.domain);
    const aStats = apexDomainStats.get(row.apexDomain);
    row.url_count = uStats?.count || 0;
    row.url_first_visit = uStats?.first_visit || null;
    row.url_last_visit = uStats?.last_visit || null;
    row.domain_count = dStats?.count || 0;
    row.domain_first_visit = dStats?.first_visit || null;
    row.domain_last_visit = dStats?.last_visit || null;
    row.domain_unique_urls = dStats?.unique_urls?.size || 0;
    row.apex_domain_count = aStats?.count || 0;
    row.apex_domain_unique_urls = aStats?.unique_urls?.size || 0;
    row.apex_domain_unique_subdomains = aStats?.unique_subdomains?.size || 0;
    return row;
  };

  // workers/history-parser/index.js
  var SQL = null;
  var pslLoaded = false;
  var loadPsl = () => {
    if (!pslLoaded) {
      importScripts("https://cdn.jsdelivr.net/npm/psl@1.9.0/dist/psl.min.js");
      pslLoaded = true;
    }
  };
  var parseHistory = async (data, wasmUrl) => {
    const uint8Array = data instanceof Uint8Array ? data : new Uint8Array(data);
    try {
      self.postMessage({
        type: "PROGRESS",
        payload: { stage: "init", message: "Initializing database engine...", percent: 0 }
      });
      if (!SQL) {
        importScripts("https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/sql-wasm.js");
        SQL = await initSqlJs({
          locateFile: () => wasmUrl
        });
      }
      loadPsl();
      const db = new SQL.Database(uint8Array);
      self.postMessage({
        type: "PROGRESS",
        payload: { stage: "counting", message: "Analyzing database...", percent: 2 }
      });
      const totalRows = estimateTotalRows(db);
      self.postMessage({
        type: "PROGRESS",
        payload: {
          stage: "collecting",
          message: "Collecting history data...",
          percent: 5,
          totalRows
        }
      });
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
                if (collectedRows % 5e3 === 0) {
                  const progress = Math.min(45, 5 + Math.round(collectedRows / totalRows * 40));
                  self.postMessage({
                    type: "PROGRESS",
                    payload: {
                      stage: "collecting",
                      message: "Collecting history data...",
                      percent: progress,
                      processedRows: collectedRows,
                      totalRows
                    }
                  });
                }
              }
            }
          } catch {
          }
        }
      }
      db.close();
      self.postMessage({
        type: "PROGRESS",
        payload: {
          stage: "stats",
          message: "Calculating statistics...",
          percent: 50,
          processedRows: collectedRows,
          totalRows: collectedRows
        }
      });
      const { urlStats, domainStats, apexDomainStats } = buildStats(allRows);
      self.postMessage({
        type: "PROGRESS",
        payload: {
          stage: "streaming",
          message: "Processing results...",
          percent: 55,
          processedRows: 0,
          totalRows: allRows.length
        }
      });
      let streamedRows = 0;
      let chunk = [];
      for (const row of allRows) {
        attachStats(row, urlStats, domainStats, apexDomainStats);
        chunk.push(row);
        streamedRows++;
        if (chunk.length >= WORKER_CHUNK_SIZE) {
          const progress = Math.min(99, 55 + Math.round(streamedRows / allRows.length * 44));
          self.postMessage({
            type: "CHUNK",
            payload: {
              items: chunk,
              progress,
              processedRows: streamedRows,
              totalRows: allRows.length
            }
          });
          chunk = [];
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }
      if (chunk.length > 0) {
        self.postMessage({
          type: "CHUNK",
          payload: {
            items: chunk,
            progress: 99,
            processedRows: streamedRows,
            totalRows: allRows.length
          }
        });
      }
      self.postMessage({
        type: "COMPLETE",
        payload: { totalProcessed: streamedRows }
      });
    } catch (error) {
      let message = error.message;
      if (message.includes("not a database") || message.includes("file is not a database")) {
        message = "Invalid database file. Please upload a valid browser history file.";
      } else if (message.includes("WASM")) {
        message = "Failed to load database engine. Please refresh and try again.";
      }
      self.postMessage({
        type: "ERROR",
        payload: { message, stack: error.stack }
      });
    }
  };
  self.onmessage = function(event) {
    const { type, payload } = event.data;
    if (type === "PARSE_HISTORY") {
      parseHistory(payload.data, payload.wasmUrl).catch((err) => {
        self.postMessage({
          type: "ERROR",
          payload: { message: err.message, stack: err.stack }
        });
      });
    } else if (type === "CANCEL") {
    }
  };
})();
//# sourceMappingURL=historyParser.worker.js.map
