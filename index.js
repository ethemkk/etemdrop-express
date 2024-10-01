const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // MongoDB bağlantı fonksiyonu
require("dotenv").config(); // Çevre değişkenlerini yükle
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile"); // Profile rotasını ekliyoruz
const http = require("http");
const WebSocket = require("ws");

// Express uygulaması
const app = express();

// HTTP sunucusunu oluşturuyoruz
const server = http.createServer(app);

// WebSocket sunucusunu oluşturuyoruz
const wss = new WebSocket.Server({ server });

// WebSocket bağlantısı
wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  // Her 5 saniyede aktif kullanıcı sayısını gönder
  const interval = setInterval(() => {
    const activeClients = wss.clients.size;
    ws.send(JSON.stringify({ activePlayers: activeClients }));
  }, 5000);

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
    clearInterval(interval);
  });
});

// Middleware'ler
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3002", "https://etemdrop.vercel.app"], // CORS izinleri
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Pre-flight (OPTIONS) istekleri
app.options("*", cors());

// MongoDB'ye bağlanma
connectDB();

// Authentication ve Profile rotalarını kaydetme
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes); // Profile rotasını ekliyoruz

// Port tanımlaması
const PORT = process.env.PORT || 3001;

// Sunucuyu başlatıyoruz
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Vercel için sunucuyu export ediyoruz
module.exports = (req, res) => {
  app(req, res);
};
