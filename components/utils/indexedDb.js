import Dexie from 'dexie';

const indexedDb = new Dexie('browserHistory');

indexedDb.version(3).stores({
  history:
    '++id, url, domain, apexDomain, title, visitTime, referrer, eventType, browser, eventEntity, eventEntityType, url_count, url_first_visit, url_last_visit, domain_count, domain_first_visit, domain_last_visit, domain_unique_urls, apex_domain_count, apex_domain_unique_urls, apex_domain_unique_subdomains',
});

export default indexedDb;
