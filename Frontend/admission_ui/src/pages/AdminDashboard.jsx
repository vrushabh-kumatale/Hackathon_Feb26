import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Admin Dashboard</h2>

      <div style={{ marginTop: "30px" }}>
        <button onClick={() => navigate("/addCourse")} className="btn">
          Create Courses
        </button>

        <button onClick={() => navigate("/addBatches")} className="btn">
          Create Batches
        </button>

        <button onClick={() => navigate("/discount")} className="btn">
          Add Discount
        </button>

         <button onClick={() => navigate("/assignDiscount")} className="btn">
          Add Discount
        </button>

        {/* <button onClick={() => navigate("/admin/capacity")} className="btn">
          Define Batch Capacity
        </button> */}

        {/* <button onClick={() => navigate("/admin/mode")} className="btn">
          Define Batch Location/Mode
        </button> */}
      </div>

      <style>{`
        .btn {
          display: block;
          width: 300px;
          margin: 15px auto;
          padding: 12px;
          font-size: 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;