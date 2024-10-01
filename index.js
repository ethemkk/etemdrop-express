const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Your MongoDB connection logic
require("dotenv").config(); // Load environment variables
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile"); // Profile rotasını dahil ediyoruz
const app = express();

// WebSocket için gerekli modüller
const http = require('http');
const WebSocket = require('ws');

// HTTP sunucusunu oluşturuyoruz
const server = http.createServer(app);

// WebSocket serverını oluşturuyoruz
const wss = new WebSocket.Server({ server });

// Middleware to parse incoming JSON requests
app.use(express.json());

// Enable CORS to allow requests from specific origins
app.use(
  cors({
    origin: [
      "http://localhost:3002", // Local frontend URL
      "https://etemdrop.vercel.app", // Deployed frontend URL on Vercel
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

// Register profile routes
app.use("/api/profile", profileRoutes); // Profile rotasını ekliyoruz

// WebSocket bağlantısı sağlandığında
wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');
  
  // Her 5 saniyede aktif kullanıcı sayısını gönder
  const interval = setInterval(() => {
    const activeClients = wss.clients.size;
    ws.send(JSON.stringify({ activePlayers: activeClients }));
  }, 5000);

  // WebSocket bağlantısı kapandığında interval'ı temizle
  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

// Define the port for local development or deployment
const PORT = process.env.PORT || 3001;

// Sunucuyu başlatıyoruz
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the app for serverless deployment on Vercel
module.exports = (req, res) => {
  app(req, res);
};
