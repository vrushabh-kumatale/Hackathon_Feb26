import React, { useEffect, useState } from "react";
import axios from "axios";

const RegistrationsList = () => {

  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await axios.get("http://localhost:4000/regList/register");
     setRegistrations(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <h3>All Registrations</h3>

      <table className="table table-bordered table-striped mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Student</th>
            <th>Batch</th>
            <th>Original Fee</th>
            <th>Discount</th>
            <th>Final Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map(reg => (
            <tr key={reg.id}>
              <td>{reg.id}</td>
              <td>{reg.registration_code}</td>
              <td>{reg.student_id}</td>
              <td>{reg.batch_id}</td>
              <td>₹{reg.original_fee}</td>
              <td>₹{reg.discount_amount}</td>
              <td>₹{reg.final_amount}</td>
              <td>{reg.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegistrationsList;