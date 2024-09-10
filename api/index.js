const express = require("express");
const cors = require("cors"); // Import CORS middleware
const connectDB = require("../config/db"); // Import MongoDB connection
require("dotenv").config(); // Import dotenv to load environment variables

const authRoutes = require("../routes/auth"); // Import routes

const app = express();

// Middleware to parse incoming JSON
app.use(express.json());

// Enable CORS with specific origin and methods
app.use(
  cors({
    origin: "*", // Allow your frontend's URL
    methods: ["GET", "POST"], // Allow specific methods
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle pre-flight (OPTIONS) requests
app.options("*", cors());

// Connect to MongoDB
connectDB();

// Register routes for authentication
app.use("/api/auth", authRoutes);

// Define the port from the environment variables or default to 3001
const PORT = process.env.PORT || 4000;

// Check if running locally or serverless (e.g., Vercel)
if (process.env.NODE_ENV !== "production") {
  // Start the server for local development
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the app for serverless platforms (e.g., Vercel)
module.exports = (req, res) => {
  app(req, res);
};
