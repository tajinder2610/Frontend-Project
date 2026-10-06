# Dope Moviez

A movie discovery and watchlist app built with Next.js App Router, React, TypeScript, Redux Toolkit, and Tailwind CSS.

## Requirements

- Node.js 20.9 or newer
- npm
- A TMDB API key for movie data

## Setup

```powershell
npm install
Copy-Item .env.example .env.local
```

Set `NEXT_PUBLIC_TMDB_API_KEY` in `.env.local`. This follows the existing Vite implementation's direct browser-to-TMDB request pattern. `NEXT_PUBLIC_` values are bundled into browser code, so this key is public; never use a private credential here. Do not commit `.env.local`.

## Commands

```powershell
npm run dev
npm run typecheck
npm run lint
npm run build
npm run start
npm run docs:migration
```

Routes are `/`, `/watchlist`, and `/benchmark`. Movie requests are made directly from the browser to TMDB, matching the original app's request path.

## Migration Record

The detailed component-by-component migration, decisions, trade-offs, security notes, and verification record is in [nextjs-typescript-migration.docx](nextjs-typescript-migration.docx). Regenerate it with `npm run docs:migration`; its source is `scripts/generate-migration-doc.mjs`.