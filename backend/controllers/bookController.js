
const Book = require("../models/Book");

// Add Book
const addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      category,
      description,
      coverImage,
      publisher,
      publishedYear,
      totalCopies,
      shelfLocation,
      tags,
      language
    } = req.body;

    if (!title || !author || !isbn || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, author, ISBN and category are required."
      });
    }

    const existingBook = await Book.findOne({
      isbn: isbn.trim()
    });

    if (existingBook) {
      return res.status(409).json({
        success: false,
        message: "Book with this ISBN already exists."
      });
    }

    const copies = totalCopies === undefined ? 1 : totalCopies;

    if (!Number.isInteger(copies) || copies < 1) {
      return res.status(400).json({
        success: false,
        message: "Total copies must be a positive integer."
      });
    }

    const book = await Book.create({
      title,
      author,
      isbn: isbn.trim(),
      category,
      description,
      coverImage,
      publisher,
      publishedYear,
      totalCopies: copies,
      availableCopies: copies,
      shelfLocation,
      tags,
      language,
      addedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Book added successfully.",
      book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Books with Search and Filters
const getBooks = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;

    const currentPage = Number(page);
    const perPage = Number(limit);

    if (
      !Number.isInteger(currentPage) ||
      !Number.isInteger(perPage) ||
      currentPage < 1 ||
      perPage < 1 ||
      perPage > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination values."
      });
    }

    const filter = {};

    if (search && search.trim()) {
      const escapedSearch = search.trim().replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const regex = new RegExp(escapedSearch, "i");

      filter.$or = [
        { title: regex },
        { author: regex },
        { isbn: regex },
        { category: regex }
      ];
    }

    if (category) {
      filter.category = category;
    }

    const totalBooks = await Book.countDocuments(filter);

    const books = await Book.find(filter)
      .populate("addedBy", "name email")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      success: true,
      totalBooks,
      currentPage,
      totalPages: Math.ceil(totalBooks / perPage),
      books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Single Book
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found."
      });
    }

    res.status(200).json({
      success: true,
      book
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid book ID."
    });
  }
};

// Update Book
const updateBook = async (req, res) => {
  try {
    const allowedFields = [
      "title",
      "author",
      "isbn",
      "category",
      "description",
      "coverImage",
      "publisher",
      "publishedYear",
      "totalCopies",
      "shelfLocation",
      "tags",
      "language"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.totalCopies !== undefined) {
      if (
        !Number.isInteger(updates.totalCopies) ||
        updates.totalCopies < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Total copies must be a non-negative integer."
        });
      }
    }

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found."
      });
    }

    if (updates.isbn) {
      const duplicate = await Book.findOne({
        isbn: updates.isbn.trim(),
        _id: { $ne: book._id }
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "This ISBN is already used by another book."
        });
      }

      updates.isbn = updates.isbn.trim();
    }

    if (updates.totalCopies !== undefined) {
      const issuedCopies = book.totalCopies - book.availableCopies;

      if (updates.totalCopies < issuedCopies) {
        return res.status(400).json({
          success: false,
          message: "Total copies cannot be less than currently issued copies."
        });
      }

      updates.availableCopies = updates.totalCopies - issuedCopies;
    }

    Object.assign(book, updates);
    await book.save();

    res.status(200).json({
      success: true,
      message: "Book updated successfully.",
      book
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Book
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found."
      });
    }

    if (book.availableCopies !== book.totalCopies) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete a book while copies are issued."
      });
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: "Book deleted successfully."
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook
};
