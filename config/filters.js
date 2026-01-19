// Range filter field definitions
// Used by FilterBy component and HistoryContext

export const RANGE_FILTER_FIELDS = [
  { key: 'url_count', label: 'URL', group: 'url' },
  { key: 'domain_count', label: 'FQDN', group: 'domain' },
  { key: 'apex_domain_count', label: 'Apex', group: 'apex' },
];

// Default range filter state
// Used by HistoryContext (initial state) and FilterBy (reset)
export const DEFAULT_RANGE_FILTERS = {
  url_count: { min: null, max: null },
  domain_count: { min: null, max: null },
  domain_unique_urls: { min: null, max: null },
  apex_domain_count: { min: null, max: null },
  apex_domain_unique_urls: { min: null, max: null },
  apex_domain_unique_subdomains: { min: null, max: null },
};

// Default stats bounds (used when history is empty)
export const DEFAULT_STATS_BOUNDS = {
  url_count: { min: 0, max: 100 },
  domain_count: { min: 0, max: 100 },
  domain_unique_urls: { min: 0, max: 100 },
  apex_domain_count: { min: 0, max: 100 },
  apex_domain_unique_urls: { min: 0, max: 100 },
  apex_domain_unique_subdomains: { min: 0, max: 100 },
};
