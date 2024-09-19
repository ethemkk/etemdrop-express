const express = require("express");
const User = require("../models/User"); // Import the User model
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expiration time (e.g., 30 days)
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword); // Log hashed password

    // Create a new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Return success response with a JWT token
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    // Log the error
    console.error("Registration Error:", error);
    res.status(500).json({ message: error.message });
  }
});


// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword); // Log hashed password

    // Create a new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Return success response with a JWT token
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    // Log the error
    console.error("Registration Error:", error);
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
