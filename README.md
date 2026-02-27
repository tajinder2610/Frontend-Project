# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


This is a common routing issue in React when using client-side routing with react-router.

✅ Why It Happens

When you navigate from Home → Watchlist using a <Link>, React Router handles it on the client-side — works perfectly.

When you type /watchlist manually in the browser or refresh, the browser sends a request to the server at /watchlist.

If your server (e.g., Node/Express, Vite, or static hosting) doesn’t handle all routes to serve index.html, you get “Page not found”.

Basically, your server doesn’t know about client-side routes.

/* /index.html 200

/* → matches all routes

/index.html → serves your SPA entry point

200 → tells Netlify to always return index.html for client-side routes