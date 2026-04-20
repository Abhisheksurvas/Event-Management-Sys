import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Mail, Lock, LogIn, Sparkles, ShieldCheck, ArrowRight, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email: formData.username, password: formData.password });
    } catch (err) {
      setError(err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans antialiased">
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100 animate-in fade-in zoom-in duration-700">
        
        {/* Left: Form Area */}
        <div className="flex-1 p-10 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <div className="flex items-center gap-2 text-indigo-600 font-black text-xl mb-4">
               <Sparkles size={28} />
               <span>Evently</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome Back!</h1>
            <p className="text-slate-500 font-medium text-sm">Sign in to your account to manage campus events.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold animate-in slide-in-from-top-2">
               <ShieldCheck size={20} />
               {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type="email"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-inner"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-inner"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <LogIn size={20} />
              <span>Enter Dashboard</span>
            </button>
          </form>

          <p className="mt-10 text-center text-slate-400 text-sm font-bold">
            Don't have an account? 
            <Link to="/register" className="text-indigo-600 hover:text-indigo-800 ml-2 group">
               Sign Up <ArrowRight size={14} className="inline group-hover:translate-x-1 transition-transform" />
            </Link>
          </p>
        </div>

        {/* Right: Accent Area */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-600 to-indigo-900 p-16 flex-col justify-between text-white relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-white/20">
               <ShieldCheck size={32} />
            </div>
            <h2 className="text-4xl font-black leading-[1.1] mb-6">Streamlined Event Management.</h2>
            <p className="text-indigo-100 text-lg font-medium leading-relaxed">Join thousands of students and faculty members in creating meaningful campus experiences.</p>
          </div>

          <div className="relative z-10 flex items-center gap-4 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2rem]">
             <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-700 bg-indigo-500 flex items-center justify-center text-xs font-bold">
                     {String.fromCharCode(64 + i)}
                  </div>
                ))}
             </div>
             <p className="text-xs font-bold tracking-tight text-indigo-100">Over 2,400+ students active today.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
