import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate();
  const studentName = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/studentLogin");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-4">

      <span className="navbar-brand">
        Student Portal
      </span>

      <div className="text-white">

        {studentName && (
          <>
            Welcome, <b>{studentName}</b>

            <button
              className="btn btn-danger btn-sm ms-3"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}

      </div>

    </nav>
  );
};

export default Navbar;