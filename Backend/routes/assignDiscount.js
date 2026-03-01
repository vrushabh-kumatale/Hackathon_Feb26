// Assign discount to batch
const express = require('express');
const router = express.Router();
const pool = require('../db-connection/db');
router.post("/assign-discount", async (req, res) => {
  try {
    const { batch_id, discount_id } = req.body;

    await pool.query(
      "INSERT INTO batch_discounts (batch_id, discount_id) VALUES (?, ?)",
      [batch_id, discount_id]
    );

    res.json({ message: "Discount assigned to batch successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/discounts/by-batch/:batchId", async (req, res) => {
  try {
    const { batchId } = req.params;

    const [rows] = await pool.query(`
      SELECT d.*
      FROM discounts d
      JOIN batch_discounts bd ON d.id = bd.discount_id
      WHERE bd.batch_id = ?
      AND d.is_active = 1
      AND (d.end_date IS NULL OR d.end_date >= CURDATE())
    `, [batchId]);

    res.json(rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all assigned discounts with batch & discount name
router.get("/assigned-list", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        bd.id,
        b.batch_name,
        d.name AS discount_name,
        d.type,
        d.value,
        d.is_percentage
      FROM batch_discounts bd
      JOIN batches b ON bd.batch_id = b.id
      JOIN discounts d ON bd.discount_id = d.id
    `);

    res.json(rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;