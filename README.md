# Play&Watch (Skeleton + US-1)

This repository contains a minimal full‑stack skeleton for **Play&Watch** plus **US‑1 (Signup/Login)** implemented as a mock.

## Stack
- Frontend: React (Vite), JS, React Router
- Backend: Node.js + Express (ES modules)
- Data: in‑memory mock objects (replace with DB later)

## Run locally
Open two terminals in VS Code:

### API
```bash
cd server
npm install
npm run dev
# http://localhost:4000/api/health
```

### Web
```bash
cd client
npm install
npm run dev
# http://localhost:5173
```

## VS Code helpers
- `.vscode/tasks.json` → run both with **Terminal ▸ Run Task ▸ dev:both**
- `.vscode/launch.json` → **Run ▸ Start Debugging ▸ Run Full Stack**

## Endpoints (mock)
- `POST /api/auth/signup` { email, password }
- `POST /api/auth/login` { email, password }
- `POST /api/preferences/:userId`
- `GET /api/preferences/:userId`
- `GET /api/recommendations/:userId`
- `POST /api/user/:userId/watched/:itemId`
- `POST /api/user/:userId/favorites/:itemId`

> Note: Authentication is intentionally simple for Sprint 1. Replace with real auth (JWT + DB) in a later sprint.
