import React, { useState, useEffect } from "react";
import axios from "axios";

const AddBatch = () => {
  const [batchData, setBatchData] = useState({
    course_id: "",
    batch_name: "",
    fee: "",
    capacity: "",
    location_mode: "ONLINE",
    start_date: "",
    end_date: ""
  });

  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);

  // Fetch courses for dropdown
  const fetchCourses = async () => {
    const res = await axios.get("http://localhost:4000/admin/courses");
    setCourses(res.data);
  };

  // Fetch batches
  const fetchBatches = async () => {
    const res = await axios.get("http://localhost:4000/admin/batches");
    setBatches(res.data);
  };

  useEffect(() => {
    fetchCourses();
    fetchBatches();
  }, []);

  const handleChange = (e) => {
    setBatchData({
      ...batchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:4000/admin/batches",
        batchData
      );

      alert("Batch Created Successfully");

      setBatchData({
        course_id: "",
        batch_name: "",
        fee: "",
        capacity: "",
        location_mode: "ONLINE",
        start_date: "",
        end_date: ""
      });
      console.log("course Id:"+course_id)

      fetchBatches(); // refresh list

    } catch (err) {
      alert(err.response?.data?.message || "Error creating batch");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Batch</h2>

      {/* Add Batch Form */}
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label>Course</label>
          <select
            className="form-control"
            name="course_id"
            value={batchData.course_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.course_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Batch Name</label>
          <input
            type="text"
            className="form-control"
            name="batch_name"
            value={batchData.batch_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Fee</label>
          <input
            type="number"
            className="form-control"
            name="fee"
            value={batchData.fee}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Capacity</label>
          <input
            type="number"
            className="form-control"
            name="capacity"
            value={batchData.capacity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Location Mode</label>
          <select
            className="form-control"
            name="location_mode"
            value={batchData.location_mode}
            onChange={handleChange}
          >
            <option value="ONLINE">ONLINE</option>
            <option value="OFFLINE">OFFLINE</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Start Date</label>
          <input
            type="date"
            className="form-control"
            name="start_date"
            value={batchData.start_date}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>End Date</label>
          <input
            type="date"
            className="form-control"
            name="end_date"
            value={batchData.end_date}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary">Add Batch</button>
      </form>

      <hr />

      {/* Display Batches */}
      <h3>All Batches</h3>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Course</th>
            <th>Batch Name</th>
            <th>Fee</th>
            <th>Capacity</th>
            <th>Mode</th>
          </tr>
        </thead>
        <tbody>
          {batches.map(batch => (
            <tr key={batch.id}>
              <td>{batch.id}</td>
              <td>{batch.course_name}</td>
              <td>{batch.batch_name}</td>
              <td>{batch.fee}</td>
              <td>{batch.capacity}</td>
              <td>{batch.location_mode}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default AddBatch;