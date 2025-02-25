import { processHistoryResults } from '@/components/utils/processBrowserHistory'

const exampleData = [
  {
    eventType: "visit",
    url: "https://www.google.com",
    title: "Google",
    lastVisitTime: "2021-01-01",
    visitCount: 10,
    domain: "google.com",
    domainVisitCount: 10,
    eventEntity: "https://www.google.com",
  },
  {
    eventType: "download",
    url: "https://www.google.com",
    title: "Google",
    lastVisitTime: "2021-01-01",
    visitCount: 10,
    domain: "google.com",
    domainVisitCount: 10,
    eventEntity: "C:\\Users\\John\\Downloads\\google.exe",
  },
  {
    eventType: "keyword_search",
    url: "https://www.google.com",
    title: "Google",
    lastVisitTime: "2021-01-01",
    visitCount: 10,
    domain: "google.com",
    domainVisitCount: 10,
    eventEntity: "google",
  },
  {
    eventType: "autofill",
    url: "https://www.google.com",
    title: "Google",
    lastVisitTime: "2021-01-01",
    visitCount: 10,
    domain: "google.com",
    domainVisitCount: 10,
    eventEntity: "google",
  },
  {
    eventType: "bookmark",
    url: "https://www.google.com",
    title: "Google",
    lastVisitTime: "2021-01-01",
    visitCount: 10,
    domain: "google.com",
    domainVisitCount: 10,
    eventEntity: "Google",
  },
];

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
      console.error(error);
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
      'download' AS eventType
      FROM
        moz_places
      JOIN
      moz_annos ON moz_places.id = moz_annos.place_id
      WHERE
        moz_annos.content NOT LIKE '%deleted%'
      ORDER BY moz_places.last_visit_date DESC
      `,
    visits: `
      SELECT
          moz_places.id,
          moz_historyvisits.visit_date as lastVisitTime,
          moz_places.url,
          moz_places.title,
          moz_places.visit_count AS visitCount,
          moz_places.url as eventEntity,
          'visit' AS eventType
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
      'autofill' AS eventType
      FROM
        moz_places
      JOIN
      moz_inputhistory ON moz_places.id = moz_inputhistory.place_id
      ORDER BY moz_places.last_visit_date DESC
    `,
    bookmarks: `
      SELECT
      moz_places.id,
      moz_places.last_visit_date AS lastVisitTime,
      moz_places.url,
      moz_places.title,
      moz_places.visit_count AS visitCount,
      moz_bookmarks.title AS eventEntity,
      'bookmark' AS eventType
      FROM
        moz_places
      JOIN
      moz_bookmarks ON moz_places.id = moz_bookmarks.fk
      WHERE 
      moz_bookmarks.fk IS NOT NULL
      ORDER BY moz_places.last_visit_date DESC
    `,
  },
};
