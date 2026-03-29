//IGDB API Service
const CLIENT_ID = "opvllo8a242300u19t5z8d3sn3yyup"; //From Twitch dev console
const ACCESS_TOKEN = "kwnl2z84n1v8l3zh8tmf4en26hmf30";

const BASE_URL = "https://api.igdb.com/v4";
const IMAGE_BASE_URL = "https://images.igdb.com/igdb/image/upload/t_cover_big"; //For game cover images

/**
 * Fetches games from IGDB based on a search query.
 * @param {string} endpoint - The search query for the game title.
 * @param {string} query - The IGDB query string
 * @returns {Promise<Array>} - A promise that resolves to an array of game objects.
 */

async function igdbRequest(endpoint, query) {
  try {
    const url = `${BASE_URL}/${endpoint}`;
    console.log(`IGDB Request: ${endpoint}`);
    console.log(`IGDB Query: ${query}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Client-ID": CLIENT_ID,
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "text/plain",
      },
      body: query,
    });

    if (!response.ok) {
      throw new Error(`IGDB API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data from IGDB:", error);
    throw error;
  }
}

/**
 * Fetches games from IGDB based on user preferences.
 * @param {Object} preferences - The user preferences for filtering games.
 * @returns {Promise<Array>} - A promise that resolves to an array of game objects.
 */

export async function fetchGamesByPreferences(preferences) {
  const allGames = [];

  try {
    console.log("Fetching games with prefereces:", preferences);

    //Build the IGDB query based on preferences
    let queryParts = [];

    //Base fields we want to fetch
    queryParts.push(
      "fields name, cover.url, genres.name, platforms.name, release_dates.y, total_rating, summary, game_modes.name;"
    );

    //Build WHERE clauses based on preferences
    let whereConditions = [];

    //Add genre filter
    if (preferences?.gameGenres && preferences.gameGenres.length > 0) {
      const genreIds = mapGenreToIds(preferences.gameGenres);
      if (genreIds.length > 0) {
        const shuffledGenres = genreIds.sort(() => 0.5 - Math.random());
        const selectedGenres = shuffledGenres.slice(0, 2);
        whereConditions.push(`genres = (${selectedGenres.join(",")})`);
        console.log(`Using 2 game genres: [${selectedGenres}]`);
      }
    }

    //Add platform filter
    if (preferences?.platforms && preferences.platforms.length > 0) {
      const platformIds = mapPlatformToIds(preferences.platforms);
      if (platformIds.length > 0) {
        whereConditions.push(`platforms = (${platformIds.join(",")})`);
        console.log(`Using platforms: [${platformIds}]`);
      }
    }

    //Add Game mode filter
    if (preferences?.gameModes && preferences.gameModes.length > 0) {
      const gameModeIds = mapGameModeToIds(preferences.gameModes);
      if (gameModeIds.length > 0) {
        whereConditions.push(`game_modes = (${gameModeIds.join(",")})`);
        console.log(`Using game modes: [${gameModeIds}]`);
      }
    }

    //Only inclde games with rating
    whereConditions.push("rating > 0");

    //Only incliude games with cover art
    whereConditions.push("cover != null");

    //Combine WHERE conditions
    if (whereConditions.length > 0) {
      queryParts.push(`where ${whereConditions.join(" & ")};`);
    }

    //Sort by rating (higers rated fames first)
    queryParts.push("sort rating desc;");

    //Fetch 10 pages of 20
    const totalGamesToFetch = 200;
    const gamesPerRequest = 20;
    const numRequests = Math.ceil(totalGamesToFetch / gamesPerRequest);

    for (let i = 0; i < numRequests; i++) {
      const offset = i * gamesPerRequest;
      const limitQuery = `limit ${gamesPerRequest}; offset ${offset};`;

      //Combine all query parts
      let fullQuery = [...queryParts, limitQuery].join(" ");

      const data = await igdbRequest("games", fullQuery);

      if (data && data.length > 0) {
        const games = data.map((game) => ({
          id: `g${game.id}`,
          kind: "game",
          title: game.name,
          genres: game.genres ? game.genres.map((g) => g.name) : [],
          year:
            game.release_dates && game.release_dates[0]
              ? game.release_dates[0].y
              : null,
          rating: game.rating ? game.rating / 10 : null,
          poster:
            game.cover && game.cover.url
              ? game.cover.url.replace("t_thumb", "t_cover_big")
              : null,
          overview: game.summary || "No description available.",
          platforms: game.platforms ? game.platforms.map((p) => p.name) : [],
          rating: game.total_rating ? Math.round(game.total_rating) / 10 : null,
        }));

        allGames.push(...games);
      }

      if (!data || data.length < gamesPerRequest) {
        break; //No more results
      }
    }
    console.log(`Fetched ${allGames.length} games from IGDB.`);
  } catch (error) {
    console.error("Error fetching games by preferences:", error);
    return [];
  }

  const shuffled = allGames.sort(() => 0.5 - Math.random());
  return shuffled;
}

/**
 * *Helper functions to map genre, platform, and game mode names to IGDB IDs
 * @param {Array<string>} genresNames - Array of genre names
 * @returns {Array<number>} - Array of genre IDs
 */

function mapGenreToIds(genresNames) {
  const genreMap = {
    "Action RPG": 25,
    Adventure: 31,
    Arcade: 33,
    Fighting: 4,
    "First-Person Shooter": 5,
    Indie: 32,
    MMORPG: 14,
    MOBA: 36,
    Platformer: 8,
    "Point-and-Click": 2,
    Puzzle: 9,
    Racing: 10,
    "Real-Time Strategy": 11,
    RPG: 12,
    Shooter: 5,
    Simulation: 13,
    Sports: 14,
    Strategy: 15,
    "Survival Horror": 34,
    "Tactical RPG": 24,
    "Turn-Based Strategy": 16,
    "Visual Novel": 34,
  };

  const ids = genresNames
    .map((name) => genreMap[name])
    .filter((id) => id !== undefined);
  return [...new Set(ids)]; //Remove duplicates
}

/**
 * Map platform names to IGDB platform IDs
 * @param {Array<string>} platformNames - Array of platform names
 * @returns {Array<number>} - Array of platform IDs
 */

function mapPlatformToIds(platformNames) {
  const platformMap = {
    PlayStation: [167, 48, 9], //PS5, PS4, PS3
    Xbox: [169, 49, 12], //Xbox Series X, Xbox One, Xbox 360
    PC: [6],
    Nintendo: [130, 41, 37], //Switch, Wii U, Nintendo 3DS
    Mobile: [34, 39], //iOS, Android
  };

  const ids = platformNames
    .flatMap((name) => platformMap[name] || [])
    .filter((id) => id !== undefined);
  return [...new Set(ids)]; //Remove duplicates
}

/**
 * Map game mode names to IGDB game mode IDs
 * @param {Array<string>} gameModeNames - Array of game mode names
 * @returns {Array<number>} - Array of game mode IDs
 */

function mapGameModeToIds(gameModeNames) {
  const gameModeMap = {
    "Single Player": 1,
    Multiplayer: 2,
    "Co-op": 3,
    "Split Screen": 4,
    MMO: 5,
  };

  const ids = gameModeNames
    .map((name) => gameModeMap[name])
    .filter((id) => id !== undefined);
  return [...new Set(ids)]; //Remove duplicates
}

export default {
  fetchGamesByPreferences,
};
