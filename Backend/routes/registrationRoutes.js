

const express = require('express');
const router = express.Router();
const pool = require('../db-connection/db');


// Utility: Generate Registration Code
function generateRegistrationCode() {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `REG-${Date.now()}-${random}`;
}


router.post("/calculate-fee", async (req, res) => {
  try {
    const { batch_id, discount_id } = req.body;

    if (!batch_id) {
      return res.status(400).json({ error: "Batch required" });
    }

    const [batchRows] = await pool.query(
      "SELECT fee FROM batches WHERE id = ?",
      [batch_id]
    );

    if (batchRows.length === 0) {
      return res.status(400).json({ error: "Invalid batch" });
    }

    const originalFee = Number(batchRows[0].fee);
    let discountAmount = 0;

    if (discount_id) {
      const [discountRows] = await pool.query(
        `SELECT * FROM discounts 
         WHERE id = ? 
         AND is_active = 1
         AND start_date <= CURDATE()
         AND (end_date IS NULL OR end_date >= CURDATE())`,
        [discount_id]
      );

      if (discountRows.length > 0) {
        const discount = discountRows[0];

        if (Number(discount.is_percentage) === 1) {
          discountAmount =
            (originalFee * Number(discount.value)) / 100;
        } else {
          discountAmount = Number(discount.value);
        }

        // Prevent negative amount
        if (discountAmount > originalFee) {
          discountAmount = originalFee;
        }
      }
    }

    const finalAmount = originalFee - discountAmount;

    res.json({
      original_fee: originalFee,
      discount_amount: discountAmount,
      final_amount: finalAmount
    });

  } catch (error) {
    console.error("Calculate Fee Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;