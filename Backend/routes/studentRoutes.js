const express = require("express");
const router = express.Router();
const pool = require("../db-connection/db");


router.post("/addStudent", (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "All fields required" });
  }

  // Check if student already exists
  pool.query("SELECT * FROM students WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length > 0) {
      return res.json({
        message: "Student already exists",
        student: result[0]
      });
    }

    // Create new student
    pool.query(
      "INSERT INTO students (name, email, phone) VALUES (?, ?, ?)",
      [name, email, phone],
      (err, insertResult) => {
        if (err) return res.status(500).json(err);

        res.json({
          message: "Student Created Successfully",
          student_id: insertResult.insertId
        });
      }
    );
  });
});

module.exports = router;