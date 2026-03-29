import React from "react";
import { Link } from "react-router-dom"; //Lets us navigate wirhout having to relaod the page

export default function Navbar({ item }) {
  const userName = localStorage.getItem("userName") || "User";
  return (
    <nav className="app-nav" style={styles.bar}>
      {/* Left hand side of the nav bar (Empty)*/}
      <div style={styles.inner}>
        <div></div>

        {/* Center of the nav bar*/}
        <div style={styles.brand} className="brand-link">
          Play&Watch
        </div>

        {/* Right hand side of the nav bar*/}
        <div style={styles.linksContainer}>
          {/*/ right section wjere the rest of the links will be located*/}
          <Link to="/" style={styles.link} className="nav-link">
            Home
          </Link>
          <Link to="/watchlist" style={styles.link} className="nav-link">
            Watchlist/PlayList
          </Link>
          <Link to="/mood" style={styles.link} className="nav-link">
            Mood
          </Link>
          <Link to="/profile" style={styles.link} className="nav-link">
            <div style={styles.profileLinkContent}>
              <span>Profile</span>
              <div style={styles.profileAvatar}>
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  //CSS Grid that keeps 3 columns (Left, Center, Right) keeping the bradn centered and spacen for each of the right lkns

  bar: {
    position: "sticky", //Keeps the nav bar at the top of the screen when scrolling
    top: 0,
    zIndex: 100,
    width: "100%",
    background: "rgba(174, 35, 35, 1)", //White with some transparency
    borderBottom: "1px solid #e5e7eb",
  },

  inner: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr", //3 columns - left, center, right*/
    alignItems: "center",
    justifyContent: "center",
    padding: "0 40px",
    minHeight: 80,
    width: "100%",
    /*gap: 100,*/
  },

  brand: {
    justifySelf: "center", //Keeps brand in the center
    fontWeight: "bold",
    /*alignSelf: "center",
    display: "flex",
    alignItems: "center",
    height: "100%",*/
    fontSize: 35,
    textDecoration: "none",
    color: "#000000ff",
    /*lineHeight: 1,*/
    fontFamily: "'Poppins', sans-serif",
    //fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
    //fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    letterSpacing: "0.6px",
    whiteSpace: "nowrap",
    cursor: "default",
  },

  linksContainer: {
    display: "flex",
    gap: 60,
    alignItems: "center",
    justifyContent: "center",
    justifySelf: "stretch",
    paddingLeft: 40,
  },

  link: {
    textDecoration: "none",
    color: "#000000ff",
    /*padding: "6px 10px",
    borderRadius: 8,
    background: "#f8fafc",
    border: "1px solid #e5e7eb",*/
    fontSize: 20,
    fontWeight: 400,
    whiteSpace: "nowrap",
  },

  profileLinkContent: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    backgroundColor: "#e5e7eb",
    color: "#000000ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: 14,
    flexShrink: 0, //Prevents the avatar from shrinking
  },
};
