
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    author: {
      type: String,
      required: true,
      trim: true
    },

    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    coverImage: {
      type: String,
      default: ""
    },

    publisher: {
      type: String,
      default: ""
    },

    publishedYear: {
      type: Number
    },

    totalCopies: {
      type: Number,
      required: true,
      min: 0,
      default: 1
    },

    availableCopies: {
      type: Number,
      min: 0,
      default: 1
    },

    shelfLocation: {
      type: String,
      default: ""
    },

    tags: {
      type: [String],
      default: []
    },

    language: {
      type: String,
      default: "English"
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Book", bookSchema);
