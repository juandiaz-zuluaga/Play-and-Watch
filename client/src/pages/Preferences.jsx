import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

//Genre options
const MOVIE_GENRES = [
  "Horror",
  "Action",
  "Thriller",
  "Sci-Fi",
  "Drama",
  "Comedy",
  "Romance",
  "Western",
  "Fantasy",
  "Adventure",
  "Animation",
  "Musical",
  "Mystery",
  "Documentary",
  "Sports",
  "Christmas",
  "History",
  "Family",
  "War",
  "Crime",
  "Biography",
];

const GAME_GENRES = [
  "Action RPG",
  "Adventure",
  "Simulation",
  "Figthing",
  "Puzzle",
  "Sports",
  "Racing",
  "Survival",
  "Shooter",
  "Strategy",
  "PLatformer",
  "Open World",
  "Battle Royale",
  "Souls-Like",
  "Fantasy",
  "Indie",
  "FPS",
  "Horror",
  "MMORPG",
];

const YEAR_RANGES = [
  "Before 1980",
  "1980s",
  "1990s",
  "2000s",
  "2010s",
  "2020s",
];

const COUNTRIES = [
  "USA",
  "UK",
  "Japan",
  "Korea",
  "India",
  "France",
  "Spain",
  "Latin-America",
  "Germany",
  "Turkey",
  "Italy",
  "Canada",
  "Australia",
  "China",
  "Russia",
];

const PLATFORMS = ["PlayStation", "Xbox", "Nintendo", "PC", "Mobile", "VR"];

const GAME_MODES = ["Single Player", "Multiplayer", "Co-op", "MMO"];

export default function Preferences() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  //State for movie preferences
  const [movieGenres, setMovieGenres] = useState([]);
  const [yearPreferences, setYearPreferences] = useState([]);
  const [countries, setCountries] = useState([]);
  //State for game preferences
  const [gameGenres, setGameGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [gameModes, setGameModes] = useState([]);

  //Load if existingn
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    api
      .get(`/preferences/${userId}`)
      .then((p) => {
        if (p) {
          setMovieGenres(p.movieGenres || []);
          setYearPreferences(p.yearPreferences || []);
          setCountries(p.countries || []);
          setGameGenres(p.gameGenres || []);
          setPlatforms(p.platforms || []);
          setGameModes(p.gameModes || []);
          /*setType(p.type || "movie");
          setGenres(p.genres || []);
          setMood(p.mood || "");
          setYearRange(p.yearRange || [1990, 2025]);*/
        }
      })
      .catch(() => {});
  }, [userId, navigate]);

  //Toggle selection functions
  const toggleMovieGenre = (genre) => {
    setMovieGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const toggleYearPreference = (year) => {
    setYearPreferences((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  const toggleCountry = (country) => {
    setCountries((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country]
    );
  };

  const toggleGameGenre = (genre) => {
    setGameGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const togglePlatform = (platform) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const toggleGameMode = (mode) => {
    setGameModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  //Save preferences function
  const savePreferences = async () => {
    if (!userId) {
      alert("Please log in first.");
      return;
    }

    //Validare some of the preferences selected
    if (movieGenres.length === 0 && gameGenres.length === 0) {
      alert("Please select at least one movie or game genre.");
      return;
    }

    try {
      await api.post(`/preferences/${userId}`, {
        movieGenres,
        yearPreferences,
        countries,
        gameGenres,
        platforms,
        gameModes,
      });

      alert("Preferences saved successfully.");
      navigate("/"); // Go to the homepage
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences. Please try again.");
    }
  };

  /*const save = async () => {
    if (!userId) return alert("Please log in first.");
    await api.post(`/preferences/${userId}`, { type, genres, mood, yearRange });
    alert("Saved preferences.");
  };
  
  Edited and commendte this by Juan Diaz 11/07*/

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Tell us more about you...</h1>

        {/* Movie Preferences Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Movie Preferences</h2>

          {/* Movie Genres */}
          <div style={styles.questionblock}>
            <p style={styles.question}>
              What is/are your favroite type of genre for movies?
            </p>
            <div style={styles.buttongGrid}>
              {MOVIE_GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => toggleMovieGenre(genre)}
                  style={
                    movieGenres.includes(genre)
                      ? styles.selectedButton
                      : styles.button
                  }
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Year Preferences */}
          <div style={styles.questionblock}>
            <p style={styles.question}>From what year(s) you prefer movies?</p>
            <div style={styles.buttongGrid}>
              {YEAR_RANGES.map((year) => (
                <button
                  key={year}
                  onClick={() => toggleYearPreference(year)}
                  style={
                    yearPreferences.includes(year)
                      ? styles.selectedButton
                      : styles.button
                  }
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Country Preferences*/}
          <div style={styles.questionblock}>
            <p style={styles.question}>
              From what country/Region you like movies?
            </p>
            <div style={styles.buttongGrid}>
              {COUNTRIES.map((country) => (
                <button
                  key={country}
                  onClick={() => toggleCountry(country)}
                  style={
                    countries.includes(country)
                      ? styles.selectedButton
                      : styles.button
                  }
                >
                  {country}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/*Video Game Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Video Game Preferences</h2>

          {/* Game Genres */}
          <div style={styles.questionblock}>
            <p style={styles.question}>
              What is/are your favroite type of games?
            </p>
            <div style={styles.buttongGrid}>
              {GAME_GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => toggleGameGenre(genre)}
                  style={
                    gameGenres.includes(genre)
                      ? styles.selectedButton
                      : styles.button
                  }
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div style={styles.questionblock}>
            <p style={styles.question}>
              On what platform(s) do you usually play?
            </p>
            <div style={styles.buttongGrid}>
              {PLATFORMS.map((platform) => (
                <button
                  key={platform}
                  onClick={() => togglePlatform(platform)}
                  style={
                    platforms.includes(platform)
                      ? styles.selectedButton
                      : styles.button
                  }
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* Game Modes */}
          <div style={styles.questionblock}>
            <p style={styles.question}>What game modes do you prefer?</p>
            <div style={styles.buttongGrid}>
              {GAME_MODES.map((mode) => (
                <button
                  key={mode}
                  onClick={() => toggleGameMode(mode)}
                  style={
                    gameModes.includes(mode)
                      ? styles.selectedButton
                      : styles.button
                  }
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/*Navigation Buttons */}
        <div style={styles.navigationButtons}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            Back
          </button>

          <button onClick={savePreferences} style={styles.saveButton}>
            Save Preferences
          </button>
        </div>

        <p style={styles.footerNote}>
          You will be able to change your preferences in your profile section
        </p>
      </div>
    </div>
    /*<h2>Preferences</h2>
      <label>Type: </label>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="movie">Movie</option>
        <option value="show">Show</option>
        <option value="game">Game</option>
      </select>

      <div style={{ marginTop: 8 }}>
        <label>Genres (comma-separated): </label>
        <input
          value={genres.join(",")}
          onChange={(e) =>
            setGenres(
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
        />
      </div>

      <div style={{ marginTop: 8 }}>
        <label>Mood: </label>
        <input value={mood} onChange={(e) => setMood(e.target.value)} />
      </div>

      <div style={{ marginTop: 8 }}>
        <label>Year Range: </label>
        <input
          style={{ width: 80 }}
          value={yearRange[0]}
          onChange={(e) =>
            setYearRange([+e.target.value || 1990, yearRange[1]])
          }
        />
        {" - "}
        <input
          style={{ width: 80 }}
          value={yearRange[1]}
          onChange={(e) =>
            setYearRange([yearRange[0], +e.target.value || 2025])
          }
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={save}>Save</button>
      </div>
    </div>
  );
} Edited and commended all of that by juan diaz*/
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "40px 20px",
  },

  content: {
    maxWidth: "900px",
    margin: "0 auto",
  },

  title: {
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 40,
    textAlign: "center",
    color: "#000",
  },

  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: "30px",
    marginBottom: 30,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    color: "#000",
    borderBottom: "2px solid #ae2323",
    paddingBottom: 10,
  },

  questionblock: {
    marginBottom: 30,
  },

  question: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 15,
    color: "#333",
  },

  buttongGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 12,
  },

  button: {
    padding: "10px 16px",
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    backgroundColor: "#fff",
    border: "2px solid #ddd",
    borderRadius: 8,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  selectedButton: {
    padding: "10px 16px",
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#ae2323",
    border: "2px solid #ae2323",
    borderRadius: 8,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  navigationButtons: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    marginTop: 20,
  },

  backButton: {
    padding: "12px 30px",
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    backgroundColor: "#fff",
    border: "2px solid #ddd",
    borderRadius: 8,
    cursor: "pointer",
  },

  saveButton: {
    padding: "12px 30px",
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#ae2323",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },

  footerNote: {
    textAlign: "center",
    fontSize: 13,
    color: "#666",
    marginTop: 20,
  },
};
