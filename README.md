# leaderboard-fe

React leaderboard UI for the Muscle Land weekly board. Talks to [leaderboard-be](https://github.com/hamdidal/leaderboard-be).

## Stack

React 18, Vite, TypeScript, TanStack Query, Zustand, Tailwind, Framer Motion, i18n (EN/TR).

## Quick start

```bash
cp .env.example .env
npm install
npm run dev
```

App: http://localhost:5173

Point `VITE_API_URL` / `VITE_WS_URL` at your API (local or Railway).

### Demo users (after API seed)

| User | How |
|------|-----|
| `demo-user` | Default (~top 100) |
| `demo-user-8000` | `?mockPlayer=8000` (outside top 100) |

## Scripts

```bash
npm run lint
npm run test
npm run build
```

## Deploy (Netlify)

- Build: `npm run build -w packages/shared && npm run build -w client`
- Publish: `client/dist`
- Env: `VITE_API_URL`, `VITE_WS_URL` (production API, `wss://` for WebSocket)

See `netlify.toml`.
