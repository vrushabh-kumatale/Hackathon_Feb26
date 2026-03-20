// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const DisplayBatches = () => {

//   const [batches, setBatches] = useState([]);
//   const navigate = useNavigate();

//   const fetchBatches = async () => {
//     const res = await axios.get("http://localhost:4000/admin/batches");
//     setBatches(res.data);
//   };

//   useEffect(() => {
//     fetchBatches();
//   }, []);

//   const handleRegister = (batchId) => {
//     console.log("Batch ID:", batchId);   // check in console
//     navigate(`/registerStudent/${batchId}`);
//   };

//   return (
//     <div className="container mt-4">

//       <h2>All Batches</h2>

//       <table className="table table-bordered mt-3">

//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Course</th>
//             <th>Batch Name</th>
//             <th>Fee</th>
//             <th>Capacity</th>
//             <th>Mode</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>

//           {batches.map(batch => (
//             <tr key={batch.id}>
//               <td>{batch.id}</td>
//               <td>{batch.course_name}</td>
//               <td>{batch.batch_name}</td>
//               <td>{batch.fee}</td>
//               <td>{batch.capacity}</td>
//               <td>{batch.location_mode}</td>

//               <td>
//                 <button
//                   className="btn btn-success"
//                   onClick={() => handleRegister(batch.id)}
//                 >
//                   Register To Course
//                 </button>
//               </td>

//             </tr>
//           ))}

//         </tbody>

//       </table>

//     </div>
//   );
// };

// export default DisplayBatches;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DisplayBatches = () => {

  const [batches, setBatches] = useState([]);
  const navigate = useNavigate();

  const fetchBatches = async () => {
    const res = await axios.get("http://localhost:4000/admin/batches");
    setBatches(res.data);
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleRegister = (batchId) => {
    console.log("Batch ID:", batchId);
    navigate(`/registerStudent/${batchId}`);
  };

  const handleAdminLogin = () => {
    navigate("/adminLogin");   // navigate to login page
  };

  return (
    <div className="container mt-4">

      {/* Top Header with Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>All Batches</h2>

        <button
          className="btn btn-primary"
          onClick={handleAdminLogin}
        >
          Admin Login
        </button>
      </div>

      <table className="table table-bordered mt-3">

        <thead>
          <tr>
            <th>ID</th>
            <th>Course</th>
            <th>Batch Name</th>
            <th>Fee</th>
            <th>Capacity</th>
            <th>Mode</th>
            <th>Action</th>
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

              <td>
                <button
                  className="btn btn-success"
                  onClick={() => handleRegister(batch.id)}
                >
                  Register To Course
                </button>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default DisplayBatches;