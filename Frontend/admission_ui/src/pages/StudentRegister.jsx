import React, { useState, useEffect } from "react";
import axios from "axios";

const RegisterStudent = () => {

  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [students, setStudents] = useState([]);

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:4000/students");
      setStudents(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
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
        phone: ""
      });

      fetchStudents(); // refresh list

    } catch (error) {
      alert(error.response?.data?.message || "Error adding student");
    }
  };

  return (
    <div className="container mt-4">

      <h2>Add Student</h2>

      {/* Add Form */}
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

        <button className="btn btn-primary">Add Student</button>
      </form>

      <hr />

      {/* Display Students */}
      <h3>All Students</h3>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default RegisterStudent;