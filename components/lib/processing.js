import db from './db';
import {
  CHROME_EPOCH_OFFSET,
  FIREFOX_PRECISION_DIVISOR,
  SAFARI_EPOCH_OFFSET,
} from './constants';

const urlToDomain = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return 'Unknown';
  }
};

const processVisitTimestamp = (timestamp) => {
  if (typeof timestamp !== 'number') {
    return timestamp;
  }

  // Chrome/Edge: Windows FILETIME epoch (microseconds since Jan 1, 1601)
  if (timestamp > CHROME_EPOCH_OFFSET) {
    return (timestamp - CHROME_EPOCH_OFFSET) / 1000;
  }

  // Firefox: Unix timestamp in microseconds
  if (timestamp > 1000000000000) {
    return timestamp / FIREFOX_PRECISION_DIVISOR;
  }

  // Safari: Mac absolute time (seconds since Jan 1, 2001)
  if (timestamp < 1000000000) {
    return (timestamp + SAFARI_EPOCH_OFFSET) * 1000;
  }

  return timestamp;
};

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

const columnMap = {
  lastVisitTime: 'visitTime',
  title: 'title',
  eventType: 'eventType',
  eventEntity: 'eventEntity',
  browser: 'browser',
  eventEntityType: 'eventEntityType',
};

const transformRow = (row, columns, stats) => {
  const historyObject = { additionalFields: {} };

  columns.forEach((column, index) => {
    const value = row[index];

    if (column === 'url') {
      const domain = urlToDomain(value);
      historyObject.url = value;
      historyObject.domain = domain;
      stats.set(domain, (stats.get(domain) || 0) + 1);
      stats.set(value, (stats.get(value) || 0) + 1);
    } else if (column === 'lastVisitTime') {
      historyObject.visitTime = processVisitTimestamp(value);
      historyObject.visitTimeFormatted = formatDate(historyObject.visitTime);
    } else if (column === 'referrer' && value === '') {
      return;
    } else if (columnMap[column]) {
      historyObject[columnMap[column]] = value;
    } else {
      historyObject.additionalFields[column] = value;
    }
  });

  return historyObject;
};

export const processHistoryResults = (results) => {
  const stats = new Map();

  const historyArray = results.values.map((row) =>
    transformRow(row, results.columns, stats)
  );

  historyArray.forEach((item) => {
    item.domain_count = stats.get(item.domain);
    item.url_count = stats.get(item.url);
    db.history.add(item);
  });

  return historyArray;
};
