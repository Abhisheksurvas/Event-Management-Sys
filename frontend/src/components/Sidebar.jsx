import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, BarChart3, LogOut, User as UserIcon, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = {
    Student: [
      { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
      { name: 'All Events', icon: <Calendar size={20} />, path: '/events' },
      { name: 'My Attendance', icon: <Users size={20} />, path: '/attendance' },
      { name: 'Profile', icon: <UserIcon size={20} />, path: '/profile' },
    ],
    Teacher: [
      { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
      { name: 'My Events', icon: <Calendar size={20} />, path: '/events' },
      { name: 'Registered Students', icon: <Users size={20} />, path: '/students' },
      { name: 'Reports', icon: <BarChart3 size={20} />, path: '/reports' },
      { name: 'Profile', icon: <UserIcon size={20} />, path: '/profile' },
    ],
    Admin: [
      { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
      { name: 'All Events', icon: <Calendar size={20} />, path: '/events' },
      { name: 'Users', icon: <Users size={20} />, path: '/users' },
      { name: 'Reports', icon: <BarChart3 size={20} />, path: '/reports' },
      { name: 'Profile', icon: <UserIcon size={20} />, path: '/profile' },
    ],
    HOD: [
      { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
      { name: 'Dept Events', icon: <Calendar size={20} />, path: '/events' },
      { name: 'Teachers', icon: <Users size={20} />, path: '/teachers' },
      { name: 'Reports', icon: <BarChart3 size={20} />, path: '/reports' },
      { name: 'Profile', icon: <UserIcon size={20} />, path: '/profile' },
    ],
    Principal: [
      { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
      { name: 'All Events', icon: <Calendar size={20} />, path: '/events' },
      { name: 'Reports', icon: <BarChart3 size={20} />, path: '/reports' },
      { name: 'Profile', icon: <UserIcon size={20} />, path: '/profile' },
    ],
  };

  const currentMenu = menuItems[user?.role] || menuItems['Student'];

  return (
    <aside className={`fixed top-0 left-0 h-full w-72 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out z-[60] border-r border-slate-800 ${!isOpen ? '-translate-x-full' : 'translate-x-0'}`}>
      <div className="p-8 flex items-center gap-3">
        <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
          <GraduationCap className="w-7 h-7 text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-wide">
          Evently
        </span>
      </div>

      <nav className="px-4 py-6 flex flex-col gap-1 flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
        {currentMenu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-medium transition-all group ${
                isActive 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <span className="transition-transform group-hover:scale-110">
              {item.icon}
            </span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 w-full p-6 bg-slate-900/80 backdrop-blur-md border-t border-slate-800">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 border border-slate-700 shadow-inner">
            <UserIcon size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 font-medium truncate uppercase tracking-wider">{user?.role} • {user?.department || 'Gen'}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-slate-800 hover:bg-rose-600/10 hover:text-rose-500 border border-slate-700 hover:border-rose-500/50 transition-all font-semibold text-sm"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
