import React, { useState, useEffect } from "react";
import axios from "axios";

const RegistrationForm = () => {

  const [formData, setFormData] = useState({
    student_id: "",
    batch_id: "",
    discount_id: ""
  });

  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [result, setResult] = useState(null);

  // Fetch dropdown data
  const fetchData = async () => {
    const studentRes = await axios.get("http://localhost:4000/students");
    const batchRes = await axios.get("http://localhost:4000/admin/batches");
    const discountRes = await axios.get("http://localhost:4000/discounts");

    setStudents(studentRes.data);
    setBatches(batchRes.data);
    setDiscounts(discountRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        student_id: Number(formData.student_id),
        batch_id: Number(formData.batch_id),
        discount_id: formData.discount_id
          ? Number(formData.discount_id)
          : null
      };

      const res = await axios.post(
        "http://localhost:4000/register",
        payload
      );

      setResult(res.data);

    } catch (error) {
      alert(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Student Registration</h2>

      <form onSubmit={handleSubmit}>

        {/* Student */}
        <div className="mb-3">
          <label>Select Student</label>
          <select
            name="student_id"
            className="form-control"
            value={formData.student_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Student</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.email})
              </option>
            ))}
          </select>
        </div>

        {/* Batch */}
        <div className="mb-3">
          <label>Select Batch</label>
          <select
            name="batch_id"
            className="form-control"
            value={formData.batch_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Batch</option>
            {batches.map(b => (
              <option key={b.id} value={b.id}>
                {b.batch_name} - ₹{b.fee}
              </option>
            ))}
          </select>
        </div>

        {/* Discount */}
        <div className="mb-3">
          <label>Select Discount (Optional)</label>
          <select
            name="discount_id"
            className="form-control"
            value={formData.discount_id}
            onChange={handleChange}
          >
            <option value="">No Discount</option>
            {discounts.map(d => (
              <option key={d.id} value={d.id}>
                {d.discount_name}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-success">
          Register Student
        </button>

      </form>

      {/* Show Result */}
      {result && (
        <div className="mt-4 alert alert-info">
          <h5>Registration Successful</h5>
          <p><strong>Registration Code:</strong> {result.registration_code}</p>
          <p><strong>Original Fee:</strong> ₹{result.original_fee}</p>
          <p><strong>Discount:</strong> ₹{result.discount_amount}</p>
          <p><strong>Final Amount:</strong> ₹{result.final_amount}</p>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;