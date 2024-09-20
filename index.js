const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Your MongoDB connection logic
require("dotenv").config(); // Load environment variables
const authRoutes = require("./routes/auth");
const app = express();
// Middleware to parse incoming JSON requests
app.use(express.json());
// Enable CORS to allow requests from specific origins
app.use(
  cors({
    origin: [
      "http://localhost:3002", // Local frontend URL
      "https://https://etemdrop.vercel.app", // Deployed frontend URL on Vercel
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Enable credentials if using authentication tokens or cookies
  })
);
// Handle pre-flight (OPTIONS) requests for CORS
app.options("*", cors());
// Connect to MongoDB
connectDB();
// Register authentication routes
app.use("/api/auth", authRoutes);
// Define the port for local development or deployment
const PORT = process.env.PORT || 3001;
// Start the server in local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
// Export the app for serverless deployment on Vercel
module.exports = (req, res) => {
  app(req, res);
};