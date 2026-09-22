SvelteKit website for https://geph.io.

Use Node 22.12 or newer:

```sh
npm ci
npm run dev
```

`npm run check` checks Svelte and TypeScript. `npm run build` produces a standalone
Node server in `build/`. Run it with `node build`, with production dependencies
installed and `HOST`, `PORT`, and proxy settings supplied by the host environment.

Production deployment is managed on the server. A systemd timer checks GitHub's
`master` branch every two minutes, builds new commits, and restarts the website
after a successful build. Failed health checks restore the previous release.
Nginx handles HTTPS, with certificates automatically renewed by Certbot.
