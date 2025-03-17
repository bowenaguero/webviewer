import Dexie from "dexie";

const indexedDb = new Dexie("browserHistory");

indexedDb.version(1).stores({
  history:
    "++id, url, title, visitTime, eventType, eventEntity",
});

export default indexedDb;
