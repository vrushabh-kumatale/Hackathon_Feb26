// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const DiscountManager = () => {

//   const [discounts, setDiscounts] = useState([]);
//   const [formData, setFormData] = useState({
//     discount_name: "",
//     discount_type_id: "",
//     value_type: "FLAT",
//     discount_value: "",
//     start_date: "",
//     end_date: ""
//   });

//   const [editingId, setEditingId] = useState(null);

//   // Fetch all discounts
//   const fetchDiscounts = async () => {
//     const res = await axios.get("http://localhost:4000/discounts");
//     setDiscounts(res.data);
//   };

//   useEffect(() => {
//     fetchDiscounts();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   // Add or Update Discount
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       if (editingId) {
//         await axios.put(
//           `http://localhost:4000/discounts/${editingId}`,
//           { ...formData, is_active: 1 }
//         );
//         alert("Discount Updated Successfully");
//       } else {
//         await axios.post(
//           "http://localhost:4000/discounts/addDiscounts",
//           formData
//         );
//         alert("Discount Created Successfully");
//       }

//       setFormData({
//         discount_name: "",
//         discount_type_id: "",
//         value_type: "FLAT",
//         discount_value: "",
//         start_date: "",
//         end_date: ""
//       });

//       setEditingId(null);
//       fetchDiscounts();

//     } catch (error) {
//       alert(error.response?.data?.message || "Error");
//     }
//   };

//   const handleEdit = (discount) => {
//     setFormData(discount);
//     setEditingId(discount.id);
//   };

//   const handleDelete = async (id) => {
//     await axios.delete(`http://localhost:4000/discounts/${id}`);
//     fetchDiscounts();
//   };

//   const toggleStatus = async (id) => {
//     await axios.patch(`http://localhost:4000/discounts/${id}/toggle`);
//     fetchDiscounts();
//   };

//   return (
//     <div className="container mt-4">

//       <h2>Discount Management</h2>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="mb-4">

//         <input
//           type="text"
//           name="discount_name"
//           placeholder="Discount Name"
//           className="form-control mb-2"
//           value={formData.discount_name}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="number"
//           name="discount_type_id"
//           placeholder="Discount Type ID"
//           className="form-control mb-2"
//           value={formData.discount_type_id}
//           onChange={handleChange}
//           required
//         />

//         <select
//           name="value_type"
//           className="form-control mb-2"
//           value={formData.value_type}
//           onChange={handleChange}
//         >
//           <option value="FLAT">FLAT</option>
//           <option value="PERCENTAGE">PERCENTAGE</option>
//         </select>

//         <input
//           type="number"
//           name="discount_value"
//           placeholder="Discount Value"
//           className="form-control mb-2"
//           value={formData.discount_value}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="date"
//           name="start_date"
//           className="form-control mb-2"
//           value={formData.start_date || ""}
//           onChange={handleChange}
//         />

//         <input
//           type="date"
//           name="end_date"
//           className="form-control mb-2"
//           value={formData.end_date || ""}
//           onChange={handleChange}
//         />

//         <button className="btn btn-primary">
//           {editingId ? "Update Discount" : "Create Discount"}
//         </button>
//       </form>

//       {/* Table */}
//       <table className="table table-bordered">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Type</th>
//             <th>Value</th>
//             <th>Active</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {discounts.map(d => (
//             <tr key={d.id}>
//               <td>{d.id}</td>
//               <td>{d.discount_name}</td>
//               <td>{d.value_type}</td>
//               <td>{d.discount_value}</td>
//               <td>{d.is_active ? "Yes" : "No"}</td>
//               <td>
//                 <button
//                   className="btn btn-sm btn-warning me-2"
//                   onClick={() => handleEdit(d)}
//                 >
//                   Edit
//                 </button>

//                 <button
//                   className="btn btn-sm btn-danger me-2"
//                   onClick={() => handleDelete(d.id)}
//                 >
//                   Delete
//                 </button>

//                 <button
//                   className="btn btn-sm btn-secondary"
//                   onClick={() => toggleStatus(d.id)}
//                 >
//                   Toggle
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//     </div>
//   );
// };

// export default DiscountManager;


import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateDiscount = () => {

  const allowedTypes = [
    "EARLY_BIRD",
    "LOYALTY",
    "INDIVIDUAL",
    "COMBO",
    "FLAT",
    "PERCENTAGE",
    "GROUP"
  ];

  const [formData, setFormData] = useState({
    name: "",
    type: "EARLY_BIRD",
    value: "",
    is_percentage: false,
    start_date: "",
    end_date: "",
    config: ""
  });

  const [discounts, setDiscounts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchDiscounts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/discounts");
      setDiscounts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.end_date) < new Date(formData.start_date)) {
        setError("End date must be greater than or equal to start date");
        return;
      }
    }

    try {
      const payload = {
        ...formData,
        value: Number(formData.value),
        config: formData.config
          ? JSON.parse(formData.config)
          : null
      };

      await axios.post("http://localhost:4000/discounts", payload);

      setSuccess("Discount Created Successfully");
      fetchDiscounts();

      setFormData({
        name: "",
        type: "EARLY_BIRD",
        value: "",
        is_percentage: false,
        start_date: "",
        end_date: "",
        config: ""
      });

    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid JSON in Config field");
      }
    }
  };

  return (
    <div className="container mt-5">

      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h4>Create Discount</h4>
        </div>

        <div className="card-body">

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">

              <div className="col-md-6 mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Type</label>
                <select
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleChange}
                >
                  {allowedTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Value</label>
                <input
                  type="number"
                  name="value"
                  className="form-control"
                  value={formData.value}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3 d-flex align-items-end">
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="is_percentage"
                    className="form-check-input"
                    checked={formData.is_percentage}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">
                    Is Percentage
                  </label>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  className="form-control"
                  value={formData.start_date}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  className="form-control"
                  value={formData.end_date}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Config (JSON)</label>
                <textarea
                  name="config"
                  className="form-control"
                  rows="3"
                  value={formData.config}
                  onChange={handleChange}
                  placeholder='{"min_registrations": 2}'
                />
              </div>

              <div className="col-12">
                <button className="btn btn-success w-100">
                  Create Discount
                </button>
              </div>

            </div>
          </form>

        </div>
      </div>

      {/* Discount List */}

      <div className="card shadow mt-5">
        <div className="card-header bg-dark text-white">
          <h4>Discount List</h4>
        </div>

        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Value</th>
                <th>Start</th>
                <th>End</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {discounts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No Discounts Found
                  </td>
                </tr>
              ) : (
                discounts.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.name}</td>
                    <td>{d.type}</td>
                    <td>
                      {d.is_percentage
                        ? `${d.value}%`
                        : `₹${d.value}`}
                    </td>
                    <td>{d.start_date}</td>
                    <td>{d.end_date || "—"}</td>
                    <td>
                      {d.is_active ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-danger">Inactive</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default CreateDiscount;