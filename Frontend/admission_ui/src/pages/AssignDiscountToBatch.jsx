import React, { useEffect, useState } from "react";
import axios from "axios";

const AssignDiscountToBatch = () => {

  const [batches, setBatches] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [batchId, setBatchId] = useState("");
  const [discountId, setDiscountId] = useState("");
  const [assigned, setAssigned] = useState([]);

  useEffect(() => {
    fetchData();
    fetchAssigned();
  }, []);

  const fetchData = async () => {
    const batchRes = await axios.get("http://localhost:4000/admin/batches");
    const discountRes = await axios.get("http://localhost:4000/discounts");

    setBatches(batchRes.data);
    setDiscounts(discountRes.data);
  };

  const fetchAssigned = async () => {
    const res = await axios.get(
      "http://localhost:4000/assignDiscount/assigned-list"
    );
    setAssigned(res.data);
  };

  const handleAssign = async () => {
    await axios.post("http://localhost:4000/assignDiscount/assign-discount", {
      batch_id: batchId,
      discount_id: discountId
    });

    alert("Discount Assigned Successfully");
  };

  return (
    <div className="card p-4">
      <h4>Assign Discount To Course</h4>

      <select
        className="form-select mb-3"
        onChange={(e) => setBatchId(e.target.value)}
      >
        <option>Select Batch</option>
        {batches.map(b => (
          <option key={b.id} value={b.id}>
            {b.batch_name}
          </option>
        ))}
      </select>

      <select
        className="form-select mb-3"
        onChange={(e) => setDiscountId(e.target.value)}
      >
        <option>Select Discount</option>
        {discounts.map(d => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      <button className="btn btn-success" onClick={handleAssign}>
        Assign
      </button>
    </div>
  );
};

export default AssignDiscountToBatch;