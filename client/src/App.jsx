import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx"; // Nav bar component

export default function App() {
  //Change for the navigation bar to be shown on the home pages and not on the login or regiser pages
  //Juan Diaz - 10/24

  //useLocation() hook to give us the ifnor to where the user is on the website
  const location = useLocation();

  //Define which pages do NOT have the navigation bar (login and register pages)
  const noNavbarPages = ["/login", "/register", "/preferences"];

  //Check if the current page the user is in, should show the navigation bar
  //.include() checks if the current path is in the array of noNavbarPages
  const showNavbar = !noNavbarPages.includes(location.pathname);
  return (
    <>
      {showNavbar && <Navbar />}
      {/*Placed outside so it can take the full width of the screen*/}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}>
        {/*}
      <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Link to="/">Home</Link>                                     Commented this section to replace it 
        <Link to="/login">Login</Link>                               with a call to the navbar component 
        <Link to="/preferences">Preferences</Link>                   we already have - Juan Diaz 10/11
        <Link to="/recommendations">Recommendations</Link>
      </nav>
      */}
        <Outlet />
      </div>
    </>
  );
}
