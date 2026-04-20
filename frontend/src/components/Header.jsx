import React, { useState, useEffect } from 'react';
import { Bell, Plus, Menu, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const Header = ({ title, subtitle, onCreateEvent, onToggleSidebar }) => {
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const { data } = await API.get('/notifications/count');
        setNotificationCount(data.count);
      } catch (error) {
        // Silently fail if notification service is not ready
      }
    };
    fetchNotificationCount();
  }, []);

  const canCreate = ["Teacher", "Admin"].includes(user?.role);

  return (
    <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <button 
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
          onClick={onToggleSidebar}
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-slate-500 text-sm font-medium">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="relative hidden lg:block group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search events..." 
            className="pl-11 pr-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all w-64 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 px-4 border-x border-slate-200">
           <button className="relative p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
            <Bell size={22} />
            {notificationCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {notificationCount}
              </span>
            )}
          </button>
          
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all overflow-hidden">
               <User size={20} />
            </div>
          </div>
        </div>

        {canCreate && onCreateEvent && (
          <button 
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-200/50 hover:-translate-y-0.5"
            onClick={onCreateEvent}
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Create Event</span>
          </button>
        )}

        <Link
          to="/profile"
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
        >
          <User size={16} />
          <span className="hidden sm:inline">Edit Profile</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
