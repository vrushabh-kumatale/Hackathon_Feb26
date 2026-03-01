const express = require('express');
const router = express.Router();
const pool = require('../db-connection/db');

router.get("/registrations", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM registrations ORDER BY id "
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router