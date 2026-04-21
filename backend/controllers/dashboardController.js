const Event = require("../models/Event");
const User = require("../models/User");

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;

    if (userRole === "Student") {
      const allEvents = await Event.find({});
      const joinedEvents = allEvents.filter(event => 
        event.attendees.some(a => a.user.toString() === userId)
      );
      
      const presentCount = joinedEvents.reduce((acc, event) => {
        const attendee = event.attendees.find(a => a.user.toString() === userId);
        return acc + (attendee.status === "present" ? 1 : 0);
      }, 0);

      const absentCount = joinedEvents.reduce((acc, event) => {
        const attendee = event.attendees.find(a => a.user.toString() === userId);
        return acc + (attendee.status === "absent" ? 1 : 0);
      }, 0);

      return res.json({
        totalEvents: allEvents.length,
        totalRegistrations: joinedEvents.length,
        presentCount,
        absentCount,
        activeEvents: allEvents.filter(e => e.status === "active").length
      });
    }

    // For Teacher, HOD, Principal, Admin
    let query = {};
    if (userRole === "Teacher") {
      // Teachers might see only their events or all events depending on requirements
      // But for dashboard stats, let's keep it global for now or filter by creator
      // The requirement says "teacher dash role is to add/remove events"
      // query = { createdBy: userId };
    }

    const activeCount = await Event.countDocuments({ ...query, status: "active" });
    const pendingCount = await Event.countDocuments({ ...query, status: "pending" });
    const completedCount = await Event.countDocuments({ ...query, status: "completed" });

    const allEvents = await Event.find(query);
    const totalRegistrations = allEvents.reduce((acc, event) => acc + event.attendees.length, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentActiveCount = await Event.countDocuments({ 
      ...query,
      status: "active", 
      createdAt: { $gte: sevenDaysAgo } 
    });

    res.json({
      activeEvents: activeCount,
      pendingApprovals: pendingCount,
      completedEvents: completedCount,
      totalRegistrations: totalRegistrations,
      weeklyIncrease: recentActiveCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
