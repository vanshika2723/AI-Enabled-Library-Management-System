
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const connectDB = require("../config/db");

const createAdmin = async () => {
  try {
    await connectDB();

    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!name || !email || !password || password.length < 12) {
      throw new Error("Valid admin credentials are required. Password must be at least 12 characters.");
    }

    const existingAdmin = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (existingAdmin) {
      if (existingAdmin.role !== "admin") {
        throw new Error("This email already belongs to a non-admin account.");
      }

      console.log("Admin account already exists.");
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);

      await User.create({
        name,
        email,
        password: hashedPassword,
        role: "admin"
      });

      console.log("Admin account created successfully!");
    }
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
