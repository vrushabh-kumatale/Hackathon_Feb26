import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light">

      <div className="container text-center">

        <h1 className="fw-bold mb-3">
          Course Management System
        </h1>

        <p className="text-muted mb-5">
          Manage students, courses, batches and registrations easily.
        </p>

        <div className="row justify-content-center">

          {/* Admin Card */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-lg border-0 p-4 h-100">
              <div className="card-body">
                <h3 className="card-title mb-3">Admin Panel</h3>
                <p className="card-text text-muted">
                  Manage courses, batches, students and discounts.
                </p>
                <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={() => navigate("/admin")}
                >
                  Go to Admin
                </button>
              </div>
            </div>
          </div>

          {/* Student Card */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-lg border-0 p-4 h-100">
              <div className="card-body">
                <h3 className="card-title mb-3">Student Panel</h3>
                <p className="card-text text-muted">
                  Login to view your courses and registration details.
                </p>
                <button
                  className="btn btn-success w-100 mt-3"
                  onClick={() => navigate("/studentLogin")}
                >
                  Go to Student Login
                </button>
              </div>
            </div>
          </div>

        </div>

        <footer className="mt-5 text-muted">
          © 2026 Course Management System
        </footer>

      </div>
    </div>
  );
};

export default Home;