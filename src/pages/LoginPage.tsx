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
  User,
  CheckCircle2,
  XCircle,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GyfLogo } from '../components/GyfLogo';

export const LoginPage: React.FC = () => {
  const { user, login, loginAsDemo } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@gyf.org');
  const [password, setPassword] = useState('Admin@GYF2026!');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleInfo, setShowRoleInfo] = useState(false);
  const [activeRoleInfoTab, setActiveRoleInfoTab] = useState<'user' | 'volunteer' | 'admin'>('user');

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
    loginAsDemo(role);
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
      <div className="w-full max-w-[500px] mb-4 flex items-center justify-between">
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

      <div className="w-full max-w-[500px] bg-white rounded-[28px] border border-slate-100 shadow-[0_12px_45px_rgba(0,0,0,0.07)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Dark Navy Header Section */}
        <div className="bg-[#272d8a] text-white pt-9 pb-8 px-8 text-center space-y-3 relative overflow-hidden">
          <div className="flex justify-center mb-1">
            <GyfLogo size="md" variant="white" />
          </div>
          
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight">
            GYF Secure Portal Login
          </h1>
          
          <p className="text-xs text-blue-100/90 font-medium">
            Role-based authentication for Admins, Volunteers, and Normal Users
          </p>
        </div>

        {/* Card Body Section */}
        <div className="p-7 sm:p-9 space-y-5">
          
          {user && (
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200/80 text-teal-900 text-xs flex items-center justify-between gap-2">
              <span className="truncate">
                Logged in as <strong className="font-bold">{user.fullName}</strong> ({user.role === 'user' ? 'Normal User' : user.role})
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
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
                1-CLICK LOGIN TO DASHBOARD:
              </span>
              <button
                type="button"
                onClick={() => setShowRoleInfo(!showRoleInfo)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#272d8a] hover:text-[#1e2370] transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Role Permissions</span>
                {showRoleInfo ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            
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

              {/* Normal User (Website User) Card */}
              <button
                type="button"
                id="login-quick-normal-user-btn"
                onClick={() => handleQuickDemo('user')}
                className="p-3 rounded-2xl bg-slate-50/60 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 text-xs font-bold flex flex-col items-center gap-1.5 transition-all text-center group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <User className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="leading-tight">
                  <div className="font-extrabold text-slate-800 text-[13px]">Normal User</div>
                  <div className="text-[11px] text-slate-400 font-medium">Website User</div>
                </div>
              </button>
            </div>
          </div>

          {/* Interactive Role Permissions Explainer Guide */}
          {showRoleInfo && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  Role Capabilities & Boundaries
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveRoleInfoTab('user')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      activeRoleInfoTab === 'user' ? 'bg-[#272d8a] text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    Normal User
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveRoleInfoTab('volunteer')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      activeRoleInfoTab === 'volunteer' ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    Volunteer
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveRoleInfoTab('admin')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      activeRoleInfoTab === 'admin' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {activeRoleInfoTab === 'user' && (
                <div className="space-y-2.5">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-800 text-xs">
                      Normal User — Website User
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Normal User is basically a visitor who creates an account and uses the services of the foundation.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200 space-y-1">
                      <p className="font-bold text-emerald-900 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        Normal User Can:
                      </p>
                      <ul className="text-[10.5px] text-emerald-800 space-y-0.5 pl-4 list-disc">
                        <li>Register / Login</li>
                        <li>View Programs & Events</li>
                        <li>Read Blogs & Articles</li>
                        <li>Make Donations</li>
                        <li>Submit Grievances</li>
                        <li>Use Chatbot</li>
                        <li>Apply to Become a Member</li>
                        <li>Update their own profile</li>
                        <li>View own submissions / status</li>
                        <li>Receive notifications</li>
                      </ul>
                    </div>

                    <div className="bg-rose-50/80 p-2.5 rounded-xl border border-rose-200 space-y-1">
                      <p className="font-bold text-rose-900 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        Normal User Cannot:
                      </p>
                      <ul className="text-[10.5px] text-rose-800 space-y-0.5 pl-4 list-disc">
                        <li>Access Admin Dashboard</li>
                        <li>Access Volunteer Dashboard</li>
                        <li>Manage Programs/Events/Blogs</li>
                        <li>Manage other users</li>
                        <li>View other users&apos; information</li>
                        <li>Manage donations</li>
                        <li>Manage grievances by others</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeRoleInfoTab === 'volunteer' && (
                <div className="space-y-1.5 bg-white p-2.5 rounded-xl border border-slate-200 text-[11px]">
                  <p className="font-bold text-slate-800">Youth Volunteer / Field Worker</p>
                  <p className="text-slate-600 text-[10.5px]">
                    Field operatives tasked with handling community cases, logging service hours, managing assigned programs and events, and filing field activity reports.
                  </p>
                </div>
              )}

              {activeRoleInfoTab === 'admin' && (
                <div className="space-y-1.5 bg-white p-2.5 rounded-xl border border-slate-200 text-[11px]">
                  <p className="font-bold text-slate-800">Foundation Administrator</p>
                  <p className="text-slate-600 text-[10.5px]">
                    Full administrative governance over users, programs, event schedules, donation ledgers, grievance ombudsman desk, website content, and volunteer dispatch.
                  </p>
                </div>
              )}
            </div>
          )}

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

