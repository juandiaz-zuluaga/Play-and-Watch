import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("userEmail") || "email@example.com";
  const userName = localStorage.getItem("userName") || "User name";

  //Redirect if not logged in
  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  //Logout Function
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");

      //Redirect to login page
      navigate("/login");
    }
  };

  return (
    <div style={styles.container}>
      {/*Profile Header Section*/}
      <div style={styles.profileHeader}>
        {/*Profile pic placeholder */}
        <div style={styles.leftSection}>
          <div styles={styles.profilePicPlaceholder}>
            <svg width="100%" height="100%" viewBox="0 0 150 150">
              <line
                x1="0"
                y1="0"
                x2="150"
                y2="150"
                stroke="#ccc"
                strokeWidth="2"
              />
              <line
                x1="150"
                y1="0"
                x2="0"
                y2="150"
                stroke="#ccc"
                strokeWidth="2"
              />
            </svg>
          </div>

          <p style={styles.editPicText}>Edit Profile Pic</p>
        </div>

        {/*Right User Information */}
        <div style={styles.rightSection}>
          {/*UserName */}
          <div style={styles.infoGroup}>
            <label style={styles.label}>User Name:</label>
            <p style={styles.value}>{userName}</p>
          </div>

          {/*Email */}
          <div style={styles.infoGroup}>
            <label style={styles.label}>Email Address</label>
            <p style={styles.value}>{userEmail}</p>
          </div>

          {/*Edit information Button */}
          <buttom
            style={styles.editButton}
            onClick={() => alert("Edit Functionality comming soon")}
          >
            {" "}
            Edit information{" "}
          </buttom>
        </div>
      </div>

      {/*Divider Line* */}
      <div style={styles.divider}></div>

      {/*Actions button section */}
      <div style={styles.buttonSection}>
        <button
          onClick={() => navigate("/preferences")}
          style={styles.actionButton}
        >
          Update Preferences
        </button>

        <button
          onClick={() => navigate("/watched")}
          style={styles.actionButton}
        >
          Already Watched / Played
        </button>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Log Out
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0px auto",
    padding: "60px 40px",
  },

  //Header Section Profile Pic and info on the side
  profileHeader: {
    display: "flex",
    gap: 60,
    alignItems: "flex-start",
    marginBottom: 50,
  },

  //Left Section with profile pic
  leftSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  profilePicPlaceholder: {
    width: 200,
    height: 200,
    border: "2px solid #000",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  editPicText: {
    marginTop: 16,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },

  //Right Section with user info
  rightSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 24,
    paddingTop: 20,
  },

  infoGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    margin: 0,
  },

  value: {
    fontSize: 15,
    color: "#666",
    margin: 0,
  },

  editButton: {
    padding: "10px 20px",
    fontSize: 15,
    fontWeight: "500",
    color: "#000",
    backgroundColor: "#fff",
    border: "2px solid #000",
    borderRadius: 8,
    cursor: "pointer",
    alingSelf: "flex-start",
    marginTop: 8,
    transition: "background 0.2s ease",
  },

  //Divider line
  divider: {
    height: 2,
    backgroundColor: "#000",
    marginBottom: 50,
  },

  //Action Buttons Section
  buttonSection: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    maxWidth: 450,
    margin: "0 auto",
  },

  actionButton: {
    padding: "16px 24px",
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    backgroundColor: "#fff",
    border: "2px solid #000",
    borderRadius: 10,
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "center",
  },

  logoutButton: {
    padding: "16px 24px",
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    backgroundColor: "#ff4d4d",
    border: "2px solid #ff4d4d",
    borderRadius: 10,
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: 8,
  },
};
