import Dexie from "dexie";

const indexedDb = new Dexie("browserHistory");

indexedDb.version(1).stores({
  history:
    "++id, url, title, lastVisitTime, referrer, eventType, browser, eventEntity, eventEntityType, additionalFields, url_count, domain_count",
});

export default indexedDb;
