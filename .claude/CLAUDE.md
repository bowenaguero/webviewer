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
  analytics/            # Vercel Analytics
  bottombar/            # Footer
  event/                # Event type icons
  fileupload/           # File upload (with local config)
  history/              # Main feature (context + table + toolbar)
  how/                  # Landing page content
  topbar/               # Header/navigation
  ui/                   # shadcn/ui primitives
config/                 # Feature-level configuration
hooks/                  # Custom React hooks (consolidated)
lib/                    # Utilities, constants, shared logic
  browser-parser/       # SQL queries + processing (single source of truth)
  constants/            # Semantic constant grouping
workers/                # Web Worker source code
public/                 # Static assets, compiled worker
```

## Key Files

- `components/history/table/HistoryTable.js` - Main data table with two-line rows (title + details)
- `components/history/context/HistoryContext.js` - Global state for history data, filters, pagination
- `components/history/toolbar/ToolBar.js` - Search, filter, date picker, sort controls
- `lib/browser-parser/queries.js` - SQL queries for different browser formats
- `lib/browser-parser/processing.js` - Data normalization
- `lib/filters.js` - Client-side filtering

## Supported Browsers

- Chrome (`History` file)
- Firefox (`places.sqlite`)
- Edge (`History` file)

## Build Philosophy

**Core Principles:** Simplicity, Clarity, Maintainability, Modularity

### Directory Organization

**Feature-based grouping** - Related code lives together:
- `components/history/` contains context, table, and toolbar for the history feature
- Each feature folder has its own barrel export (index.js)

**Semantic separation** - Code grouped by purpose:
- `lib/` - Shared utilities and business logic
- `config/` - Feature-level configuration
- `hooks/` - All custom React hooks in one place
- `workers/` - Web Worker source code

### Import Patterns

**Barrel exports** - Clean, discoverable imports:
```javascript
import { HistoryTable, ToolBar } from '@/components/history';
import { useHistoryWorker, useStatsBounds } from '@/hooks';
import { combinedFilter } from '@/lib';
```

**Explicit named exports** - Better tree-shaking, no `export *`:
```javascript
// Good
export { ComponentA } from './ComponentA';
export { ComponentB } from './ComponentB';

// Avoid
export * from './ComponentA';
```

**Absolute paths** for cross-feature imports (`@/`), relative for siblings.

### Single Source of Truth

**Shared logic lives in one place:**
- `lib/browser-parser/` - SQL queries and processing used by both main thread and worker
- `lib/constants/` - All constants, semantically grouped (browser, ui, external)
- `config/` - Feature configuration (table, filters)

**No duplication** - Worker imports from lib/, doesn't duplicate code.

### Performance Patterns

**Split contexts** - Minimize re-renders:
- Separate contexts for data, filters, pagination
- Components subscribe only to what they need

**Memoization** - Expensive computations:
- `useMemo` for derived state
- `useDeferredValue` for search input
- `useTransition` for non-urgent updates

**Streaming** - Large data:
- Worker streams results in chunks
- Progress updates during processing

### Configuration Hierarchy

1. **lib/constants/** - Core behavioral constants (epoch offsets, limits)
2. **config/** - Feature configuration (table layout, filter fields)
3. **Component-local config** - UI-specific (collocated with component)

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
npm run dev          # Development server (builds worker first)
npm run build        # Production build (builds worker first)
npm run build:worker # Build web worker only
npm run lint         # ESLint
npm run test:run     # Unit tests (87 tests)
npm run test:e2e     # E2E tests (Playwright)
```

## External Integrations

ActionsMenu provides "Send to" options:
- VirusTotal
- URLScan
- Browserling
