//TMDB API Service
const API_KEY = "b98260293b8dcf13c5a9a67f90fbd3f0"; //API key
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"; //Poster Images

/**
 * Makes a reqeust to the TMDB API
 * @param {string} endpoint - The API endpoint to call
 * @param {object} params - Query parameters as key-value pairs
 * @returns {Promise<object>} - The JSON response from the API
 */

async function tmdbRequest(endpoint, params = {}) {
  try {
    //Add API key to parameters
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      ...params,
    });

    const url = `${BASE_URL}${endpoint}?${queryParams}`;
    console.log("TMDB Request URL:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`TMDB API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("TMDB API Error:", error);
    throw error;
  }
}

/**
 * Fetches movie based on user preferences
 * @param {object} preferences - User preferences (genres, years, countries)
 * @returns {Promise<Array>} - List of recommended movies
 */
export async function fetchMoviesByPreferences(preferences) {
  const allMovies = [];
  try {
    console.log("Fetching movies with preferences:", preferences);

    const params = {
      language: "en-US",
      sort_by: "vote_count.desc",
      include_adult: "false",
      page: 1,
    };

    //Add genre filter if user selected movie genres
    if (preferences?.movieGenres && preferences.movieGenres.length > 0) {
      //Map our genre names to TMDB genre IDs
      const genreIds = mapGenreToIds(preferences.movieGenres, "movie");
      if (genreIds.length > 0) {
        const shuffledGenres = genreIds.sort(() => 0.5 - Math.random());
        const selectedGenres = shuffledGenres.slice(0, 2); //TMDB allows up to 3 genres for filtering
        params.with_genres = selectedGenres.join(",");
        console.log(`Using 2 random movie genres ${selectedGenres}`);
      }
    }

    //Add year filter if user selected year preferences
    if (
      preferences?.yearPreferences &&
      preferences.yearPreferences.length > 0
    ) {
      const yearRange = getYearRange(preferences.yearPreferences);
      if (yearRange.min) {
        params["primary_release_date.gte"] = `${yearRange.min}-01-01`;
      }
      if (yearRange.max) {
        params["primary_release_date.lte"] = `${yearRange.max}-12-31`;
      }
    }

    if (preferences?.countries && preferences.countries.length > 0) {
      const countryCodes = mapCountriesToCodes(preferences.countries);
      if (countryCodes.length > 0) {
        params.with_origin_country = countryCodes.join("|");
      }
    }

    //Fetch movies from TMDB
    const pagesToFetch = 10; //Fetch 2 pages to get more results

    for (let page = 1; page <= pagesToFetch; page++) {
      const pageParams = { ...params, page };
      /*console.log(`Fetching page ${page} of movies from TMDB...`);*/
      const data = await tmdbRequest("/discover/movie", pageParams);

      //Format the result to match out app structure
      if (data.results && data.results.length > 0) {
        const movies = data.results.map((movie) => ({
          id: `m${movie.id}`,
          kind: "movie",
          title: movie.title,
          genres: movie.genre_ids.map((id) => getGenreNameById(id, "movie")),
          year: movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : null,
          rating: movie.vote_average
            ? Math.round(movie.vote_average * 10) / 10
            : null,
          poster: movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : null,
          overview: movie.overview,
        }));
        allMovies.push(...movies);
      }
    }

    console.log(
      `Fetched movies:, ${allMovies.length} movies from TMDB ${pagesToFetch} pages`
    );
  } catch (error) {
    console.error("Error fetching movies by preferences:", error);
    return []; //Return empty list on error
  }
  const shuffled = allMovies.sort(() => 0.5 - Math.random());
  return shuffled;
}

/**
 * Fetch TV shows based on user preferences
 * @param {object} preferences - User preferences (genres, years, countries)
 * @returns {Promise<Array>} - List of recommended TV shows
 */

export async function fetchShowsByPreferences(preferences) {
  const allShows = [];
  try {
    console.log("Fetching TV shows with preferences:", preferences);

    const params = {
      language: "en-US",
      sort_by: "vote_count.desc",
      include_adult: "false",
      page: 1,
    };

    //Add gnere filter
    if (preferences?.movieGenres && preferences.movieGenres.length > 0) {
      //Map our genre names to TMDB genre IDs
      const genreIds = mapGenreToIds(preferences.movieGenres, "tv");
      if (genreIds.length > 0) {
        const shuffledGenres = genreIds.sort(() => 0.5 - Math.random());
        const selectedGenres = shuffledGenres.slice(0, 2); //TMDB allows up to 2 genres for filtering*/
        params.with_genres = selectedGenres.join(",");
        console.log(`Using 2 random TV genres ${selectedGenres} `);
      }
    }

    //Add year filter
    if (
      preferences?.yearPreferences &&
      preferences.yearPreferences.length > 0
    ) {
      const yearRange = getYearRange(preferences.yearPreferences);
      if (yearRange.min) {
        params["first_air_date.gte"] = `${yearRange.min}-01-01`;
      }
      if (yearRange.max) {
        params["first_air_date.lte"] = `${yearRange.max}-12-31`;
      }
    }

    if (preferences?.countries && preferences.countries.length > 0) {
      const countryCodes = mapCountriesToCodes(preferences.countries);
      if (countryCodes.length > 0) {
        params.with_origin_country = countryCodes.join("|");
      }
    }

    const pagesToFetch = 10; //Fetch 2 pages to get more results

    for (let page = 1; page <= pagesToFetch; page++) {
      const pageParams = { ...params, page };
      const data = await tmdbRequest("/discover/tv", pageParams);

      //Format the result to match out app structure
      if (data.results && data.results.length > 0) {
        const shows = data.results.map((show) => ({
          id: `s${show.id}`,
          kind: "show",
          title: show.name,
          genres: show.genre_ids.map((id) => getGenreNameById(id, "tv")),
          year: show.first_air_date
            ? new Date(show.first_air_date).getFullYear()
            : null,
          rating: show.vote_average
            ? Math.round(show.vote_average * 10) / 10
            : null,
          poster: show.poster_path
            ? `${IMAGE_BASE_URL}${show.poster_path}`
            : null,
          overview: show.overview,
        }));
        allShows.push(...shows);
      }
    }

    console.log(
      `Fetched ${allShows.length} shows from TMDB (${pagesToFetch} pages)`
    );

    if (
      allShows.length === 0 &&
      params.with_genres &&
      params.with_genres.includes(`,`)
    ) {
      console.log(
        "No shows found with selected genres, retrying with single genre..."
      );
      params.with_genres = params.with_genres.split(`,`)[0]; //Use only first genre
      console.log(`Retrying with genre: ${params.with_genres}`);

      for (let page = 1; page <= pagesToFetch; page++) {
        const pageParams = { ...params, page };
        const data = await tmdbRequest("/discover/tv", pageParams);

        if (data.results && data.results.length > 0) {
          const shows = data.results.map((show) => ({
            id: `s${show.id}`,
            kind: "show",
            title: show.name,
            genres: show.genre_ids.map((id) => getGenreNameById(id, "tv")),
            year: show.first_air_date
              ? new Date(show.first_air_date).getFullYear()
              : null,
            rating: show.vote_average
              ? Math.round(show.vote_average * 10) / 10
              : null,
            poster: show.poster_path
              ? `${IMAGE_BASE_URL}${show.poster_path}`
              : null,
            overview: show.overview,
          }));
          allShows.push(...shows);
        }
      }
      console.log(
        `fetched ${allShows.length} shows from TMDB after retrying with single genre.`
      );
    }
  } catch (error) {
    console.error("Error fetching shows by preferences:", error);
    return []; //Return empty list on error
  }

  const shuffled = allShows.sort(() => 0.5 - Math.random());
  return shuffled;
}

/**
 * Map genre names to TMDB genre IDs
 * @param {Array<string>} genresNames - List of genre names
 * @param {string} type - "movie" or "tv"
 * @returns {Array<number>} - List of TMDB genre IDs
 */

function mapGenreToIds(genresNames, type = "movie") {
  //TMDB Genre IDs same movies and TV shows
  const movieGenreMap = {
    Action: 28,
    Adventure: 12,
    Animation: 16,
    Comedy: 35,
    Crime: 80,
    Documentary: 99,
    Drama: 18,
    Family: 10751,
    Fantasy: 14,
    History: 36,
    Horror: 27,
    Music: 10402,
    Mystery: 9648,
    Romance: 10749,
    "Sci-Fi": 878,
    "Science Fiction": 878,
    Thriller: 53,
    War: 10752,
    Western: 37,
    //TV specific genres
    Reality: 10764,
    "Action & Adventure": 10759,
    Soap: 10766,
    Talk: 10767,
    "War & Politics": 10768,
  };

  const tvGenreMap = {
    Action: 10759,
    Adventure: 10759,
    Animation: 16,
    Comedy: 35,
    Crime: 80,
    Documentary: 99,
    Drama: 18,
    Family: 10751,
    Fantasy: 10765,
    Mystery: 9648,
    Romance: 10749,
    "Sci-Fi": 10765,
    "Science Fiction": 10765,
    Thriller: 53,
    War: 10768,
    Western: 37,
  };

  const genreMap = type === "tv" ? tvGenreMap : movieGenreMap;

  const ids = genresNames
    .map((name) => genreMap[name])
    .filter((id) => id !== undefined);
  return [...new Set(ids)]; //Return unique IDs
}

/**
 * Convert TMDB genre ID to genre name
 * @param {number} id - TMDB genre ID
 * @param {string} type - "movie" or "tv"
 * @returns {string} - Genre name
 */

function getGenreNameById(id, type = "movie") {
  const movieGenreMap = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };

  const tvGenreMap = {
    10759: "Action & Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    10765: "Sci-Fi & Fantasy",
    9648: "Mystery",
    10749: "Romance",
    53: "Thriller",
    10768: "War & Politics",
    37: "Western",
    10764: "Reality",
    10766: "Soap",
    10767: "Talk",
  };

  const genreMap = type === "tv" ? tvGenreMap : movieGenreMap;
  return genreMap[id] || "Unknown";
}

/** Get year range from user year preferences
 * @param {Array<string>} yearPreferences - List of year preference strings
 * @returns {object} - Object with min and max year
 */

function getYearRange(yearPreferences) {
  let overallMin = null;
  let overallMax = null;

  yearPreferences.forEach((pref) => {
    let rangeMin, rangeMax;

    if (pref === "Before 1980") {
      rangeMin = 1900;
      rangeMax = 1979;
    } else if (pref === "1980s") {
      rangeMin = 1980;
      rangeMax = 1989;
    } else if (pref === "1990s") {
      rangeMin = 1990;
      rangeMax = 1999;
    } else if (pref === "2000s") {
      rangeMin = 2000;
      rangeMax = 2009;
    } else if (pref === "2010s") {
      rangeMin = 2010;
      rangeMax = 2019;
    } else if (pref === "2020s") {
      rangeMin = 2020;
      rangeMax = 2029;
    }

    if (overallMin === null || rangeMin < overallMin) {
      overallMin = rangeMin;
    }
    if (overallMax === null || rangeMax > overallMax) {
      overallMax = rangeMax;
    }
  });
  return { min: overallMin, max: overallMax };
}

/**
 * Map country names to TMDB country codes
 * @param {Array<string>} countries - List of country names
 * @returns {Array<string>} - List of TMDB country codes
 */

function mapCountriesToCodes(countries) {
  const countryMap = {
    USA: "US",
    UK: "GB",
    Japan: "JP",
    Korea: "KR",
    India: "IN",
    France: "FR",
    Spain: "ES",
    "Latin America": "MX",
    "Latin-America": "MX",
    Germany: "DE",
    Turkey: "TR",
    Italy: "IT",
    Canada: "CA",
    Australia: "AU",
    China: "CN",
    Russia: "RU",
  };

  return countries
    .map((country) => countryMap[country])
    .filter((code) => code !== undefined);
}

export default {
  fetchMoviesByPreferences,
  fetchShowsByPreferences,
};
