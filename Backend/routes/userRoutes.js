const express = require('express')
const cryptoJs = require('crypto-js')
const jwt = require('jsonwebtoken')
const pool = require("../db-connection/db");
const  result  = require('../utils/result');
const config = require('../utils/config')

const router = express.Router()


router.post('/register', async (req, res) => {
  try {
    console.log("reg");

    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        status: "error",
        error: "All fields are required"
      });
    }

    const encryptedPassword = String(cryptoJs.SHA256(password));

    const sql = `INSERT INTO users(email, password, role) VALUES(?,?,?)`;

    const [data] = await pool.query(sql, [
      email,
      encryptedPassword,
      role
    ]);

    res.json({
      status: "success",
      data: data
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = cryptoJs.SHA256(password).toString();

    const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;

    const [data] = await pool.query(sql, [email, hashedPassword]);

    if (data.length === 0) {
      return res.send(result.createResult("Invalid email or password"));
    }

    const user = data[0];

    console.log("user:", user);

    const payload = {
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, config.secret, { expiresIn: "1h" });

    const userData = {
      email: user.email,
      role: user.role,
      token,
    };

    res.send(result.createResult(null, userData));

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).send(result.createResult(error.message));
  }
});
module.exports = router;