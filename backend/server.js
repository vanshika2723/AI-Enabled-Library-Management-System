
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const borrowRoutes = require("./routes/borrowRoutes");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const bookRoutes = require("./routes/bookRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Authentication Routes
app.use("/api/auth", authRoutes);

// Book Management Routes
app.use("/api/books", bookRoutes);

app.use("/api/borrows", borrowRoutes);

app.use("/api/students", studentRoutes);

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SmartLib AI Backend is Running!"
  });
});

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SmartLib AI API is Healthy"
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
