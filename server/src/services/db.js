import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Connecting to database
const dbPath = path.join(__dirname, "../data/playwatch.db");
const db = new Database(dbPath);

console.log("Connected to the database.");

//Enabling foreign key constraints
db.pragma("foreign_keys = ON");

//User info functions
export function createUser(username, email, password) {
  const stmt = db.prepare(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
  );
  const result = stmt.run(username, email, password);
  return result.lastInsertRowid;
}

export function getUserById(userId) {
  const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
  return stmt.get(userId);
}

export function getUserByEmail(email) {
  const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
  return stmt.get(email);
}

//User preferences fucntions
export function savePreferences(userId, preferences) {
  const userIdInt = parseInt(userId);
  const userExist = db
    .prepare(`SELECT id FROM users WHERE id = ?`)
    .get(userIdInt);

  if (!userExist) {
    console.log(`Creating user ${userIdInt} in database...`);
    const stmt = db.prepare(
      `INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)`
    );
    stmt.run(
      userIdInt,
      `user_${userIdInt}`,
      `user_${userIdInt}@temp.com`,
      `temp_password`
    );
  }
  const stmt = db.prepare(`
        INSERT INTO preferences (user_id, movie_genres, year_preferences, countries, game_genres, platforms, game_modes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
        movie_genres = excluded.movie_genres,
        year_preferences = excluded.year_preferences,
        countries = excluded.countries,
        game_genres = excluded.game_genres,
        platforms = excluded.platforms,
        game_modes = excluded.game_modes,
        updated_at = CURRENT_TIMESTAMP
    `);

  stmt.run(
    userIdInt,
    JSON.stringify(preferences.movieGenres || []),
    JSON.stringify(preferences.yearPreferences || []),
    JSON.stringify(preferences.countries || []),
    JSON.stringify(preferences.gameGenres || []),
    JSON.stringify(preferences.platforms || []),
    JSON.stringify(preferences.gameModes)
  );
}

export function getPreferences(userId) {
  const userIdInt = parseInt(userId);
  const stmt = db.prepare(`SELECT * FROM preferences WHERE user_id = ?`);
  const row = stmt.get(userIdInt);

  if (!row) {
    console.log(`No preferences found for user ${userIdInt}`);
    return null;
  }
  return {
    movieGenres: JSON.parse(row.movie_genres || `[]`),
    yearPreferences: JSON.parse(row.year_preferences || `[]`),
    countries: JSON.parse(row.countries || `[]`),
    gameGenres: JSON.parse(row.game_genres || `[]`),
    platforms: JSON.parse(row.platforms || `[]`),
    gameModes: JSON.parse(row.game_modes || `[]`),
  };
}

//User watchlist / playlist functions

export function addToWatchlist(userId, itemId, itemData) {
  const userIdInt = parseInt(userId);
  const stmt = db.prepare(`
        INSERT INTO watchlist (user_id, item_id, item_data)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id, item_id) DO NOTHING
        `);
  stmt.run(userIdInt, itemId, JSON.stringify(itemData));
}

export function removeFromWatchlist(userId, itemId) {
  const userIdInt = parseInt(userId);
  const stmt = db.prepare(
    `DELETE FROM watchlist WHERE user_id = ? AND item_id = ?`
  );
  stmt.run(userIdInt, itemId);
}

export function getWatchlist(userId) {
  const userIdInt = parseInt(userId);
  const stmt = db.prepare(
    `SELECT item_id, item_data FROM watchlist Where user_id = ?`
  );
  const rows = stmt.all(userIdInt);
  return rows.map((row) => JSON.parse(row.item_data));
}

export function getWatchlistIds(userId) {
  const userIdInt = parseInt(userId);
  const stmt = db.prepare(`SELECT item_id FROM watchlist WHERE user_id = ?`);
  const rows = stmt.all(userIdInt);
  return rows.map((row) => row.item_id);
}

//User already watched / played functions

export function addToWatched(userId, itemId, itemData) {
  const userIdInt = parseInt(userId); //Convers to integer
  console.log(
    `addToWatched called with userId: ${userIdInt} (type: ${typeof userIdInt})`
  );
  try {
    const stmt = db.prepare(`
        INSERT INTO watched (user_id, item_id, item_data)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id, item_id) DO NOTHING
    `);
    const result = stmt.run(userIdInt, itemId, JSON.stringify(itemData));
    console.log(`Inserted into watched. Changes: ${result.changes}`);

    const check = db
      .prepare(`SELECT * FROM watched WHERE user_id = ? AND item_id = ?`)
      .get(userIdInt, itemId);
    console.log(`Verification check: `, check ? `FOUND` : `NOT FOUND`);
  } catch (error) {
    console.log(`Error in addToWatched:`, error);
  }
}

export function removeFromWatched(userId, itemId) {
  const userIdInt = parseInt(userId);
  const stmt = db.prepare(
    `DELETE FROM watched WHERE user_id = ? AND item_id = ?`
  );
  stmt.run(userIdInt, itemId);
}

export function getWatched(userId) {
  const userIdInt = parseInt(userId);
  console.log(
    `getWatched called with userId: ${userIdInt} (type: ${typeof userIdInt})`
  );
  const stmt = db.prepare(
    `SELECT item_id, item_data FROM watched Where user_id = ?`
  );
  const rows = stmt.all(userIdInt);
  console.log(
    `Found ${rows.length} rows in watched table for user ${userIdInt}`
  );
  console.log(`First row:`, rows[0]);
  return rows.map((row) => JSON.parse(row.item_data));
}

export function getWatchedIds(userId) {
  const userIdInt = parseInt(userId);
  const stmt = db.prepare(`SELECT item_id FROM watched WHERE user_id = ?`);
  const rows = stmt.all(userIdInt);
  return rows.map((row) => row.item_id);
}

export default db;
