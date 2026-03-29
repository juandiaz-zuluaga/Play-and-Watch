import { Router } from "express";
import { preferences } from "../data/mock.js";
import { getPreferences, savePreferences } from "../services/db.js";

const router = Router();
//Save user preferences
router.post("/:userId", (req, res) => {
  //res.json(preferences[req.params.userId] || null);
  const userId = req.params.userId;
  const preferences = req.body;

  console.log("Saved preferences for user", userId);
  console.log("preferences: ", preferences);

  savePreferences(userId, preferences);
  res.json({ ok: true });
});

//Get user preferences
router.get("/:userId", (req, res) => {
  const userId = req.params.userId;
  const preferences = getPreferences(userId);

  if (!preferences) {
    return res.json({});
  }

  res.json(preferences);
});

export default router;
