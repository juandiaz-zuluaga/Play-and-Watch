// Vite exposes env vars prefixed with VITE_ via import.meta.env.
// Locally (no .env set), this falls back to localhost so `npm run dev`
// keeps working exactly as before. In production, VITE_API_URL will be
// set to the real deployed backend URL (set in Vercel's project settings).
const BASE = (import.meta.env.VITE_API_URL || "http://localhost:4000") + "/api";

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  delete: (path) => request(path, { method: "DELETE" }),
};
