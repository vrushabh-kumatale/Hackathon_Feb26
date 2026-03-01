// Assign discount to batch
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