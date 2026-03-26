import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const RegisterStudent = () => {

  const navigate = useNavigate();

  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    phone: "",
    batch_id: ""
  });

  const [batches, setBatches] = useState([]);

  const fetchBatches = async () => {

    try {

      const res = await axios.get(
        "http://localhost:4000/admin/batches"
      );

      setBatches(res.data);

    } catch (error) {
      console.error(error);
    }

  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleChange = (e) => {

    setStudentData({
      ...studentData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:4000/students/addStudent",
        studentData
      );

      alert("Student Added Successfully");

      setStudentData({
        name: "",
        email: "",
        phone: "",
        batch_id: ""
      });

      navigate("/regList");

    } catch (error) {
      alert("Error adding student");
    }

  };

  return (

    <>
      <Navbar />

      <div className="container mt-4">

        <h2>Register Student</h2>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label>Name</label>

            <input
              type="text"
              className="form-control"
              name="name"
              value={studentData.name}
              onChange={handleChange}
              required
            />

          </div>

          <div className="mb-3">
            <label>Email</label>

            <input
              type="email"
              className="form-control"
              name="email"
              value={studentData.email}
              onChange={handleChange}
              required
            />

          </div>

          <div className="mb-3">
            <label>Phone</label>

            <input
              type="text"
              className="form-control"
              name="phone"
              value={studentData.phone}
              onChange={handleChange}
              required
            />

          </div>

          <div className="mb-3">
            <label>Select Batch</label>

            <select
              className="form-control"
              name="batch_id"
              value={studentData.batch_id}
              onChange={handleChange}
              required
            >

              <option value="">Select Batch</option>

              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.batch_name}
                </option>
              ))}

            </select>

          </div>

          <button className="btn btn-primary me-2">
            Register
          </button>

          <button
            type="button"
            className="btn btn-success"
            onClick={() => navigate("/studentLogin")}
          >
            Login
          </button>

        </form>

      </div>
    </>
  );
};

export default RegisterStudent;