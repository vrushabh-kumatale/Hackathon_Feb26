const express = require("express");
const router = express.Router();
const db = require("../db-connection/db");



router.post("/courses", (req, res) => {
  const { course_name, description } = req.body;

  if (!course_name) {
    return res.status(400).json({ message: "Course name is required" });
  }

  db.query(
    "INSERT INTO courses (course_name, description) VALUES (?, ?)",
    [course_name, description],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Course Created Successfully",
        course_id: result.insertId
      });
    }
  );
});



// router.post("/batches", (req, res) => {
//   const {
//     course_id,
//     batch_name,
//     fee,
//     capacity,
//     location_mode,
//     start_date,
//     end_date
//   } = req.body;

//   if (!course_id || !batch_name || !fee || !capacity || !location_mode) {
//     return res.status(400).json({ message: "All required fields must be provided" });
//   }

//   if (!["ONLINE", "OFFLINE"].includes(location_mode)) {
//     return res.status(400).json({ message: "Invalid location mode" });
//   }

//   // Check if course exists
//   db.query("SELECT * FROM courses WHERE id = ?", [course_id], (err, course) => {
//     if (err) return res.status(500).json(err);

//     if (course.length === 0) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     // Insert Batch
//     db.query(
//       `INSERT INTO batches 
//        (course_id, batch_name, fee, capacity, location_mode, start_date, end_date)
//        VALUES (?, ?, ?, ?, ?, ?, ?)`,
//       [
//         course_id,
//         batch_name,
//         fee,
//         capacity,
//         location_mode,
//         start_date || null,
//         end_date || null
//       ],
//       (err, result) => {
//         if (err) return res.status(500).json(err);

//         res.json({
//           message: "Batch Created Successfully",
//           batch_id: result.insertId
//         });
//       }
//     );
//   });
// });

router.post("/batches", async (req, res) => {
  try {
    const {
      course_id,
      batch_name,
      fee,
      capacity,
      location_mode,
      start_date,
      end_date
    } = req.body;

    if (!course_id || !batch_name || !fee || !capacity || !location_mode) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    if (!["ONLINE", "OFFLINE"].includes(location_mode)) {
      return res.status(400).json({ message: "Invalid location mode" });
    }

    // Check if course exists
    const [course] = await db.query(
      "SELECT * FROM courses WHERE id = ?",
      [course_id]
    );

    if (course.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Insert Batch
    const [result] = await db.query(
      `INSERT INTO batches 
       (course_id, batch_name, fee, capacity, location_mode, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        course_id,
        batch_name,
        fee,
        capacity,
        location_mode,
        start_date || null,
        end_date || null
      ]
    );

    res.json({
      message: "Batch Created Successfully",
      batch_id: result.insertId
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// router.get("/courses", (req, res) => {
//   db.query("SELECT * FROM courses", (err, result) => {
//     if (err) return res.status(500).json(err);
//     res.json(result);
//   });
// });
router.get("/courses", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM courses");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// router.get("/batches/:course_id", (req, res) => {
//   const course_id = req.params.course_id;

//   db.query(
//     "SELECT * FROM batches WHERE course_id = ?",
//     [course_id],
//     (err, result) => {
//       if (err) return res.status(500).json(err);
//       res.json(result);
//     }
//   );
// });

router.get("/batches", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT b.*, c.course_name
      FROM batches b
      JOIN courses c ON b.course_id = c.id
      ORDER BY b.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;