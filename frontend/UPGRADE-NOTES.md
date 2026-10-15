# Upgrade Notes — React 19.3 + Next.js 16.3.3

This source was upgraded from Next.js 13.5.11 / React 18 to:

- Next.js 16.3.3
- React 19.3.0
- React DOM 19.3.0
- React TypeScript types 19.3.x
- eslint-config-next 16.3.3

## Compatibility changes

- `next lint` was replaced with the ESLint CLI because Next.js 16 no longer uses `next lint`.
- `middleware.ts` was migrated to `proxy.ts`, matching the Next.js 16 convention.
- Pages Router code that imported `usePathname` / `useParams` from `next/navigation` was migrated to `next/router`, because this project remains on the Pages Router.
- The project has a custom `webpack` SVG loader (`@svgr/webpack`). Next.js 16 uses Turbopack by default, so `dev` and `build` explicitly use `--webpack` to preserve the existing SVG import behavior without changing the UI architecture.

## Run on Windows

1. Install Node.js 20.9+ (Node 22 LTS is also suitable).
2. Open PowerShell in this project folder.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open `http://localhost:3000`.
6. For a production build, run `npm run build`, then `npm start`.

The backend in the original source is separate. If the storefront calls the backend API, the backend must also be running and the project's environment/API settings must point to it.

## Verification note

The source upgrade was applied, but a clean `npm install` / `next build` could not be completed in this environment because access to the npm registry timed out. Therefore no claim is made that the final production build has been successfully executed here.
