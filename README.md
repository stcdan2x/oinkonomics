# Oinkonomics

A business manager for a small Philippine piggery: an offline-first progressive
web app that keeps the herd records (breeders, litters, growing batches, health
events, sales), the money (ledger, income statement, cash flow, batch costing
and break-even), the feed and supplies stock, a strategy recommender with
projections, and a sourced Guide on raising and selling pigs. Data lives in the
browser (IndexedDB) with optional sync between devices through the farm's own
Google Drive.

Live app: https://stcdan2x.github.io/oinkonomics/

## Stack

Vite 6, React 18, TypeScript, Tailwind 4, Dexie, Recharts, vite-plugin-pwa,
Vitest.

## Run locally

```
npm ci
npm run dev       # development server
npm test          # unit tests
npm run build     # production build into dist/
```

## Deployment

Every push to `main` runs the tests and the build, then publishes `dist/` to
GitHub Pages (`.github/workflows/deploy.yml`).

## About this repository

This repository is a generated, minimal projection of a private development
repository: it contains the application source and its tests, nothing else.
Its history is a sequence of `Sync skeleton from <sha>` commits.

## License

MIT, see `LICENSE`.
