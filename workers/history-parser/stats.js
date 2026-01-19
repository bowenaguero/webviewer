// Worker-specific statistics calculation functions

/**
 * Estimate total rows for progress calculation
 * @param {Object} db - SQL.js database instance
 */
export const estimateTotalRows = (db) => {
  let total = 0;
  const countQueries = [
    'SELECT COUNT(*) FROM moz_historyvisits',
    'SELECT COUNT(*) FROM visits',
    'SELECT COUNT(*) FROM moz_places',
    'SELECT COUNT(*) FROM urls',
    'SELECT COUNT(*) FROM downloads',
    'SELECT COUNT(*) FROM history_visits',
  ];

  for (const query of countQueries) {
    try {
      const result = db.exec(query)[0];
      if (result && result.values[0]) {
        total += result.values[0][0];
      }
    } catch {
      // Table doesn't exist for this browser type
    }
  }

  return Math.max(total, 100);
};

/**
 * Build statistics from all collected rows
 * @param {Array} allRows - Array of history objects
 */
export const buildStats = (allRows) => {
  const urlStats = new Map();
  const domainStats = new Map();
  const apexDomainStats = new Map();

  for (const row of allRows) {
    const { url, domain, apexDomain, visitTime } = row;

    // URL stats
    if (!urlStats.has(url)) {
      urlStats.set(url, {
        count: 0,
        first_visit: Infinity,
        last_visit: 0,
      });
    }
    const uStats = urlStats.get(url);
    uStats.count++;
    if (visitTime < uStats.first_visit) uStats.first_visit = visitTime;
    if (visitTime > uStats.last_visit) uStats.last_visit = visitTime;

    // Domain stats (FQDN)
    if (!domainStats.has(domain)) {
      domainStats.set(domain, {
        count: 0,
        first_visit: Infinity,
        last_visit: 0,
        unique_urls: new Set(),
      });
    }
    const dStats = domainStats.get(domain);
    dStats.count++;
    dStats.unique_urls.add(url);
    if (visitTime < dStats.first_visit) dStats.first_visit = visitTime;
    if (visitTime > dStats.last_visit) dStats.last_visit = visitTime;

    // Apex domain stats
    if (!apexDomainStats.has(apexDomain)) {
      apexDomainStats.set(apexDomain, {
        count: 0,
        first_visit: Infinity,
        last_visit: 0,
        unique_urls: new Set(),
        unique_subdomains: new Set(),
      });
    }
    const aStats = apexDomainStats.get(apexDomain);
    aStats.count++;
    aStats.unique_urls.add(url);
    aStats.unique_subdomains.add(domain);
    if (visitTime < aStats.first_visit) aStats.first_visit = visitTime;
    if (visitTime > aStats.last_visit) aStats.last_visit = visitTime;
  }

  return { urlStats, domainStats, apexDomainStats };
};

/**
 * Attach stats to a row object
 * @param {Object} row - History object
 * @param {Map} urlStats - URL statistics map
 * @param {Map} domainStats - Domain statistics map
 * @param {Map} apexDomainStats - Apex domain statistics map
 */
export const attachStats = (row, urlStats, domainStats, apexDomainStats) => {
  const uStats = urlStats.get(row.url);
  const dStats = domainStats.get(row.domain);
  const aStats = apexDomainStats.get(row.apexDomain);

  row.url_count = uStats?.count || 0;
  row.url_first_visit = uStats?.first_visit || null;
  row.url_last_visit = uStats?.last_visit || null;
  row.domain_count = dStats?.count || 0;
  row.domain_first_visit = dStats?.first_visit || null;
  row.domain_last_visit = dStats?.last_visit || null;
  row.domain_unique_urls = dStats?.unique_urls?.size || 0;
  row.apex_domain_count = aStats?.count || 0;
  row.apex_domain_unique_urls = aStats?.unique_urls?.size || 0;
  row.apex_domain_unique_subdomains = aStats?.unique_subdomains?.size || 0;

  return row;
};
