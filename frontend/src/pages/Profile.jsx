import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { User, Mail, Shield, Edit2, Check, X, Briefcase, Contact, Calendar, Users, PlusCircle, TrendingUp, Award, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import API from "../api";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    staffId: user?.staffId || "",
    department: user?.department || "",
  });
  const [stats, setStats] = useState({
    eventsCreated: 0,
    totalAttendees: 0,
    upcomingEvents: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.role === "Teacher" || user?.role === "Admin") {
        try {
          const { data } = await API.get("/events");
          const myEvents = data.filter(e => e.createdBy?._id === user?._id || e.createdBy === user?._id);
          const upcoming = myEvents.filter(e => new Date(e.date) > new Date()).length;
          const attendees = myEvents.reduce((acc, curr) => acc + (curr.attendees?.length || 0), 0);
          
          setStats({
            eventsCreated: myEvents.length,
            totalAttendees: attendees,
            upcomingEvents: upcoming
          });
        } catch (error) {
          console.error("Error fetching stats", error);
        }
      }
    };
    fetchStats();
  }, [user]);

  const handleSave = async () => {
    try {
      const { data } = await API.put("/auth/profile", formData);
      localStorage.setItem("profile", JSON.stringify(data));
      setUser(data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar isOpen={isSidebarOpen} />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'} p-6 md:p-10`}>
        <div className="max-w-6xl mx-auto">
          <Header
            title="My Profile"
            subtitle="Manage your personal information and view your activity."
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Left Column: Profile Card & Stats */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Profile Hero Card */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-indigo-800 relative">
                   <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-3xl shadow-xl">
                      <div className="w-24 h-24 bg-slate-100 rounded-[1.25rem] flex items-center justify-center text-indigo-600 border-4 border-white overflow-hidden">
                         <User size={48} />
                      </div>
                   </div>
                </div>
                <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                   <div>
                      <h1 className="text-2xl font-black text-slate-900 leading-none">{user?.name}</h1>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full border border-indigo-100 uppercase tracking-widest">{user?.role}</span>
                        <span className="text-slate-400 text-xs font-medium">• {user?.department || 'General Department'}</span>
                      </div>
                   </div>
                   {!isEditing && (
                     <button 
                       onClick={() => setIsEditing(true)}
                       className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all text-sm"
                     >
                       <Edit2 size={16} /> Edit Profile
                     </button>
                   )}
                </div>
              </div>

              {/* Stats for Faculty/Admin */}
              {(user?.role === "Teacher" || user?.role === "Admin") && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-md transition-all">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                         <Calendar size={20} />
                      </div>
                      <p className="text-3xl font-black text-slate-900">{stats.eventsCreated}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Events Hosted</p>
                   </div>
                   <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-md transition-all">
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                         <Users size={20} />
                      </div>
                      <p className="text-3xl font-black text-slate-900">{stats.totalAttendees}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Impact</p>
                   </div>
                   <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-md transition-all">
                      <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit mb-4 group-hover:bg-amber-600 group-hover:text-white transition-all">
                         <TrendingUp size={20} />
                      </div>
                      <p className="text-3xl font-black text-slate-900">{stats.upcomingEvents}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Scheduled</p>
                   </div>
                </div>
              )}

              {/* Detailed Information Form */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                       <Award size={22} className="text-indigo-600" />
                       Account Details
                    </h3>
                 </div>
                 <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                          <div className="relative group">
                             <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                             <input 
                               disabled={!isEditing}
                               className={`w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold transition-all ${isEditing ? 'focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white' : 'text-slate-500 cursor-not-allowed'}`}
                               value={formData.name} 
                               onChange={(e) => setFormData({...formData, name: e.target.value})} 
                             />
                          </div>
                       </div>
                       
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                          <div className="relative group">
                             <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                             <input 
                               disabled={!isEditing}
                               className={`w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold transition-all ${isEditing ? 'focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white' : 'text-slate-500 cursor-not-allowed'}`}
                               value={formData.email} 
                               onChange={(e) => setFormData({...formData, email: e.target.value})} 
                             />
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Employee / Student ID</label>
                          <div className="relative group">
                             <Contact className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                             <input 
                               disabled={!isEditing}
                               className={`w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold transition-all ${isEditing ? 'focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white' : 'text-slate-500 cursor-not-allowed'}`}
                               placeholder="Not specified"
                               value={formData.staffId} 
                               onChange={(e) => setFormData({...formData, staffId: e.target.value})} 
                             />
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Department / Faculty</label>
                          <div className="relative group">
                             <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                             <input 
                               disabled={!isEditing}
                               className={`w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold transition-all ${isEditing ? 'focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white' : 'text-slate-500 cursor-not-allowed'}`}
                               placeholder="e.g. Computer Science"
                               value={formData.department} 
                               onChange={(e) => setFormData({...formData, department: e.target.value})} 
                             />
                          </div>
                       </div>
                    </div>

                    {isEditing && (
                      <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-slate-50">
                        <button 
                          onClick={handleSave} 
                          className="flex-1 flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95"
                        >
                          <Check size={18} /> Save Changes
                        </button>
                        <button 
                          onClick={() => { setIsEditing(false); setFormData({ name: user.name, email: user.email, staffId: user.staffId, department: user.department }); }} 
                          className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                        >
                          <X size={18} /> Cancel
                        </button>
                      </div>
                    )}
                 </div>
              </div>
            </div>

            {/* Right Column: Actions & Security */}
            <div className="space-y-8">
               {/* Quick Actions Sidebar */}
               {(user?.role === "Teacher" || user?.role === "Admin") && (
                 <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-200">
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                       Actions
                    </h3>
                    <div className="space-y-4">
                       <Link 
                         to="/events/create" 
                         className="flex items-center gap-3 w-full p-4 bg-white/10 hover:bg-indigo-600 rounded-2xl text-sm font-bold transition-all group"
                       >
                          <div className="p-2 bg-white/10 rounded-xl group-hover:bg-white/20">
                             <PlusCircle size={20} className="text-indigo-400 group-hover:text-white" />
                          </div>
                          Host New Event
                       </Link>
                       <Link 
                         to="/events" 
                         className="flex items-center gap-3 w-full p-4 bg-white/10 hover:bg-indigo-600 rounded-2xl text-sm font-bold transition-all group"
                       >
                          <div className="p-2 bg-white/10 rounded-xl group-hover:bg-white/20">
                             <Calendar size={20} className="text-indigo-400 group-hover:text-white" />
                          </div>
                          Manage Calendar
                       </Link>
                    </div>
                 </div>
               )}

               {/* Security Card */}
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                     Security
                  </h3>
                  <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl relative overflow-hidden group">
                     <div className="relative z-10 flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${user?.isTwoFactorEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                           <Shield size={24} />
                        </div>
                        <div>
                           <p className="font-bold text-slate-900">2FA Security</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.isTwoFactorEnabled ? 'Active' : 'Not Enabled'}</p>
                        </div>
                     </div>
                     <Link to="/dashboard" className="relative z-10 p-2 bg-white rounded-xl shadow-sm text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all">
                        <Edit2 size={16} />
                     </Link>
                  </div>
                  
                  <div className="mt-8 flex items-center gap-3 text-xs font-medium text-slate-400">
                     <Clock size={14} />
                     <span>Last login: Today at 09:42 AM</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
