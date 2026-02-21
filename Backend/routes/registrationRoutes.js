const express = require("express");
const router = express.Router();
const pool = require("../db-connection/db");
// const { v4: uuidv4 } = require("uuid");



router.post("/registration", (req, res) => {
  const { email, batch_id } = req.body;

  if (!email || !batch_id) {
    return res.status(400).json({ message: "Email and batch_id required" });
  }

  // Step 1: Get Student
  pool.query("SELECT * FROM students WHERE email = ?", [email], (err, student) => {
    if (err) return res.status(500).json(err);
    if (student.length === 0)
      return res.status(404).json({ message: "Student not found" });

    const studentId = student[0].id;

    // Step 2: Check ACTIVE registration
    pool.query(
      "SELECT * FROM registrations WHERE student_id = ? AND status = 'ACTIVE'",
      [studentId],
      (err, existing) => {
        if (err) return res.status(500).json(err);

        if (existing.length > 0) {
          return res.status(400).json({
            message: "Student already has an ACTIVE registration"
          });
        }

        // Step 3: Get batch fee
        pool.query(
          "SELECT fee FROM batches WHERE id = ?",
          [batch_id],
          (err, batch) => {
            if (err) return res.status(500).json(err);
            if (batch.length === 0)
              return res.status(404).json({ message: "Batch not found" });

            const fee = batch[0].fee;
            const registrationCode = "REG-" + uuidv4();

            // Step 4: Insert registration
            db.query(
              `INSERT INTO registrations 
               (registration_code, student_id, batch_id, original_fee, final_amount)
               VALUES (?, ?, ?, ?, ?)`,
              [registrationCode, studentId, batch_id, fee, fee],
              (err, result) => {
                if (err) return res.status(500).json(err);

                res.json({
                  message: "Registration Successful",
                  registration_code: registrationCode,
                  payable_amount: fee
                });
              }
            );
          }
        );
      }
    );
  });
});

module.exports = router;