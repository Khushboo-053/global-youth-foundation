import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  AlertCircle,
  UserCheck,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { user, login, loginAsDemo } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@gyf.org');
  const [password, setPassword] = useState('Admin@GYF2026!');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAfterLogin = (loggedInUser?: any) => {
    const targetUser = loggedInUser || user;
    if (targetUser?.role === 'volunteer' || targetUser?.membershipStatus === 'Volunteer') {
      navigate('/volunteer', { replace: true });
    } else if (targetUser?.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide your email address');
      return;
    }

    setIsLoading(true);
    setError('');

    const res = await login(email.trim(), password.trim());
    setIsLoading(false);

    if (res.success && res.user) {
      handleAfterLogin(res.user);
    } else {
      setError(res.error || 'Invalid credentials or inactive account.');
    }
  };

  const handleQuickDemo = (role: 'admin' | 'volunteer' | 'user') => {
    const demoUser = loginAsDemo(role);
    if (role === 'admin') {
      setEmail('admin@gyf.org');
      setPassword('Admin@GYF2026!');
      navigate('/admin', { replace: true });
    } else if (role === 'volunteer') {
      setEmail('volunteer@gyf.org');
      setPassword('Volunteer@GYF2026!');
      navigate('/volunteer', { replace: true });
    } else {
      setEmail('tariq@gyf.org');
      setPassword('Member@GYF2026!');
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div id="login-page" className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 py-8 font-sans">
      <div className="w-full max-w-[480px] mb-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Website</span>
        </Link>
        <span className="text-[11px] font-extrabold text-teal-800 bg-teal-50 border border-teal-200/80 px-2.5 py-1 rounded-lg">
          Global Youth Foundation
        </span>
      </div>

      <div className="w-full max-w-[480px] bg-white rounded-[28px] border border-slate-100 shadow-[0_12px_45px_rgba(0,0,0,0.07)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Dark Navy Header Section */}
        <div className="bg-[#272d8a] text-white pt-9 pb-8 px-8 text-center space-y-2.5 relative overflow-hidden">
          <div className="w-13 h-13 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center mx-auto mb-2 shadow-inner backdrop-blur-xs">
            <Lock className="w-6 h-6 stroke-[2.2]" />
          </div>
          
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-white tracking-tight">
            GYF Secure Portal Login
          </h1>
          
          <p className="text-xs text-blue-100/90 font-medium">
            Role-based authentication for Admins, Volunteers, and Citizens
          </p>
        </div>

        {/* Card Body Section */}
        <div className="p-7 sm:p-9 space-y-5">
          
          {user && (
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200/80 text-teal-900 text-xs flex items-center justify-between gap-2">
              <span className="truncate">
                Logged in as <strong className="font-bold">{user.fullName}</strong> ({user.role})
              </span>
              <button
                type="button"
                onClick={() => handleAfterLogin()}
                className="px-2.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold shrink-0 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Role Login Demo Buttons */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
              1-CLICK LOGIN TO DASHBOARD:
            </span>
            
            <div className="grid grid-cols-3 gap-2.5">
              {/* Admin Card */}
              <button
                type="button"
                id="login-quick-admin-btn"
                onClick={() => handleQuickDemo('admin')}
                className="p-3 rounded-2xl bg-purple-50/40 hover:bg-purple-50/80 border border-purple-200 hover:border-purple-300 text-xs font-bold flex flex-col items-center gap-1.5 transition-all text-center group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="leading-tight">
                  <div className="font-extrabold text-purple-900 text-[13px]">Admin</div>
                  <div className="text-[11px] text-purple-500 font-medium">/admin</div>
                </div>
              </button>

              {/* Volunteer Card */}
              <button
                type="button"
                id="login-quick-volunteer-btn"
                onClick={() => handleQuickDemo('volunteer')}
                className="p-3 rounded-2xl bg-sky-50/40 hover:bg-sky-50/80 border border-sky-300 hover:border-sky-400 text-xs font-bold flex flex-col items-center gap-1.5 transition-all text-center group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <UserCheck className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="leading-tight">
                  <div className="font-extrabold text-sky-900 text-[13px]">Volunteer</div>
                  <div className="text-[11px] text-sky-500 font-medium">/volunteer</div>
                </div>
              </button>

              {/* Citizen Card */}
              <button
                type="button"
                id="login-quick-citizen-btn"
                onClick={() => handleQuickDemo('user')}
                className="p-3 rounded-2xl bg-slate-50/60 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 text-xs font-bold flex flex-col items-center gap-1.5 transition-all text-center group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <User className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="leading-tight">
                  <div className="font-extrabold text-slate-800 text-[13px]">Citizen</div>
                  <div className="text-[11px] text-slate-400 font-medium">/dashboard</div>
                </div>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
              OR EMAIL & PASSWORD
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
                EMAIL ADDRESS
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gyf.org"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#272d8a] focus:border-transparent transition-all shadow-2xs"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
                PASSWORD
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#272d8a] focus:border-transparent transition-all shadow-2xs"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#272d8a] hover:bg-[#1e2370] active:scale-[0.99] disabled:opacity-50 text-white text-sm font-bold shadow-md shadow-indigo-950/15 transition-all mt-1 cursor-pointer"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Create Account Link */}
          <div className="text-center text-xs text-slate-500 font-medium pt-1">
            Don’t have an account yet?{' '}
            <Link to="/signup" className="font-bold text-[#272d8a] hover:underline">
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

