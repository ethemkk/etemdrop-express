const express = require("express");
const router = express.Router();
const User = require("../models/User"); // User modelini doğru tanımladığınızdan emin olun

// Kullanıcı verisini çekmek için GET isteği
router.get("/user", async (req, res) => {
  try {
    const userId = req.user.id; // Örneğin, JWT'den user ID'yi çekebilirsiniz
    const user = await User.findById(userId).select("username");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
