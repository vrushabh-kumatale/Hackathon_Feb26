const express = require('express');
const router = express.Router();
const pool = require('../db-connection/db');



// router.post('/addDiscounts', async (req, res) => {
//     try {
//         const {
//             discount_name,
//             discount_type_id,
//             value_type,
//             discount_value,
//             start_date,
//             end_date
//         } = req.body;

//         if (!discount_name || !discount_type_id || !value_type || !discount_value) {
//             return res.status(400).json({ message: "Required fields missing" });
//         }

//         if (!['FLAT', 'PERCENTAGE'].includes(value_type)) {
//             return res.status(400).json({ message: "Invalid value_type" });
//         }

//         const [result] = await pool.query(
//             `INSERT INTO discounts
//             (discount_name, discount_type_id, value_type, discount_value, start_date, end_date)
//             VALUES (?, ?, ?, ?, ?, ?)`,
//             [discount_name, discount_type_id, value_type, discount_value, start_date, end_date]
//         );

//         res.status(201).json({
//             message: "Discount created successfully",
//             id: result.insertId
//         });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
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

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM discounts ORDER BY id"
        );
        res.json(rows);
    } catch (error) {
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