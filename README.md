# leaderboard-fe

React leaderboard UI for **Muscle Land**. Talks to [leaderboard-be](https://github.com/hamdidal/leaderboard-be).

## Live demo

| | URL |
| --- | --- |
| **App** | [https://panteon-leaderboard.netlify.app/](https://panteon-leaderboard.netlify.app/) |
| **Outside top 100** | [?mockPlayer=8000](https://panteon-leaderboard.netlify.app/?mockPlayer=8000) |
| **Backend API** | [https://panteon-leaderboard-server-production.up.railway.app](https://panteon-leaderboard-server-production.up.railway.app) |

Netlify production env:

```bash
VITE_API_URL=https://panteon-leaderboard-server-production.up.railway.app
VITE_WS_URL=wss://panteon-leaderboard-server-production.up.railway.app
```

## Repositories

| Repo | URL |
| ---- | --- |
| **Frontend (this repo)** | [github.com/hamdidal/leaderboard-fe](https://github.com/hamdidal/leaderboard-fe) |
| **Backend** | [github.com/hamdidal/leaderboard-be](https://github.com/hamdidal/leaderboard-be) |

## Stack

React 18, Vite 6, TypeScript, TanStack Query, Zustand, Tailwind, Framer Motion, i18n (EN/TR), Storybook 8.

## Quick start

```bash
cp .env.example .env
npm install --legacy-peer-deps
npm run dev
```

App: http://localhost:5173

Point `VITE_API_URL` / `VITE_WS_URL` at your API (local or Railway). Vite dev server proxies `/api` and `/live` when env vars are unset.

## Demo players

The API seed creates two fixed users. The app picks one automatically:

| How you open the site | User ID | Approx. rank | What you see |
| --------------------- | ------- | ------------ | ------------ |
| **Default** — no query params | `demo-user` | **~76** (inside top 100) | Highlighted row, jump-to-me, estimated reward |
| **Outside top 100** — `?mockPlayer=8000` or `?mockPlayer=outside` | `demo-user-8000` | **~8000** | Sticky neighbor panel (3 above, 2 below), points-to-top-100 |

Run `npm run seed` on the backend first ([leaderboard-be](https://github.com/hamdidal/leaderboard-be)).

## Scripts

```bash
npm run lint
npm run test          # 56 tests
npm run build
npm run storybook
```

## Deploy (Netlify)

- Build: `npm run build -w packages/shared && npm run build -w client`
- Publish: `client/dist`
- Env: `VITE_API_URL`, `VITE_WS_URL` (see Live demo above)

See `netlify.toml`.

## AI workflow

See [AI_WORKFLOW.md](AI_WORKFLOW.md) — covers both backend and frontend; AI-assisted development is part of the Panteon case deliverable.
