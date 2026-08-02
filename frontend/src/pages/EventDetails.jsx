import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import { CheckCircle, XCircle, ArrowLeft, Calendar, MapPin, User, Users, ClipboardCheck, Info, ShieldCheck, UserPlus, Clock } from "lucide-react";
import toast from "react-hot-toast";

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/events/${id}`);
      setEvent(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load event details");
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      await API.patch(`/events/${id}/register`);
      toast.success("Registration request sent to teacher");
      fetchEvent();
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const handleApproveRegistration = async (userId, status) => {
    try {
      await API.patch(`/events/${id}/approve-registration`, { userId, status });
      toast.success(`Registration ${status}`);
      fetchEvent();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
       <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading event details...</p>
       </div>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
       <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-rose-100">
          <Info size={40} />
       </div>
       <h2 className="text-2xl font-bold text-slate-900 mb-2">Event Not Found</h2>
       <p className="text-slate-500 max-w-sm mb-8">The event you're looking for might have been deleted or the link is incorrect.</p>
       <Link to="/events" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
          Back to Events
       </Link>
    </div>
  );

  const userAttendee = event.attendees.find((a) => a.user?._id === user?._id);
  const isTeacherOrAdmin = ["Teacher", "Admin"].includes(user?.role);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar isOpen={isSidebarOpen} />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'} p-6 md:p-10`}>
        <div className="max-w-7xl mx-auto">
          <Header
            title="Event Details"
            subtitle="Full event overview and registration management."
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          
          <button 
            onClick={() => navigate(-1)} 
            className="mb-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold text-sm transition-all group"
          >
            <div className="p-1.5 bg-white border border-slate-200 rounded-lg group-hover:border-indigo-100 group-hover:bg-indigo-50 transition-all">
              <ArrowLeft size={16} />
            </div>
            Back to Events
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                
                <div className="relative">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100 tracking-wide uppercase">
                      {event.approvalStatus}
                    </span>
                    <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100 tracking-wide uppercase">
                      {event.status}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">{event.title}</h1>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-white text-indigo-500 rounded-xl shadow-sm border border-slate-100">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</p>
                        <p className="font-bold text-slate-700">{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-white text-rose-500 rounded-xl shadow-sm border border-slate-100">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</p>
                        <p className="font-bold text-slate-700">{event.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Info size={16} className="text-indigo-500" />
                      About this Event
                    </h3>
                    <p className="text-slate-600 leading-relaxed bg-slate-50/30 p-6 rounded-2xl border border-dashed border-slate-200">{event.description}</p>
                  </div>
                </div>
              </div>

              {/* Registration Management (For Teacher/Admin) */}
              {isTeacherOrAdmin && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <ClipboardCheck size={22} className="text-emerald-500" />
                        Registration Requests
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">Approve or reject student registration requests.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
                          <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                          <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {event.attendees.map((a, idx) => (
                          <tr key={idx} className="group hover:bg-slate-50/30 transition-all">
                            <td className="px-8 py-5">
                               <div className="flex flex-col">
                                  <span className="font-bold text-slate-900">{a.user?.name}</span>
                                  <span className="text-xs text-slate-500">{a.user?.email}</span>
                               </div>
                            </td>
                            <td className="px-8 py-5">
                               <span className={`px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-widest border ${
                                 a.registrationStatus === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                 a.registrationStatus === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                 'bg-rose-50 text-rose-600 border-rose-100'
                               }`}>
                                 {a.registrationStatus}
                               </span>
                            </td>
                            <td className="px-8 py-5 text-center">
                              {a.registrationStatus === 'pending' && (
                                <div className="flex justify-center gap-2">
                                  <button 
                                    onClick={() => handleApproveRegistration(a.user?._id, 'approved')}
                                    className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
                                    title="Approve"
                                  >
                                    <CheckCircle size={18} />
                                  </button>
                                  <button 
                                    onClick={() => handleApproveRegistration(a.user?._id, 'rejected')}
                                    className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all"
                                    title="Reject"
                                  >
                                    <XCircle size={18} />
                                  </button>
                                </div>
                              )}
                              {a.registrationStatus !== 'pending' && (
                                 <span className="text-xs font-bold text-slate-400">Processed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="space-y-8">
               {/* Stats Overview */}
               <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-200">
                  <h3 className="text-sm font-bold text-indigo-100 uppercase tracking-widest mb-6">Engagement Summary</h3>
                  <div className="space-y-6">
                       <div>
                          <p className="text-4xl font-black text-white">{event.attendees.filter(a => a.registrationStatus === 'approved').length}</p>
                          <p className="text-xs font-bold text-indigo-100 uppercase mt-1">Confirmed Participants</p>
                       </div>
                       <div>
                          <p className="text-2xl font-black text-white/80">{event.attendees.length}</p>
                          <p className="text-[10px] font-bold text-indigo-100 uppercase mt-1">Total Requests</p>
                       </div>
                  </div>
               </div>

               {/* Student Status Card */}
               {user?.role === "Student" && (
                 <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">My Status</h3>
                    
                    {!userAttendee ? (
                       <button 
                         onClick={handleRegister}
                         className="w-full mt-4 flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-[0.98]"
                       >
                         <UserPlus size={20} /> Register for Event
                       </button>
                    ) : (
                       <div className={`mt-4 p-6 rounded-2xl border-2 ${
                         userAttendee.registrationStatus === 'approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                         userAttendee.registrationStatus === 'pending' ? 'bg-amber-50 border-amber-100 text-amber-600' : 
                         'bg-rose-50 border-rose-100 text-rose-600'
                       }`}>
                          {userAttendee.registrationStatus === 'approved' ? <CheckCircle size={40} className="mx-auto mb-3" /> : 
                           userAttendee.registrationStatus === 'pending' ? <Clock size={40} className="mx-auto mb-3" /> : 
                           <XCircle size={40} className="mx-auto mb-3" />}
                          <p className="text-xl font-black uppercase">{userAttendee.registrationStatus}</p>
                          <p className="text-xs font-bold mt-1 text-slate-400">
                             {userAttendee.registrationStatus === 'approved' ? 'Attendance: PRESENT' : 
                              userAttendee.registrationStatus === 'rejected' ? 'Attendance: ABSENT' : 
                              'Waiting for approval'}
                          </p>
                       </div>
                    )}
                 </div>
               )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetails;
