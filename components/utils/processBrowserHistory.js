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

    const historyArray = []
    results[0].values.forEach((row) => {
      let historyObject = {}
      results[0].columns.forEach((column, index) => {
        if (column === "lastVisitTime") {
          historyObject[column] = processVisitTimestamp(row[index])
        }
        else {
          historyObject[column] = row[index]
        }
      })
      historyArray.push(historyObject)
    })

    return historyArray
  } 