
const Borrow = require("../models/Borrow");
const Book = require("../models/Book");

// @desc    Issue a book to a student
// @route   POST /api/borrows
// @access  Admin
const issueBook = async (req, res) => {
  try {
    const { studentId, bookId, dueDate } = req.body;

    if (!studentId || !bookId || !dueDate) {
      return res.status(400).json({
        message: "Student ID, Book ID and due date are required"
      });
    }

    const due = new Date(dueDate);

    if (isNaN(due.getTime()) || due <= new Date()) {
      return res.status(400).json({
        message: "Due date must be a valid future date"
      });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        message: "No copies available for this book"
      });
    }

    const student = await require("../models/User").findById(studentId);

    if (!student || student.role !== "student" || !student.isActive) {
      return res.status(404).json({
        message: "Active student not found"
      });
    }
    // Prevent duplicate active book issue
    const existingBorrow = await Borrow.findOne({
      student: studentId,
      book: bookId,
      status: { $in: ["Issued", "Overdue"] }
    });

    if (existingBorrow) {
      return res.status(400).json({
        message: "This book is already issued to this student and has not been returned yet."
      });
    }
    const borrow = await Borrow.create({
      student: studentId,
      book: bookId,
      dueDate: due
    });

    book.availableCopies -= 1;
    await book.save();

    const populatedBorrow = await Borrow.findById(borrow._id)
      .populate("student", "name email studentId")
      .populate("book", "title author isbn");

    res.status(201).json({
      message: "Book issued successfully",
      borrow: populatedBorrow
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to issue book",
      error: error.message
    });
  }
};
// @desc    Update overdue book statuses
// @access  Admin
const updateOverdueStatuses = async () => {
  try {
    const result = await Borrow.updateMany(
      {
        status: "Issued",
        dueDate: { $lt: new Date() }
      },
      {
        $set: { status: "Overdue" }
      }
    );

    return result.modifiedCount;
  } catch (error) {
    throw error;
  }
};
// @desc    Return a borrowed book
// @route   PUT /api/borrows/return/:borrowId
// @access  Admin
const returnBook = async (req, res) => {
  try {
    const { borrowId } = req.params;

    const borrow = await Borrow.findById(borrowId);

    if (!borrow) {
      return res.status(404).json({
        message: "Borrow record not found"
      });
    }

    if (borrow.status === "Returned") {
      return res.status(400).json({
        message: "This book has already been returned"
      });
    }

    const book = await Book.findById(borrow.book);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }
const today = new Date();
const dueDate = new Date(borrow.dueDate);

today.setHours(0, 0, 0, 0);
dueDate.setHours(0, 0, 0, 0);

const lateDays = Math.max(
  0,
  Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24))
);

borrow.fineAmount = lateDays * 5;
    borrow.status = "Returned";
 borrow.returnDate = today;

    await borrow.save();
if (book.availableCopies < book.totalCopies) {
  book.availableCopies += 1;
}

await book.save();

    const updatedBorrow = await Borrow.findById(borrow._id)
      .populate("student", "name email studentId")
      .populate("book", "title author isbn");

    res.status(200).json({
      message: "Book returned successfully",
      borrow: updatedBorrow
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to return book",
      error: error.message
    });
  }
};
// @desc    Get all borrow records
// @route   GET /api/borrows
// @access  Admin
const getAllBorrows = async (req, res) => {
  try {
    const {
      status,
      studentId,
      bookId,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Student filter
    if (studentId) {
      filter.student = studentId;
    }

    // Book filter
    if (bookId) {
      filter.book = bookId;
    }

    // Issue date range filter
    if (startDate || endDate) {
      filter.issueDate = {};

      if (startDate) {
        filter.issueDate.$gte = new Date(startDate);
      }

      if (endDate) {
        filter.issueDate.$lte = new Date(endDate);
              }
    }

    const pageNumber = Math.max(1, parseInt(page) || 1);
    const pageLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const skip = (pageNumber - 1) * pageLimit;

    const totalRecords = await Borrow.countDocuments(filter);

    const borrows = await Borrow.find(filter)
      .populate("student", "name email studentId")
      .populate("book", "title author isbn")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit);

    res.status(200).json({
      totalRecords,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalRecords / pageLimit),
      pageLimit,
      filters: {
        status: status || null,
        studentId: studentId || null,
        bookId: bookId || null,
        startDate: startDate || null,
        endDate: endDate || null
      },
      borrows
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch borrow records",
      error: error.message
    });
  }
};
// @desc    Get borrow records for a particular student
// @route   GET /api/borrows/student/:studentId
// @access  Admin
const getStudentBorrows = async (req, res) => {
  try {
    const { studentId } = req.params;

    const borrows = await Borrow.find({ student: studentId })
      .populate("student", "name email studentId")
      .populate("book", "title author isbn")
      .sort({ createdAt: -1 });

    res.status(200).json({
      totalRecords: borrows.length,
      borrows
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch student borrow records",
      error: error.message
    });
  }
};

// @desc    Get current student's borrow records
// @route   GET /api/borrows/my
// @access  Student
const getMyBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({ student: req.user._id })
      .populate("student", "name email studentId")
      .populate("book", "title author isbn")
      .sort({ createdAt: -1 });

    res.status(200).json({
      totalRecords: borrows.length,
      borrows
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch your borrow records",
      error: error.message
    });
  }
};
// @desc    Mark fine as paid
// @route   PUT /api/borrows/pay-fine/:borrowId
// @access  Admin
const payFine = async (req, res) => {
  try {
    const { borrowId } = req.params;

    const borrow = await Borrow.findById(borrowId);

    if (!borrow) {
      return res.status(404).json({
        message: "Borrow record not found"
      });
    }

    if (borrow.fineAmount <= 0) {
      return res.status(400).json({
        message: "No fine pending for this borrow record"
      });
    }

    if (borrow.finePaid) {
      return res.status(400).json({
        message: "Fine has already been paid"
      });
    }

    borrow.finePaid = true;
    await borrow.save();

    res.status(200).json({
      message: "Fine payment marked successfully",
      borrow
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to mark fine payment",
      error: error.message
    });
  }
};
// @desc    Get student fine summary
// @route   GET /api/borrows/fine-summary/:studentId
// @access  Admin
const getStudentFineSummary = async (req, res) => {
  try {
    const { studentId } = req.params;

    const borrows = await Borrow.find({
      student: studentId,
      fineAmount: { $gt: 0 }
    }).populate("book", "title author isbn");

    const totalFine = borrows.reduce(
      (total, borrow) => total + borrow.fineAmount,
      0
    );

    const paidFine = borrows
      .filter((borrow) => borrow.finePaid)
      .reduce((total, borrow) => total + borrow.fineAmount, 0);

    const pendingFine = borrows
      .filter((borrow) => !borrow.finePaid)
      .reduce((total, borrow) => total + borrow.fineAmount, 0);

    res.status(200).json({
      studentId,
      totalFine,
      paidFine,
      pendingFine,
      fineRecords: borrows
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch student fine summary",
      error: error.message
    });
  }
};
// @desc    Get borrow statistics for dashboard
// @route   GET /api/borrows/stats
// @access  Admin
const getBorrowStats = async (req, res) => {
  try {
    const totalBorrowed = await Borrow.countDocuments();

    const currentlyIssued = await Borrow.countDocuments({
      status: "Issued"
    });

    const returnedBooks = await Borrow.countDocuments({
      status: "Returned"
    });

    const overdueBooks = await Borrow.countDocuments({
      status: "Overdue"
    });

    const totalFineResult = await Borrow.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$fineAmount" }
        }
      }
    ]);

    const pendingFineResult = await Borrow.aggregate([
      {
        $match: {
          finePaid: false,
          fineAmount: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$fineAmount" }
        }
      }
    ]);

    res.status(200).json({
      totalBorrowed,
      currentlyIssued,
      returnedBooks,
      overdueBooks,
      totalFine: totalFineResult[0]?.total || 0,
      pendingFine: pendingFineResult[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch borrow statistics",
      error: error.message
    });
  }
};
module.exports = {
  issueBook,
  getAllBorrows,
  getStudentBorrows,
  getMyBorrows,
  updateOverdueStatuses,
  returnBook,
  payFine,
  getStudentFineSummary,
    getBorrowStats
};