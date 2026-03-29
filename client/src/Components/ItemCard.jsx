import React from "react";
export default function ItemCard({
  item,
  onAddToFavorites,
  onMarkWatched,
  isInWatchlist,
}) {
  return (
    <div style={styles.card}>
      {/*Movie or Game image*/}
      <div style={styles.imageContainer}>
        <img
          src={
            item.poster ||
            item.image ||
            "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
          }
          alt={item.title || item.name}
          style={styles.image}
        />
      </div>

      {/*Info Section */}
      <div style={styles.cardInfo}>
        <div style={styles.topRow}>
          <p style={styles.itemName}> {item.title || item.name || "Unknown"}</p>
          <span style={styles.rating}>
            {item.rating || item.vote_average || "N/A"}
          </span>
        </div>

        {/*Icon Section */}
        <div style={styles.iconRow}>
          {/*Favorites Button PLACEHOLDER */}
          <button
            onClick={() => onAddToFavorites(item.id)}
            style={isInWatchlist ? styles.iconButtonActive : styles.iconButton}
            title={isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
          >
            {isInWatchlist ? "★" : "☆"}
          </button>{" "}
          {/*/It is not functional or implemented yet  
          {/*Rating of movie / game 
          <span style={styles.rating}>
            ☆ {item.rating || item.vote_average || "N/A"}
          </span> /*}

          {/*Already watched button PLACEHOLDER */}
          <button
            onClick={() => onMarkWatched(item.id)}
            style={styles.iconButton}
            title="Mark as watched/played"
          >
            {" "}
            {/*It is not funtional or implemented yet  */}✓
          </button>
        </div>
      </div>
    </div>
  );
}
{
  /*Styling for the item cards of the movies and games */
}

const styles = {
  card: {
    width: "200px",
    border: "2px solid #ddd",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    transition: "transfor 0.2 ease, box-shadow 0.2s ease",
    cursor: "pointer",
  },

  imageContainer: {
    width: "100%",
    height: "280px",
    backgroundColor: "#f0f0f0",
    display: "flex",
    alingItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  cardInfo: {
    padding: "12px",
    //borderTop: "1px solid #ddd",
  },

  itemName: {
    fontSize: 15,
    fontWeight: "600",
    margin: 0,
    color: "#000",
    textAlign: "left",
    flex: 1,
    /*overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    */
    lineHeight: "1.3",
    wordBreaking: "break-word",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alingItems: "center",
    marginBottom: 0,
    gap: 8,
  },

  iconRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },

  iconButton: {
    background: "none",
    border: "none",
    fontSize: 20,
    cursor: "pointer",
    padding: 4,
    transition: "transform 0.2s ease",
    color: "#666",
  },

  iconButtonActive: {
    background: "none",
    border: "none",
    fontSize: 20,
    cursor: "pointer",
    padding: 4,
    transition: "transform 0.2s ease",
    color: "#ffd700",
  },

  rating: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
};
