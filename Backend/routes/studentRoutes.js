const express = require("express");
const router = express.Router();
const pool = require("../db-connection/db");
const bcrypt = require("bcrypt");
const result = require('../utils/result')
const cryptoJs = require('crypto-js')
const jwt = require("jsonwebtoken");
const config = require('../utils/config')

router.post("/addStudent", async (req, res) => {
  try {
    const { name, email, phone, batch_id } = req.body;

    if (!name || !email || !phone || !batch_id) {
      return res.status(400).json({ message: "All fields required" });
    }

    const [existingStudent] = await pool.query(
      "SELECT * FROM students WHERE email = ?",
      [email]
    );

    let studentId;

    if (existingStudent.length > 0) {
      studentId = existingStudent[0].id;
    } else {
      const defaultPassword = "sunbeam123";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      const [insertResult] = await pool.query(
        "INSERT INTO students (name, email, phone, password) VALUES (?, ?, ?, ?)",
        [name, email, phone, hashedPassword]
      );

      studentId = insertResult.insertId;
    }

    const registrationCode = "REG-" + Date.now();

    const originalFee = 50000;
    const discountAmount = 0o0;
    const finalAmount = originalFee - discountAmount;

    await pool.query(
      `INSERT INTO registrations
      (registration_code, student_id, batch_id, original_fee, discount_amount, final_amount, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        registrationCode,
        studentId,
        batch_id,
        originalFee,
        discountAmount,
        finalAmount,
        "ACTIVE"
      ]
    );

    res.json({
      message: "Student & Registration Created Successfully",
      student_id: studentId,
      registration_code: registrationCode
    });

  } catch (error) {
    console.error("Add Student Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find user by email only
    const [data] = await pool.query(
      "SELECT * FROM students WHERE email = ?",
      [email]
    );

    if (data.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = data[0];

    // 2️⃣ Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // 3️⃣ Create JWT token
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, config.secret, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: error.message });
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