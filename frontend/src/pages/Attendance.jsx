import React from "react";
import StudentAttendanceDashboard from "./StudentAttendanceDashboard";
import { useAuth } from "../context/AuthContext";

const Attendance = () => {
  const { user, logout } = useAuth();

  return <StudentAttendanceDashboard user={user} onLogout={logout} />;
};

export default Attendance;
