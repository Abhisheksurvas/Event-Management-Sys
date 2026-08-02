import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import CreateEventModal from "../components/CreateEventModal";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import { Calendar, MapPin, Trash2, Eye, FileDown, FileText, CheckCircle, XCircle, ArrowRight, Search, Filter, UserPlus, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Events = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/events");
      setEvents(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user?._id]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await API.delete(`/events/${id}`);
        toast.success("Event deleted successfully");
        fetchEvents();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete event");
      }
    }
  };

  const handleApproveEvent = async (id, status) => {
    try {
      await API.patch(`/events/${id}/approve`, { status });
      toast.success(`Event ${status}`);
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  const handleRegister = async (id) => {
    try {
      await API.patch(`/events/${id}/register`);
      toast.success("Registration request sent to teacher");
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const handleDownloadReport = async (eventId, type, title) => {
    try {
      const response = await API.get(`/events/${eventId}/export/${type}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_${title.replace(/\s+/g, '_')}.${type === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report");
    }
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canDelete = (event) => {
    return user?.role === "Admin" || (user?.role === "Teacher" && event.createdBy?._id === user?._id);
  };

  const isHOD = ["HOD", "Principal", "Admin"].includes(user?.role);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar isOpen={isSidebarOpen} />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'} p-6 md:p-10`}>
        <div className="max-w-7xl mx-auto">
          <Header
            title={user?.role === "Student" ? "Campus Events" : "Event Center"}
            subtitle={user?.role === "Student" ? "Explore, join, and grow." : "Manage and approve institutional events."}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onCreateEvent={["Teacher", "Admin"].includes(user?.role) ? () => setIsModalOpen(true) : null}
          />
          
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Toolbar */}
            <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div className="relative group flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search events..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-0">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-500 font-medium">Fetching events...</p>
                </div>
              ) : filteredEvents.length > 0 ? (
                user?.role === "Student" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {filteredEvents.map((event) => (
                      <div key={event._id} className="group bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                           <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                              <Calendar size={22} />
                           </div>
                           <span className={`px-3 py-1 text-[10px] font-bold rounded-full border tracking-wider uppercase ${
                             event.myStatus === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                             event.myStatus === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                             event.myStatus === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                             'bg-slate-50 text-slate-500 border-slate-100'
                           }`}>
                             {event.myStatus === 'not joined' ? 'Available' : event.myStatus}
                           </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{event.title}</h3>
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center text-sm text-slate-500 gap-2">
                            <Calendar size={14} className="text-slate-400" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-sm text-slate-500 gap-2">
                            <MapPin size={14} className="text-slate-400" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>

                        <div className="mt-auto pt-4 flex gap-2">
                          {event.myStatus !== 'not joined' ? (
                            <Link 
                              to={`/events/${event._id}`} 
                              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                            >
                              <Eye size={14} /> See Details
                            </Link>
                          ) : (
                            <button 
                              onClick={() => handleRegister(event._id)}
                              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                            >
                              <UserPlus size={14} /> Register Now
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Event Details</th>
                          <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Approval</th>
                          <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredEvents.map((event) => (
                          <tr key={event._id} className="hover:bg-slate-50/30 transition-colors group">
                            <td className="px-8 py-5">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{event.title}</span>
                                <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                  <MapPin size={12} /> {event.location}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                               <span className={`inline-flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-extrabold rounded-full border uppercase tracking-wide ${
                                 event.approvalStatus === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                 event.approvalStatus === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                 'bg-rose-50 text-rose-700 border-rose-200'
                               }`}>
                                 {event.approvalStatus === "approved" && <CheckCircle size={15} />}
                                 {event.approvalStatus === "pending" && <Clock3 size={15} />}
                                 {event.approvalStatus === "rejected" && <XCircle size={15} />}
                                 {event.approvalStatus === "approved" ? "Approved" : event.approvalStatus === "pending" ? "Pending" : "Reject"}
                               </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {isHOD && event.approvalStatus === 'pending' && (
                                  <>
                                    <button 
                                      onClick={() => handleApproveEvent(event._id, 'approved')}
                                      className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-xl transition-all"
                                      title="Approve Event"
                                    >
                                      <CheckCircle size={16} />
                                      Approve
                                    </button>
                                    <button 
                                      onClick={() => handleApproveEvent(event._id, 'rejected')}
                                      className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-xl transition-all"
                                      title="Reject Event"
                                    >
                                      <XCircle size={16} />
                                      Reject
                                    </button>
                                  </>
                                )}
                                
                                <Link 
                                  to={`/events/${event._id}`} 
                                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                  title="View Details"
                                >
                                  <Eye size={18} />
                                </Link>
                                
                                {canDelete(event) && (
                                  <button 
                                    onClick={() => handleDelete(event._id)} 
                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" 
                                    title="Delete"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                <div className="py-32 flex flex-col items-center justify-center text-center px-6">
                  <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-slate-200">
                    <Calendar size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No events found</h3>
                </div>
              )}
            </div>
          </div>
        </div>

        <CreateEventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEventCreated={fetchEvents}
        />
      </main>
    </div>
  );
};

export default Events;
