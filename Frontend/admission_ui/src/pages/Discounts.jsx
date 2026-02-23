import React, { useState, useEffect } from "react";
import axios from "axios";

const DiscountManager = () => {

  const [discounts, setDiscounts] = useState([]);
  const [formData, setFormData] = useState({
    discount_name: "",
    discount_type_id: "",
    value_type: "FLAT",
    discount_value: "",
    start_date: "",
    end_date: ""
  });

  const [editingId, setEditingId] = useState(null);

  // Fetch all discounts
  const fetchDiscounts = async () => {
    const res = await axios.get("http://localhost:4000/discounts");
    setDiscounts(res.data);
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Add or Update Discount
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:4000/discounts/${editingId}`,
          { ...formData, is_active: 1 }
        );
        alert("Discount Updated Successfully");
      } else {
        await axios.post(
          "http://localhost:4000/discounts",
          formData
        );
        alert("Discount Created Successfully");
      }

      setFormData({
        discount_name: "",
        discount_type_id: "",
        value_type: "FLAT",
        discount_value: "",
        start_date: "",
        end_date: ""
      });

      setEditingId(null);
      fetchDiscounts();

    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  const handleEdit = (discount) => {
    setFormData(discount);
    setEditingId(discount.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4000/discounts/${id}`);
    fetchDiscounts();
  };

  const toggleStatus = async (id) => {
    await axios.patch(`http://localhost:4000/discounts/${id}/toggle`);
    fetchDiscounts();
  };

  return (
    <div className="container mt-4">

      <h2>Discount Management</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-4">

        <input
          type="text"
          name="discount_name"
          placeholder="Discount Name"
          className="form-control mb-2"
          value={formData.discount_name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="discount_type_id"
          placeholder="Discount Type ID"
          className="form-control mb-2"
          value={formData.discount_type_id}
          onChange={handleChange}
          required
        />

        <select
          name="value_type"
          className="form-control mb-2"
          value={formData.value_type}
          onChange={handleChange}
        >
          <option value="FLAT">FLAT</option>
          <option value="PERCENTAGE">PERCENTAGE</option>
        </select>

        <input
          type="number"
          name="discount_value"
          placeholder="Discount Value"
          className="form-control mb-2"
          value={formData.discount_value}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="start_date"
          className="form-control mb-2"
          value={formData.start_date || ""}
          onChange={handleChange}
        />

        <input
          type="date"
          name="end_date"
          className="form-control mb-2"
          value={formData.end_date || ""}
          onChange={handleChange}
        />

        <button className="btn btn-primary">
          {editingId ? "Update Discount" : "Create Discount"}
        </button>
      </form>

      {/* Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Value</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.discount_name}</td>
              <td>{d.value_type}</td>
              <td>{d.discount_value}</td>
              <td>{d.is_active ? "Yes" : "No"}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(d)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-danger me-2"
                  onClick={() => handleDelete(d.id)}
                >
                  Delete
                </button>

                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => toggleStatus(d.id)}
                >
                  Toggle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default DiscountManager;