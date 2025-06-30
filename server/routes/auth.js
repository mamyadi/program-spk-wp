const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Login route with enhanced logging
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  console.log("Login attempt:", {
    username,
    password: password ? "****" + password.substr(-4) : "undefined",
    bodyType: typeof req.body,
    contentType: req.headers["content-type"],
  });

  if (!username || !password) {
    console.log("Missing username or password");
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (error, results) => {
      if (error) {
        console.error("Error in login query:", error);
        return res.status(500).json({
          message: "Database error",
        });
      }

      if (results.length === 0) {
        console.log(`User not found: ${username}`);
        return res.status(401).json({
          message: "Authentication failed",
        });
      }

      const user = results[0];
      console.log(`User found:`, {
        id: user.id,
        username: user.username,
        passwordHash: user.password,
      });

      // Compare passwords with detailed logging
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error("bcrypt.compare error:", err);
          return res.status(500).json({
            message: "Authentication error",
          });
        }

        console.log(`Password match result: ${isMatch}`);

        if (!isMatch) {
          return res.status(401).json({
            message: "Authentication failed",
          });
        }

        // Generate token
        const token = jwt.sign(
          {
            userId: user.id,
            username: user.username,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "24h",
          }
        );

        console.log("Authentication successful, token generated");

        return res.status(200).json({
          message: "Authentication successful",
          token,
          userId: user.id,
          username: user.username,
        });
      });
    }
  );
});

module.exports = router;
