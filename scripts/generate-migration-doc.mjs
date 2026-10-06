import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

const outputPath = resolve("nextjs-typescript-migration.docx");
const ink = "19232E";
const accent = "D97732";
const muted = "586575";

const sections = [
  {
    title: "1. Executive Summary",
    paragraphs: [
      "The application has been moved from a Vite-powered React single-page application to Next.js App Router with strict TypeScript. The existing movie discovery, pagination, watchlist, toast feedback, Redux state, and performance benchmark workflows remain in place.",
      "The migration replaces client-side React Router routes with filesystem routes and relocates the root document and global provider setup into the App Router layout. Movie data is fetched directly from the browser to preserve the original Vite app's TMDB request path. Interactive interfaces remain client components; route shells and the root layout are server components by default.",
      "The result is a Next application configured for development with `npm run dev`, production compilation with `npm run build`, and production serving with `npm run start`. The generated file is this report: `nextjs-typescript-migration.docx`.",
    ],
  },
  {
    title: "2. Before and After",
    paragraphs: [
      "Before: Vite mounted `src/App.jsx` through `src/main.jsx`, React Router matched URLs in the browser, and the browser called TMDB directly using an API key embedded in source. Most application state and props had no compile-time contract.",
      "After: Next discovers pages under `src/app`, `src/app/layout.tsx` owns document metadata and global CSS, `src/app/providers.tsx` establishes the client state boundary, and a shared typed browser helper requests TMDB directly. Domain data, context values, Redux state, component props, and benchmark measurements now have explicit TypeScript types.",
      "The application deliberately keeps React, Redux Toolkit, React Context, react-hot-toast, and Tailwind CSS. The migration changes the framework boundary and strengthens contracts without replacing the existing state architecture or visual language.",
    ],
  },
  {
    title: "3. Architecture and Request Flow",
    paragraphs: [
      "Routing: `/` is `src/app/page.tsx`; `/watchlist` is `src/app/watchlist/page.tsx`; `/benchmark` is `src/app/benchmark/page.tsx`; unmatched URLs render `src/app/not-found.tsx`. This replaces BrowserRouter, Routes, Route, and the old wildcard route.",
      "Providers: `src/app/layout.tsx` is the root server layout. It wraps route content in the client-only `Providers` component. Providers creates a Redux store for that application tree, wraps the watchlist context, mounts the shared Header and toast host, and avoids creating a module-global Redux store shared across server requests.",
      "Movie request: `src/lib/tmdb.ts` builds a TMDB trending URL with page and language parameters and fetches it directly from the browser. Both Banner and the Redux thunk use this helper. This matches the original Vite repository; Node's fetch in this environment reset TMDB connections even though PowerShell and the browser request path work.",
      "Watchlist persistence: the provider reads localStorage from an effect after hydration and only writes after hydration has completed. This prevents the initial empty state used during server rendering from overwriting a user's saved watchlist.",
      "Client/server boundary: pages and layouts are server components unless they need state or browser APIs. Header, Banner, movie list/cards, pagination, watchlist, benchmark, context, and providers are client-side because they use interaction hooks, Redux hooks, React Context, effects, or browser storage.",
    ],
  },
  {
    title: "4. Component-by-Component Migration",
    paragraphs: [
      "App root (`src/App.jsx` -> `src/app/layout.tsx`, `src/app/providers.tsx`): the monolithic root used to compose the context, header, toaster, lazy modules, and route switch. Those responsibilities are separated: layout owns metadata and global styles; providers own client-only shared state and chrome; each URL is now a page file. The old App component and browser entrypoint were removed. Trade-off: the provider shell is client-rendered because Redux, Context, and toast components are interactive, while route discovery and document setup use Next conventions.",
      "Header (`src/components/Header.tsx`): switched from `react-router-dom` Link with `to` to `next/link` with `href`; added the client directive and typed Redux selector. The mobile menu and backdrop marquee are unchanged. Trade-off: Header sits under the shared client provider so it can consume Redux state, increasing client-side code compared with a static header.",
      "Home (`src/components/Home.tsx`): retained as a lightweight composition of Banner and MovieList. It is consumed by the filesystem home page. This preserves the existing component boundary rather than moving presentation into a route file.",
      "Banner (`src/components/Banner.tsx`): marked as a client component because it fetches after mount and stores image/title state. It uses the shared `getTrendingMovies` helper; its response is typed and missing results are handled. Non-OK responses leave the optional banner empty without throwing a console stack trace; MovieList displays any feed error. Trade-off: banner content still appears after hydration rather than being server-rendered, preserving the existing loading behavior.",
      "Movie (`src/components/Movie.tsx`): added a typed Movie prop and typed callbacks; added client boundary for button interactions; changed clickable divs into accessible buttons with labels; handles missing poster paths. The existing card structure and add/remove affordance remain. Trade-off: the existing emoji actions and remote image URLs remain rather than introducing a new icon/image optimization system.",
      "MovieList (`src/components/MovieList.tsx`): switched to typed Redux and watchlist hooks, typed the containment predicate through the shared Movie type, and added visible loading/error states. It remains a client component because it connects Redux and Context. The existing responsive grid and pagination placement remain.",
      "Pagination (`src/components/Pagination.tsx`): uses typed dispatch/selector hooks and the typed thunk to fetch on page changes. Clickable divs became disabled, labeled buttons; page changes remain Redux-owned and capped at 500. No server navigation was introduced because pagination represents client state rather than a distinct URL in the original application.",
      "Watchlist (`src/components/WatchList.tsx`): uses a typed context hook and typed Movie records; removed its duplicate localStorage load because persistence now belongs exclusively to the provider; fixed genre mapping to safely handle unknown genre IDs; retained search, genre filtering, sorting, and table presentation. A live TMDB response showed 3 of 20 trending items with both vote_average and vote_count equal to zero. These are unrated, not 0.0-rated, so the table now displays `Not rated`; both ascending and descending sorts keep such items at the end. `Movie.vote_count` is represented as an optional field for saved legacy data. Trade-off: storage hydration is centralized and predictable, but the watchlist still loads client-side and is not shareable between devices.",
      "PerformanceBenchmark (`src/components/PerformanceBenchmark.tsx`): typed synthetic records, benchmark summaries, labels, runner props, and result state. Corrected the conditional useMemo call so hooks run in stable order; the filter callback is stable for its inputs so the baseline still recomputes on unrelated ticks while the optimized variant reuses its memoized result. The route remains client-only because it uses Profiler, timers, state, and performance measurements. Trade-off: this is still a synthetic client benchmark, not a production performance guarantee.",
      "Spinner (`src/components/Spinner.tsx`, `src/components/Spinner.css`): retained as the existing loading visual and CSS module; it remains available for future Suspense/loading boundaries. The App Router currently uses framework page loading rather than retaining the old lazy-route Suspense wrapper.",
      "Movie Context (`src/context/MovieContext.tsx`): added the client directive, a typed MovieContextValue, typed watchlist state/actions, and a `useMovieContext` hook that fails clearly outside its provider. Reads malformed storage defensively, avoids writes until hydration completes, and uses functional state updates to avoid stale state. Duplicate additions are prevented. Trade-off: Context continues to own watchlist state alongside Redux owning fetched movie/pagination state; this preserves the existing separation rather than consolidating state.",
    ],
  },
  {
    title: "5. Redux, Data Types, and Utilities",
    paragraphs: [
      "`src/types/movie.ts`: introduces the shared Movie and MovieState contracts used across fetched movie results, cards, context, and the Redux slice. Optional names support TMDB response variants; nullable poster/backdrop paths reflect actual API data.",
      "`src/redux/store.ts`: changed from a singleton default store to `makeStore()`, with exported AppStore, RootState, and AppDispatch types. This is the Redux Toolkit pattern compatible with Next server/client rendering and prevents server requests from sharing mutable singleton state.",
      "`src/redux/hooks.ts`: exposes `useAppSelector` and `useAppDispatch` with store-derived types, removing unknown selector state and repeated unsafe casts from UI components.",
      "`src/redux/movieSlice.ts`: gives the initial state an explicit MovieState, defines boolean loading and nullable string errors, types payloads with PayloadAction, and exports named action creators. The state now distinguishes no error (`null`) from a descriptive error message.",
      "`src/redux/paginationSlice.ts`: retains page increment/decrement behavior and the 1-to-500 bound. It is now a `.ts` module because it contains no JSX.",
      "`src/redux/fetchMovieMiddleware.ts`: remains a Redux thunk with a typed page input and error state transition. It calls the shared browser helper and retains loading/success/error behavior.",
      "`src/utility.ts`: the genre dictionary now has a numeric-key-to-string Record type so genre lookups are checked and unknown values can be filtered safely.",
    ],
  },
  {
    title: "6. Styling, Assets, and Project Configuration",
    paragraphs: [
      "`src/index.css` is still the global stylesheet and Tailwind v4 entry point, but it is imported once from the App Router root layout. Global defaults that conflicted with the application layout were removed. `src/App.css` remains for existing component-specific styles and no longer imports Tailwind a second time.",
      "`postcss.config.mjs` uses `@tailwindcss/postcss`, replacing the Vite-specific Tailwind plugin. Existing utility classes and CSS animations remain; no visual redesign was part of this framework migration.",
      "`src/app/layout.tsx` replaces the old `index.html` document: it defines HTML language, metadata title/description, global styles, and the existing Font Awesome CDN stylesheet. Trade-off: Font Awesome remains a runtime network dependency instead of being locally bundled.",
      "`tsconfig.json` enables strict checking, JSX preservation, Next's TypeScript plugin, bundler-style module resolution, and the `@/*` alias. UI modules use `.tsx`; non-JSX logic uses `.ts`.",
      "`eslint.config.js` now applies TypeScript ESLint recommended rules and React Hooks rules to JS/TS source and ignores Next-generated output. `package.json` replaces Vite scripts with Next dev/build/start, adds a strict typecheck command, and adds the migration-doc generation command. Vite and React Router packages and their old entry/config files were removed.",
      "`src/main.tsx`, `src/App.tsx`, `index.html`, and `vite.config.js` were removed because Next owns application bootstrapping, HTML generation, and filesystem routing. Existing public assets remain untouched; no copy into Next's public directory was required for current asset references.",
    ],
  },
  {
    title: "7. Decisions and Trade-offs",
    paragraphs: [
      "App Router was chosen over the Pages Router because it is Next's current route/layout model and cleanly replaces the existing route tree with nested filesystem pages and a root layout.",
      "Interactive components were kept as client components instead of rewriting them into server data components. This limits behavioral risk and preserves React hooks, Redux, Context, browser storage, toasts, and the Profiler. Trade-off: several route experiences hydrate client JavaScript that a future server-first refactor could reduce.",
      "Redux and Context were retained rather than merged. Redux continues to own the movie feed and page number; Context owns the local watchlist and persistence. This avoids a broad state rewrite but means the app has two state mechanisms.",
      "Direct browser fetching was restored to match the source repository and avoid this environment's Node-to-TMDB connection reset. This removes the server proxy hop, but `NEXT_PUBLIC_TMDB_API_KEY` is visible in the browser bundle and network requests. Use only a key intended to be public; a private server credential must not use this approach.",
      "Each browser page or pagination request performs its own TMDB request. This preserves the original request behavior but does not provide a server cache; repeated requests count against the API's usage limits.",
      "TMDB artwork now uses `next/image`, with `image.tmdb.org` as the only configured remote image host and explicit responsive sizes. Missing poster paths render stable fallbacks. Trade-off: image delivery now depends on Next's image optimizer and the allowlist must be updated if image hosts change.",
      "A dedicated report-generation script and `docs:migration` npm command were added so the requested Word report can be reproduced. The generated DOCX is a deliverable, not a new runtime dependency of the application.",
    ],
  },
  {
    title: "8. Dependency Installation and Removal Log",
    paragraphs: [
      "Package changes were made through npm rather than hand-editing the lockfile. Framework packages were first declared in `package.json`, then `npm install` resolved and wrote the lockfile. Subsequent additions and removals used npm's install/uninstall commands so both manifest and lockfile stayed synchronized.",
    ],
    rows: [
      ["Action and packages", "Why and how"],
      ["Installed: `next` (declared as ^15.5.4)", "Replaced Vite's dev server, build pipeline, HTML shell, and routing with Next App Router. Added to dependencies in package.json; resolved with `npm install` (lockfile selected Next 15.5.27)."],
      ["Installed: `@tailwindcss/postcss` (^4.1.14)", "Replaced the Vite-specific Tailwind plugin with the PostCSS integration expected by the Next build. Declared in devDependencies, then installed by `npm install`."],
      ["Installed: `@types/node` (^22.18.6) and `typescript` (^5.9.2)", "Provide Node/Next ambient types and strict TS compilation. Declared in devDependencies and resolved by `npm install`; TypeScript checking is exposed as `npm run typecheck`."],
      ["Installed: `docx` (^9.8.1)", "Builds the requested Word report as a real OpenXML DOCX. Installed with `npm install --save-dev docx`; the generator is run with `npm run docs:migration`."],
      ["Installed: `typescript-eslint` (^8.71.1)", "Lets ESLint parse and lint the new `.ts`/`.tsx` files using flat-config TypeScript rules. Installed with `npm install --save-dev typescript-eslint`."],
      ["Installed: `@next/eslint-plugin-next` (^16.3.8)", "Provides Next-specific lint rules, including image and framework checks. Installed with `npm install --save-dev @next/eslint-plugin-next`, then registered in eslint.config.js."],
      ["Uninstalled: `@vitejs/plugin-react`, `eslint-plugin-react-refresh`, and `vite`", "These only supported the removed Vite server/build/refresh setup. Removed with `npm uninstall @vitejs/plugin-react eslint-plugin-react-refresh react-router react-router-dom vite`."],
      ["Uninstalled: `react-router` and `react-router-dom`", "Replaced by Next filesystem routes and `next/link`; removed in the same `npm uninstall` command above."],
      ["Removed during manifest reconciliation: `@tailwindcss/vite` and `baseline-browser-mapping`", "The former was Vite-only; the latter was part of the original Vite/template toolchain and no longer needed. They were omitted from the updated manifest and removed from the lock/install tree by `npm install`, not by the explicit uninstall command."],
      ["Kept: React, React DOM, Redux Toolkit, React Redux, react-hot-toast, Tailwind CSS, React typings, ESLint, React Hooks plugin, globals, and @eslint/js", "These still serve the app's UI, state, toast, CSS, or lint needs; no replacement was needed."],
    ],
  },
  {
    title: "9. Security and Environment Setup: Key Exposure Episode",
    paragraphs: [
      "Chronology: the original Vite source in the linked public GitHub repository contained a TMDB API key directly in the Banner and Redux fetch URLs. That value was already public before this migration and must be considered compromised. This report intentionally does not reproduce the credential.",
      "During the first Next migration, requests were moved behind a Next Route Handler using a server-only `TMDB_API_KEY`, specifically to avoid sending the credential to the browser. When the user said the linked implementation required no separate key, the repository files were inspected; they showed that the existing key was hardcoded rather than that TMDB allowed unauthenticated requests.",
      "At the user's direction, the already-public linked key was copied into ignored `.env.local` for local testing. The Next server Route Handler then returned 502 because Node's native fetch in this Windows environment got ECONNRESET talking to api.themoviedb.org. A PowerShell Invoke-WebRequest test with the same local value returned HTTP 200 and 20 movie results, proving the credential itself worked while isolating the runtime network difference.",
      "To preserve the original app's working direct-browser request path, a shared `src/lib/tmdb.ts` helper was added and the key variable changed to `NEXT_PUBLIC_TMDB_API_KEY`. This worked in browser smoke testing and rendered 20 movie cards plus the featured banner. This is a deliberate security trade-off: Next embeds `NEXT_PUBLIC_` values in browser-accessible code and requests, so this key is not secret. The value remains only in ignored `.env.local`, not tracked source, but it is observable by every user of the site.",
      "Required remediation: revoke/rotate the exposed key in TMDB and replace the local value with a fresh key only if the account/key is explicitly suitable for public browser use. For production/private credentials, restore server-side proxying and fix the Node/network egress path (for example, configure the proper proxy or deployment egress) instead of using `NEXT_PUBLIC_`. `.env.local` is git-ignored; never commit it or paste the value into chat or documentation.",
    ],
  },
  {
    title: "10. Environment Setup",
    paragraphs: [
      "For the current direct-browser implementation, set `NEXT_PUBLIC_TMDB_API_KEY` in `.env.local` (copy `.env.example` and replace the placeholder). This value is observable in browser code and requests. Do not use a private credential in this variable. The actual key is intentionally omitted from this report.",
    ],
  },
  {
    title: "11. Verification and Known Limits",
    paragraphs: [
      "Verified during migration: `npm run typecheck` completed successfully with strict TypeScript; `npm run lint` completed with no errors or warnings after correcting the benchmark hook ordering and dependencies.",
      "After the request-path adjustment, `npm run typecheck`, `npm run lint`, and `npm run build` all passed. Browser smoke testing confirmed the home page loads 20 movie posters and titles. The project has no dedicated automated component or API tests in the starting repository.",
      "npm reported ten dependency advisories after framework and lint tooling installation (two moderate, eight high). These are dependency audit findings, not migration test failures; review with `npm audit` before deployment and assess updates separately to avoid unrelated breaking upgrades.",
    ],
  },
  {
    title: "12. File Mapping Reference",
    rows: [
      ["Previous responsibility", "Next.js / TypeScript destination"],
      ["Vite HTML + React mount", "src/app/layout.tsx and src/app/providers.tsx"],
      ["React Router root and URL routes", "src/app/page.tsx, watchlist/page.tsx, benchmark/page.tsx, not-found.tsx"],
      ["Browser TMDB fetch", "src/lib/tmdb.ts used by Banner and the Redux thunk"],
      ["Global Redux instance", "src/redux/store.ts makeStore + src/redux/hooks.ts"],
      ["Implicit movie shape", "src/types/movie.ts"],
      ["Vite Tailwind integration", "postcss.config.mjs + App Router global CSS import"],
      ["Vite scripts and configuration", "Next scripts in package.json; vite.config.js/index.html removed"],
      ["Migration notes", "nextjs-typescript-migration.docx, generated by scripts/generate-migration-doc.mjs"],
    ],
  },
];

function bodyParagraph(text) {
  return new Paragraph({
    children: [new TextRun({ text, color: ink, size: 21 })],
    spacing: { after: 160, line: 300 },
  });
}

function makeTable(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map((row, rowIndex) => new TableRow({
      children: row.map((cell) => new TableCell({
        width: { size: 50, type: WidthType.PERCENTAGE },
        shading: rowIndex === 0 ? { type: ShadingType.CLEAR, fill: ink } : undefined,
        margins: { top: 120, bottom: 120, left: 140, right: 140 },
        children: [new Paragraph({
          children: [new TextRun({
            text: cell,
            bold: rowIndex === 0,
            color: rowIndex === 0 ? "FFFFFF" : ink,
            size: 19,
          })],
        })],
      })),
    })),
  });
}

const content = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 1200, after: 220 },
    children: [new TextRun({ text: "PROJECT MIGRATION", bold: true, color: accent, size: 24 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: "Vite React to Next.js + TypeScript", bold: true, color: ink, size: 40 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 700 },
    children: [new TextRun({ text: "Component-by-component implementation record, architecture decisions, and trade-offs", color: muted, size: 22 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 1000 },
    children: [new TextRun({ text: "Dope Moviez | Generated from the migrated repository", color: muted, size: 19 })],
  }),
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text: "At a Glance", color: accent })],
  }),
  makeTable([
    ["Area", "Outcome"],
    ["Framework", "Next.js App Router"],
    ["Language", "TypeScript with strict checking"],
    ["Routes", "/, /watchlist, /benchmark, custom 404"],
    ["Data access", "Direct browser fetch via typed TMDB helper"],
    ["State", "Redux Toolkit for feed/pagination; Context for watchlist"],
  ]),
  new Paragraph({ pageBreakBefore: true, children: [] }),
];

for (const section of sections) {
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    keepNext: true,
    children: [new TextRun({ text: section.title, color: accent })],
  }));
  for (const paragraph of section.paragraphs ?? []) content.push(bodyParagraph(paragraph));
  if (section.rows) content.push(makeTable(section.rows));
}

const document = new Document({
  creator: "GitHub Copilot",
  title: "Vite React to Next.js and TypeScript Migration",
  subject: "Detailed component-by-component migration record",
  description: "Architecture, implementation choices, trade-offs, security, and verification.",
  styles: {
    default: {
      document: { run: { font: "Aptos", size: 21, color: ink } },
      heading1: { run: { font: "Aptos Display", size: 30, bold: true, color: accent }, paragraph: { spacing: { before: 300, after: 160 } } },
    },
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 900, right: 1000, bottom: 900, left: 1000 },
      },
    },
    children: content,
  }],
});

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, await Packer.toBuffer(document));
console.log(`Generated ${outputPath}`);