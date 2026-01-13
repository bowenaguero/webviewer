import { FolderSearch, Upload, Search } from 'lucide-react';
import { FaChrome, FaFirefox, FaEdge, FaSafari } from 'react-icons/fa';

// Steps displayed in the Help dropdown
export const HELP_STEPS = [
  { icon: FolderSearch, label: 'Find', desc: 'Browser history file' },
  { icon: Upload, label: 'Upload', desc: 'Drop it here' },
  { icon: Search, label: 'Explore', desc: 'Search, filter, analyze' },
];

// Supported browsers displayed in the Help dropdown
export const SUPPORTED_BROWSERS = [
  { icon: FaChrome, name: 'Chrome', file: 'History' },
  { icon: FaFirefox, name: 'Firefox', file: 'places.sqlite' },
  { icon: FaSafari, name: 'Safari', file: 'History.db' },
  { icon: FaEdge, name: 'Edge', file: 'History' },
];

// Warning messages displayed in the Help dropdown
export const UPLOAD_WARNINGS = [
  'Rename to .db or .sqlite to upload',
  '500k row limit',
];
