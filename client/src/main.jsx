import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx"; //Added register import Juan Diaz 10/24
import Preferences from "./pages/Preferences.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import Watchlist from "./pages/Watchlist.jsx";
import Watched from "./pages/Watched.jsx";
import Profile from "./pages/Profile.jsx";
import "./index.css";

//It defines all the routes in the website
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      //Added regsister path: Juan Diaz 10/24
      { path: "register", element: <Register /> },
      { path: "preferences", element: <Preferences /> },
      { path: "recommendations", element: <Recommendations /> },
      //Added watchlist path: Zerong Wu 11/02
      { path: "Watchlist", element: <Watchlist /> },
      //Added watched path: Zerong Wu 11/18
      { path: "Watched", element: <Watched /> },
      //Adding new routes here Juan Diaz 10/16
      { path: "profile", element: <Profile /> },
      { path: "movies", element: <div>Moives Page (Comming Soon)</div> },
      { path: "games", element: <div>Games Page (Comming Soon)</div> },
      { path: "mood", element: <div>Mood Page (Comming Soon)</div> },
      { path: "profile", element: <div>Profile Page (Comming Soon)</div> },
    ],
  },
]);

//Entry point of React App
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
