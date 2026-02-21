const express = require("express");
const router = express.Router();
const db = require("../config/db");



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



router.post("/batches", (req, res) => {
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
  db.query("SELECT * FROM courses WHERE id = ?", [course_id], (err, course) => {
    if (err) return res.status(500).json(err);

    if (course.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Insert Batch
    db.query(
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
      ],
      (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({
          message: "Batch Created Successfully",
          batch_id: result.insertId
        });
      }
    );
  });
});



router.get("/courses", (req, res) => {
  db.query("SELECT * FROM courses", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});


router.get("/batches/:course_id", (req, res) => {
  const course_id = req.params.course_id;

  db.query(
    "SELECT * FROM batches WHERE course_id = ?",
    [course_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

module.exports = router;