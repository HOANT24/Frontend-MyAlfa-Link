# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Dev server on port 3000
npm run build    # Production build
npm test         # Jest test runner (watch mode)
```

ESLint is configured via `eslintConfig` in package.json (extends `react-app` and `react-app/jest`). No separate lint command — CRA runs ESLint as part of the build.

## Architecture

**MyALFA Link** is a React 19 SPA for the ALFA Partenaires client portal. It is built with Create React App, styled with Tailwind CSS v3, and deployed on Vercel.

### Routing (`src/App.js`)

React Router v7. All routes except `/login` are wrapped in `ProtectedRoute`, which checks for `clients` in localStorage and redirects to `/login` if absent.

| Route | Page |
|-------|------|
| `/login` | Auth (login + account creation flows) |
| `/home` | Main shell — sidebar + dynamic content |
| `/documents` | Document viewer |
| `/:id?/preview-html` | Inline HTML document preview |
| `*` | Redirects to `/home` |

### Global State (`src/pages/EtatGlobal.js`)

Single `EtatGlobalContext` (React Context) wraps the entire app from `src/index.js`. It holds:

- `clients` / `clientSelect` — persisted to localStorage; changing `clientSelect` triggers cascading API refetches for all feature data
- `documents`, `demandes`, `questionnaires`, `rdvs`, `dataDashboard`

All API calls target `https://backend-myalfa.vercel.app`. There are no auth headers — the backend infers identity from the email in localStorage.

### Main Layout (`src/pages/home/Layout.js`)

Renders the sidebar + content area. Page switching is driven by a local `currentPage` state rather than URL sub-routes. The sidebar collapses on screens narrower than 1024 px. Premium features are gated by a `IS_PREMIUM = false` constant — currently shows a blur overlay for locked pages.

Brand accent color: `#840040` (dark burgundy).

### Feature Pages

Each subdirectory under `src/pages/` maps to one nav item loaded inside Layout:

- `dashboard/` — metrics via recharts
- `documents/` — document list and viewer
- `demandes/` — client requests
- `questionnaires/` — forms/surveys
- `rdv/` — appointments
- `prestations/` — services
- `applications/` — premium third-party apps
- `previewHTML/` — standalone HTML preview route

### UI Components

Reusable primitives live in `src/components/ui/` (button, input, dialog, table, tabs, select, textArea). Icons come from `lucide-react`.

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `react-router-dom` v7 | Client-side routing |
| `tailwindcss` v3 | Utility-first styling |
| `recharts` | Dashboard charts |
| `date-fns` | Date formatting |
| `lucide-react` | Icons |

## Deployment

`vercel.json` rewrites all routes to `/index.html` (standard SPA config). No environment variables are needed — the API base URL is hardcoded in `EtatGlobal.js`.
