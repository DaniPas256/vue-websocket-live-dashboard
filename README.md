## Real-Time Live Dashboard

A project created to showcase my programming skills. Check out the [DEMO](https://danipas256.github.io/live-dashboard/). 

Real-time dashboard that streams live match data from a Node/Express WebSocket backend into a Vue 3 + Pinia + TypeScript frontend.

### Architecture Overview

- **Backend (`backend`)**
  - Node.js + Express HTTP server.
  - REST API `GET /api/matches` returning the initial list of matches.
  - WebSocket server at `/ws/matches` broadcasting match updates every 1–2 seconds.

- **Frontend (`frontend`)**
  - Vite + Vue 3 + TypeScript.
  - Pinia store
  - Services for REST (`matchesApi`) and WebSocket (`useWebSocket` + `matchUpdatesChannel`).
  - Components (`MatchCard`, `MatchList`, `ToolbarFilters`) and `DashboardView` container.

### Running the Project

#### 1. Backend

```bash
cd backend
npm install
npm run dev
```

#### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

