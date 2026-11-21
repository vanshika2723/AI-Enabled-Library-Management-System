
const express = require("express");
const router = express.Router();

const {
  issueBook,
  getAllBorrows,
  getStudentBorrows,
  getMyBorrows,
  updateOverdueStatuses,
  returnBook,
  payFine,
  getStudentFineSummary,
 getBorrowStats
} = require("../controllers/borrowController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin: Issue a book
router.post("/", protect, adminOnly, issueBook);
// Admin: Update overdue book statuses
router.put("/update-overdue", protect, adminOnly, async (req, res) => {
  try {
    const updatedCount = await updateOverdueStatuses();

    res.status(200).json({
      message: "Overdue statuses updated successfully",
      updatedCount
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update overdue statuses",
      error: error.message
    });
  }
});
router.put("/return/:borrowId", protect, adminOnly, returnBook);
// Admin: Get all borrow records
router.get("/", protect, adminOnly, getAllBorrows);

// Admin: Get borrow records of a specific student
router.get("/student/:studentId", protect, adminOnly, getStudentBorrows);

// Student: Get own borrow records
router.get("/my", protect, getMyBorrows);

router.put("/pay-fine/:borrowId", protect, adminOnly, payFine);
router.get("/fine-summary/:studentId", protect, adminOnly, getStudentFineSummary);
router.get("/stats", protect, adminOnly, getBorrowStats);
module.exports = router;