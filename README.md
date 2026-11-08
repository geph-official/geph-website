SvelteKit website for https://geph.io.

Use Node 22.12 or newer:

```sh
npm ci
npm run dev
```

`npm run check` checks Svelte and TypeScript.

Cloudflare Pages uses the `geph-official/geph-website` GitHub repository:

- Production branch: `master`
- Build command: `npm run build:pages`
- Build output directory: `.svelte-kit/cloudflare`
- Node.js version: `22`

Pushes to the production branch build and deploy through the Cloudflare Workers
and Pages GitHub app. Grant that app access to this repository in the
`geph-official` organization. Other branches receive preview deployments.

`npm run build:pages` uses the Cloudflare adapter. Preview the result with
`npx wrangler pages dev .svelte-kit/cloudflare`. Language redirects and release
metadata run in Pages Functions; release download links are fetched on each
homepage request.

`npm run build` produces a standalone Node server in `build/` when `CF_PAGES`
is unset. Run it with `node build`, with production dependencies installed and
`HOST`, `PORT`, and proxy settings supplied by the host environment.
