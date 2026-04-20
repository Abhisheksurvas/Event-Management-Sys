const Event = require("../models/Event");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit-table");

// @desc    Get all events
// @route   GET /api/events
// @access  Private
exports.getEvents = async (req, res) => {
  try {
    let query = {};
    const userRole = req.user.role;
    const userId = req.user.id;

    // Filter by approval status
    // Students only see approved events
    if (userRole === "Student") {
      query.approvalStatus = "approved";
    }

    const events = await Event.find(query)
      .sort({ date: -1, createdAt: -1 })
      .populate("createdBy", "name")
      .populate("attendees.user", "name email department staffId");

    // Add attendance/registration status for the requesting user
    const eventsWithStatus = events.map(event => {
      const eventObj = event.toObject();
      const attendee = event.attendees.find(a => a.user.toString() === userId);
      eventObj.myStatus = attendee ? attendee.registrationStatus : "not joined";
      eventObj.attendanceStatus = attendee ? attendee.status : "absent";
      return eventObj;
    });

    res.json(eventsWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name")
      .populate("attendees.user", "name email department staffId");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new event (Sent to HOD for approval)
// @route   POST /api/events
// @access  Private/Teacher/Admin
exports.createEvent = async (req, res) => {
  try {
    const userRole = req.user.role;
    req.body.createdBy = req.user.id;

    // Admin and Principal events are auto-approved
    if (userRole === "Admin" || userRole === "Principal") {
      req.body.approvalStatus = "approved";
      req.body.status = "active";
    } else {
      req.body.approvalStatus = "pending";
      req.body.status = "pending";
    }

    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve/Reject event (By HOD)
// @route   PATCH /api/events/:id/approve
// @access  Private/HOD/Principal/Admin
exports.approveEvent = async (req, res) => {
  try {
    const { status } = req.body; // "approved" or "rejected"
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.approvalStatus = status;
    event.approvedBy = req.user.id;
    
    if (status === "approved") {
      event.status = "active";
    } else {
      event.status = "completed"; // Or a 'rejected' status if you add one
    }

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Student register for event
// @route   PATCH /api/events/:id/register
// @access  Private/Student
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.approvalStatus !== "approved") {
      return res.status(400).json({ message: "Cannot register for an unapproved event" });
    }

    const alreadyRegistered = event.attendees.find(
      (a) => a.user.toString() === req.user.id
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    event.attendees.push({
      user: req.user.id,
      registrationStatus: "pending",
      status: "absent" // Initially absent until approved by teacher
    });

    await event.save();
    res.json({ message: "Registration request sent to teacher" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve/Reject student registration (By Teacher)
// @route   PATCH /api/events/:id/approve-registration
// @access  Private/Teacher/Admin
exports.approveStudentRegistration = async (req, res) => {
  try {
    const { userId, status } = req.body; // "approved" or "rejected"
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Teachers can only approve/reject registrations for their own events.
    if (req.user.role === "Teacher" && event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to approve registrations for this event" });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Use 'approved' or 'rejected'" });
    }

    const attendeeIndex = event.attendees.findIndex(
      (a) => a.user.toString() === userId
    );

    if (attendeeIndex === -1) {
      return res.status(404).json({ message: "Student registration not found" });
    }

    event.attendees[attendeeIndex].registrationStatus = status;
    
    // If approved, mark as present. If rejected, mark as absent.
    if (status === "approved") {
      event.attendees[attendeeIndex].status = "present";
    } else {
      event.attendees[attendeeIndex].status = "absent";
    }

    await event.save();
    
    const updatedEvent = await Event.findById(req.params.id)
      .populate("createdBy", "name")
      .populate("attendees.user", "name email department staffId");

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Attendee Status (Manual)
// @route   PATCH /api/events/:id/attendee-status
// @access  Private/Teacher/Admin
exports.updateAttendeeStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const attendeeIndex = event.attendees.findIndex(
      (a) => a.user.toString() === userId
    );

    if (attendeeIndex !== -1) {
      event.attendees[attendeeIndex].status = status;
    } else {
      event.attendees.push({ user: userId, status });
    }

    await event.save();
    
    const updatedEvent = await Event.findById(req.params.id)
      .populate("createdBy", "name")
      .populate("attendees.user", "name email department staffId");

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(401).json({ message: "Not authorized" });
    }

    await event.deleteOne();
    res.json({ message: "Event removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Exports
exports.exportAllEventsExcel = async (req, res) => { /* ... (Logic from before) ... */ };
exports.exportAllEventsPDF = async (req, res) => { /* ... (Logic from before) ... */ };
exports.exportEventAttendanceExcel = async (req, res) => { /* ... (Logic from before) ... */ };
exports.exportEventAttendancePDF = async (req, res) => { /* ... (Logic from before) ... */ };
