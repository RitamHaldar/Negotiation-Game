import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Terminal, Lock, User, Mail, Zap, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister, loading, error } = useAuth();
  
  // Two-way bounding variables
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) return;
    
    try {
      const response = await handleRegister({ username, email, password });
      if (response.success) {
        navigate('/'); // Navigate to dashboard/home after registration
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#060b13] text-slate-200 flex items-center justify-center relative font-sans selection:bg-cyan-500/30 p-4 overflow-hidden">
      
      {/* Background Grid & Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40V0h40' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")` }}></div>
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/15 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Floating Decorative Elements */}
        <div className="absolute -top-6 -left-6 w-12 h-12 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-xl animate-pulse"></div>
        <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-2 border-r-2 border-cyan-500/40 rounded-br-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>

        <div className="bg-[#0B111A]/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden relative group">
          
          {/* Top Edge Glow */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div>

          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-16 h-16 bg-[#050A11] border border-slate-800 rounded-xl flex items-center justify-center mb-6 shadow-inner relative group-hover:border-cyan-500/30 transition-colors duration-500">
                <div className="absolute inset-0 bg-cyan-400/10 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Terminal className="w-8 h-8 text-cyan-400 relative z-10" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-widest uppercase mb-2">Initialize Profile</h1>
              <p className="text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase">Join the Negotiation Arena</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                  <span className="text-red-200 text-[11px] font-medium tracking-wide uppercase">{error}</span>
                </div>
              )}
              
              {/* Username Input */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase ml-1">Agent Alias</label>
                <div className="flex h-14 bg-[#050A11] border border-slate-800 rounded-lg overflow-hidden focus-within:border-cyan-500/50 focus-within:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all">
                  <div className="w-12 flex items-center justify-center bg-[#0a0f18] border-r border-slate-800 text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ENTER ALIAS..." 
                    className="flex-1 bg-transparent px-4 outline-none text-white text-[13px] tracking-[0.1em] placeholder:text-slate-600 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase ml-1">Comms Uplink</label>
                <div className="flex h-14 bg-[#050A11] border border-slate-800 rounded-lg overflow-hidden focus-within:border-cyan-500/50 focus-within:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all">
                  <div className="w-12 flex items-center justify-center bg-[#0a0f18] border-r border-slate-800 text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="NAME@SERVER.COM" 
                    className="flex-1 bg-transparent px-4 outline-none text-white text-[13px] tracking-[0.1em] placeholder:text-slate-600 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase ml-1">Encryption Key</label>
                <div className="flex h-14 bg-[#050A11] border border-slate-800 rounded-lg overflow-hidden focus-within:border-cyan-500/50 focus-within:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all">
                  <div className="w-12 flex items-center justify-center bg-[#0a0f18] border-r border-slate-800 text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••" 
                    className="flex-1 bg-transparent px-4 outline-none text-white text-[13px] tracking-[0.2em] placeholder:text-slate-600 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading || !username || !email || !password}
                className={`mt-4 h-14 bg-[#22c55e] hover:bg-[#16a34a] text-[#060B13] flex justify-center items-center gap-3 rounded-lg font-black tracking-[0.2em] uppercase text-xs transition-all group overflow-hidden relative shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] ${loading ? 'opacity-80 cursor-wait' : ''}`}
              >
                <div className="absolute inset-0 bg-white/20 -translate-x-[120%] skew-x-[-20deg] group-hover:animate-[slide_0.6s_ease-out]"></div>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 animate-pulse relative z-10" />
                    <span className="relative z-10">Syncing...</span>
                  </div>
                ) : (
                  <>
                    <span className="relative z-10">Construct Identity</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
              <p className="text-[10px] text-slate-500 font-bold tracking-[0.1em] uppercase">
                Already registered in the system? 
                <button onClick={() => navigate('/login')} className="text-cyan-400 hover:text-cyan-300 ml-2 border-b border-transparent hover:border-cyan-400 transition-colors">
                  Authenticate →
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
