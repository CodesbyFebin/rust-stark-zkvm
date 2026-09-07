# zkvm.host (Next.js 16)

The zkvm.host marketing/docs site, migrated from a client-only Vite + React
SPA to Next.js 16 (App Router) with a real static export (`output: 'export'`)
-- every route gets its own genuinely server-rendered `<title>`, meta
description, canonical URL, Open Graph/Twitter tags, and JSON-LD, generated
at build time, not injected client-side after the JS bundle loads.

## Architecture

- **App Router, static export.** `next build` produces `out/`: one real
  `.html` file per route (`architecture.html`, `capabilities.html`, ...),
  plus a `_next/` directory of JS/CSS. No Node server is required at
  runtime -- this deploys as plain static files, same as the old Vite SPA
  did, just with real per-route HTML now instead of one shared shell.
- **Server Components by default.** Every `page.jsx` exports `metadata`
  directly -- no client-side `useEffect` hack needed to set the title/
  description/canonical per route (the old `usePageMeta`/`usePageJsonLd`
  hooks this replaced lived in the previous `homepage-app/`, now removed).
  JSON-LD is a plain `<script type="application/ld+json">` in the page's
  own JSX, server-rendered on the first response.
- **Client Components only where there's real interactivity**: the hero
  terminal animation (`HeroTerminal.jsx`), the FAQ accordion
  (`FaqAccordion.jsx`), the Playground demo (`PlaygroundDemo.jsx`), and the
  Capabilities search/filter board (`CapabilitiesBoard.jsx`). Everything
  else -- the actual page content -- is a Server Component.
- **`title.template` in the root layout did not reliably apply to the
  `<title>` tag** in this static-export setup during migration (verified:
  `og:title` picked up a manually-suffixed string fine; the plain `<title>`
  tag did not inherit the parent template). Every page therefore sets its
  full `"<Title> — zkvm.host"` string explicitly in its own `metadata`
  export rather than relying on template merging.

## Deployment

This does **not** deploy itself directly. `next build` writes to `out/`
(gitignored), which then gets synced into `../site/` -- the actual Vercel
deploy root, which also holds hand-authored static content that isn't part
of this Next.js app at all (`blog/`, `glossary/`, `dashboard/`, `depin/`,
`funding/`, `robots.txt`, `llms.txt`, `sitemap.xml`, the real favicons).

```bash
npm run build              # writes homepage-next/out/
rm -rf ../site/app-assets  # remove the old Vite bundle if it's still there
cp -r out/. ../site/       # sync into the deploy root -- never touches
                            # site/blog, site/glossary, site/dashboard,
                            # site/depin, site/funding, or the real favicons
cd ../site && vercel --prod --yes
```

`site/vercel.json` sets `"cleanUrls": true` so Vercel serves
`architecture.html` at `/architecture` with no extension -- confirmed
against Vercel's own documentation
(https://vercel.com/docs/project-configuration/vercel-json) before
relying on it, and verified live in production after deploying (every
route curl-tested for `200` + the correct per-route title, plus the
hand-authored static directories confirmed still serving unchanged).

## Local development

```bash
npm install
npm run dev -- --port 4190
```

Or via this repo's `.claude/launch.json`: the `homepage-next` configuration
runs the same command.
