import { EXTERNAL_URLS } from '../lib/constants';

// Column widths for desktop table (must add up to 100%)
export const COL_WIDTHS = {
  actions: 'w-[3%]',
  time: 'w-[15%]',
  type: 'w-[5%]',
  url: 'w-[40%]',
  title: 'w-[37%]',
};

// Copy action configurations for ActionsMenu
export const COPY_TYPES = {
  event: {
    getValue: (event) => JSON.stringify(event),
    description: 'Event copied to clipboard',
  },
  url: {
    getValue: (event) => event.url,
    description: 'URL copied to clipboard',
  },
  domain: {
    getValue: (event) => event.domain,
    description: 'Domain copied to clipboard',
  },
};

// External service providers for "Send to" feature
export const SEND_TO_PROVIDERS = {
  virustotal: { label: 'VirusTotal', getUrl: EXTERNAL_URLS.virustotal },
  browserling: { label: 'Browserling', getUrl: EXTERNAL_URLS.browserling },
  urlscan: { label: 'URLScan', getUrl: EXTERNAL_URLS.urlscan },
};

// Pagination settings
export const PAGINATION = {
  defaultItemsPerPage: 15,
  itemsPerPageOptions: [15, 25, 50, 100],
  maxVisiblePages: 5,
};
