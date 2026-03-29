import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api"; //API service backend requests
import ItemCard from "../Components/ItemCard"; //Card component to display each item

export default function Home() {
  const navigate = useNavigate(); //Allows to direct users

  //Gets the userId from the browsers local storage which is saved during the login
  //If the user is not logged in this will be null
  const userId = localStorage.getItem("userId");

  //State to store array of recommendations fetched from API
  const [allItems, setAllItems] = useState([]);

  const [filteredItems, setFilteredItems] = useState([]);

  const [activeTab, setActiveTab] = useState("all"); //State to track which tab is active: all, movies, shows, games

  //State to tracj whether we are currently loading data
  const [loading, setLoading] = useState(true);

  const [watchlistIds, setWatchlistIds] = useState(new Set()); //Array of IDs of items in the user's watchlist

  //Checks if the uer is logged in, if not i tredirects to log in
  useEffect(() => {
    if (!userId) {
      navigate("/login"); //If user id not found redirect to login
    }
  }, [userId, navigate]); //Re-run if userId or navigate changes

  //Fetch users watchlist to track which items are stared
  const fetchWatchlist = async () => {
    if (!userId) {
      return; //If no userId dont fetch
    }

    try {
      const res = await api.get(`/user/${userId}/state`); //Get user state from backend
      const favoriteIds = new Set(res.favorites || []); //Get array of favorite IDs or empty array if null
      setWatchlistIds(favoriteIds); //Update state with the set of favorite IDs
    } catch (error) {
      console.error("Error fetching watchlist: ", error);
    }
  };

  //Fuction to fetch recommendations from backend
  const fetchRecommendations = async () => {
    if (!userId) {
      return; // If theres no userId, dont fetch
    }

    try {
      setLoading(true);

      //Make the request to the API
      const res = await api.get(`/recommendations/${userId}`);

      //Update item states with the fetched data
      setAllItems(res.items || []); //res.items comes from back end and || and [] means to put the empty array in the case that re.items is null
    } catch (error) {
      //If API call fails for some reason
      console.error("Error fetching recommendations: ", error); //Log error for debugging
      setAllItems([]); //Set items to empty array
    } finally {
      //finally blocks always tuns, whether try succeeded or catch failed
      setLoading(false);
    }
  };

  //useEffect ti fetch recommendatons when components loads
  useEffect(() => {
    fetchWatchlist(); //Fetch the user's watchlist
    fetchRecommendations(); //Call the fetch function
  }, [userId]); //Rerun if userId changes

  //Filter items when tab changes or items update
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredItems(allItems);
    } else {
      setFilteredItems(allItems.filter((item) => item.kind === activeTab));
    }
  }, [activeTab, allItems]);

  //Function called when user clicks the start to add to favorites
  const handleAddToWatchlist = async (item) => {
    //id = the ID of the movie/game being pressed

    if (!userId) {
      return; //Dont proceed if user not logged in
    }

    try {
      //Check if already in watchlist
      if (watchlistIds.has(item.id)) {
        await api.delete(`/user/${userId}/favorites/${id}`); //Remove from watchlist

        //Update local state
        setWatchlistIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(item.id);
          return newSet;
        });

        alert("Removed from watchlist!");
      } else {
        //Make a POST request to add items to user's favorites
        await api.post(`/user/${userId}/favorites/${item.id}`, {
          id: item.id,
          kind: item.kind,
          title: item.title,
          genres: item.genres,
          year: item.year,
          rating: item.rating,
          poster: item.poster,
          image: item.poster,
          overview: item.overview,
          platforms: item.platforms,
        });

        setWatchlistIds((prev) => new Set([...prev, item.id])); //Update local state to include new favorite

        //Shows a success message
        alert("Added to watchlist!");
      }
    } catch (error) {
      //If API call fails
      console.error("Error adding to favorites", error); // Log error
      alert("Failed to add to favorites");
    }
  };

  //Function call when user clicks the checkmark to makr as watched/played
  const handleMarkWatched = async (item) => {
    if (!userId) {
      return;
    }

    try {
      //Make a POST request to mark item as watched/played
      await api.post(`/user/${userId}/watched/${item.id}`, {
        id: item.id,
        kind: item.kind,
        title: item.title,
        genres: item.genres,
        year: item.year,
        rating: item.rating,
        poster: item.poster,
        image: item.poster,
        overview: item.overview,
        platforms: item.platforms,
      });

      //Remove from watchlist if it was there
      if (watchlistIds.has(item.id)) {
        setWatchlistIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(item.id);
          return newSet;
        });
      }

      setAllItems((prevItems) => prevItems.filter((i) => i.id !== item.id));

      //Refresh recomendations after marking as watched
      //Card should disappear from the list

      alert("Marked as watched/played!");

      //await fetchRecommendations(); Item stais visible intil page reloads
    } catch (error) {
      console.error("Error making as watched/played: ", error);
      alert("Failed to mark as watched/played");
    }
  };

  //If still loading, show loading message
  if (loading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Loading Recommendations...</h1>
      </div>
    );
  }

  //Main content: Show recommendations

  return (
    <div style={styles.container}>
      {" "}
      {/*Main container with max width and centering*/}
      {/*Header Section*/}
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome user!</h1>

        <p style={styles.subtitle}>
          Here we have some recommendaions based on your preferences.
        </p>
      </div>
      {/*Tab Navigation*/}
      <div style={styles.tabContainer}>
        {/*Button for all of the options */}
        <button
          onClick={() => setActiveTab("all")}
          style={activeTab === "all" ? styles.activeTab : styles.tab}
        >
          {" "}
          All
        </button>
        {/*Button for movies */}
        <button
          onClick={() => setActiveTab("movie")}
          style={activeTab === "movie" ? styles.activeTab : styles.tab}
        >
          {" "}
          Movies
        </button>
        {/*Button for shows */}
        <button
          onClick={() => setActiveTab("show")}
          style={activeTab === "show" ? styles.activeTab : styles.tab}
        >
          {" "}
          Shows
        </button>
        {/*Button for games */}
        <button
          onClick={() => setActiveTab("game")}
          style={activeTab === "game" ? styles.activeTab : styles.tab}
        >
          {" "}
          Games
        </button>
      </div>
      {/*Check if we have items to display */}
      {filteredItems.length === 0 ? (
        //If there is no items show this message
        <p style={styles.noResults}>
          No recommendations found. Try updating your preferences!
        </p>
      ) : (
        //If we have itmes, show the cards in a grid
        <div style={styles.grid}>
          {/*CSS grid container */}

          {/*.map() loops through array and creates a JSX file for each item, and for each item it creates a ItemCard component */}
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onAddToFavorites={() => handleAddToWatchlist(item)}
              onMarkWatched={() => handleMarkWatched(item)}
              isInWatchlist={watchlistIds.has(item.id)} //Tells if itemCard i start button should be active or not
            />
          ))}
        </div>
      )}
    </div>
    /*<section>
      <h1>Play&Watch</h1>
      <p>Find your next movie, show, or game based on your tastes.</p>
    </section>*/
  );
}

//CSS-in-JS styles
const styles = {
  //Main container
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "40px 24px",
  },

  //Header Section
  header: {
    marginBottom: 30,
  },

  //Main title
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },

  //Subtitle text
  subtitle: {
    fontSuze: 16,
    color: "#666",
    margin: 0,
  },

  //Message when showing no results
  noResults: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 40,
  },

  //Grid Container for cards
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", //Creates responsive Columns
    gap: 24,
    justifyItems: "center",
    marginTop: 20,
  },

  //Tab Navigation container
  tabContainer: {
    display: "flex",
    gap: 10,
    marginBottom: 16,
  },

  //Individual tab style
  tab: {
    padding: "6px 14px",
    borderRadius: 6,
    background: "white",
    border: "1px solid #666",
    cursor: "pointer",
    transition: "background 0.2s ease",
    fontSize: "15px",
  },

  //Active tab style
  activeTab: {
    padding: "6px 14px",
    fontSize: "15px",
    background: "#ddd",
    border: "1px solid #666",
    borderRadius: 6,
    cursor: "pointer",
  },
};
