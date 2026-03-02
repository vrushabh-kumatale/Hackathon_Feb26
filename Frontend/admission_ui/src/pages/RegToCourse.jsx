import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    student_id: "",
    batch_id: "",
    discount_id: ""
  });

  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [calculation, setCalculation] = useState(null);
  const [loading, setLoading] = useState(false);

  // ============================
  // Fetch Initial Data
  // ============================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentRes, batchRes, discountRes] = await Promise.all([
        axios.get("http://localhost:4000/students"),
        axios.get("http://localhost:4000/admin/batches"),
        axios.get("http://localhost:4000/discounts")
      ]);

      setStudents(studentRes.data);
      setBatches(batchRes.data);
      setDiscounts(discountRes.data);

    } catch (error) {
      console.log("Fetch Error:", error);
    }
  };

  // ============================
  // Handle Change + Live Fee
  // ============================
  const handleChange = async (e) => {
    const { name, value } = e.target;

    const updatedForm = {
      ...formData,
      [name]: value
    };

    setFormData(updatedForm);

    // Reset calculation if batch removed
    if (!updatedForm.batch_id) {
      setCalculation(null);
      return;
    }

    // Live fee calculation
    if (name === "batch_id" || name === "discount_id") {
      try {
        const res = await axios.post(
          "http://localhost:4000/register/calculate-fee",
          {
            batch_id: Number(updatedForm.batch_id),
            discount_id: updatedForm.discount_id
              ? Number(updatedForm.discount_id)
              : null
          }
        );

        setCalculation(res.data);

      } catch (error) {
        console.log("Calculation Error:", error);
        setCalculation(null);
      }
    }
  };

  // ============================
  // Submit Registration
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        student_id: Number(formData.student_id),
        batch_id: Number(formData.batch_id),
        discount_id: formData.discount_id
          ? Number(formData.discount_id)
          : null
      };

      await axios.post(
        "http://localhost:4000/register",
        payload
      );

      alert("Registration Successful ✅");

      // Reset form
      setFormData({
        student_id: "",
        batch_id: "",
        discount_id: ""
      });

      setCalculation(null);

      navigate("/regList");

    } catch (error) {
      alert(error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">

      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h4>Student Registration</h4>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            {/* Student */}
            <div className="mb-3">
              <label className="form-label">Select Student</label>
              <select
                name="student_id"
                className="form-select"
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
              <label className="form-label">Select Batch</label>
              <select
                name="batch_id"
                className="form-select"
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
              <label className="form-label">Select Discount (Optional)</label>
              <select
                name="discount_id"
                className="form-select"
                value={formData.discount_id}
                onChange={handleChange}
              >
                <option value="">No Discount</option>
                {discounts.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.is_percentage ? `${d.value}%` : `₹${d.value}`})
                  </option>
                ))}
              </select>
            </div>

            {/* Live Fee Display */}
            {calculation && (
              <div className="alert alert-info mt-3">
                <p><strong>Original Fee:</strong> ₹{calculation.original_fee}</p>
                <p><strong>Discount:</strong> ₹{calculation.discount_amount}</p>
                <hr />
                <h5>
                  Remaining Payable Amount: ₹{calculation.final_amount}
                </h5>
              </div>
            )}

            <button 
              className="btn btn-success w-100 mt-3"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register Student"}
            </button>

          </form>

        </div>
      </div>

    </div>
  );
};

export default RegistrationForm;