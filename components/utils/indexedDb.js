import Dexie from 'dexie';

const indexedDb = new Dexie('browserHistory');

indexedDb.version(2).stores({
  history:
    '++id, url, domain, title, visitTime, referrer, eventType, browser, eventEntity, eventEntityType, url_count, url_first_visit, url_last_visit, domain_count, domain_first_visit, domain_last_visit, domain_unique_urls',
});

export default indexedDb;
