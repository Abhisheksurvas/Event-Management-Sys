import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import { FileDown, FileText, BarChart3, PieChart, TrendingUp, ArrowRight, Download } from "lucide-react";

const Reports = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleDownload = async (type) => {
    try {
      const response = await API.get(`/events/export/${type}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `system_wide_report_${new Date().getTime()}.${type === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  const showSystemReports = ["HOD", "Principal", "Admin", "Teacher"].includes(user?.role);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar isOpen={isSidebarOpen} />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'} p-6 md:p-10`}>
        <div className="max-w-7xl mx-auto">
          <Header
            title="Reports & Analytics"
            subtitle="Deep dive into system-wide event performance and participation."
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Quick Actions / Stats */}
            <div className="lg:col-span-1 space-y-8">
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <TrendingUp size={18} className="text-indigo-600" />
                    Reporting Summary
                  </h3>
                  <div className="space-y-4">
                     <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Reports Generated</p>
                        <p className="text-2xl font-black text-slate-900">128</p>
                     </div>
                     <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Most Exported Format</p>
                        <p className="text-2xl font-black text-slate-900">Excel (.xlsx)</p>
                     </div>
                  </div>
                  <div className="mt-8 p-6 bg-indigo-50 border border-indigo-100 rounded-2xl">
                     <p className="text-xs font-bold text-indigo-700 leading-relaxed italic">"Detailed analytics help in understanding student engagement across different campus activities."</p>
                  </div>
               </div>

               <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-200 group">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="p-2 bg-white/10 rounded-xl">
                        <PieChart size={20} className="text-indigo-400" />
                     </div>
                     <h4 className="font-bold">Real-time Data</h4>
                  </div>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">System reports are generated from live data, ensuring you always have the latest attendance records.</p>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-500 w-3/4 group-hover:w-full transition-all duration-1000"></div>
                  </div>
               </div>
            </div>

            {/* Main Reports Area */}
            <div className="lg:col-span-2 space-y-8">
               <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-full">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">Available Exports</h2>
                      <p className="text-slate-500 text-sm mt-1 font-medium">Download comprehensive data for all institution events.</p>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                       <BarChart3 size={24} />
                    </div>
                  </div>
                  
                  {showSystemReports ? (
                    <div className="space-y-6">
                      <div className="group flex flex-col sm:flex-row sm:items-center p-8 bg-slate-50 border border-slate-100 rounded-3xl gap-6 hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="p-5 bg-emerald-100 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm shadow-emerald-100">
                          <FileDown size={32} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">Master Attendance Sheet</h4>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-widest">Excel</span>
                          </div>
                          <p className="text-sm text-slate-500 font-medium">A complete spreadsheet containing every event, registrant details, and their final attendance status.</p>
                        </div>
                        <button 
                          onClick={() => handleDownload('excel')} 
                          className="flex items-center justify-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-95"
                        >
                          <Download size={18} /> Download
                        </button>
                      </div>

                      <div className="group flex flex-col sm:flex-row sm:items-center p-8 bg-slate-50 border border-slate-100 rounded-3xl gap-6 hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="p-5 bg-rose-100 text-rose-600 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-all duration-300 shadow-sm shadow-rose-100">
                          <FileText size={32} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">System Summary Report</h4>
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 uppercase tracking-widest">PDF</span>
                          </div>
                          <p className="text-sm text-slate-500 font-medium">A summarized overview of institutional event performance, highlighting top categories and participation rates.</p>
                        </div>
                        <button 
                          onClick={() => handleDownload('pdf')} 
                          className="flex items-center justify-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-lg hover:shadow-rose-200 transition-all active:scale-95"
                        >
                          <Download size={18} /> Download
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-24 flex flex-col items-center justify-center text-center px-6">
                      <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mb-6 border-2 border-dashed border-slate-200 shadow-inner">
                        <FileText size={40} />
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 mb-2">No Export Access</h3>
                      <p className="text-slate-500 max-w-sm mb-8 font-medium">Individual event reports are available directly within each event's details page.</p>
                      <a 
                        href="/events" 
                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
                      >
                        Browse My Events <ArrowRight size={18} />
                      </a>
                    </div>
                  )}
               </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
