const express = require("express");
const router = express.Router();
const db = require("../config/db");
const checkAuth = require("../middleware/check-auth");

// Helper function to run a database query as a promise
const queryAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Get all calculation data needed for Weighted Product method
router.get("/", checkAuth, async (req, res) => {
  try {
    console.log("Fetching calculation data");

    // Get all criteria with their weights
    const criteria = await queryAsync("SELECT * FROM criteria ORDER BY id ASC");
    console.log(`Retrieved ${criteria.length} criteria`);

    // Get all alternatives
    const alternatives = await queryAsync(
      "SELECT * FROM alternatives ORDER BY id ASC"
    );
    console.log(`Retrieved ${alternatives.length} alternatives`);

    // Get all scores
    const scores = await queryAsync("SELECT * FROM scores");
    console.log(`Retrieved ${scores.length} scores`);

    // Map scores to alternatives
    alternatives.forEach((alt) => {
      const altScores = scores.filter(
        (score) => score.alternative_id === alt.id
      );
      alt.scores = altScores.map((score) => ({
        id: score.id,
        criteria_id: score.criteria_id,
        value: score.value,
      }));
    });
    console.log("Mapped scores to alternatives");

    // Calculate total weight (should sum to 1)
    const totalWeight = criteria.reduce(
      (sum, criterion) => sum + parseFloat(criterion.weight),
      0
    );

    // Normalize weights if needed (if sum != 1)
    if (Math.abs(totalWeight - 1) > 0.001) {
      criteria.forEach((criterion) => {
        criterion.normalizedWeight = parseFloat(criterion.weight) / totalWeight;
      });
    } else {
      criteria.forEach((criterion) => {
        criterion.normalizedWeight = parseFloat(criterion.weight);
      });
    }

    // Create decision matrix
    const decisionMatrix = alternatives.map((alt) => {
      const scores = {};
      alt.scores.forEach((score) => {
        scores[score.criteria_id] = parseFloat(score.value);
      });

      return {
        id: alt.id,
        code: alt.code,
        name: alt.name,
        scores: scores,
      };
    });

    // Calculate vector S
    const vectorS = decisionMatrix.map((alt) => {
      let s = 1;
      criteria.forEach((criterion) => {
        const score = alt.scores[criterion.id] || 0;
        const power =
          criterion.type === "benefit"
            ? criterion.normalizedWeight
            : -criterion.normalizedWeight; // Negative for cost criteria
        s *= Math.pow(score, power);
      });

      return {
        id: alt.id,
        code: alt.code,
        name: alt.name,
        s: s,
      };
    });

    // Calculate total vector S
    const totalVectorS = vectorS.reduce((sum, vector) => sum + vector.s, 0);

    // Calculate vector V
    const vectorV = vectorS.map((vector) => ({
      id: vector.id,
      code: vector.code,
      name: vector.name,
      s: vector.s,
      v: vector.s / totalVectorS,
    }));

    // Sort alternatives by V value (descending)
    const rankedAlternatives = [...vectorV].sort((a, b) => b.v - a.v);

    res.status(200).json({
      criteria,
      decisionMatrix,
      vectorS,
      vectorV,
      rankedAlternatives,
    });
  } catch (error) {
    console.error("Error in calculation:", error);
    res.status(500).json({
      message: "Database error",
      error: error.message,
    });
  }
});

module.exports = router;
