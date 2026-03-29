import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Watchlist() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");

  const fatchFav = async () => {
    if (!userId) return alert("Please log in first.");
    const res = await api.get(`/user/${userId}/favorites`);
    setItems(res.items || []);
  };

  const removeFav = async (id) => {
    if (!userId) return;
    await api.delete(`/user/${userId}/favorites/${id}`);
    setItems(items.filter((i) => i.id !== id));
    alert("Removed from favorites.");
  };

  //NEW FUNCTION Juan Diaz - 11/18: Mark item as already watched
  const markAsWatched = async (item) => {
    if (!userId) {
      return;
    }

    try {
      //Add to watchlist
      await api.post(`/user/${userId}/watched/${item.id}`, {
        id: item.id,
        kind: item.kind,
        title: item.title,
        genre: item.genre,
        year: item.year,
        rating: item.rating,
        poster: item.poster,
        image: item.image || item.poster,
        overview: item.overview,
        platforms: item.platforms,
      });
      //Remove from watchlist
      await api.delete(`/user/${userId}/favorites/${item.id}`);

      //Update UI
      setItems(items.filter((i) => i.id !== item.id));

      alert(`${item.title} marked as watched/played!`);
    } catch (error) {
      console.error("Error marking as watched/played:", error);
      alert("Failed to mark as watched/played");
    }
  };

  // Handles changes in the filter type
  const handleFilterChange = (type) => {
    const map = {
      all: "all",
      movies: "movie",
      shows: "show",
      games: "game",
    };
    setFilter(map[type]);
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
    fatchFav();
  }, [userId, navigate]);

  const filteredItems =
    filter === "all" ? items : items.filter((i) => i.kind === filter);

  // Display title based on filter type
  const currentTitle =
    filter === "all"
      ? "All Items"
      : filter === "movie"
      ? "Movies"
      : filter === "show"
      ? "Shows"
      : "Games";

  return (
    <div style={styles.container}>
      {/* Main page title */}
      <h1 style={styles.mainTitle}>Watchlist / Playlist</h1>

      {/* Toggle button for Movies, TV, and Games */}
      <div style={styles.buttonRow}>
        {["all", "movies", "shows", "games"].map((type) => (
          <button
            key={type}
            onClick={() => handleFilterChange(type)}
            style={{
              ...styles.button,
              background:
                filter ===
                { all: "all", movies: "movie", shows: "show", games: "game" }[
                  type
                ]
                  ? "#ddd"
                  : "white",
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Current category title */}
      <h2 style={styles.sectionTitle}>{currentTitle}</h2>

      {/* Favorited content */}
      {filteredItems.length === 0 ? (
        <p style={{ textAlign: "left" }}>You have no favorites yet.</p>
      ) : (
        <div style={styles.grid}>
          {filteredItems.map((i) => (
            <div key={i.id} style={styles.card}>
              <img
                src={
                  i.image ||
                  "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
                }
                alt={i.title}
                style={styles.image}
              />
              <div style={{ marginTop: 8 }}>
                <strong>{i.title}</strong>
              </div>
              <div style={{ color: "#555", fontSize: 14 }}>
                Rating: {i.rating ?? "N/A"}
              </div>
              <button
                onClick={() => removeFav(i.id)}
                style={styles.removeButton}
              >
                Remove from list
              </button>

              {/*NEW Already watched / played button */}
              <button
                onClick={() => markAsWatched(i)}
                style={styles.watchedButton}
              >
                {" "}
                Already Watched / Played{" "}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
  },
  mainTitle: {
    textAlign: "left",
    fontSize: "50px",
    fontWeight: "bold",
    marginBottom: "24px",
  },
  buttonRow: {
    textAlign: "left",
    marginBottom: "16px",
  },
  button: {
    padding: "6px 14px",
    marginRight: 10,
    borderRadius: 6,
    border: "1px solid #666",
    background: "white",
    cursor: "pointer",
    fontSize: "15px",
  },
  sectionTitle: {
    textAlign: "left",
    fontSize: "28px",
    marginBottom: "16px",
    fontWeight: "600",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 16,
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: 10,
    textAlign: "center",
    background: "#fafafa",
  },
  image: {
    width: "100%",
    borderRadius: 8,
  },
  removeButton: {
    marginTop: 8,
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid #666",
    background: "white",
    cursor: "pointer",
    width: "100%",
  },

  watchedButton: {
    marginTop: 8,
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid #666",
    background: "white",
    cursor: "pointer",
    width: "100%",
  },
};
