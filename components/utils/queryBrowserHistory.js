import { processHistoryResults } from "@/components/utils/processBrowserHistory";

// const exampleData = [
//   {
//     eventType: "visit",
//     url: "https://www.google.com",
//     title: "Google",
//     lastVisitTime: "2021-01-01",
//     visitCount: 10,
//     domain: "google.com",
//     domainVisitCount: 10,
//     eventEntity: "https://www.google.com",
//   },
//   {
//     eventType: "download",
//     url: "https://www.google.com",
//     title: "Google",
//     lastVisitTime: "2021-01-01",
//     visitCount: 10,
//     domain: "google.com",
//     domainVisitCount: 10,
//     eventEntity: "C:\\Users\\John\\Downloads\\google.exe",
//   },
//   {
//     eventType: "keyword_search",
//     url: "https://www.google.com",
//     title: "Google",
//     lastVisitTime: "2021-01-01",
//     visitCount: 10,
//     domain: "google.com",
//     domainVisitCount: 10,
//     eventEntity: "google",
//   },
//   {
//     eventType: "autofill",
//     url: "https://www.google.com",
//     title: "Google",
//     lastVisitTime: "2021-01-01",
//     visitCount: 10,
//     domain: "google.com",
//     domainVisitCount: 10,
//     eventEntity: "google",
//   },
//   {
//     eventType: "bookmark",
//     url: "https://www.google.com",
//     title: "Google",
//     lastVisitTime: "2021-01-01",
//     visitCount: 10,
//     domain: "google.com",
//     domainVisitCount: 10,
//     eventEntity: "Google",
//   },
// ];

export const queryBrowserHistory = async (db) => {
  let results = [];

  Object.keys(BROWSER_QUERIES).forEach((key) => {
    try {
      Object.keys(BROWSER_QUERIES[key]).forEach((query) => {
        const result = db.exec(BROWSER_QUERIES[key][query]);
        const processedResult = processHistoryResults(result);
        results.push(...processedResult);
      });
    } catch (error) {
      console.log(error);
    }
  });

  console.log({ history: results });
  return { history: results };
};

const BROWSER_QUERIES = {
  firefox: {
    downloads: `
      SELECT
        moz_places.id,
        moz_places.last_visit_date AS lastVisitTime,
        moz_places.url,
        moz_places.title,
        moz_places.visit_count AS visitCount,
        moz_annos.content AS eventEntity,
        'download' AS eventType,
        'firefox' as browser
      FROM
        moz_places
      JOIN
        moz_annos ON moz_places.id = moz_annos.place_id
      WHERE
        moz_annos.content NOT LIKE '%deleted%'
      ORDER BY moz_places.last_visit_date DESC
      LIMIT 10000
      `,
    visits: `
      SELECT
          moz_places.id,
          moz_historyvisits.visit_date as lastVisitTime,
          moz_places.url,
          moz_places.title,
          moz_places.visit_count AS visitCount,
          moz_places.url as eventEntity,
          'visit' AS eventType,
          'firefox' as browser
      FROM
          moz_places
      JOIN
          moz_historyvisits ON moz_places.id = moz_historyvisits.place_id
      ORDER BY moz_historyvisits.visit_date DESC
      LIMIT 10000
      `,
    autofill: `
      SELECT
      moz_places.id,
      moz_places.last_visit_date AS lastVisitTime,
      moz_places.url,
      moz_places.title,
      moz_places.visit_count AS visitCount,
      moz_inputhistory.input AS eventEntity,
      'autofill' AS eventType,
      'firefox' as browser
      FROM
        moz_places
      JOIN
      moz_inputhistory ON moz_places.id = moz_inputhistory.place_id
      ORDER BY moz_places.last_visit_date DESC
      LIMIT 10000
    `,
    bookmarks: `
      SELECT
        moz_places.id,
        moz_places.last_visit_date AS lastVisitTime,
        moz_places.url,
        moz_places.title,
        moz_places.visit_count AS visitCount,
        moz_bookmarks.title AS eventEntity,
        'bookmark' AS eventType,
        'firefox' as browser
      FROM
        moz_places
      JOIN
        moz_bookmarks ON moz_places.id = moz_bookmarks.fk
      WHERE 
        moz_bookmarks.fk IS NOT NULL
      ORDER BY moz_places.last_visit_date DESC
      LIMIT 10000
    `,
  },
  chrome: {
    downloads: `
      SELECT
        id,
        start_time as lastVisitTime,
        target_path as eventEntity,
        tab_url as url,
        tab_referrer_url as tabReferrerUrl,
        referrer as referrer,
        mime_type as mimeType,
        original_mime_type as originalMimeType,
        received_bytes as receivedBytes,
        total_bytes as totalBytes,
        'download' as eventType,
        'chrome' as browser
      FROM
        downloads
      ORDER BY start_time DESC   
      LIMIT 10000
    `,
    visits: `
    SELECT
      urls.id,
      visits.visit_time as lastVisitTime,
      urls.url as url,
      urls.title,
      urls.visit_count as visitCount,
      urls.url as eventEntity,
      visits.external_referrer_url as referrer,
      'visit' as eventType,
      'chrome' as browser
    FROM
      visits
    JOIN
      urls ON visits.url = urls.id
    ORDER BY visits.visit_time DESC
    LIMIT 10000
    `,
    keyword_search: `
    SELECT
      content_annotations.visit_id,
      content_annotations.search_terms as eventEntity,
      visits.url,
      visits.visit_time as lastVisitTime,
      visits.id,
      urls.url,
      urls.title,
      urls.visit_count,
      'keyword' as eventType,
      'chrome' as browser
    FROM 
      content_annotations
    JOIN 
      visits ON content_annotations.visit_id = visits.id
	  JOIN 
      urls ON urls.id = visits.url
    WHERE content_annotations.search_terms IS NOT ""
    ORDER BY visits.visit_time DESC
    LIMIT 10000
    `,
  },
};
