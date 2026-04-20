const express = require("express");
const {
  getEvents,
  getEvent,
  createEvent,
  approveEvent,
  registerForEvent,
  approveStudentRegistration,
  deleteEvent,
  exportAllEventsExcel,
  exportAllEventsPDF,
  exportEventAttendanceExcel,
  exportEventAttendancePDF,
  updateAttendeeStatus,
} = require("../controllers/eventController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect); // All routes are protected

router.get("/", getEvents);

// Export routes
router.get("/export/excel", authorize("HOD", "Principal", "Admin"), exportAllEventsExcel);
router.get("/export/pdf", authorize("HOD", "Principal", "Admin"), exportAllEventsPDF);
router.get("/:id/export/excel", authorize("Teacher", "Admin"), exportEventAttendanceExcel);
router.get("/:id/export/pdf", authorize("Teacher", "Admin"), exportEventAttendancePDF);

// Event management routes
router.get("/:id", getEvent);
router.post("/", authorize("Teacher", "Admin"), createEvent);
router.delete("/:id", authorize("Teacher", "Admin"), deleteEvent);

// Workflow routes
router.patch("/:id/approve", authorize("HOD", "Principal", "Admin"), approveEvent);
router.patch("/:id/register", authorize("Student"), registerForEvent);
router.patch("/:id/approve-registration", authorize("Teacher", "Admin"), approveStudentRegistration);

// Legacy/Manual attendance
router.patch("/:id/attendee-status", authorize("Teacher", "Admin"), updateAttendeeStatus);

module.exports = router;
