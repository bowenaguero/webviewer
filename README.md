# webviewer

Client-side browser history analysis. Your data never leaves your browser.

## Features

- Parses SQLite history files in-browser using WebAssembly
- Supports Chrome, Firefox, and Edge
- Filter by date, event type, and search
- Send URLs to VirusTotal, URLScan, Browserling

## Usage

1. Copy your browser history file (rename to `.db` or `.sqlite`)
2. Upload at [webviewer.vercel.app](https://webviewer.vercel.app)
3. Browse, filter, and analyze

## History File Locations

| Browser | Path                                                       |
| ------- | ---------------------------------------------------------- |
| Chrome  | `AppData/Local/Google/Chrome/User Data/Default/History`    |
| Firefox | `AppData/Roaming/Mozilla/Firefox/Profiles/*/places.sqlite` |
| Edge    | `AppData/Local/Microsoft/Edge/User Data/Default/History`   |

## Development

```bash
npm install
npm run dev
```
