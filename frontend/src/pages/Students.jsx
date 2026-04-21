import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import { Search, Users, Mail, GraduationCap, CheckCircle, XCircle, Clock3 } from "lucide-react";

const Students = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/events");
        const registeredStudents = [];
        data.forEach(event => {
          if (event.attendees) {
            event.attendees.forEach(attendee => {
              const attendeeUser = attendee.user || {};
              registeredStudents.push({
                ...attendeeUser,
                eventName: event.title,
                requestStatus: attendee.registrationStatus || "pending",
                status: attendee.status,
                eventId: event._id
              });
            });
          }
        });
        setStudents(registeredStudents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.eventName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar isOpen={isSidebarOpen} />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'} p-6 md:p-10`}>
        <div className="max-w-7xl mx-auto">
          <Header
            title="Student Roster"
            subtitle="View and manage participants across all your events."
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
             {/* Toolbar */}
             <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="relative group flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by student name, email, or event..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  />
               </div>
               <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 flex items-center gap-2">
                     <Users size={16} className="text-indigo-600" />
                     <span className="text-sm font-bold text-indigo-700">{filteredStudents.length} Total Participants</span>
                  </div>
               </div>
            </div>

            {/* Table */}
            <div className="p-0 overflow-x-auto">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-500 font-medium">Loading participant data...</p>
                </div>
              ) : filteredStudents.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Participant</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Contact</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Registered Event</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Request</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredStudents.map((student, index) => (
                      <tr key={index} className="group hover:bg-slate-50/30 transition-all">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all overflow-hidden uppercase">
                                {student.name?.split(" ").map(n => n[0]).join("")}
                             </div>
                             <div>
                               <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-all">{student.name}</p>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-1">
                                 <GraduationCap size={10} /> {student.department || 'Science Dept'}
                               </p>
                             </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm">
                              <Mail size={14} />
                              <span>{student.email}</span>
                           </div>
                        </td>
                        <td className="px-8 py-5">
                           <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
                              {student.eventName}
                           </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                           <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest border ${
                             student.requestStatus === 'approved'
                             ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                             : student.requestStatus === 'pending'
                             ? 'bg-amber-50 text-amber-600 border-amber-100'
                             : 'bg-rose-50 text-rose-600 border-rose-100'
                           }`}>
                             {student.requestStatus === 'approved' && <CheckCircle size={12} />}
                             {student.requestStatus === 'pending' && <Clock3 size={12} />}
                             {student.requestStatus === 'rejected' && <XCircle size={12} />}
                             {student.requestStatus}
                           </span>
                        </td>
                        <td className="px-8 py-5 text-center">
                           <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest border ${
                             student.status === 'present' 
                             ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                             : 'bg-rose-50 text-rose-600 border-rose-100'
                           }`}>
                             {student.status === 'present' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                             {student.status}
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-32 flex flex-col items-center justify-center text-center px-6">
                   <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-slate-200">
                      <Users size={40} />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 mb-2">No participants found</h3>
                   <p className="text-slate-500 max-w-sm mb-4">We couldn't find any students matching your search criteria.</p>
                </div>
              )}
            </div>
            
            <div className="p-8 bg-slate-50/50 border-t border-slate-100 text-center">
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">End of Participant List</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Students;
