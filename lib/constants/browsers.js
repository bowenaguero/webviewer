// Consolidated browser data - single source of truth
// Used by: SupportedBrowsersTable, Supports, fileupload/config

import { FaChrome, FaFirefox, FaEdge, FaSafari, FaOpera } from 'react-icons/fa';

// Core browser definitions
export const BROWSER_DATA = {
  chrome: {
    id: 'chrome',
    name: 'Chromium',
    icon: FaChrome,
    file: 'History',
    supported: true,
    paths: [
      'Windows: AppData/Local/Google/Chrome/User Data/Default/History',
      'macOS: Library/Application Support/Google/Chrome/Default/History',
    ],
  },
  firefox: {
    id: 'firefox',
    name: 'Firefox',
    icon: FaFirefox,
    file: 'places.sqlite',
    supported: true,
    paths: [
      'Windows: AppData/Roaming/Mozilla/Firefox/Profiles/<your_profile>/places.sqlite',
      'macOS: Library/Application Support/Mozilla/Firefox/Profiles/Default/places.sqlite',
    ],
  },
  edge: {
    id: 'edge',
    name: 'Edge',
    icon: FaEdge,
    file: 'History',
    supported: true,
    paths: [
      'Windows: AppData/Local/Microsoft/Edge/User Data/Default/History',
      'macOS: Library/Application Support/Microsoft/Edge/Default/History',
    ],
  },
  safari: {
    id: 'safari',
    name: 'Safari',
    icon: FaSafari,
    file: 'History.db',
    supported: true,
    paths: ['macOS: ~/Library/Safari/History.db'],
  },
  opera: {
    id: 'opera',
    name: 'Opera',
    icon: FaOpera,
    file: 'History',
    supported: false,
    paths: [
      'Windows: AppData/Local/Opera Software/Opera Stable/History',
      'macOS: Library/Application Support/Opera Software/Opera Stable/History',
    ],
  },
  brave: {
    id: 'brave',
    name: 'Brave',
    icon: FaChrome, // Brave uses Chromium icons
    file: 'History',
    supported: false,
    paths: [
      'Windows: AppData/Local/BraveSoftware/Brave-Browser/User Data/Default/History',
      'macOS: Library/Application Support/BraveSoftware/Brave-Browser/Default/History',
    ],
  },
};

// Derived lists for different components
export const SUPPORTED_BROWSERS = Object.values(BROWSER_DATA).filter(
  (b) => b.supported,
);

export const UNSUPPORTED_BROWSERS = Object.values(BROWSER_DATA).filter(
  (b) => !b.supported,
);

// For SupportedBrowsersTable - includes all browsers with display names
export const BROWSERS_TABLE_DATA = Object.values(BROWSER_DATA).map((b) => ({
  name: b.supported ? b.name : `${b.name} (Not Tested)`,
  supported: b.supported,
  fileName: b.file,
  filePath: b.paths,
}));

// For Supports component - icons with tooltips
export const BROWSER_ICONS_SUPPORTED = SUPPORTED_BROWSERS.map((b) => ({
  id: b.id,
  icon: b.icon,
  tooltip: `${b.name} (Supported)`,
}));

export const BROWSER_ICONS_UNSUPPORTED = UNSUPPORTED_BROWSERS.map((b) => ({
  id: b.id,
  icon: b.icon,
  tooltip: `${b.name} (Not Supported)`,
}));

// For Help dropdown in fileupload
export const HELP_BROWSER_LIST = SUPPORTED_BROWSERS.map((b) => ({
  icon: b.icon,
  name: b.name === 'Chromium' ? 'Chrome' : b.name, // Display as Chrome in help
  file: b.file,
}));
