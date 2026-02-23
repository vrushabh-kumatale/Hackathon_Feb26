const express = require("express");
const router = express.Router();
const pool = require("../db-connection/db");


router.post("/addStudent", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Check if student already exists
    const [existingStudent] = await pool.query(
      "SELECT * FROM students WHERE email = ?",
      [email]
    );

    if (existingStudent.length > 0) {
      return res.json({
        message: "Student already exists",
        student: existingStudent[0]
      });
    }

    // Insert new student
    const [insertResult] = await pool.query(
      "INSERT INTO students (name, email, phone) VALUES (?, ?, ?)",
      [name, email, phone]
    );

    res.json({
      message: "Student Created Successfully",
      student_id: insertResult.insertId
    });

  } catch (error) {
    console.error("Add Student Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
});


router.get("/", async (req, res) => {
  try {
    const [students] = await pool.query(
      "SELECT * FROM students "
    );

    res.json(students);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;