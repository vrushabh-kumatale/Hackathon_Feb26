import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:4000/user/login",
        formData
      );

      if (res.data.status === "success") {

        const { token, role } = res.data.data;

        // Store token
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        // Role-based redirect
        if (role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/studentDashboard");
        }
      } else {
        alert(res.data.error);
      }

    } catch (error) {
      alert("Login Failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit} style={{ width: "300px", margin: "auto" }}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          style={inputStyle}
        />

        <button style={buttonStyle}>Login</button>

        <p style={{ marginTop: "10px" }}>
          Don’t have account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  margin: "10px 0"
};

const buttonStyle = {
  padding: "8px 20px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none"
};

export default Login;