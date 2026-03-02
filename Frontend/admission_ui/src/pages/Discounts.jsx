
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const CreateDiscount = () => {

//   const allowedTypes = [
//     "EARLY_BIRD",
//     "LOYALTY",
//     "INDIVIDUAL",
//     "COMBO",
//     "FLAT",
//     "PERCENTAGE",
//     "GROUP"
//   ];

//   const [formData, setFormData] = useState({
//     name: "",
//     type: "EARLY_BIRD",
//     value: "",
//     is_percentage: false,
//     start_date: "",
//     end_date: "",
//     config: ""
//   });

//   const [discounts, setDiscounts] = useState([]);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const fetchDiscounts = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/discounts");
//       setDiscounts(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     fetchDiscounts();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (formData.start_date && formData.end_date) {
//       if (new Date(formData.end_date) < new Date(formData.start_date)) {
//         setError("End date must be greater than or equal to start date");
//         return;
//       }
//     }

//     try {
//       const payload = {
//         ...formData,
//         value: Number(formData.value),
//         config: formData.config
//           ? JSON.parse(formData.config)
//           : null
//       };

//       await axios.post("http://localhost:4000/discounts", payload);

//       setSuccess("Discount Created Successfully");
//       fetchDiscounts();

//       setFormData({
//         name: "",
//         type: "EARLY_BIRD",
//         value: "",
//         is_percentage: false,
//         start_date: "",
//         end_date: "",
//         config: ""
//       });

//     } catch (err) {
//       if (err.response?.data?.message) {
//         setError(err.response.data.message);
//       } else {
//         setError("Invalid JSON in Config field");
//       }
//     }
//   };

//   return (
//     <div className="container mt-5">

//       <div className="card shadow">
//         <div className="card-header bg-primary text-white">
//           <h4>Create Discount</h4>
//         </div>

//         <div className="card-body">

//           {error && <div className="alert alert-danger">{error}</div>}
//           {success && <div className="alert alert-success">{success}</div>}

//           <form onSubmit={handleSubmit}>
//             <div className="row">

//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   className="form-control"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Type</label>
//                 <select
//                   name="type"
//                   className="form-select"
//                   value={formData.type}
//                   onChange={handleChange}
//                 >
//                   {allowedTypes.map((t) => (
//                     <option key={t} value={t}>{t}</option>
//                   ))}
//                 </select>
//               </div>

//               <div className="col-md-4 mb-3">
//                 <label className="form-label">Value</label>
//                 <input
//                   type="number"
//                   name="value"
//                   className="form-control"
//                   value={formData.value}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="col-md-4 mb-3 d-flex align-items-end">
//                 <div className="form-check">
//                   <input
//                     type="checkbox"
//                     name="is_percentage"
//                     className="form-check-input"
//                     checked={formData.is_percentage}
//                     onChange={handleChange}
//                   />
//                   <label className="form-check-label">
//                     Is Percentage
//                   </label>
//                 </div>
//               </div>

//               <div className="col-md-6 mb-3">
//                 <label className="form-label">Start Date</label>
//                 <input
//                   type="date"
//                   name="start_date"
//                   className="form-control"
//                   value={formData.start_date}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="col-md-6 mb-3">
//                 <label className="form-label">End Date</label>
//                 <input
//                   type="date"
//                   name="end_date"
//                   className="form-control"
//                   value={formData.end_date}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="col-12 mb-3">
//                 <label className="form-label">Config (JSON)</label>
//                 <textarea
//                   name="config"
//                   className="form-control"
//                   rows="3"
//                   value={formData.config}
//                   onChange={handleChange}
//                   placeholder='{"min_registrations": 2}'
//                 />
//               </div>

//               <div className="col-12">
//                 <button className="btn btn-success w-100">
//                   Create Discount
//                 </button>
//               </div>

//             </div>
//           </form>

//         </div>
//       </div>

//       {/* Discount List */}

//       <div className="card shadow mt-5">
//         <div className="card-header bg-dark text-white">
//           <h4>Discount List</h4>
//         </div>

//         <div className="card-body table-responsive">
//           <table className="table table-bordered table-hover">
//             <thead className="table-light">
//               <tr>
//                 <th>ID</th>
//                 <th>Name</th>
//                 <th>Type</th>
//                 <th>Value</th>
//                 <th>Start</th>
//                 <th>End</th>
//                 <th>Active</th>
//               </tr>
//             </thead>
//             <tbody>
//               {discounts.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" className="text-center">
//                     No Discounts Found
//                   </td>
//                 </tr>
//               ) : (
//                 discounts.map((d) => (
//                   <tr key={d.id}>
//                     <td>{d.id}</td>
//                     <td>{d.name}</td>
//                     <td>{d.type}</td>
//                     <td>
//                       {d.is_percentage
//                         ? `${d.value}%`
//                         : `₹${d.value}`}
//                     </td>
//                     <td>{d.start_date}</td>
//                     <td>{d.end_date || "—"}</td>
//                     <td>
//                       {d.is_active ? (
//                         <span className="badge bg-success">Active</span>
//                       ) : (
//                         <span className="badge bg-danger">Inactive</span>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default CreateDiscount;

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

  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    type: "EARLY_BIRD",
    value: "",
    is_percentage: false,
    start_date: "",
    end_date: "",
    student_ids: [],
    batch_ids: []
  });

  const [discounts, setDiscounts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchDiscounts();
    fetchStudents();
    fetchBatches();
  }, []);

  const fetchDiscounts = async () => {
    const res = await axios.get("http://localhost:4000/discounts");
    setDiscounts(res.data);
  };

  const fetchStudents = async () => {
    const res = await axios.get("http://localhost:4000/students");
    setStudents(res.data);
  };

  const fetchBatches = async () => {
    const res = await axios.get("http://localhost:4000/admin/batches");
    setBatches(res.data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, options } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "select-multiple") {
      const selected = Array.from(options)
        .filter(o => o.selected)
        .map(o => Number(o.value));

      setFormData({ ...formData, [name]: selected });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {

      const payload = {
        name: formData.name,
        type: formData.type,
        value: Number(formData.value),
        is_percentage: formData.is_percentage,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        config: {
          student_ids: formData.student_ids,
          batch_ids: formData.batch_ids
        }
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
        student_ids: [],
        batch_ids: []
      });

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
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
                <label>Name</label>
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
                <label>Type</label>
                <select
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleChange}
                >
                  {allowedTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label>Value</label>
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
                <label>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  className="form-control"
                  value={formData.start_date}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>End Date</label>
                <input
                  type="date"
                  name="end_date"
                  className="form-control"
                  value={formData.end_date}
                  onChange={handleChange}
                />
              </div>

              {/* STUDENT MULTI SELECT */}
              <div className="col-md-6 mb-3">
                <label>Select Students (Optional)</label>
                <select
                  multiple
                  name="student_ids"
                  className="form-select"
                  onChange={handleChange}
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* BATCH MULTI SELECT */}
              <div className="col-md-6 mb-3">
                <label>Select Batches (Optional)</label>
                <select
                  multiple
                  name="batch_ids"
                  className="form-select"
                  onChange={handleChange}
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.batch_name}
                    </option>
                  ))}
                </select>
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

    </div>
  );
};

export default CreateDiscount;