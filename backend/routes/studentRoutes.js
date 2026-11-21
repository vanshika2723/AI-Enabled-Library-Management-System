const express = require("express");
const router = express.Router();

const { getAllStudents ,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin: Get all registered students
router.get("/", protect, adminOnly, getAllStudents);
// Update student (Admin only)
router.put("/:id", protect, adminOnly, updateStudent);

// Delete student (Admin only)
router.delete("/:id", protect, adminOnly, deleteStudent);

module.exports = router;