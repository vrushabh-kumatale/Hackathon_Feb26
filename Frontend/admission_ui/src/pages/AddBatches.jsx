import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBatch = () => {

  const navigate = useNavigate();

  const [batchData, setBatchData] = useState({
    course_id: "",
    batch_name: "",
    fee: "",
    capacity: "",
    location_mode: "ONLINE",
    start_date: "",
    end_date: ""
  });

  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    const res = await axios.get("http://localhost:4000/admin/courses");
    setCourses(res.data);
  };

  useEffect(() => {
    fetchCourses();
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

      // redirect to display page
      navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "Error creating batch");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Batch</h2>

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
          />
        </div>

        <button className="btn btn-primary">
          Add Batch
        </button>

      </form>
    </div>
  );
};

export default AddBatch;