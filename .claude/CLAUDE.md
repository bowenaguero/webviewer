# WebViewer - Browser History Analyzer

## Overview

Client-side browser history analysis tool. All data processing happens in-browser using WebAssembly - user data never leaves their browser.

**Live:** https://viewer.websec.tools

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **UI:** shadcn/ui + Radix primitives + Tailwind CSS v4
- **Fonts:** Geist Sans / Geist Mono
- **SQLite Parsing:** sql.js (WebAssembly) via Web Worker
- **Local Storage:** Dexie (IndexedDB wrapper)
- **Icons:** lucide-react, react-icons

## Project Structure

```
app/                    # Next.js App Router pages
components/
  context/              # React context (HistoryContext)
  event/                # Event type icons
  fileupload/           # Dropzone file upload
  hooks/                # Custom React hooks
  table/                # HistoryTable, ActionsMenu, PaginationMenu
  toolbar/              # ToolBar, SearchBar, FilterBy, SortBy, DatePicker
  topbar/               # Header/navigation
  bottombar/            # Footer
  ui/                   # shadcn/ui components
  utils/                # Helpers, constants, query/filter/process functions
lib/                    # Utilities (cn function)
public/                 # Static assets, Web Worker
```

## Key Files

- `components/table/HistoryTable.js` - Main data table with two-line rows (title + details)
- `components/context/HistoryContext.js` - Global state for history data, filters, pagination
- `components/toolbar/ToolBar.js` - Search, filter, date picker, sort controls
- `components/utils/queryBrowserHistory.js` - SQL queries for different browser formats
- `components/utils/processBrowserHistory.js` - Data normalization
- `components/utils/filterBrowserHistory.js` - Client-side filtering

## Supported Browsers

- Chrome (`History` file)
- Firefox (`places.sqlite`)
- Edge (`History` file)

## Design Patterns

### Table UX
- Dense rows with `py-1.5 px-3` padding, `text-xs` font
- Two-line rows: Title on line 1, event details on line 2 (when present)
- Fixed column widths: actions 3%, time 15%, type 5%, url 40%, title 37%
- Type column is icon-only with tooltip
- All content has tooltips for overflow

### Toolbar Buttons
- `variant="ghost"` with conditional styling
- Icon-only when inactive, icon + text + X when active
- Border/text color: `border-gray-800 text-gray-500` (inactive), `border-gray-300 text-gray-300` (active)

### Event Types
- Visit, Download, Form, Bookmark, Search, Typed (and more per browser)
- Each has an icon in `EventIcon.js`

## Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run lint     # ESLint
```

## External Integrations

ActionsMenu provides "Send to" options:
- VirusTotal
- URLScan
- Browserling
