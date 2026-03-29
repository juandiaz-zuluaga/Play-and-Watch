import { Router } from "express";
import {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  getWatchlistIds,
  addToWatched,
  removeFromWatched,
  getWatched,
  getWatchedIds,
} from "../services/db.js";

const router = Router();

/*function ensureState(userId) {
  if (!userState[userId])
    userState[userId] = { watched: new Map(), favorites: new Map() };
  return userState[userId];
}*/

// Mark item as watched
router.post("/:userId/watched/:itemId", (req, res) => {
  /*const st = ensureState(req.params.userId);
  const { itemId } = req.params;
  const itemData = req.body;*/
  const { userId, itemId } = req.params;
  const itemData = req.body;

  //Store full item data for reference
  addToWatched(userId, itemId, itemData);
  removeFromWatchlist(userId, itemId); //Remove from favorites if present

  console.log(`Added item ${itemId} to watched for user ${userId}`);
  res.json({ ok: true, watched: getWatchedIds(userId) });
});

// Unmark item as watched
router.delete("/:userId/watched/:itemId", (req, res) => {
  /*const st = ensureState(req.params.userId);
  const { itemId } = req.params;*/
  const { userId, itemId } = req.params;

  removeFromWatched(userId, itemId);
  console.log(`Removed item ${itemId} from watched for user ${userId}`);
  res.json({ ok: true, watched: getWatchedIds(userId) });
});

// GET watched list return full item data
router.get("/:userId/watched", (req, res) => {
  /*const st = ensureState(req.params.userId);
  const items = Array.from(st.watched.values());*/
  const { userId } = req.params;
  const items = getWatched(userId);

  console.log(`Fetching ${items.length} watched items for user ${userId}`);
  res.json({ items });
});

// Add item to favorites
router.post("/:userId/favorites/:itemId", (req, res) => {
  /*const st = ensureState(req.params.userId);
  const { itemId } = req.params;
  const itemData = req.body;
  //Store full item data for reference*/
  const { userId, itemId } = req.params;
  const itemData = req.body;

  addToWatchlist(userId, itemId, itemData);

  console.log(`Added item ${itemId} to favorites for user ${userId}`);
  res.json({ ok: true, favorites: getWatchlistIds(userId) });
});

// Remove item from favorites
router.delete("/:userId/favorites/:itemId", (req, res) => {
  /*const st = ensureState(req.params.userId);
  const { itemId } = req.params;
  st.favorites.delete(itemId);*/
  const { userId, itemId } = req.params;

  removeFromWatchlist(userId, itemId);

  console.log(`Removed item ${itemId} from favorites for user ${userId}`);
  res.json({ ok: true, favorites: getWatchlistIds(userId) });
});

// Get Watchlist
router.get("/:userId/favorites", (req, res) => {
  /*const st = ensureState(req.params.userId);
  const items = Array.from(st.favorites.values());*/
  const { userId } = req.params;
  const items = getWatchlist(userId);

  console.log(`Fetching ${items.length} favorite items for user ${userId}`);
  res.json({ items });
});

router.get("/:userId/state", (req, res) => {
  const { userId } = req.params;

  //return arrays of IDs
  res.json({
    favorites: getWatchlistIds(userId),
    watched: getWatchedIds(userId),
  });
});

export default router;
