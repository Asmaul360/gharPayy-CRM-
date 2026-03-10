import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, Home, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('agent', JSON.stringify(res.data.agent));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1.5rem] shadow-2xl shadow-blue-500/20 mb-6 border-2 border-white/10 group hover:rotate-6 transition-transform">
            <Home className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Gharpayy <span className="text-blue-500">CRM</span></h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">Agent Enterprise Portal</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
           {/* Glass card effect */}
           <div className="absolute inset-0 bg-white/[0.02] pointer-events-none"></div>
           
           <form className="space-y-6 relative z-10" onSubmit={handleLogin}>
            {error && (
              <div className="p-4 text-xs font-black uppercase tracking-widest text-red-400 bg-red-950/30 border border-red-500/20 rounded-2xl animate-shake">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Terminal</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="w-full bg-slate-950/50 border border-white/10 pl-14 pr-5 py-4 rounded-2xl text-white font-bold text-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-600"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="agent@gharpayy.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Passkey</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  className="w-full bg-slate-950/50 border border-white/10 pl-14 pr-5 py-4 rounded-2xl text-white font-bold text-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-600"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full group btn-gradient py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Initialize Session</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="mt-10 flex items-center justify-center space-x-2 text-slate-600">
           <ShieldCheck size={14} />
           <p className="text-[10px] font-black uppercase tracking-[0.2em]">End-to-End Encrypted Session</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
