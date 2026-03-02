const express = require("express");
const router = express.Router();
const pool = require("../db-connection/db");
const bcrypt = require("bcrypt");
const result = require('../utils/result')
const cryptoJs = require('crypto-js')
const jwt = require("jsonwebtoken");
const config = require('../utils/config')



// router.post("/addStudent", async (req, res) => {
//   try {
//     const { name, email, phone } = req.body;

//     if (!name || !email || !phone) {
//       return res.status(400).json({ message: "All fields required" });
//     }

//     // Check if student already exists
//     const [existingStudent] = await pool.query(
//       "SELECT * FROM students WHERE email = ?",
//       [email]
//     );

//     if (existingStudent.length > 0) {
//       return res.json({
//         message: "Student already exists",
//         student: existingStudent[0]
//       });
//     }

//     // Insert new student
//     const [insertResult] = await pool.query(
//       "INSERT INTO students (name, email, phone) VALUES (?, ?, ?)",
//       [name, email, phone]
//     );

//     res.json({
//       message: "Student Created Successfully",
//       student_id: insertResult.insertId
//     });

//   } catch (error) {
//     console.error("Add Student Error:", error);
//     res.status(500).json({
//       message: "Server Error",
//       error: error.message
//     });
//   }
// });



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

    // ✅ Hardcoded Password
    const defaultPassword = "sunbeam123";

    // ✅ Encrypt Password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

    // ✅ Insert new student with encrypted password
    const [insertResult] = await pool.query(
      "INSERT INTO students (name, email, phone, password) VALUES (?, ?, ?, ?)",
      [name, email, phone, hashedPassword]
    );

    res.json({
      message: "Student Created Successfully",
      student_id: insertResult.insertId,
      default_password: defaultPassword   // optional (for testing)
    });

  } catch (error) {
    console.error("Add Student Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
});

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const hashedPassword = cryptoJs.SHA256(password).toString();

//     const sql = `SELECT * FROM students WHERE email = ? AND password = ?`;

//     const [data] = await pool.query(sql, [email, hashedPassword]);

//     if (data.length === 0) {
//       return res.send(result.createResult("Invalid email or password"));
//     }

//     const user = data[0];

//     console.log("user:", user);

//     const payload = {
//       email: user.email,
//       role: user.role,
//     };

//     const token = jwt.sign(payload, config.secret, { expiresIn: "1h" });

//     const userData = {
//       email: user.email,
//       role: user.role,
//       token,
//     };

//     res.send(result.createResult(null, userData));

//   } catch (error) {
//     console.error("LOGIN ERROR:", error);
//     res.status(500).send(result.createResult(error.message));
//   }
// });



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