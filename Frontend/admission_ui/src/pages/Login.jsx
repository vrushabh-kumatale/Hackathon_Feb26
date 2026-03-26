
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";

// const Login = () => {

//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: ""
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post(
//         "http://localhost:4000/students/login",
//         formData
//       );

//       const { token, user, message } = res.data;

//       alert(message);

//       localStorage.setItem("token", token);
//       localStorage.setItem("role", user.role);

//       if (user.role === "ADMIN") {
//         navigate("/admin");
//       } else {
//         navigate("/registerStudent");   // ✅ student redirected here
//       }

//     } catch (error) {
//       alert(error.response?.data?.error || "Login Failed");
//     }
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center vh-100">
//       <div className="card shadow-lg p-4" style={{ width: "400px" }}>
//         <h3 className="text-center mb-4">Login</h3>

//         <form onSubmit={handleSubmit}>

//           <div className="mb-3">
//             <label className="form-label">Email</label>
//             <input
//               type="email"
//               name="email"
//               className="form-control"
//               placeholder="Enter email"
//               required
//               onChange={handleChange}
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Password</label>
//             <input
//               type="password"
//               name="password"
//               className="form-control"
//               placeholder="Enter password"
//               required
//               onChange={handleChange}
//             />
//           </div>

//           <button className="btn btn-primary w-100">
//             Login
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        "http://localhost:4000/students/login",
        formData
      );

      const { token, user, message } = res.data;

      alert(message);

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);

      localStorage.setItem("student_id", user.id);

      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/registerStudent");
      }

    } catch (error) {
      alert(error.response?.data?.error || "Login Failed");
    }

  };

  return (

    <div className="container d-flex justify-content-center align-items-center vh-100">

      <div className="card p-4 shadow" style={{ width: "400px" }}>

        <h3 className="text-center mb-4">
          Student Login
        </h3>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary w-100">
            Login
          </button>

        </form>

      </div>

    </div>
  );
};

export default Login;