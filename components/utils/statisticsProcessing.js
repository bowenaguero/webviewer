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
  
  export const calculateStatistics = (historyRows) => {
    const statistics = {
      urlStats: new Map(),
      domainStats: new Map(),
      totalVisits: 0,
      uniqueUrls: 0,
      uniqueDomains: 0
    }
  
    historyRows?.forEach(row => {
      const url = row[0]
      const visitCount = row[3] || 0
  
      statistics.urlStats.set(url, (statistics.urlStats.get(url) || 0) + visitCount)
      
      try {
        const domain = new URL(url).hostname
        statistics.domainStats.set(
          domain, 
          (statistics.domainStats.get(domain) || 0) + visitCount
        )
      } catch (e) {
        // Skip invalid URLs
      }
    })
  
    statistics.totalVisits = Array.from(statistics.urlStats.values())
      .reduce((sum, count) => sum + count, 0)
    statistics.uniqueUrls = statistics.urlStats.size
    statistics.uniqueDomains = statistics.domainStats.size
  
    return {
      urlStats: Object.fromEntries(statistics.urlStats),
      domainStats: Object.fromEntries(statistics.domainStats),
      totalVisits: statistics.totalVisits,
      uniqueUrls: statistics.uniqueUrls,
      uniqueDomains: statistics.uniqueDomains
    }
  }
  
  export const processHistoryResults = (results) => {
    if (!results?.[0]?.values) return { history: [], statistics: null }
  
    const history = results[0].values.map(row => ({
      url: row[0],
      title: row[1] || 'Untitled',
      lastVisitTime: processVisitTimestamp(row[2]),
      visitCount: row[3] || 0
    }))
  
    const statistics = calculateStatistics(results[0].values)
  
    return { history, statistics }
  } 