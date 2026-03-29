import { Router } from "express";
import { users } from "../data/mock.js";

const router = Router();

router.post("/signup", (req, res) => {
  const { userName, email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: "email & password required" });
  if (users.find((u) => u.email === email))
    return res.status(409).json({ error: "email exists" });
  if (users.find((u) => u.userName === userName))
    return res.status(400).json({ error: "Username already etaken" });
  const user = { id: Date.now().toString(), userName, email, password };
  users.push(user);
  res.json({
    user: { id: user.id, userName: user.userName, email: user.email },
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "invalid credentials" });
  res.json({
    user: { id: user.id, userName: user.userName, email: user.email },
  });
});

export default router;
