import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import { ShieldCheck, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

const TwoFactorVerify = () => {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login-2fa", { userId, token });
      localStorage.setItem("profile", JSON.stringify(data));
      setUser(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid 2FA token");
    }
  };

  if (!userId) {
     return (
       <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100">
             <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} />
             </div>
             <h2 className="text-2xl font-black text-slate-900 mb-4">Session Expired</h2>
             <p className="text-slate-500 font-medium mb-8">Please log in again to receive a new verification code.</p>
             <Link to="/login" className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200">
                <ArrowLeft size={18} /> Back to Login
             </Link>
          </div>
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans antialiased">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-700">
        
        {/* Header Area */}
        <div className="p-10 text-center bg-gradient-to-br from-slate-900 to-indigo-950 text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/10">
               <ShieldCheck size={32} className="text-indigo-400" />
            </div>
            <h1 className="text-2xl font-black tracking-tight mb-2">Two-Step Verification</h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">Please enter the 6-digit code from your authenticator app to continue.</p>
          </div>
        </div>

        {/* Form Area */}
        <div className="p-10">
          {error && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold animate-in slide-in-from-top-2">
               <AlertCircle size={20} />
               {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center">6-Digit Verification Code</label>
              <input
                type="text"
                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl text-center text-4xl font-black tracking-[0.5em] focus:outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-200 shadow-inner"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                maxLength="6"
                required
                autoComplete="one-time-code"
                autoFocus
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <CheckCircle size={22} />
              <span>Verify & Access</span>
            </button>
          </form>

          <button 
            onClick={() => navigate("/login")}
            className="mt-8 flex items-center justify-center gap-2 w-full text-slate-400 hover:text-indigo-600 font-bold text-sm transition-all"
          >
            <ArrowLeft size={16} /> Back to Login
          </button>
        </div>

        {/* Footer Area */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secured by Evently Auth</p>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorVerify;
