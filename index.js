const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo"); // Oturumları MongoDB'de saklamak için
const connectDB = require("./config/db"); // MongoDB bağlantı fonksiyonu
require("dotenv").config(); // Çevresel değişkenler

const authRoutes = require("./routes/auth");

const app = express();

// JSON veri işlemleri için middleware
app.use(express.json());

// CORS yapılandırması
app.use(
  cors({
    origin: [
      "http://localhost:3002", // Lokal frontend
      "https://etemdrop.vercel.app", // Vercel'deki frontend URL'si
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Kimlik doğrulama bilgilerini (cookie) dahil et
  })
);

// Pre-flight (OPTIONS) isteklerini işle
app.options("*", cors());

// MongoDB'ye bağlan
connectDB();

// Oturum yapılandırması
app.use(
  session({
    secret: 'mySecretKey', // Güvenli bir anahtar kullan
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI // MongoDB oturumları saklanacak yer
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 24 saatlik oturum süresi
    }
  })
);

// Auth rotalarını kaydet
app.use("/api/auth", authRoutes);

// Lokal geliştirme veya deployment portu
const PORT = process.env.PORT || 3001;

// Sunucuyu başlat
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Vercel için uygulamayı dışa aktar
module.exports = (req, res) => {
  app(req, res);
};
