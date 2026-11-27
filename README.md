# Smart-Living360 Global: web app (V1)

Next.js (TypeScript) front end for the V1 customer site. Backend, database and payments come next, per `claude/smartliving360-v1-spec.md`.

## Run locally

    npm install
    npm run dev

Open http://localhost:3000.

## Deploy

Import this folder into Vercel. Then add the domain in Project Settings → Domains and set the DNS records at go54 as described.

## Next steps

- Add the logo to `public/` and replace the text wordmark in `app/layout.tsx`.
- Replace the estimated colours in `app/globals.css` with the exact brand values.
- Build `POST /api/requests` and the database schema.
