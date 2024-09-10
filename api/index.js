const express = require("express");
const connectDB = require("../config/db");
const authRoutes = require("../routes/auth");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
