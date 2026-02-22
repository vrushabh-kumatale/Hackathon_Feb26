// import React, { useState } from "react";
// import axios from "axios";

// const AddCourse = () => {

//   const [courseData, setCourseData] = useState({
//     course_name: "",
//     description: ""
//   });

//   const handleChange = (e) => {
//     setCourseData({
//       ...courseData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       //const token = localStorage.getItem("token");

//       const response = await axios.post(
//         "http://localhost:4000/admin/courses",
//         courseData,
//         // {
//         //   headers: {
//         //     token: token
//         //   }
//         // }
//       );

//       console.log("Response:", response.data);
//       alert("Course Added Successfully!");

//       // Clear form after submit
//       setCourseData({
//         course_name: "",
//         description: ""
//       });

//     } catch (err) {
//       console.error("Error:", err);
//       alert("Failed to Add Course");
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Add New Course</h2>

//       <form onSubmit={handleSubmit} className="mt-3">

//         <div className="mb-3">
//           <label className="form-label">Course Name</label>
//           <input
//             type="text"
//             className="form-control"
//             name="course_name"
//             value={courseData.course_name}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Description</label>
//           <textarea
//             className="form-control"
//             name="description"
//             rows="3"
//             value={courseData.description}
//             onChange={handleChange}
//             required
//           ></textarea>
//         </div>

//         <button type="submit" className="btn btn-primary">
//           Add Course
//         </button>

//       </form>
//     </div>
//   );
// };

// export default AddCourse;
import React, { useState, useEffect } from "react";
import axios from "axios";

const AddCourse = () => {

  const [courseData, setCourseData] = useState({
    course_name: "",
    description: ""
  });

  const [courses, setCourses] = useState([]);

  // ✅ Fetch all courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/admin/courses"
      );
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // ✅ Load courses when page loads
  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:4000/admin/courses",
        courseData
      );

      alert("Course Added Successfully!");

      // Clear form
      setCourseData({
        course_name: "",
        description: ""
      });

      // ✅ Refresh list after adding
      fetchCourses();

    } catch (err) {
      console.error("Error:", err);
      alert("Failed to Add Course");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Course</h2>

      {/* Add Course Form */}
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

      {/* Display Courses */}
      <hr />
      <h3 className="mt-4">All Courses</h3>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Course Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.course_name}</td>
                <td>{course.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No Courses Available
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
};

export default AddCourse;