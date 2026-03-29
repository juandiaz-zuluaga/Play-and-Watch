import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import prefRouter from "./routes/preferences.js";
import recRouter from "./routes/recommendations.js";
import userRouter from "./routes/user.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "play&watch-api" }));

app.use("/api/auth", authRouter);
app.use("/api/preferences", prefRouter);
app.use("/api/recommendations", recRouter);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
