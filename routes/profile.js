const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Kullanıcı modeliniz

// Kullanıcıyı ID veya Token ile bulma
router.get("/user", async (req, res) => {
  try {
    const userId = req.user.id; // ID'yi token'dan veya başka bir kaynaktan alabilirsiniz
    const user = await User.findById(userId).select("username"); // Sadece username'i çekiyoruz
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
