const express = require("express");
const {
  register,
  login,
  setup2FA,
  verify2FA,
  login2FA,
  updateProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/login-2fa", login2FA);
router.get("/setup-2fa", protect, setup2FA);
router.post("/verify-2fa", protect, verify2FA);
router.put("/profile", protect, updateProfile);

module.exports = router;
