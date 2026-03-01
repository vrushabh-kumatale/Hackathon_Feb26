import React, { useEffect, useState } from "react";
import axios from "axios";

const RegistrationsList = () => {

  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await axios.get("http://localhost:4000/regList/registrations");
      setRegistrations(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">

      <div className="card shadow">
        <div className="card-header bg-dark text-white">
          <h4>All Registrations</h4>
        </div>

        <div className="card-body">

          <table className="table table-bordered table-striped">
            <thead className="table-primary">
              <tr>
                <th>ID</th>
                <th>Registration Code</th>
                <th>Student ID</th>
                <th>Batch ID</th>
                <th>Original Fee</th>
                <th>Discount</th>
                <th>Final Amount</th>
                <th>Status</th>
                <th>Registered At</th>
              </tr>
            </thead>

            <tbody>
              {registrations.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.registration_code}</td>
                  <td>{r.student_id}</td>
                  <td>{r.batch_id}</td>
                  <td>₹{r.original_fee}</td>
                  <td>₹{r.discount_amount}</td>
                  <td><strong>₹{r.final_amount}</strong></td>
                  <td>
                    <span className="badge bg-success">
                      {r.status}
                    </span>
                  </td>
                  <td>{new Date(r.registered_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
};

export default RegistrationsList;