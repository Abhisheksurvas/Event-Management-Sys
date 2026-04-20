import React, { useState, useMemo, useEffect } from 'react';
import { Search, Calendar, CheckCircle2, XCircle, UserPlus, Clock3, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import API from '../api';
import toast from 'react-hot-toast';

const StudentAttendanceDashboard = ({ user }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/events');
        setEvents(data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load attendance data');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Only show events where student already requested/registered.
  const registeredEvents = useMemo(() => {
    return events
      .filter((event) => event.myStatus && event.myStatus !== 'not joined')
      .map((event) => ({
        ...event,
        // Requirement: approved => present, otherwise absent.
        attendanceResult: event.myStatus === 'approved' ? 'present' : 'absent',
      }));
  }, [events]);

  const stats = useMemo(() => {
    const total = registeredEvents.length;
    const present = registeredEvents.filter((e) => e.attendanceResult === 'present').length;
    const absent = total - present;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    return { total, present, absent, percentage };
  }, [registeredEvents]);

  const filteredEvents = useMemo(() => {
    return registeredEvents.filter(
      (event) =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [registeredEvents, searchTerm]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar isOpen={isSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'} p-6 md:p-10`}>
        <div className="max-w-7xl mx-auto">
          <Header
            title="Student Dashboard"
            subtitle={`Welcome back, ${user?.name || 'Student'}!`}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">My Attendance</h1>
              <p className="text-slate-500">Registration goes to teacher. Approved means present, otherwise absent.</p>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              Register
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-slate-500 text-sm font-medium mb-1">Registered Events</h3>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  {stats.percentage}%
                </span>
              </div>
              <h3 className="text-slate-500 text-sm font-medium mb-1">Present</h3>
              <p className="text-3xl font-bold text-slate-900">{stats.present}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl w-fit mb-4">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-slate-500 text-sm font-medium mb-1">Absent</h3>
              <p className="text-3xl font-bold text-slate-900">{stats.absent}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-900">Attendance Log</h2>
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search event or location..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="py-20 text-center text-slate-500 font-medium">Loading attendance data...</div>
              ) : filteredEvents.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Event Name</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Request</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEvents.map((event) => (
                      <tr key={event._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{event.title}</td>
                        <td className="px-6 py-4 text-slate-600 text-sm">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {event.location}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 text-sm">{new Date(event.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                              event.myStatus === 'approved'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : event.myStatus === 'pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-100'
                                : 'bg-rose-50 text-rose-700 border-rose-100'
                            }`}
                          >
                            {event.myStatus === 'approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {event.myStatus === 'pending' && <Clock3 className="w-3.5 h-3.5" />}
                            {event.myStatus === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                            {event.myStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {event.attendanceResult === 'present' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Present
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border border-rose-100">
                              <XCircle className="w-3.5 h-3.5" />
                              Absent
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-20 text-center">
                  <h3 className="text-lg font-semibold text-slate-900">No registered events yet</h3>
                  <p className="text-slate-500 mt-1 mb-5">Register for an event, then wait for teacher approval.</p>
                  <Link
                    to="/events"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentAttendanceDashboard;
