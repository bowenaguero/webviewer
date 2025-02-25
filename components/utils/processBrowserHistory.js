export const processVisitTimestamp = (timestamp) => {
    if (typeof timestamp === 'number') {
      if (timestamp > 11644473600000000) {
        // Chrome/Edge timestamp (Windows epoch)
        return (timestamp - 11644473600000000) / 1000
      }
      else if (timestamp > 1000000000000) {
        // Firefox timestamp (Unix milliseconds)
        return timestamp / 1000
      }
      else if (timestamp < 1000000000) {
        // Safari timestamp (Mac absolute time)
        return (timestamp + 978307200) * 1000
      }
    }
    return timestamp
  }
  
  export const processHistoryResults = (results) => {
    if (!results?.[0]?.values) return { history: []}
  
    const history = results[0].values.map(row => ({
      id: row[0],
      lastVisitTime: processVisitTimestamp(row[1]),
      url: row[2],
      title: row[3] || 'Untitled',
      visitCount: row[4] || 0,
      eventEntity: row[5],
      eventType: row[6]
    }))
  
    return history
  } 