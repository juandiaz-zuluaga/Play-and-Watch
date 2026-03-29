import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

try {
  console.log("Initializing database creation...");

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  //Creating the database file
  const dbPath = path.join(__dirname, "playwatch.db");
  const db = new Database(dbPath);

  console.log(`Creatung the database tables`);

  //User Tables Creation
  db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

  //Preferences table creation
  db.exec(`
  CREATE TABLE IF NOT EXISTS preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    movie_genres TEXT,
    year_preferences TEXT,
    countries TEXT,
    game_genres TEXT,
    platforms TEXT,
    game_modes TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id)
)`);

  //Watchlist table creation
  db.exec(`
    CREATE TABLE IF NOT EXISTS watchlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    item_id TEXT NOT NULL,
    item_data TEXT NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
    UNIQUE(user_id, item_id)
    )
`);

  //Watched table creation
  db.exec(`
    CREATE TABLE IF NOT EXISTS watched (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    item_id TEXT NOT NULL,
    item_data TEXT NOT NULL,
    watched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, item_id)
    )
`);

  console.log("Database tables created successfully.");
  console.log(`Database file located at: ${dbPath}`);

  db.close();
} catch (error) {
  console.error("Error initializing database:", error.message);
  console.error(`Full error`, error);
  process.exit(1);
}
