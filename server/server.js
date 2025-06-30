const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS explicitly
const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Body parsing middleware with increased limit
app.use(express.json({ limit: "10mb" })); // Use native Express JSON parser
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Import routes
const authRoutes = require("./routes/auth");
const criteriaRoutes = require("./routes/criteria");
const alternativesRoutes = require("./routes/alternatives");
const calculationRoutes = require("./routes/calculation");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/criteria", criteriaRoutes);
app.use("/api/alternatives", alternativesRoutes);
app.use("/api/calculation", calculationRoutes);

// Simple route for testing
app.get("/", (req, res) => {
  res.json({ message: "Welcome to SPK-WP API" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(`API is available at http://localhost:${PORT}`);
});
