// const express = require("express");
// const router = express.Router();
// const pool = require("../db-connection/db");
// // const { v4: uuidv4 } = require("uuid");



// router.post("/registration", (req, res) => {
//   const { email, batch_id } = req.body;

//   if (!email || !batch_id) {
//     return res.status(400).json({ message: "Email and batch_id required" });
//   }

//   // Step 1: Get Student
//   pool.query("SELECT * FROM students WHERE email = ?", [email], (err, student) => {
//     if (err) return res.status(500).json(err);
//     if (student.length === 0)
//       return res.status(404).json({ message: "Student not found" });

//     const studentId = student[0].id;

//     // Step 2: Check ACTIVE registration
//     pool.query(
//       "SELECT * FROM registrations WHERE student_id = ? AND status = 'ACTIVE'",
//       [studentId],
//       (err, existing) => {
//         if (err) return res.status(500).json(err);

//         if (existing.length > 0) {
//           return res.status(400).json({
//             message: "Student already has an ACTIVE registration"
//           });
//         }

//         // Step 3: Get batch fee
//         pool.query(
//           "SELECT fee FROM batches WHERE id = ?",
//           [batch_id],
//           (err, batch) => {
//             if (err) return res.status(500).json(err);
//             if (batch.length === 0)
//               return res.status(404).json({ message: "Batch not found" });

//             const fee = batch[0].fee;
//             const registrationCode = "REG-" + uuidv4();

//             // Step 4: Insert registration
//             db.query(
//               `INSERT INTO registrations 
//                (registration_code, student_id, batch_id, original_fee, final_amount)
//                VALUES (?, ?, ?, ?, ?)`,
//               [registrationCode, studentId, batch_id, fee, fee],
//               (err, result) => {
//                 if (err) return res.status(500).json(err);

//                 res.json({
//                   message: "Registration Successful",
//                   registration_code: registrationCode,
//                   payable_amount: fee
//                 });
//               }
//             );
//           }
//         );
//       }
//     );
//   });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../db-connection/db');


// Utility: Generate Registration Code
function generateRegistrationCode() {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `REG-${Date.now()}-${random}`;
}



// router.post('/', async (req, res) => {

//     const connection = await db.getConnection();

//     try {
//         const { student_id, batch_id, discount_id } = req.body;

//         if (!student_id || !batch_id) {
//             return res.status(400).json({ message: "student_id and batch_id are required" });
//         }

//         await connection.beginTransaction();

//         // 1️⃣ Check student exists
//         const [student] = await connection.query(
//             "SELECT id FROM students WHERE id = ?",
//             [student_id]
//         );

//         if (student.length === 0) {
//             throw new Error("Student not found");
//         }

//         // 2️⃣ Get batch details
//         const [batch] = await connection.query(
//             "SELECT * FROM batches WHERE id = ?",
//             [batch_id]
//         );

//         if (batch.length === 0) {
//             throw new Error("Batch not found");
//         }

//         const batchData = batch[0];

//         // 3️⃣ Check capacity
//         const [count] = await connection.query(
//             "SELECT COUNT(*) AS total FROM registrations WHERE batch_id = ? AND status = 'ACTIVE'",
//             [batch_id]
//         );

//         if (count[0].total >= batchData.capacity) {
//             throw new Error("Batch capacity full");
//         }

//         let original_fee = batchData.fee;
//         let discount_amount = 0;
//         let final_amount = original_fee;

//         // 4️⃣ Apply Discount (if provided)
//         if (discount_id) {

//             const [discount] = await connection.query(
//                 `SELECT * FROM discounts 
//                  WHERE id = ? AND is_active = 1`,
//                 [discount_id]
//             );

//             if (discount.length === 0) {
//                 throw new Error("Invalid or inactive discount");
//             }

//             const discountData = discount[0];

//             // Check date validity
//             const today = new Date().toISOString().split('T')[0];

//             if (
//                 (discountData.start_date && today < discountData.start_date) ||
//                 (discountData.end_date && today > discountData.end_date)
//             ) {
//                 throw new Error("Discount not valid for current date");
//             }

//             if (discountData.value_type === "FLAT") {
//                 discount_amount = Number(discountData.discount_value);
//             } else if (discountData.value_type === "PERCENTAGE") {
//                 discount_amount = (original_fee * Number(discountData.discount_value)) / 100;
//             }

//             final_amount = original_fee - discount_amount;

//             if (final_amount < 0) final_amount = 0;
//         }

//         // 5️⃣ Generate Registration Code
//         const registration_code = generateRegistrationCode();

//         // 6️⃣ Insert into registrations
//         const [registrationResult] = await connection.query(
//             `INSERT INTO registrations
//             (registration_code, student_id, batch_id, original_fee, discount_amount, final_amount)
//             VALUES (?, ?, ?, ?, ?, ?)`,
//             [registration_code, student_id, batch_id, original_fee, discount_amount, final_amount]
//         );

//         const registration_id = registrationResult.insertId;

//         // 7️⃣ Insert into registration_discounts (if discount used)
//         if (discount_id) {
//             await connection.query(
//                 `INSERT INTO registration_discounts
//                 (registration_id, discount_id, discount_amount)
//                 VALUES (?, ?, ?)`,
//                 [registration_id, discount_id, discount_amount]
//             );
//         }

//         await connection.commit();
//         connection.release();

//         res.status(201).json({
//             message: "Registration successful",
//             registration_code,
//             original_fee,
//             discount_amount,
//             final_amount
//         });

//     } catch (error) {

//         await connection.rollback();
//         connection.release();

//         res.status(400).json({ error: error.message });
//     }
// });

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