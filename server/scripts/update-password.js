const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Hash password
const password = "admin123";
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function (err, hash) {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }

  // Update admin password in database
  connection.query(
    "UPDATE users SET password = ? WHERE username = ?",
    [hash, "admin"],
    (error, results) => {
      if (error) {
        console.error("Error updating password:", error);
      } else {
        console.log("Password updated successfully!");
        console.log("Hash:", hash);
      }

      // Close connection
      connection.end();
    }
  );
});
