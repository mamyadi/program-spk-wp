const express = require("express");
const router = express.Router();
const db = require("../config/db");
const checkAuth = require("../middleware/check-auth");

// Get all alternatives with their scores
router.get("/", checkAuth, (req, res) => {
  console.log("Fetching all alternatives");

  // Use a simpler query approach that's less prone to SQL syntax errors
  db.query(
    "SELECT * FROM alternatives ORDER BY id ASC",
    (error, alternatives) => {
      if (error) {
        console.error("Error fetching alternatives:", error);
        return res.status(500).json({
          message: "Database error",
        });
      }

      // If no alternatives, return empty array
      if (!alternatives.length) {
        return res.status(200).json({ alternatives: [] });
      }

      // Get all scores for all alternatives in a separate query
      db.query("SELECT * FROM scores", (scoresError, scores) => {
        if (scoresError) {
          console.error("Error fetching scores:", scoresError);
          return res.status(500).json({
            message: "Database error fetching scores",
          });
        }

        // Map scores to alternatives
        const alternativesWithScores = alternatives.map((alt) => {
          const altScores = scores.filter(
            (score) => score.alternative_id === alt.id
          );
          return {
            ...alt,
            scores: altScores.map((score) => ({
              id: score.id,
              criteria_id: score.criteria_id,
              value: score.value,
            })),
          };
        });

        console.log(
          `Successfully fetched ${alternativesWithScores.length} alternatives`
        );
        res.status(200).json({
          alternatives: alternativesWithScores,
        });
      });
    }
  );
});

// Get a single alternative with its scores
router.get("/:id", checkAuth, (req, res) => {
  const id = req.params.id;
  console.log(`Fetching alternative with ID: ${id}`);

  // Get the alternative first
  db.query(
    "SELECT * FROM alternatives WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.error("Error fetching alternative:", error);
        return res.status(500).json({
          message: "Database error",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Alternative not found",
        });
      }

      const alternative = results[0];

      // Get scores for this alternative
      db.query(
        "SELECT * FROM scores WHERE alternative_id = ?",
        [id],
        (scoresError, scores) => {
          if (scoresError) {
            console.error("Error fetching scores:", scoresError);
            return res.status(500).json({
              message: "Database error fetching scores",
            });
          }

          // Map scores to the expected format
          const scoresFormatted = scores.map((score) => ({
            id: score.id,
            criteria_id: score.criteria_id,
            value: score.value,
          }));

          // Combine alternative with scores
          const alternativeWithScores = {
            ...alternative,
            scores: scoresFormatted,
          };

          console.log(
            `Successfully fetched alternative ${id} with ${scores.length} scores`
          );
          res.status(200).json({
            alternative: alternativeWithScores,
          });
        }
      );
    }
  );
});

// Create a new alternative
router.post("/", checkAuth, (req, res) => {
  const { code, name, scores } = req.body;

  if (!code || !name) {
    return res.status(400).json({
      message: "Code and name are required",
    });
  }

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).json({
        message: "Database error",
      });
    }

    // Insert the alternative
    db.query(
      "INSERT INTO alternatives (code, name) VALUES (?, ?)",
      [code, name],
      (error, result) => {
        if (error) {
          return db.rollback(() => {
            console.error("Error creating alternative:", error);
            res.status(500).json({
              message: "Database error",
            });
          });
        }

        const alternativeId = result.insertId;

        // If there are no scores, commit the transaction
        if (!scores || !Array.isArray(scores) || scores.length === 0) {
          return db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Error committing transaction:", err);
                res.status(500).json({
                  message: "Database error",
                });
              });
            }

            res.status(201).json({
              message: "Alternative created successfully",
              createdAlternative: {
                id: alternativeId,
                code,
                name,
                scores: [],
              },
            });
          });
        }

        // Insert all scores
        const scoreValues = scores.map((score) => [
          alternativeId,
          score.criteria_id,
          score.value,
        ]);

        db.query(
          "INSERT INTO scores (alternative_id, criteria_id, value) VALUES ?",
          [scoreValues],
          (error, result) => {
            if (error) {
              return db.rollback(() => {
                console.error("Error creating scores:", error);
                res.status(500).json({
                  message: "Database error",
                });
              });
            }

            // Commit the transaction
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error("Error committing transaction:", err);
                  res.status(500).json({
                    message: "Database error",
                  });
                });
              }

              res.status(201).json({
                message: "Alternative created successfully",
                createdAlternative: {
                  id: alternativeId,
                  code,
                  name,
                  scores,
                },
              });
            });
          }
        );
      }
    );
  });
});

// Update an alternative and its scores
router.put("/:id", checkAuth, (req, res) => {
  const id = req.params.id;
  const { code, name, scores } = req.body;

  if (!code || !name) {
    return res.status(400).json({
      message: "Code and name are required",
    });
  }

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).json({
        message: "Database error",
      });
    }

    // Update the alternative
    db.query(
      "UPDATE alternatives SET code = ?, name = ? WHERE id = ?",
      [code, name, id],
      (error, result) => {
        if (error) {
          return db.rollback(() => {
            console.error("Error updating alternative:", error);
            res.status(500).json({
              message: "Database error",
            });
          });
        }

        if (result.affectedRows === 0) {
          return db.rollback(() => {
            res.status(404).json({
              message: "Alternative not found",
            });
          });
        }

        // Delete all scores for this alternative
        db.query(
          "DELETE FROM scores WHERE alternative_id = ?",
          [id],
          (error, result) => {
            if (error) {
              return db.rollback(() => {
                console.error("Error deleting scores:", error);
                res.status(500).json({
                  message: "Database error",
                });
              });
            }

            // If there are no scores, commit the transaction
            if (!scores || !Array.isArray(scores) || scores.length === 0) {
              return db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error("Error committing transaction:", err);
                    res.status(500).json({
                      message: "Database error",
                    });
                  });
                }

                res.status(200).json({
                  message: "Alternative updated successfully",
                  updatedAlternative: {
                    id,
                    code,
                    name,
                    scores: [],
                  },
                });
              });
            }

            // Insert all new scores
            const scoreValues = scores.map((score) => [
              id,
              score.criteria_id,
              score.value,
            ]);

            db.query(
              "INSERT INTO scores (alternative_id, criteria_id, value) VALUES ?",
              [scoreValues],
              (error, result) => {
                if (error) {
                  return db.rollback(() => {
                    console.error("Error creating scores:", error);
                    res.status(500).json({
                      message: "Database error",
                    });
                  });
                }

                // Commit the transaction
                db.commit((err) => {
                  if (err) {
                    return db.rollback(() => {
                      console.error("Error committing transaction:", err);
                      res.status(500).json({
                        message: "Database error",
                      });
                    });
                  }

                  res.status(200).json({
                    message: "Alternative updated successfully",
                    updatedAlternative: {
                      id,
                      code,
                      name,
                      scores,
                    },
                  });
                });
              }
            );
          }
        );
      }
    );
  });
});

// Delete an alternative
router.delete("/:id", checkAuth, (req, res) => {
  const id = req.params.id;

  // The scores will be deleted automatically because of the ON DELETE CASCADE
  db.query("DELETE FROM alternatives WHERE id = ?", [id], (error, result) => {
    if (error) {
      console.error("Error deleting alternative:", error);
      return res.status(500).json({
        message: "Database error",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Alternative not found",
      });
    }

    res.status(200).json({
      message: "Alternative deleted successfully",
    });
  });
});

module.exports = router;
