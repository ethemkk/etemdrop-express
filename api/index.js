const express = require("express");
const cors = require("cors"); // Import CORS middleware
const connectDB = require("../config/db");
const authRoutes = require("../routes/auth");

const app = express();
app.use(express.json()); // Middleware to parse incoming JSON
app.use(
  cors({
    origin: ["http://localhost:3002", "https://etemdrop.vercel.app/"], // Allow origins
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow the HTTP methods you need
  })
);

// Connect to MongoDB
connectDB();

// Register and login routes
app.use("/api/auth", authRoutes);

// Export the app as a serverless function
module.exports = (req, res) => {
  app(req, res);
};
