import { Router } from "express";
//import { catalog, preferences as prefs, userState } from "../data/mock.js";
import {
  fetchMoviesByPreferences,
  fetchShowsByPreferences,
} from "../services/tmdb.js";
import { fetchGamesByPreferences } from "../services/igdb.js";
import { getPreferences, getWatchedIds } from "../services/db.js";

const router = Router();

router.get("/:userId", async (req, res) => {
  try {
    const p = getPreferences(req.params.userId);

    //Demonstration of filtering based on preferences
    console.log("User preferences:", p);

    if (!p) {
      console.log("No preferences found for user:");
      return res.json({ items: [] });
    }

    let allItems = [];

    //Fetch movies from TMDB API
    console.log("Fetching movie recommendations from TMDB...");
    const movies = await fetchMoviesByPreferences(p);
    console.log(`Got ${movies.length} movies from TMDB.`);
    allItems = [...allItems, ...movies];

    //Fetch shows from TMDB API
    console.log("Fetching show recommendations from TMDB...");
    const shows = await fetchShowsByPreferences(p);
    console.log(`Got ${shows.length} shows from TMDB.`);
    allItems = [...allItems, ...shows];

    //Fetch games from IGDB API
    console.log("Fetching game recommendations from IGDB...");
    const games = await fetchGamesByPreferences(p);
    console.log(`Got ${games.length} games from IGDB.`);
    allItems = [...allItems, ...games];

    console.log(`Final recommendations list: ${allItems.length} items`);

    /*if (p.gameGenres && p.gameGenres.length > 0) {
      const gameMatches = catalog.filter(
        (item) =>
          item.kind === "game" &&
          item.genres &&
          item.genres.some((g) => p.gameGenres && p.gameGenres.includes(g))
      );
      console.log(`Got ${gameMatches.length} games from mock data.`);
      allItems = [...allItems, ...gameMatches];
    }
*/

    //Filter out already watched items
    const watchedIds = getWatchedIds(req.params.userId);
    if (getWatchedIds.length > 0) {
      //const beforeCount = allItems.length;
      allItems = allItems.filter((item) => !watchedIds.includes(item.id));
      console.log(`Filtered out ${watchedIds.length} watched items.`);
    }

    res.json({ items: allItems });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

export default router;
