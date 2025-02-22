const BROWSER_QUERIES = {
    chromium: `
      SELECT 
        urls.url,
        urls.title,
        visits.visit_time as lastVisitTime,
        urls.visit_count as visitCount
      FROM urls 
      JOIN visits ON urls.id = visits.url
      ORDER BY visits.visit_time DESC
      LIMIT 10000
    `,
    firefox: `
      SELECT 
        moz_places.url,
        moz_places.title,
        moz_historyvisits.visit_date as lastVisitTime,
        moz_places.visit_count as visitCount
      FROM moz_places 
      JOIN moz_historyvisits ON moz_places.id = moz_historyvisits.place_id
      WHERE moz_historyvisits.visit_date IS NOT NULL
      ORDER BY moz_historyvisits.visit_date DESC
      LIMIT 10000
    `,
    safari: `
      SELECT 
        url,
        title,
        visit_time as lastVisitTime,
        visit_count as visitCount
      FROM history_items
      JOIN history_visits ON history_items.id = history_visits.history_item
      GROUP BY url
      ORDER BY visit_time DESC
      LIMIT 10000
    `
  }
  
  export const queryBrowserHistory = async (db) => {
    let results
    let errors = {}
  
    // Try Chromium format
    try {
      results = db.exec(BROWSER_QUERIES.chromium)
      return results
    } catch (chromiumError) {
      errors.chromium = chromiumError
  
      // Try Firefox format
      try {
        results = db.exec(BROWSER_QUERIES.firefox)
        return results
      } catch (firefoxError) {
        errors.firefox = firefoxError
  
        // Try Safari format
        try {
          results = db.exec(BROWSER_QUERIES.safari)
          return results
        } catch (safariError) {
          errors.safari = safariError
          
          console.error('No supported browser schema detected:', errors)
          throw new Error('Unsupported browser history format')
        }
      }
    }
  } 