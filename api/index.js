const express = require("express");
const connectDB = require("../config/db");
const authRoutes = require("../routes/auth"); // Importing the auth routes

const app = express();
app.use(express.json()); // Parse incoming JSON

// Connect to MongoDB
connectDB();

// Register and login routes
app.use("/api/auth", authRoutes); // Using the auth routes under /api/auth

// Export the app as a serverless function
module.exports = (req, res) => {
  app(req, res);
};
