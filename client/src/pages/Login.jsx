import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; //Hooks for navigation
import { api } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  {
    /* const signup = async () => {
    try {
      const res = await api.post("/auth/signup", { email, password });
      alert("Signed up: " + res.user.email + "\nYour userId is in console.");      Commenteed in order to make a separate
      console.log("User:", res.user);                                              file for the sign up for easier and 
      localStorage.setItem("userId", res.user.id);                                 more friendly user experience and to 
    } catch (e) {                                                                  match our wireframes Juan Diaz 10/26
      alert("Signup failed: " + e);
    }
  };
*/
  }

  const login = async () => {
    try {
      //Making a POST request
      const res = await api.post("/auth/login", { email, password });
      //alert("Logged in: " + res.user.email);
      //console.log("User:", res.user);
      localStorage.setItem("userId", res.user.id);
      localStorage.setItem("userEmail", res.user.email);
      localStorage.setItem("userName", res.user.userName);
      alert("Login successful");
      navigate("/"); //Redirect User to home page when logged in
    } catch (e) {
      //If login fails show error message
      alert("Login failed: " + e.message);
    }
  };

  return (
    //Main container
    <div style={styles.container}>
      {/*<h2>Login / Signup (Mock)</h2>
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /> Commented to organize it and ensure
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>                                                     to match with CSS Juan DIaz 10/26
        <button onClick={signup}>Sign Up</button> 
        <button onClick={login}>Log In</button>
      </div>*/}

      {/*Title of webstie at top */}
      <h1 style={styles.logo}>Play & Watch</h1>

      {/*White box that contains login form */}
      <div style={styles.loginBox}>
        {/*Form title */}
        <h2 style={styles.title}>Login</h2>

        {/* Email input section */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            placeholder="email@example.com"
            value={email} //Value comes from state
            onChange={(e) => setEmail(e.target.value)} //Updates state when users type
            style={styles.input}
          />
        </div>

        {/*Password Input section */}
        <div style={styles.passwordGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="***********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>

        {/*Forgot password link (Not functinal yet, just a visual button) */}
        <a href="#" style={styles.forgotLink}>
          Forgot Email /passsord
        </a>

        {/*Login Button */}
        <button onClick={login} style={styles.loginButton}>
          Login
        </button>

        {/*Regisyer link section */}
        <div style={styles.registerSection}>
          <span style={styles.registerText}> Don't have an account? </span>
          {/*Link component navigates to page */}
          <Link to="/register" style={styles.registerLink}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

//CSS Styling
const styles = {
  //Main container

  container: {
    minHeight: "100vh", //full viewport height
    display: "flex",
    flexDirection: "column", //Stakc items veritcally
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },

  //Logo at the top
  logo: {
    fontSize: 48,
    fontWeight: "bold",
    marginBotttom: 40,
    fontFamily: "'Poppins', sans-serif",
    color: "#000",
  },

  //White box containing login form
  loginBox: {
    backgroundColor: "#fff",
    border: "2px solid #000",
    borderRadius: 8,
    padding: "40px",
    width: "400px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },

  //Form title
  title: {
    fontSize: 24,
    fontWeigth: "600",
    marginBottom: 24,
    textAlign: "center",
    color: "#000",
  },

  //Input group
  inputGroup: {
    marginBottom: 16,
  },

  //Input label
  label: {
    display: "block", //Display so its in its own line
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#333",
  },

  //Text input field
  input: {
    width: "100%",
    fontSize: 14,
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: 4,
    boxSizing: "border-box",
  },

  //Forgot Paswword Link
  forgotLink: {
    display: "Block",
    fontSize: 13,
    color: "#0066cc",
    textAlign: "right",
    marginTop: 8,
    marginBottom: 24,
    textDecoration: "none", //No underline
  },

  //Login Button
  loginButton: {
    width: "100px",
    padding: "12px",
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#000",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    marginBottom: 16,
  },

  //Register section Container
  registerSection: {
    textAlign: "center",
    fontSize: 14,
  },

  //Dont have an account text
  registerText: {
    color: "#666",
  },

  //Register here link
  registerLink: {
    color: "#0066cc",
    textDecoration: "none",
    fontWeight: "500",
  },
};
