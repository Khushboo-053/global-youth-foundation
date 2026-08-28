import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  ShieldCheck, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  LogOut, 
  Plus, 
  ArrowRight, 
  Search, 
  Sparkles,
  AlertCircle,
  Bell
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ComplaintTimeline } from '../components/ComplaintTimeline';

export const DashboardPage: React.FC = () => {
  const { user, logout, complaints, membershipApplications, notifications } = useApp();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Authentication Required</h2>
          <p className="text-xs text-slate-600">
            Please sign in to access your Global Youth Foundation member dashboard.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xs hover:bg-teal-700"
            >
              <span>Go to Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter complaints related to this user if email matches, or show recent
  const userComplaints = complaints;

  return (
    <div id="dashboard-page" className="min-h-screen bg-slate-50 text-slate-800 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Welcome Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-teal-500/15 blur-2xl" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center text-xl font-extrabold shrink-0">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  Member Portal
                </span>
                <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-400/30">
                  {user.role}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Welcome, {user.name}
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                {user.email} {user.phone && `• ${user.phone}`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <Link
              to="/grievance"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Grievance</span>
            </Link>
            
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 text-xs font-bold border border-slate-700 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* 3 Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Grievance Dockets
            </span>
            <div className="text-3xl font-extrabold text-slate-900">
              {userComplaints.filter(c => c.currentStatus !== 'Closed').length}
            </div>
            <div className="text-[11px] text-teal-700 font-medium">Under active committee follow-up</div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Membership Applications
            </span>
            <div className="text-3xl font-extrabold text-slate-900">
              {membershipApplications.length}
            </div>
            <div className="text-[11px] text-teal-700 font-medium">Registered records in system</div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              System Notifications
            </span>
            <div className="text-3xl font-extrabold text-slate-900">
              {notifications.length}
            </div>
            <div className="text-[11px] text-teal-700 font-medium">Live activity events</div>
          </div>
        </div>

        {/* Grievances Track List */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Registered Grievance Dockets
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time tracking of community grievances lodged through the portal
              </p>
            </div>
            <Link
              to="/track-complaint"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Open Public Tracker</span>
            </Link>
          </div>

          {userComplaints.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl space-y-2">
              <p className="text-sm">No grievances recorded yet.</p>
              <Link to="/grievance" className="text-xs font-bold text-teal-700">Submit your first grievance →</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userComplaints.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-300 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-extrabold text-teal-900 px-2.5 py-1 rounded bg-teal-100/60 border border-teal-200">
                        {item.id}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">
                        {item.subject}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        item.currentStatus === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                        item.currentStatus === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                        'bg-sky-100 text-sky-800'
                      }`}>
                        {item.currentStatus}
                      </span>
                      <Link
                        to={`/track-complaint?id=${item.id}`}
                        className="text-xs font-semibold text-teal-700 hover:text-teal-900 ml-2"
                      >
                        View Timeline →
                      </Link>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span>Category: <strong className="text-slate-700 font-medium">{item.category}</strong></span>
                    <span>•</span>
                    <span>Location: <strong className="text-slate-700 font-medium">{item.location}</strong></span>
                    <span>•</span>
                    <span>Date: <strong className="text-slate-700 font-medium">{item.submittedAt}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Membership Applications Section */}
        {membershipApplications.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Membership Applications
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Your submitted volunteer and membership onboarding records
              </p>
            </div>

            <div className="space-y-3">
              {membershipApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {app.applicationId}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {app.fullName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Interest: {app.areaOfInterest} • {app.city}, {app.state}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                      {app.status}
                    </span>
                    <span className="text-xs text-slate-400">{app.submittedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
