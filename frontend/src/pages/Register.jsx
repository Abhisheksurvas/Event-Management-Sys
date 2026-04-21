import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { User, Mail, Lock, UserPlus, Sparkles, ShieldCheck, ArrowRight, ChevronDown } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
  });
  const [error, setError] = useState("");
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans antialiased">
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse border border-slate-100 animate-in fade-in zoom-in duration-700">
        
        {/* Right: Form Area */}
        <div className="flex-1 p-10 lg:p-16 flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-indigo-600 font-black text-xl mb-4">
               <Sparkles size={28} />
               <span>Evently</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create Account</h1>
            <p className="text-slate-500 font-medium text-sm">Join the campus network and start managing events.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold animate-in slide-in-from-top-2">
               <ShieldCheck size={20} />
               {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <div className="space-y-2 group sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type="text"
                  className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-inner"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type="email"
                  className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-inner"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@college.edu"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Account Role</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
                   <ChevronDown size={20} />
                </div>
                <select
                  className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700 appearance-none shadow-inner"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="HOD">HOD</option>
                  <option value="Principal">Principal</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 group sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Choose Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type="password"
                  className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-inner"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3 sm:col-span-2 mt-4"
            >
              <UserPlus size={20} />
              <span>Create Account</span>
            </button>
          </form>

          <p className="mt-8 text-center text-slate-400 text-sm font-bold">
            Already a member? 
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 ml-2 group">
               Log In <ArrowRight size={14} className="inline group-hover:translate-x-1 transition-transform" />
            </Link>
          </p>
        </div>

        {/* Left: Accent Area */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-slate-900 to-indigo-950 p-16 flex-col justify-between text-white relative">
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full -ml-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-10 -mb-10 blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-white/10">
               <UserPlus size={32} className="text-indigo-400" />
            </div>
            <h2 className="text-4xl font-black leading-[1.1] mb-6 tracking-tight">One Platform. <br/>Unlimited Possibilities.</h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">Organize workshops, manage attendance, and get real-time reports with the most intuitive campus management system.</p>
          </div>

          <div className="relative z-10 p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] shadow-2xl">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                   <ShieldCheck size={20} />
                </div>
                <div>
                   <p className="text-sm font-bold">Secure Access</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise Grade Security</p>
                </div>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed italic">"The automated reporting saved our department over 15 hours of manual entry every month."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
