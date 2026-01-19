// External service URLs for "Send to" feature

export const EXTERNAL_URLS = {
  virustotal: (domain) => `https://www.virustotal.com/gui/domain/${domain}`,
  browserling: (url) => `https://www.browserling.com/browse/win10/chrome/${url}`,
  urlscan: (domain) => `https://urlscan.io/search/#${domain}`,
};
