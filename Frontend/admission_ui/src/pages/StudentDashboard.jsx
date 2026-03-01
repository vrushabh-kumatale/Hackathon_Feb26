import React from "react";
import { Outlet, Link } from "react-router-dom";

const StudentDashboard = () => {
  return (
    <div className="d-flex" style={{ height: "100vh" }}>

      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
        <h4>Student Panel</h4>
        <hr />

        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/registerStudent" className="nav-link text-white">
              Register Student
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/regToCourse" className="nav-link text-white">
              Register To Course
            </Link>
          </li>
        </ul>
      </div>

      {/* Content Area */}
      <div className="flex-fill p-4 bg-light">
        <Outlet />
      </div>

    </div>
  );
};

export default StudentDashboard;