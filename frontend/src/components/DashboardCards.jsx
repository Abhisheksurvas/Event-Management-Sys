import React from 'react';
import { CalendarCheck, Users, Clock, CheckCircle, UserCheck, UserX, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Card = ({ title, value, icon, colorClass, description, trend }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600 text-blue-600 bg-blue-50',
    purple: 'from-purple-500 to-purple-600 text-purple-600 bg-purple-50',
    orange: 'from-orange-500 to-orange-600 text-orange-600 bg-orange-50',
    green: 'from-emerald-500 to-emerald-600 text-emerald-600 bg-emerald-50',
    rose: 'from-rose-500 to-rose-600 text-rose-600 bg-rose-50',
  };

  const selectedColor = colors[colorClass] || colors.blue;
  const [gradient, text, bg] = selectedColor.split(' ');

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${bg} ${text} group-hover:bg-gradient-to-br ${gradient} group-hover:text-white transition-all duration-300`}>
          {React.cloneElement(icon, { size: 24 })}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp size={12} />
            {trend}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{value}</span>
        </div>
        <p className="text-slate-400 text-xs mt-2 flex items-center gap-1">
          {description}
        </p>
      </div>
      <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${gradient} transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min(100, (parseInt(value) / 20) * 100)}%` }}
        />
      </div>
    </div>
  );
};

const DashboardCards = ({ stats }) => {
  const { user } = useAuth();
  const role = user?.role;

  if (role === 'Student') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          title="Joined Events"
          value={stats?.totalRegistrations || 0}
          icon={<Users />}
          colorClass="purple"
          description={`Out of ${stats?.totalEvents || 0} total events`}
        />
        <Card
          title="Present"
          value={stats?.presentCount || 0}
          icon={<UserCheck />}
          colorClass="green"
          description="Attendance recorded"
          trend={`${stats?.totalRegistrations ? Math.round((stats.presentCount / stats.totalRegistrations) * 100) : 0}%`}
        />
        <Card
          title="Absent"
          value={stats?.absentCount || 0}
          icon={<UserX />}
          colorClass="rose"
          description="Missed events"
        />
        <Card
          title="Active Events"
          value={stats?.activeEvents || 0}
          icon={<CalendarCheck />}
          colorClass="blue"
          description="Currently available"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card
        title="Active Events"
        value={stats?.activeEvents || 0}
        icon={<CalendarCheck />}
        colorClass="blue"
        description="Across all departments"
        trend={stats?.weeklyIncrease ? `+${stats.weeklyIncrease}` : null}
      />
      <Card
        title="Total Registrations"
        value={stats?.totalRegistrations || 0}
        icon={<Users />}
        colorClass="purple"
        description="Global participation"
      />
      <Card
        title="Pending Approvals"
        value={stats?.pendingApprovals || 0}
        icon={<Clock />}
        colorClass="orange"
        description="Awaiting review"
      />
      <Card
        title="Completed Events"
        value={stats?.completedEvents || 0}
        icon={<CheckCircle />}
        colorClass="green"
        description="Successfully finished"
      />
    </div>
  );
};

export default DashboardCards;
