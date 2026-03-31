## Real-Time Live Dashboard

This project is a production-style real-time dashboard that streams live match data (scores, time, odds) from a Node/Express WebSocket backend into a Vue 3 + Pinia + TypeScript frontend.

### Architecture Overview

- **Backend (`backend`)**
  - Node.js + Express HTTP server.
  - REST API `GET /api/matches` returning the initial list of matches.
  - WebSocket server at `/ws/matches` broadcasting incremental match updates every 1–2 seconds.
  - In-memory match store and a simulation engine that mutates scores, odds, and time.
- **Frontend (`frontend`)**
  - Vite + Vue 3 (Composition API) + TypeScript.
  - Pinia store with **normalized state** (`entities` + `ids`) for matches.
  - Services layer for REST (`matchesApi`) and WebSocket (`useWebSocket` + `matchUpdatesChannel`).
  - Presentational components (`MatchCard`, `MatchList`, `ToolbarFilters`) and `DashboardView` container.

Real-time updates follow a common production pattern: **REST bootstraps initial state**, then **WebSocket streams small delta messages**.

### How Real-Time Updates Work

1. **Initial load**
   - Frontend calls `GET /api/matches` via `matchesApi.fetchMatches()`.
   - Response body: `{ data: Match[] }`, where `Match` has `{ id, name, score, time, odds, lastUpdatedAt }`.
   - `matchesStore.loadInitial()` normalizes the array into `entities: Record<string, Match>` and `ids: string[]`.

2. **Streaming updates**
   - Backend `matchSimulator` runs on an interval (default 1s), randomly:
     - Advances `time` a few minutes.
     - Occasionally updates `score` (home/away goals).
     - Randomly nudges `odds`.
   - For each simulated change, the simulator calls its listeners with a minimal `MatchUpdate`:
     - `{ type: "match-update", payload: { id, score?, time?, odds? } }`.
   - `wsServer` broadcasts this envelope over WebSocket to all connected clients.

3. **Frontend WebSocket handling**
   - `useWebSocket(url)` composable abstracts:
     - `connect` / `disconnect`.
     - Auto-reconnect with capped attempts.
     - Parsing of incoming JSON messages.
   - `useMatchUpdatesChannel` configures `useWebSocket` for `/ws/matches` and wires received `MatchUpdate` payloads into `matchesStore.applyUpdate()`.
   - `matchesStore.applyUpdate()`:
     - Patches only the changed fields for the matching entity.
     - Updates `lastUpdatedAt`.
     - Adds the id to `recentlyUpdatedIds` for short-lived highlight styling.

Because the Pinia store is normalized, each update only touches a single `Match` object; Vue’s reactivity then efficiently rerenders just the affected `MatchCard`.

### Key Design Decisions & Trade-offs

- **In-memory store vs. database**
  - Chosen: in-memory `matchStore` for simplicity and local development.
  - Trade-off: no persistence or horizontal scaling out of the box; in a real system you’d back this by Redis or a database and run multiple stateless API instances.

- **WebSocket library**
  - Chosen: `ws` on the backend and native `WebSocket` in the browser, wrapped by `useWebSocket`.
  - Trade-off: avoids Socket.IO overhead and custom protocol, but you implement reconnect and message protocols yourself (which this project demonstrates).

- **Normalized state on the frontend**
  - Chosen: `entities` + `ids` pattern inside `matchesStore`.
  - Benefits:
    - Cheap per-item updates during high-frequency WebSocket traffic.
    - Easier to scale to hundreds or thousands of items.

- **Filtering & sorting in getters**
  - Implemented as a single computed getter `allMatches` that:
    - Filters by `filters.search` (match name).
    - Sorts by `time`, `odds`, or a score-derived metric.
  - Trade-off: very clear derivation logic, at the cost of recomputation when filters change; acceptable for a dashboard-sized dataset.

- **Auto-reconnect strategy**
  - Simple fixed-interval reconnect with a maximum attempts cap.
  - Real-world deployments might use exponential backoff, jitter, and better detection of “offline” vs. “server down”.

### Running the Project

#### Prerequisites

- Node.js 20.x (the project was built and tested with 20.10.0).
- npm (comes with Node).

#### 1. Backend

```bash
cd backend
npm install
npm run dev
```

This starts the HTTP + WebSocket server on `http://localhost:4000`:

- REST: `GET http://localhost:4000/api/matches`
- WebSocket: `ws://localhost:4000/ws/matches`

#### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite runs on `http://localhost:5173` and is configured to proxy:

- `/api` → `http://localhost:4000`
- `/ws` → `ws://localhost:4000`

Open `http://localhost:5173` in your browser to see the live dashboard.

### Frontend Structure

- `src/main.ts` – Bootstraps Vue app, Pinia, router, and global theme CSS.
- `src/App.vue` – Layout shell with header, live connection indicator, and dark mode toggle.
- `src/views/DashboardView.vue` – Container view:
  - Loads initial data via `matchesStore.loadInitial()`.
  - Connects the WebSocket channel.
  - Renders toolbar, loading/error banners, and the match list.
- `src/components/ToolbarFilters.vue` – Search input + sort controls.
- `src/components/MatchList.vue` – Receives ready-to-render `matches` and `recentlyUpdatedIds`.
- `src/components/MatchCard.vue` – Presentational card with subtle flash on update.
- `src/stores/matchesStore.ts` – Normalized Pinia store with filters, sorting, and update logic.
- `src/stores/themeStore.ts` – Dark/light theme toggle with `localStorage` persistence.
- `src/stores/connectionStore.ts` – Connection status for the header indicator.
- `src/services/api/matchesApi.ts` – Axios-based REST client.
- `src/services/ws/useWebSocket.ts` – Generic reconnecting WebSocket composable.
- `src/services/ws/matchUpdatesChannel.ts` – Wires WebSocket messages into the matches store.

The UI uses a modern, card-based layout with:

- Loading and error banners.
- Search and sort controls.
- Highlighted cards for recently updated matches.
- A global dark/light theme that affects backgrounds, borders, and typography.

### Backend Structure

- `src/server.ts` – Express app, `/api` routes, and WebSocket server wiring.
- `src/config.ts` – Central configuration (port, WebSocket path, update interval).
- `src/types/match.ts` – Shared `Match` and `MatchUpdate` types (backend side).
- `src/data/matchStore.ts` – In-memory match repository and initial data seeding.
- `src/services/matchSimulator.ts` – Interval-driven simulation of scores, odds, and time.
- `src/http/matchRouter.ts` – `GET /api/matches` route.
- `src/ws/wsServer.ts` – WebSocket server setup and broadcast of `match-update` messages.

### Testing

- **Frontend unit tests**
  - Vitest + jsdom are configured via `vitest.config.ts`.
  - Example: `src/stores/matchesStore.test.ts` validates:
    - Normalization and default sorting.
    - Patch-only updates and highlight tracking.

- **Backend tests (minimal example)**
  - `src/services/matchSimulator.test.ts` illustrates how to import and exercise simulator logic. For a full production system, you’d add dedicated tests for score/odds update rules and REST/WS contracts.

Run frontend tests:

```bash
cd frontend
npm run test:unit
```

### Extensibility Notes

- To scale to **1000+ matches**, you can:
  - Swap `MatchList` implementation with a virtual scroller (e.g., `vue-virtual-scroller`) without changing the store or services.
  - Keep the normalized store and simply increase the initial data set and simulator coverage.
- To integrate authentication or multi-tenancy later:
  - Keep the existing services as “core data layer” and add auth middleware to the backend and route guards on the frontend.

This setup aims to mirror how a production team would structure a small, focused real-time dashboard: clear separation of concerns, testable units, and explicit boundaries between transport (WebSocket/HTTP), state (Pinia), and presentation (Vue components).

