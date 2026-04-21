import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import API from "../api";
import { Sparkles, ArrowLeft, AlignLeft, Calendar, MapPin, Send } from "lucide-react";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/events", formData);
      toast.success("Event created successfully!");
      navigate("/events");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create event");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar isOpen={isSidebarOpen} />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'} p-6 md:p-10`}>
        <div className="max-w-4xl mx-auto">
          <Header
            title="Host New Event"
            subtitle="Fill in the details to schedule a new campus event."
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          <Link 
            to="/events" 
            className="mb-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold text-sm transition-all group w-fit"
          >
            <div className="p-1.5 bg-white border border-slate-200 rounded-lg group-hover:border-indigo-100 group-hover:bg-indigo-50 transition-all">
              <ArrowLeft size={16} />
            </div>
            Back to Events
          </Link>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="p-8 sm:p-12 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
                   <Sparkles size={32} />
                </div>
                <div>
                   <h2 className="text-2xl font-black tracking-tight">Event Creation Wizard</h2>
                   <p className="text-indigo-100 text-sm font-medium mt-1">Ready to create something amazing for the students?</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <AlignLeft size={16} className="text-indigo-500" />
                  Event Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. AI & Robotics Symposium 2024"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-medium placeholder:text-slate-400 shadow-inner"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <AlignLeft size={16} className="text-indigo-500" />
                  Full Description
                </label>
                <textarea
                  placeholder="Provide a detailed overview of the event, its objectives, and what attendees can expect..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-medium placeholder:text-slate-400 shadow-inner min-h-[160px] resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Calendar size={16} className="text-indigo-500" />
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-medium shadow-inner"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <MapPin size={16} className="text-indigo-500" />
                    Venue / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Science Block, Room 102"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-medium placeholder:text-slate-400 shadow-inner"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex flex-col-reverse sm:flex-row gap-4">
                 <button 
                   type="button" 
                   onClick={() => navigate(-1)}
                   className="flex-1 py-4 px-8 border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-95"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   className="flex-[2] py-4 px-8 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                 >
                   <Send size={20} />
                   Publish Event Now
                 </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;
