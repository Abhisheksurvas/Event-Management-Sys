import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardCards from "../components/DashboardCards";
import CreateEventModal from "../components/CreateEventModal";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import { FileDown, FileText, ArrowRight, ExternalLink, CheckCircle, XCircle, Clock3 } from "lucide-react";
import StudentAttendanceDashboard from "./StudentAttendanceDashboard";
import toast from "react-hot-toast";

const TeacherDashboard = ({ user, stats, onCreateEvent, pendingRequests, requestsLoading, onApproveStudentRequest }) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <Header
      title="Teacher Dashboard"
      subtitle={`Welcome back, ${user?.name}! Manage your events with ease.`}
      onCreateEvent={onCreateEvent}
    />
    
    <DashboardCards stats={stats} />

    <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Quick Reports</h2>
          <p className="text-slate-500 text-sm mt-1">Export your event data in one click.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:border-indigo-200 hover:bg-white transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
               <FileDown size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">My Events (Excel)</h4>
              <p className="text-xs text-slate-500">Full spreadsheet of all your events</p>
            </div>
          </div>
          <Link to="/events" className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">
             Go to Events <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="flex flex-col justify-center p-8 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
          <h4 className="text-lg font-bold mb-2">Need Help?</h4>
          <p className="text-indigo-100 text-sm mb-6">Check our guide on how to manage attendance effectively.</p>
          <button className="flex items-center gap-2 text-sm font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all self-start">
             View Documentation <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </section>

    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-50">
        <h2 className="text-xl font-bold text-slate-900">Pending Student Requests</h2>
        <p className="text-slate-500 text-sm mt-1">Approve or reject registrations. Approved = present, Rejected = absent.</p>
      </div>

      {requestsLoading ? (
        <div className="py-16 text-center text-slate-500 font-medium">Loading requests...</div>
      ) : pendingRequests.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Event</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Request</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pendingRequests.map((request, idx) => (
                <tr key={`${request.eventId}-${request.userId}-${idx}`} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="font-bold text-slate-900">{request.studentName}</div>
                    <div className="text-xs text-slate-500">{request.studentEmail}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="font-semibold text-slate-800">{request.eventTitle}</div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-xl text-[10px] font-extrabold uppercase tracking-widest">
                      <Clock3 size={12} />
                      Pending
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onApproveStudentRequest(request.eventId, request.userId, "approved")}
                        className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-xl transition-all"
                        title="Approve"
                      >
                        <CheckCircle size={14} />
                        Approve
                      </button>
                      <button
                        onClick={() => onApproveStudentRequest(request.eventId, request.userId, "rejected")}
                        className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-xl transition-all"
                        title="Reject"
                      >
                        <XCircle size={14} />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-slate-500 font-medium">No pending student requests right now.</p>
        </div>
      )}
    </section>
  </div>
);

const AdminDashboard = ({ user, stats, handleDownload, onCreateEvent }) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <Header
      title="Admin Control Panel"
      subtitle={`System Administrator: ${user?.name}`}
      onCreateEvent={onCreateEvent} 
    />
    
    <DashboardCards stats={stats} />

    <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900">System-Wide Reports</h2>
          <p className="text-slate-500 text-sm mt-1">Comprehensive data export for the entire institution.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center p-6 bg-slate-50 border border-slate-100 rounded-2xl gap-5 group hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl">
            <FileDown size={28} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-900">Master Sheet (Excel)</h4>
            <p className="text-xs text-slate-500">Every event, attendee, and status.</p>
          </div>
          <button onClick={() => handleDownload('excel')} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all">
            Export
          </button>
        </div>

        <div className="flex items-center p-6 bg-slate-50 border border-slate-100 rounded-2xl gap-5 group hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all">
          <div className="p-4 bg-rose-100 text-rose-600 rounded-2xl">
            <FileText size={28} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-900">Summary PDF</h4>
            <p className="text-xs text-slate-500">Monthly overview and analytics.</p>
          </div>
          <button onClick={() => handleDownload('pdf')} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all">
            Export
          </button>
        </div>
      </div>
    </section>
  </div>
);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const fetchStats = async () => {
    try {
      const { data } = await API.get("/dashboard/stats");
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  useEffect(() => {
    if (user) {
       fetchStats();
       if (user.role === "Teacher") {
        fetchTeacherPendingRequests();
       }
    }
  }, [user]);

  const fetchTeacherPendingRequests = async () => {
    try {
      setRequestsLoading(true);
      const { data } = await API.get("/events");
      const myPendingRequests = [];

      data.forEach((event) => {
        const isMyEvent = event.createdBy?._id === user?._id || event.createdBy === user?._id;
        if (!isMyEvent) return;

        (event.attendees || []).forEach((attendee) => {
          if (attendee.registrationStatus === "pending") {
            myPendingRequests.push({
              eventId: event._id,
              eventTitle: event.title,
              userId: attendee.user?._id,
              studentName: attendee.user?.name || "Student",
              studentEmail: attendee.user?.email || "",
            });
          }
        });
      });

      setPendingRequests(myPendingRequests);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load pending requests");
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleApproveStudentRequest = async (eventId, userId, status) => {
    try {
      await API.patch(`/events/${eventId}/approve-registration`, { userId, status });
      toast.success(`Student ${status}`);
      fetchTeacherPendingRequests();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  const handleDownload = async (type) => {
    try {
      const response = await API.get(`/events/export/${type}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `system_report_${new Date().getTime()}.${type === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  const renderRoleDashboard = () => {
    const props = { 
      user, 
      stats, 
      onCreateEvent: ["Teacher", "Admin"].includes(user?.role) ? () => setIsModalOpen(true) : null, 
      handleDownload, 
      onLogout: logout
    };
    
    switch (user?.role) {
      case "Teacher":
        return (
          <TeacherDashboard
            {...props}
            pendingRequests={pendingRequests}
            requestsLoading={requestsLoading}
            onApproveStudentRequest={handleApproveStudentRequest}
          />
        );
      case "Student":
        return <StudentAttendanceDashboard {...props} />;
      case "Admin":
        return <AdminDashboard {...props} />;
      case "HOD":
      case "Principal":
        return <AdminDashboard {...props} />; // Reusing Admin style for HOD/Principal for now
      default:
        return <StudentAttendanceDashboard {...props} />;
    }
  };

  if (user?.role === "Student") {
    return renderRoleDashboard();
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar isOpen={isSidebarOpen} />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'} p-6 md:p-10`}>
        <div className="max-w-7xl mx-auto">
          {renderRoleDashboard()}
        </div>

        <CreateEventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEventCreated={fetchStats}
        />
      </main>
      
      {/* Mobile Sidebar Overlay */}
      {!isSidebarOpen && (
         <button 
           onClick={() => setIsSidebarOpen(true)}
           className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center lg:hidden z-50 hover:bg-indigo-700 transition-all"
         >
           <ArrowRight className="rotate-180" size={24} />
         </button>
      )}
    </div>
  );
};

export default Dashboard;
