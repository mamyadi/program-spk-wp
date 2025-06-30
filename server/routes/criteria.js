const express = require("express");
const router = express.Router();
const db = require("../config/db");
const checkAuth = require("../middleware/check-auth");

// Get all criteria
router.get("/", checkAuth, (req, res) => {
  db.query("SELECT * FROM criteria ORDER BY id ASC", (error, results) => {
    if (error) {
      console.error("Error fetching criteria:", error);
      return res.status(500).json({
        message: "Database error",
      });
    }
    res.status(200).json({
      criteria: results,
    });
  });
});

// Get a single criterion
router.get("/:id", checkAuth, (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM criteria WHERE id = ?", [id], (error, results) => {
    if (error) {
      console.error("Error fetching criterion:", error);
      return res.status(500).json({
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Criterion not found",
      });
    }

    res.status(200).json({
      criterion: results[0],
    });
  });
});

// Create a new criterion
router.post("/", checkAuth, (req, res) => {
  const { code, name, weight, type } = req.body;

  if (!code || !name || !weight || !type) {
    return res.status(400).json({
      message: "All fields are required (code, name, weight, type)",
    });
  }

  // Check if type is valid
  if (!["benefit", "cost"].includes(type)) {
    return res.status(400).json({
      message: 'Type must be either "benefit" or "cost"',
    });
  }

  const criterion = {
    code,
    name,
    weight,
    type,
  };

  db.query("INSERT INTO criteria SET ?", criterion, (error, result) => {
    if (error) {
      console.error("Error creating criterion:", error);
      return res.status(500).json({
        message: "Database error",
      });
    }

    res.status(201).json({
      message: "Criterion created successfully",
      createdCriterion: {
        id: result.insertId,
        ...criterion,
      },
    });
  });
});

// Update a criterion
router.put("/:id", checkAuth, (req, res) => {
  const id = req.params.id;
  const { code, name, weight, type } = req.body;

  if (!code || !name || !weight || !type) {
    return res.status(400).json({
      message: "All fields are required (code, name, weight, type)",
    });
  }

  // Check if type is valid
  if (!["benefit", "cost"].includes(type)) {
    return res.status(400).json({
      message: 'Type must be either "benefit" or "cost"',
    });
  }

  const criterion = {
    code,
    name,
    weight,
    type,
  };

  db.query(
    "UPDATE criteria SET ? WHERE id = ?",
    [criterion, id],
    (error, result) => {
      if (error) {
        console.error("Error updating criterion:", error);
        return res.status(500).json({
          message: "Database error",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Criterion not found",
        });
      }

      res.status(200).json({
        message: "Criterion updated successfully",
        updatedCriterion: {
          id,
          ...criterion,
        },
      });
    }
  );
});

// Delete a criterion
router.delete("/:id", checkAuth, (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM criteria WHERE id = ?", [id], (error, result) => {
    if (error) {
      console.error("Error deleting criterion:", error);
      return res.status(500).json({
        message: "Database error",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Criterion not found",
      });
    }

    res.status(200).json({
      message: "Criterion deleted successfully",
    });
  });
});

module.exports = router;
