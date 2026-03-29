import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";

export default function Register() {
  //State for first name input
  const [userName, setUserName] = useState("");

  //State for email input
  const [email, setEmail] = useState("");

  //State for password input
  const [password, setPassword] = useState("");

  //State for birth date input
  const [birthDate, setBirthDate] = useState("");

  //State for terms checkbox
  const [agreed, setAgreed] = useState(false);

  //Hook for navigaton
  const navigate = useNavigate();

  //Function called when enter the register page
  const register = async () => {
    if (!userName || !email || !password || !birthDate) {
      //Checks if all the fields are filled
      alert("Please fill in all fields");
      return;
    }
    if (!agreed) {
      //Checks if user agreed to terms and conditions
      alert("Please agree to the terms and conditions");
      return;
    }

    try {
      //Make a POST request to backend
      //First name and birth date are just for front end validation
      const res = await api.post("/auth/signup", { userName, email, password });

      //If signup successful, backend return user objects and saves it to localStorage
      localStorage.setItem("userId", res.user.id);
      localStorage.setItem("userName", res.user.userName);
      localStorage.setItem("userEmail", res.user.email);

      //New users should set their preferences before seeing recommendatiosn
      navigate("/preferences");
    } catch (e) {
      alert("Registration failed: " + e.message);
    }
  };

  return (
    <div style={styles.container}>
      {/*Title of webstie at top */}
      <h1 style={styles.logo}>Play & Watch</h1>

      {/*White box that contains login form */}
      <div style={styles.registerBox}>
        {/*Form title */}
        <h2 style={styles.title}>Register Accunt</h2>

        {/*First name input */}
        <div style={styles.inputGroup}>
          <label style={styles.label}> Create a user name: </label>
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={styles.input}
            reaquired
          />
        </div>

        {/*Email input */}
        <div style={styles.inputGroup}>
          <label style={styles.label}> Enter email address:</label>
          <input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>

        {/*Password input */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Create a password: </label>
          <input
            type="password"
            placeholder="***************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>

        {/*Birth Date input */}
        <div style={styles.inputGroupu}>
          <label style={styles.label}> Enter date of birth:</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            style={styles.input}
          />
        </div>

        {/*Terms and conditions Checkbox*/}
        <div styles={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={styles.checkbox}
          />

          {/*HTMLFro link label to the checkbox */}
          <label htmlFor="terms" style={styles.checkboxLabel}>
            {" "}
            I agree to the Terms & Conditions / Privacy Policy{" "}
          </label>
        </div>

        {/*Register Button */}
        <button onClick={register} style={styles.registerButton}>
          Register Account
        </button>

        {/*Login in button for users that already have an account */}
        <div style={styles.loginSection}>
          <span style={styles.loginText}>Already have an account?</span>
          <Link to="/Login" style={styles.loginLink}>
            Login here
          </Link>{" "}
          {/*Link to login page */}
        </div>
      </div>
    </div>
  );
}

//Styling of the register page

const styles = {
  //Main container
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column", //Stack vetically
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },

  //Top logo
  logo: {
    fontSize: 48,
    fontWeigth: "bold",
    marginBottom: 40,
    fontFamily: "'Poppins', sans-serif",
    color: "#000",
  },

  //Contaier for form
  registerBox: {
    backgroundColor: "#fff",
    border: "2px solid #000",
    borderRadius: 8,
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
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

  //Input Group Container
  inputGroup: {
    marginBottom: 16, //Space in betwen each group
  },

  //Input labels
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: "400",
    marginBottom: 6,
    color: "#333",
  },

  //Input for name, email, password, and birthdate
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: 14,
    border: "1px solid #ccc",
    borderRadius: 4,
    boxSizing: "border-box", //Includes the padding in the width
  },

  //Checbox and label on the same line
  checkboxGroup: {
    display: "flex",
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },

  //Checkbox input
  checkbox: {
    width: 16,
    height: 16,
    cursor: "pointer",
  },

  //Checkbox label
  checkboxLabel: {
    fontSize: 12,
    color: "#333",
    cursor: "pointer",
  },

  //Register Button
  registerButton: {
    width: "100%",
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

  //Login link section
  loginSection: {
    textAlign: "center",
    fontSize: 14,
  },

  //Already have an account text
  loginText: {
    color: "#666",
  },

  //Login here link
  loginLink: {
    color: "#0066cc",
    textDecoration: "none",
    fontWeight: "500",
  },
};
