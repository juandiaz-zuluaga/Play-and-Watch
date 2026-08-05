// This must be the very first import. ES module imports are evaluated in
// order before any other code runs, and tmdb.js/igdb.js read process.env
// as soon as they're imported (via the auth/preferences/recommendations
// routers below) — so dotenv has to be loaded before any of those imports.
import "dotenv/config";

import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import prefRouter from "./routes/preferences.js";
import recRouter from "./routes/recommendations.js";
import userRouter from "./routes/user.js";

const app = express();

// Allow both local dev and the real deployed frontend to talk to this API.
// FRONTEND_URL gets set in your hosting provider's environment variables
// once the frontend is deployed (e.g. https://play-and-watch.vercel.app).
const allowedOrigins = ["http://localhost:5173"];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) =>
  res.json({ ok: true, service: "play&watch-api" }),
);

app.use("/api/auth", authRouter);
app.use("/api/preferences", prefRouter);
app.use("/api/recommendations", recRouter);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`API listening on http://localhost:${PORT}`),
);
