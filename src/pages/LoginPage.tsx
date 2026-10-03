import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  HelpCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GyfLogo } from '../components/GyfLogo';

export const LoginPage: React.FC = () => {
  const { user, login } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAccessHelp, setShowAccessHelp] = useState(false);

  const handleAfterLogin = (loggedInUser?: any) => {
    const targetUser = loggedInUser || user;
    if (targetUser?.role === 'admin' || targetUser?.email?.toLowerCase() === 'admin@gyf.org') {
      navigate('/admin', { replace: true });
    } else if (targetUser?.role === 'volunteer' || targetUser?.membershipStatus === 'Volunteer') {
      navigate('/volunteer', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide your email address.');
      return;
    }
    if (!password) {
      setError('Please provide your password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await login(email.trim(), password);
      setIsLoading(false);

      if (res.success && res.user) {
        handleAfterLogin(res.user);
      } else {
        setError(res.error || 'Invalid email or password. Please verify your credentials.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Authentication error occurred. Please try again.');
    }
  };

  return (
    <div id="login-page" className="min-h-screen bg-linear-to-b from-slate-50 via-slate-100/60 to-slate-200/40 flex flex-col items-center justify-center p-4 py-8 font-sans">

      {/* Top Header Navigation */}
      <div className="w-full max-w-[480px] mb-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <span className="text-[11px] font-extrabold text-[#272d8a] bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-lg">
          Global Youth Foundation
        </span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-[480px] bg-white rounded-[28px] border border-slate-200/80 shadow-[0_16px_48px_rgba(30,35,112,0.08)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Card Header */}
        <div className="bg-[#272d8a] text-white pt-8 pb-7 px-8 text-center space-y-2.5 relative overflow-hidden">
          <div className="flex justify-center mb-1">
            <GyfLogo size="md" variant="white" />
          </div>

          <h1 className="text-2xl sm:text-[25px] font-black text-white tracking-tight">
            Sign In to GYF Portal
          </h1>

          <p className="text-xs text-blue-100/90 font-medium max-w-[340px] mx-auto">
            Authorized access for Administrators, Field Volunteers, and Registered Members
          </p>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-5">

          {/* Active Session Notice */}
          {user && (
            <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200/80 text-teal-950 text-xs flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] text-teal-700 font-medium block">Active Session:</span>
                <strong className="font-bold truncate block">{user.fullName} ({user.role})</strong>
              </div>
              <button
                type="button"
                onClick={() => handleAfterLogin()}
                className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shrink-0 transition-all shadow-xs"
              >
                Go to Workspace
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Real Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
                Official Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@gyf.org or your email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50/60 hover:bg-slate-50 focus:bg-white border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#272d8a] focus:border-transparent transition-all"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
                  Password
                </label>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50/60 hover:bg-slate-50 focus:bg-white border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#272d8a] focus:border-transparent transition-all"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#272d8a] hover:bg-[#1e2370] active:scale-[0.99] disabled:opacity-60 text-white text-sm font-bold shadow-md shadow-[#272d8a]/20 transition-all mt-2 cursor-pointer"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In Securely</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Collapsible Access & Credentials Assistance */}
          {/* COMMENTED OUT — credentials/access level hints hidden from public view
          <div className="pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAccessHelp(!showAccessHelp)}
              className="w-full flex items-center justify-between text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors py-1.5"
            >
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                Need credentials or access guidance?
              </span>
              {showAccessHelp ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAccessHelp && (
              <div className="mt-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs space-y-2 text-slate-600 animate-in fade-in duration-150">
                <p className="font-bold text-slate-800 text-[11.5px] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#272d8a]" />
                  Designated System Access Levels:
                </p>
                <div className="space-y-1.5 text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                    <strong className="text-purple-900 font-bold">Admin Portal:</strong> For Secretariat executives managing programs, events, grievance dispatch, and system records.
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                    <strong className="text-sky-900 font-bold">Volunteer Portal:</strong> For registered field coordinators managing local chapters, outreach drives, and assigned tasks.
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200/80">
                    <strong className="text-slate-800 font-bold">Member Portal:</strong> For registered website users to track grievance submissions, register for events, and manage memberships.
                  </div>
                </div>
              </div>
            )}
          </div>
          */}

          {/* Create Account Link */}
          <div className="text-center text-xs text-slate-500 font-medium pt-1">
            Don’t have an account yet?{' '}
            <Link to="/signup" className="font-bold text-[#272d8a] hover:underline">
              Create an account
            </Link>
          </div>

        </div>
      </div>

      {/* Security Footer Note */}
      <div className="mt-6 text-center text-[11px] text-slate-600 flex items-center gap-1.5 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>End-to-End SSL Encrypted & Protected by PostgreSQL Row Level Security (RLS)</span>
      </div>

    </div>
  );
};
