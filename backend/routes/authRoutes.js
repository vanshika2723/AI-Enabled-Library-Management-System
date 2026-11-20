
const express = require("express");
const router = express.Router();

const {
  registerStudent,
  loginUser,
  getMe
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Student Registration
router.post("/register", registerStudent);

// Admin / Student Login
router.post("/login", loginUser);

// Logged-in User Profile
router.get("/me", protect, getMe);

module.exports = router;
