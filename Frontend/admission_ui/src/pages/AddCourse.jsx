import React, { useState } from "react";
import axios from "axios";

const AddCourse = () => {

  const [courseData, setCourseData] = useState({
    course_name: "",
    description: ""
  });

  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:4444/course/add",
        courseData,
        {
          headers: {
            token: token
          }
        }
      );

      console.log("Response:", response.data);
      alert("Course Added Successfully!");

      // Clear form after submit
      setCourseData({
        course_name: "",
        description: ""
      });

    } catch (err) {
      console.error("Error:", err);
      alert("Failed to Add Course");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Course</h2>

      <form onSubmit={handleSubmit} className="mt-3">

        <div className="mb-3">
          <label className="form-label">Course Name</label>
          <input
            type="text"
            className="form-control"
            name="course_name"
            value={courseData.course_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            rows="3"
            value={courseData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">
          Add Course
        </button>

      </form>
    </div>
  );
};

export default AddCourse;