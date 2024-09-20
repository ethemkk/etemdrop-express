const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();

// JSON veri işlemleri için middleware
app.use(express.json());

// CORS yapılandırması
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL'i buraya ekle
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Kimlik doğrulama bilgilerini (cookie) dahil et
  })
);

// MongoDB'ye bağlan
connectDB();

// Oturum yapılandırması
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Güvenli bir secret anahtar
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI // MongoDB oturumları saklanacak yer
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 saatlik oturum süresi
      httpOnly: true, // Cookie'yi JavaScript erişiminden korur
      secure: process.env.NODE_ENV === 'production', // Production'da HTTPS üzerinde çalışır
      sameSite: 'lax', // CSRF koruması
    }
  })
);

// Auth rotalarını kaydet
app.use("/api/auth", authRoutes);

// Lokal geliştirme veya deployment portu
const PORT = process.env.PORT || 3001;

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
