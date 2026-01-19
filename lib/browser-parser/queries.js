// Browser-specific SQL queries for parsing history databases
// SINGLE SOURCE OF TRUTH - used by both lib/ and web worker

import { QUERY_ROW_LIMIT } from '../constants/browser';

export const BROWSER_QUERIES = {
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
    `,
  },
};
