export const users = []; // { id, email, password }
export const preferences = {}; // { userId: { type, genres, mood, yearRange } }

export const catalog = [
  {
    id: "m1",
    kind: "movie",
    title: "Inception",
    genres: ["Sci-Fi"],
    year: 2010,
  },
  {
    id: "s1",
    kind: "show",
    title: "Breaking Bad",
    genres: ["Drama"],
    year: 2008,
  },
  {
    id: "g1",
    kind: "game",
    title: "The Witcher 3",
    genres: ["Action RPG"],
    year: 2015,
  },
];

export const userState = {}; // { userId: { watched: Set(), favorites: Set() } }
