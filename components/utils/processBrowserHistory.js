import indexedDb from "./indexedDb";
import { formatDate, urlToDomain, processVisitTimestamp } from "./helpers";
import initSqlJs from "sql.js";

let rowLimit = 25000;
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
      LIMIT ${rowLimit}
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
      LIMIT ${rowLimit}
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
      LIMIT ${rowLimit}
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
      LIMIT ${rowLimit}
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
      LIMIT ${rowLimit}
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
    LIMIT ${rowLimit}
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
    LIMIT ${rowLimit}
    `,
  },
};

const columnMap = {
  lastVisitTime: "visitTime",
  title: "title",
  eventType: "eventType",
  eventEntity: "eventEntity",
  browser: "browser",
  eventEntityType: "eventEntityType",
};

export const processHistoryResults = (results) => {
  const historyArray = [];
  const stats = new Map();

  results.values.forEach((row) => {
    let historyObject = {};
    historyObject["additionalFields"] = {};

    results.columns.forEach((column, index) => {
      let value = row[index];
      
      if (column === "url") {
        const url = value;
        const domain = urlToDomain(url);

        historyObject["url"] = url;
        historyObject["domain"] = domain;

        stats.set(domain, (stats.get(domain) || 0) + 1);
        stats.set(url, (stats.get(url) || 0) + 1);
      } else if (column === "lastVisitTime") {
        historyObject["visitTime"] = processVisitTimestamp(value);
        historyObject["visitTimeFormatted"] = formatDate(historyObject["visitTime"]);
      } else if (column === "referrer" && value === "") {
        return;
      } else if (columnMap[column]) {
        historyObject[columnMap[column]] = value;
      } else {
        historyObject["additionalFields"][column] = value;
      }
    });

    historyArray.push(historyObject);
  });

  historyArray.forEach((historyObject) => {
    historyObject["domain_count"] = stats.get(historyObject["domain"]);
    historyObject["url_count"] = stats.get(historyObject["url"]);
  });

  return historyArray;
};

export const queryBrowserHistory = async (db) => {
  let results = [];

  Object.keys(BROWSER_QUERIES).forEach((key) => {
    try {
      Object.keys(BROWSER_QUERIES[key]).forEach((query) => {
        const result = db.exec(BROWSER_QUERIES[key][query])[0];
        const processedResult = processHistoryResults(result);
        results.push(...processedResult);
      });
    } catch (error) {
      console.log(error);
    }
  });

  return results;
};

export const readSqlDatabase = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const SQL = await initSqlJs({
    locateFile: (file) => `/${file}`,
  });
  const db = new SQL.Database(new Uint8Array(arrayBuffer));
  return db;
};

export const loadHistory = async (indexedDb) => {
  const history = indexedDb.history.toArray();
  return history;
};

export const storeHistory = (history) => {
  history.forEach((entry) => {
    indexedDb.history.add(entry);
  });
};

export const clearHistory = () => {
  indexedDb.history.clear();
};
