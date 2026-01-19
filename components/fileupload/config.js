import { FolderSearch, Upload, Search } from 'lucide-react';
import { HELP_BROWSER_LIST } from '@/lib/constants/index';

// Steps displayed in the Help dropdown
export const HELP_STEPS = [
  { icon: FolderSearch, label: 'Find', desc: 'Browser history file' },
  { icon: Upload, label: 'Upload', desc: 'Drop it here' },
  { icon: Search, label: 'Explore', desc: 'Search, filter, analyze' },
];

// Supported browsers displayed in the Help dropdown (re-export from constants)
export const SUPPORTED_BROWSERS = HELP_BROWSER_LIST;

// Warning messages displayed in the Help dropdown
export const UPLOAD_WARNINGS = [
  'Rename to .db or .sqlite to upload',
  '500k row limit',
];
