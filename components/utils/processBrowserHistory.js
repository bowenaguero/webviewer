import db from "./indexedDb";

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

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
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

    db.history.add(historyObject);
  });



  return historyArray;
};
