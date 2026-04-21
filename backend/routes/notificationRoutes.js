const express = require("express");
const router = express.Router();
const { getNotificationCount, getNotifications } = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getNotifications);
router.get("/count", protect, getNotificationCount);

module.exports = router;
