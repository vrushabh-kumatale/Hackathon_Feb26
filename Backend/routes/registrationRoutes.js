

// const express = require('express');
// const router = express.Router();
// const pool = require('../db-connection/db');


// // Utility: Generate Registration Code
// function generateRegistrationCode() {
//     const random = Math.floor(1000 + Math.random() * 9000);
//     return `REG-${Date.now()}-${random}`;
// }


// router.post("/register", async (req, res) => {
//   try {
//     const { student_id, batch_id, discount_id } = req.body;

//     if (!student_id || !batch_id) {
//       return res.status(400).json({ error: "Student & Batch required" });
//     }

//     // 1️⃣ Get batch fee
//     const [batchRows] = await pool.query(
//       "SELECT fee FROM batches WHERE id = ?",
//       [batch_id]
//     );

//     if (batchRows.length === 0) {
//       return res.status(400).json({ error: "Invalid batch" });
//     }

//     const originalFee = Number(batchRows[0].fee);
//     let discountAmount = 0;

//     // 2️⃣ Apply discount
//     if (discount_id) {
//       const [discountRows] = await pool.query(
//         `SELECT * FROM discounts 
//          WHERE id = ? 
//          AND is_active = 1
//          AND start_date <= CURDATE()
//          AND (end_date IS NULL OR end_date >= CURDATE())`,
//         [discount_id]
//       );

//       if (discountRows.length > 0) {
//         const discount = discountRows[0];

//         if (Number(discount.is_percentage) === 1) {
//           discountAmount =
//             (originalFee * Number(discount.value)) / 100;
//         } else {
//           discountAmount = Number(discount.value);
//         }

//         if (discountAmount > originalFee) {
//           discountAmount = originalFee;
//         }
//       }
//     }

//     const finalAmount = originalFee - discountAmount;

//     // 3️⃣ Generate registration code
//     const registrationCode =
//       "REG-" + Date.now() + "-" + Math.floor(Math.random() * 10000);

//     // 4️⃣ Insert into registrations table
//     await pool.query(
//       `INSERT INTO registrations 
//       (registration_code, student_id, batch_id, original_fee, discount_amount, final_amount, status)
//       VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')`,
//       [
//         registrationCode,
//         student_id,
//         batch_id,
//         originalFee,
//         discountAmount,
//         finalAmount
//       ]
//     );

//     res.json({
//       message: "Registration Successful",
//       registration_code: registrationCode
//     });

//   } catch (error) {
//     console.error("Register Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const pool = require("../db-connection/db");


// ===============================
// 1️⃣ CALCULATE FEE ROUTE
// URL: POST /register/calculate-fee
// ===============================
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
          discountAmount = (originalFee * Number(discount.value)) / 100;
        } else {
          discountAmount = Number(discount.value);
        }

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


// ===============================
// 2️⃣ REGISTER STUDENT ROUTE
// URL: POST /register
// ===============================
router.post("/", async (req, res) => {
  try {
    const { student_id, batch_id, discount_id } = req.body;

    if (!student_id || !batch_id) {
      return res.status(400).json({ error: "Student & Batch required" });
    }

    // Get batch fee
    const [batchRows] = await pool.query(
      "SELECT fee FROM batches WHERE id = ?",
      [batch_id]
    );

    if (batchRows.length === 0) {
      return res.status(400).json({ error: "Invalid batch" });
    }

    const originalFee = Number(batchRows[0].fee);
    let discountAmount = 0;

    // Apply discount
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
          discountAmount = (originalFee * Number(discount.value)) / 100;
        } else {
          discountAmount = Number(discount.value);
        }

        if (discountAmount > originalFee) {
          discountAmount = originalFee;
        }
      }
    }

    const finalAmount = originalFee - discountAmount;

    // Generate registration code
    const registrationCode =
      "REG-" + Date.now() + "-" + Math.floor(Math.random() * 10000);

    // Insert into DB
    await pool.query(
      `INSERT INTO registrations 
      (registration_code, student_id, batch_id, original_fee, discount_amount, final_amount, status)
      VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')`,
      [
        registrationCode,
        student_id,
        batch_id,
        originalFee,
        discountAmount,
        finalAmount
      ]
    );

    res.json({
      message: "Registration Successful",
      registration_code: registrationCode
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/student-discount", async (req, res) => {
  try {
    const { batch_id } = req.query;

    if (!batch_id) {
      return res.json([]);
    }

    const [rows] = await pool.query(
      `SELECT d.*
       FROM batch_discounts bd
       JOIN discounts d ON bd.discount_id = d.id
       WHERE bd.batch_id = ?`,
      [batch_id]   // ✔ Only ONE value
    );

    res.json(rows);

  } catch (error) {
    console.error("Discount Fetch Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;