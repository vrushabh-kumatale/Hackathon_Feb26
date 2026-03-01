import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>Welcome to Course Management System</h1>

      <div style={styles.buttonContainer}>
        <button 
          style={styles.adminBtn}
          onClick={() => navigate("/admin")}
        >
          Admin Login
        </button>

        <button 
          style={styles.studentBtn}
          onClick={() => navigate("/userLogin")}
        >
          Student Login
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px"
  },
  buttonContainer: {
    marginTop: "40px"
  },
  adminBtn: {
    padding: "15px 30px",
    margin: "20px",
    fontSize: "18px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  studentBtn: {
    padding: "15px 30px",
    margin: "20px",
    fontSize: "18px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  }
};

export default Home;