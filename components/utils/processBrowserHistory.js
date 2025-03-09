const urlToDomain = (url) => {
  return new URL(url).hostname;
};

const processVisitTimestamp = (timestamp) => {
  if (typeof timestamp === "number") {
    if (timestamp > 11644473600000000) {
      // Chrome/Edge timestamp (Windows epoch)
      return (timestamp - 11644473600000000) / 1000;
    } else if (timestamp > 1000000000000) {
      // Firefox timestamp (Unix milliseconds)
      return timestamp / 1000;
    } else if (timestamp < 1000000000) {
      // Safari timestamp (Mac absolute time)
      return (timestamp + 978307200) * 1000;
    }
  }
  return timestamp;
};

export const processHistoryResults = (results) => {
  const historyArray = [];
  const stats = new Map();
  results[0].values.forEach((row) => {
    let historyObject = {};
    historyObject["additionalFields"] = {};
    results[0].columns.forEach((column, index) => {
      if (column === "lastVisitTime") {
        historyObject["visitTime"] = processVisitTimestamp(row[index]);
      } else if (column === "url") {
        const url = row[index];
        const domain = urlToDomain(url);

        historyObject["url"] = url;
        historyObject["domain"] = domain;

        stats.set(domain, (stats.get(domain) || 0) + 1);
        stats.set(url, (stats.get(url) || 0) + 1);
      } else if (column === "title") {
        historyObject["title"] = row[index];
      } else if (column === "eventType") {
        historyObject["eventType"] = row[index];
      } else if (column === "eventEntity") {
        historyObject["eventEntity"] = row[index];
      } else if (column === "browser") {
        historyObject["browser"] = row[index];
      } else if (column === "eventEntityType") {
        historyObject["eventEntityType"] = row[index];
      } else {
        if (column === "referrer" && row[index] === "") {
          return;
        } else {
          historyObject["additionalFields"][column] = row[index];
        }
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
