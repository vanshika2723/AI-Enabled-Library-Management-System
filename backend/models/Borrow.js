
const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true
    },

    issueDate: {
      type: Date,
      default: Date.now
    },

    dueDate: {
      type: Date,
      required: true
    },

    returnDate: {
      type: Date,
      default: null
    },

    status: {
      type: String,
      enum: ["Issued", "Returned", "Overdue"],
      default: "Issued"
    },

    fineAmount: {
      type: Number,
      default: 0,
      min: 0
    },

    finePaid: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Borrow", borrowSchema);
