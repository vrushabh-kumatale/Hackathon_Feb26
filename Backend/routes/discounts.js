const express = require('express');
const router = express.Router();
const pool = require('../db-connection/db');

router.post("/", async (req, res) => {
  try {
    const {
      name,
      type,
      value,
      is_percentage,
      start_date,
      end_date,
      config
    } = req.body;

    const allowedTypes = [
      "EARLY_BIRD",
      "LOYALTY",
      "INDIVIDUAL",
      "COMBO",
      "FLAT",
      "PERCENTAGE",
      "GROUP"
    ];

    if (!name || !type || !value) {
      return res.status(400).json({
        message: "Required fields missing"
      });
    }

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        message: "Invalid discount type",
        allowed_types: allowedTypes
      });
    }

    if (start_date && end_date) {
      if (new Date(end_date) < new Date(start_date)) {
        return res.status(400).json({
          message: "End date must be greater than or equal to start date"
        });
      }
    }

    // ✅ Proper date formatting
    const formattedStartDate =
      start_date && start_date.trim() !== "" ? start_date : null;

    const formattedEndDate =
      end_date && end_date.trim() !== "" ? end_date : null;

    const sql = `
      INSERT INTO discounts
      (name, type, value, is_percentage, start_date, end_date, config)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      name,
      type,
      value,
      is_percentage ? 1 : 0,
      formattedStartDate,
      formattedEndDate,
      config ? JSON.stringify(config) : null
    ]);

    res.json({
      message: "Discount created successfully",
      id: result.insertId
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// router.post("/calculate-fee", async (req, res) => {
//   try {
//     const { batch_id, discount_id, student_id } = req.body;

//     // 🔹 Validate batch
//     if (!batch_id) {
//       return res.status(400).json({ error: "Batch is required" });
//     }

//     const [batchRows] = await pool.query(
//       "SELECT fee FROM batches WHERE id = ?",
//       [batch_id]
//     );

//     if (batchRows.length === 0) {
//       return res.status(400).json({ error: "Invalid batch" });
//     }

//     const originalFee = Number(batchRows[0].fee);
//     let discountAmount = 0;

//     // 🔹 If discount selected
//     if (discount_id) {

//       const [discountRows] = await pool.query(
//         `SELECT * FROM discounts 
//          WHERE id = ? 
//          AND is_active = 1
//          AND (start_date IS NULL OR start_date <= CURDATE())
//          AND (end_date IS NULL OR end_date >= CURDATE())`,
//         [discount_id]
//       );

//       if (discountRows.length > 0) {

//         const discount = discountRows[0];

//         // 🔹 Safe Config Handling
//         if (discount.config) {

//           let config;

//           try {
//             config =
//               typeof discount.config === "string"
//                 ? JSON.parse(discount.config)
//                 : discount.config;
//           } catch (err) {
//             console.error("Invalid JSON in config:", err);
//             return res.status(400).json({
//               error: "Invalid discount configuration"
//             });
//           }

//           // 🔹 Student restriction
//           if (
//             config?.student_ids &&
//             config.student_ids.length > 0
//           ) {
//             if (!config.student_ids.includes(Number(student_id))) {
//               return res.status(400).json({
//                 error: "This discount is not valid for this student"
//               });
//             }
//           }

//           // 🔹 Batch restriction
//           if (
//             config?.batch_ids &&
//             config.batch_ids.length > 0
//           ) {
//             if (!config.batch_ids.includes(Number(batch_id))) {
//               return res.status(400).json({
//                 error: "This discount is not valid for this course"
//               });
//             }
//           }
//         }

//         // 🔹 Apply discount
//         if (Number(discount.is_percentage) === 1) {
//           discountAmount =
//             (originalFee * Number(discount.value)) / 100;
//         } else {
//           discountAmount = Number(discount.value);
//         }

//         // 🔹 Prevent negative amount
//         if (discountAmount > originalFee) {
//           discountAmount = originalFee;
//         }
//       }
//     }

//     const finalAmount = originalFee - discountAmount;

//     return res.json({
//       original_fee: originalFee,
//       discount_amount: discountAmount,
//       final_amount: finalAmount
//     });

//   } catch (error) {
//     console.error("Calculate Fee Error:", error);
//     return res.status(500).json({
//       error: "Server error while calculating fee"
//     });
//   }
// });

router.get('/', async (req, res) => {
  try {
    const { student_id, batch_id } = req.query;

    
    if (!student_id || !batch_id) {
      const [allDiscounts] = await pool.query(
        "SELECT * FROM discounts WHERE is_active = 1 ORDER BY id"
      );
      return res.json(allDiscounts);
    }

    const [rows] = await pool.query(`
      SELECT DISTINCT d.*
      FROM discounts d
      LEFT JOIN discount_students ds 
        ON d.id = ds.discount_id
      LEFT JOIN discount_batches dbt 
        ON d.id = dbt.discount_id
      WHERE d.is_active = 1
      AND (
        ds.student_id = ?
        OR dbt.batch_id = ?
        OR (
          NOT EXISTS (SELECT 1 FROM discount_students WHERE discount_id = d.id)
          AND NOT EXISTS (SELECT 1 FROM discount_batches WHERE discount_id = d.id)
        )
      )
      ORDER BY d.id
    `, [student_id, batch_id]);

    res.json(rows);

  } catch (error) {
    console.error("Discount Filter Error:", error);
    res.status(500).json({ error: error.message });
  }
});


router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM discounts WHERE id = ?",
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Discount not found" });
        }

        res.json(rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.put('/:id', async (req, res) => {
    try {
        const {
            discount_name,
            discount_type_id,
            value_type,
            discount_value,
            start_date,
            end_date,
            is_active
        } = req.body;

        const [result] = await pool.query(
            `UPDATE discounts SET
                discount_name = ?,
                discount_type_id = ?,
                value_type = ?,
                discount_value = ?,
                start_date = ?,
                end_date = ?,
                is_active = ?
             WHERE id = ?`,
            [
                discount_name,
                discount_type_id,
                value_type,
                discount_value,
                start_date,
                end_date,
                is_active,
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Discount not found" });
        }

        res.json({ message: "Discount updated successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query(
            "DELETE FROM discounts WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Discount not found" });
        }

        res.json({ message: "Discount deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id/toggle', async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT is_active FROM discounts WHERE id = ?",
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Discount not found" });
        }

        const newStatus = rows[0].is_active ? 0 : 1;

        await db.query(
            "UPDATE discounts SET is_active = ? WHERE id = ?",
            [newStatus, req.params.id]
        );

        res.json({ message: "Discount status updated", is_active: newStatus });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;