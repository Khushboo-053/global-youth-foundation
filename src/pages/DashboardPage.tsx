import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
  Bell,
  Scale,
  CreditCard,
  QrCode,
  MapPin,
  Phone,
  Mail,
  Award,
  Users,
  Building,
  HeartHandshake,
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  Edit3,
  BookOpen,
  HelpCircle,
  Flame,
  Info
} from 'lucide-react';
import { useApp, DEMO_USERS } from '../context/AppContext';
import { DigitalIdCard } from '../components/DigitalIdCard';
import { GrievanceDetailModal } from '../components/GrievanceDetailModal';
import { LegalAidBookingModal } from '../components/LegalAidBookingModal';
import { ComplaintStatus, GrievanceRecord } from '../types';
import { EVENTS, ORG_INFO } from '../data/mockData';

type DashboardTab = 
  | 'overview' 
  | 'grievances' 
  | 'identity' 
  | 'events' 
  | 'legalaid' 
  | 'notifications' 
  | 'settings';

export const DashboardPage: React.FC = () => {
  const { 
    user, 
    logout, 
    loginAsDemo, 
    complaints, 
    memberships, 
    notifications,
    registeredEvents,
    toggleEventRegistration,
    legalAidAppointments,
    markNotificationRead,
    clearAllNotifications,
    updateProfile
  } = useApp();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab state
  const tabParam = (searchParams.get('tab') as DashboardTab) || 'overview';
  const [activeTab, setActiveTab] = useState<DashboardTab>(tabParam);

  // Filter & Search states for Grievances
  const [grievanceFilter, setGrievanceFilter] = useState<string>('all');
  const [grievanceSearch, setGrievanceSearch] = useState<string>('');

  // Modals state
  const [selectedComplaint, setSelectedComplaint] = useState<GrievanceRecord | null>(null);
  const [showLegalAidModal, setShowLegalAidModal] = useState<boolean>(false);

  // Settings form state
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    city: user?.city || '',
    bloodGroup: user?.bloodGroup || 'O+',
    emergencyContact: user?.emergencyContact || '',
    chapter: user?.chapter || 'Central Kashmir Hub (Srinagar & Bemina)',
    bio: user?.bio || ''
  });
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3000);
  };

  // If user is not logged in, render interactive Authentication & Demo Gateway
  if (!user) {
    return (
      <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-2xl w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Global Youth Foundation • Member & Citizen Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Sign In to Your GYF Dashboard
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Access your confidential grievance tracking, digital membership identity credentials, legal aid bookings, and youth campaign workspace.
            </p>
          </div>

          {/* Quick Demo Access Switcher */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Instant 1-Click Demo Profiles (Explore Now):</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => loginAsDemo('member')}
                className="p-3 rounded-xl bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 text-left transition-all group"
              >
                <div className="text-xs font-bold text-slate-900 group-hover:text-teal-800">
                  Tariq Manzoor
                </div>
                <div className="text-[11px] text-teal-700 font-medium">Active Member</div>
              </button>

              <button
                type="button"
                onClick={() => loginAsDemo('volunteer')}
                className="p-3 rounded-xl bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 text-left transition-all group"
              >
                <div className="text-xs font-bold text-slate-900 group-hover:text-teal-800">
                  Aisha Begum
                </div>
                <div className="text-[11px] text-teal-700 font-medium">Volunteer Lead</div>
              </button>

              <button
                type="button"
                onClick={() => loginAsDemo('officer')}
                className="p-3 rounded-xl bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 text-left transition-all group"
              >
                <div className="text-xs font-bold text-slate-900 group-hover:text-teal-800">
                  Adv. Farooq Mir
                </div>
                <div className="text-[11px] text-teal-700 font-medium">Ombudsman Officer</div>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all"
            >
              <span>Standard Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-all"
            >
              <span>Register New Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.currentStatus === 'Resolved').length;
  const activeComplaints = complaints.filter(c => c.currentStatus !== 'Resolved' && c.currentStatus !== 'Closed').length;
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  // Filtered complaints list
  const filteredComplaints = complaints.filter(c => {
    const matchesFilter = grievanceFilter === 'all' || c.currentStatus.toLowerCase() === grievanceFilter.toLowerCase();
    const matchesSearch = grievanceSearch === '' || 
      c.id.toLowerCase().includes(grievanceSearch.toLowerCase()) ||
      c.subject.toLowerCase().includes(grievanceSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(grievanceSearch.toLowerCase()) ||
      c.location.toLowerCase().includes(grievanceSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div id="gyf-dashboard-root" className="min-h-screen bg-slate-50 text-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Profile & Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden shadow-xl">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

          {/* User Info Left */}
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-teal-500/20 border-2 border-teal-400/40 text-teal-300 flex items-center justify-center text-2xl font-extrabold shrink-0 shadow-inner overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.fullName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  user.fullName.charAt(0)
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                <Check className="w-3 h-3 text-white stroke-[3]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-extrabold text-teal-400 uppercase tracking-widest bg-teal-950/80 px-2 py-0.5 rounded border border-teal-500/30">
                  {user.membershipStatus} Portal
                </span>
                <span className="font-mono text-[11px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {user.membershipId || 'GYF-MEM-2025-084'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {user.fullName}
              </h1>
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <span>{user.email}</span>
                <span>•</span>
                <span>{user.chapter || 'Central Kashmir Hub'}</span>
              </p>
            </div>
          </div>

          {/* Quick Actions Right */}
          <div className="flex flex-wrap items-center gap-2.5 relative z-10 w-full lg:w-auto">
            <Link
              to="/grievance"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Grievance</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowLegalAidModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
            >
              <Scale className="w-4 h-4 text-teal-400" />
              <span>Legal Aid Helpdesk</span>
            </button>

            {/* Demo Switcher Quick Menu */}
            <div className="flex items-center rounded-xl bg-slate-800 p-1 border border-slate-700 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => loginAsDemo('member')}
                title="Switch to Member view"
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  user.membershipStatus === 'Member' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Member
              </button>
              <button
                type="button"
                onClick={() => loginAsDemo('volunteer')}
                title="Switch to Volunteer view"
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  user.membershipStatus === 'Volunteer' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Volunteer
              </button>
              <button
                type="button"
                onClick={() => loginAsDemo('officer')}
                title="Switch to Staff/Ombudsman view"
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  user.membershipStatus === 'Admin' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Ombudsman
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
              title="Sign Out"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
          <button
            type="button"
            onClick={() => handleTabChange('overview')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('grievances')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'grievances'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Grievance Cell</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-800 font-extrabold">
              {complaints.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('identity')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'identity'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-sky-600" />
            <span>Digital ID & Membership</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('events')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'events'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>Workshops & Events</span>
            {registeredEvents.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-teal-100 text-teal-800 font-extrabold">
                {registeredEvents.length} Enrolled
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('legalaid')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'legalaid'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-indigo-600" />
            <span>Legal Aid Helpdesk</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('notifications')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-rose-500" />
            <span>Notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-extrabold">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('settings')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Profile Settings</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* 4 Metrics Quick Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Active Dockets
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900">
                  {activeComplaints}
                </div>
                <div className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                  <span>Under active redressal</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Resolved Cases
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900">
                  {resolvedComplaints}
                </div>
                <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <span>Mediation achieved</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Impact Hours
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900">
                  {user.volunteerHours || 64}h
                </div>
                <div className="text-xs text-teal-700 font-semibold">
                  Community service logged
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Enrolled Events
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900">
                  {registeredEvents.length}
                </div>
                <div className="text-xs text-sky-700 font-semibold">
                  Upcoming workshops
                </div>
              </div>
            </div>

            {/* Quick Actions & Live Secretariat Desk Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Baramulla & Srinagar Helpdesk Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-linear-to-br from-slate-900 to-slate-800 text-white border border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                    <Building className="w-4 h-4" />
                    <span>Secretariat Help Desk</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>OPEN TODAY</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">
                    Baramulla & Srinagar Grievance Cell
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Offering free citizen document drafting, legal counseling, student scholarship follow-ups, and ombudsman mediation.
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>Hours: 10:00 AM – 05:00 PM (Mon–Sat)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>Hotline: +91 91035 99292</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>Baramulla Main Town & Srinagar (Bemina)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLegalAidModal(true)}
                    className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-xs"
                  >
                    Book In-Person / Virtual Consultation
                  </button>
                </div>
              </div>

              {/* Digital Identity Mini Preview */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Digital Credential
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      Active Member Card
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Official GYF Identity Card
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Your digital volunteer ID card with QR-verification code for community service and event entry.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-teal-300">{user.fullName}</span>
                    <QrCode className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    ID: {user.membershipId || 'GYF-MEM-2025-084'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleTabChange('identity')}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>View & Print Full Card</span>
                </button>
              </div>

              {/* Quick Grievance Submission Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Civic Support
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      Confidential
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Submit Community Grievance
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Lodge student scholarships, civic amenities, human rights, or ecological concerns securely with unique docket tracking.
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>100% Anonymous filing supported</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>24–48hr initial review by ombudsman</span>
                  </div>
                </div>

                <Link
                  to="/grievance"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-teal-400" />
                  <span>Open Grievance Form</span>
                </Link>
              </div>

            </div>

            {/* Recent Grievances Docket Section */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Recent Community Grievance Dockets
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any docket to view real-time progression history or update official notes
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleTabChange('grievances')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900"
                  >
                    <span>View All Dockets ({complaints.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {complaints.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedComplaint(item)}
                    className="p-5 rounded-2xl bg-slate-50 hover:bg-teal-50/40 border border-slate-200/80 hover:border-teal-300 transition-all cursor-pointer space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-extrabold text-teal-900 px-2.5 py-1 rounded bg-teal-100/70 border border-teal-200">
                          {item.id}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 hover:text-teal-900">
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
                        <span className="text-xs font-bold text-teal-700 ml-2 hidden sm:inline">
                          View Details →
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span>Category: <strong className="text-slate-700 font-medium">{item.category}</strong></span>
                      <span>•</span>
                      <span>Location: <strong className="text-slate-700 font-medium">{item.location}</strong></span>
                      <span>•</span>
                      <span>Updated: <strong className="text-slate-700 font-medium">{item.submittedAt}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: GRIEVANCES REDRESSAL CELL */}
        {activeTab === 'grievances' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header & Controls Bar */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Grievance Redressal Registry
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Centralized docket database with full resolution timeline audit logs
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/grievance"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Lodge New Grievance</span>
                  </Link>

                  <Link
                    to="/track-complaint"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Public Tracker</span>
                  </Link>
                </div>
              </div>

              {/* Search & Status Filters */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by Docket ID (e.g. GYF-2026-847291), category, or keyword..."
                    value={grievanceSearch}
                    onChange={(e) => setGrievanceSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {['all', 'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setGrievanceFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        grievanceFilter === st
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st === 'all' ? 'All Dockets' : st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grievances List */}
            {filteredComplaints.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No matching grievances found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search query or status filter to locate the desired case record.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComplaints.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-teal-300 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-teal-900 px-3 py-1 rounded-lg bg-teal-50 border border-teal-200">
                          {item.id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.currentStatus === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                          item.currentStatus === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                          'bg-sky-100 text-sky-800'
                        }`}>
                          {item.currentStatus}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium">
                          Priority: {item.priority}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedComplaint(item)}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          View Docket & History
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {item.subject}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500">
                      <div className="flex flex-wrap items-center gap-4 text-[11px]">
                        <span>Category: <strong className="text-slate-800 font-medium">{item.category}</strong></span>
                        <span>•</span>
                        <span>Location: <strong className="text-slate-800 font-medium">{item.location}</strong></span>
                        <span>•</span>
                        <span>Date: <strong className="text-slate-800 font-medium">{item.submittedAt}</strong></span>
                      </div>

                      <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                        {item.assignedDepartment || 'Ombudsman Desk'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: DIGITAL ID CARD & MEMBERSHIP */}
        {activeTab === 'identity' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              
              {/* Left Column: Digital Card */}
              <div className="space-y-4">
                <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Official Membership Credential
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Verified identity card for GYF volunteer delegations, symposiums, and community legal aid camps
                    </p>
                  </div>

                  <DigitalIdCard user={user} />
                </div>
              </div>

              {/* Right Column: Member Details & Volunteer Milestones */}
              <div className="space-y-6">
                
                {/* Profile Overview Card */}
                <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Delegate Details on Record
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-400">Full Legal Name</span>
                      <span className="font-bold text-slate-900">{user.fullName}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-400">Designation & Role</span>
                      <span className="font-bold text-teal-700">{user.role || user.membershipStatus}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-400">Official Membership ID</span>
                      <span className="font-mono font-bold text-slate-900">{user.membershipId || 'GYF-MEM-2025-084'}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-400">Regional Chapter</span>
                      <span className="font-medium text-slate-800">{user.chapter || 'Central Kashmir Hub'}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-400">Registered Phone</span>
                      <span className="font-medium text-slate-800">{user.phone}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-400">Blood Group</span>
                      <span className="font-bold text-amber-700">{user.bloodGroup || 'O+'}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-400">Member Since</span>
                      <span className="font-medium text-slate-800">{user.joinedDate || 'Jan 2025'}</span>
                    </div>
                  </div>
                </div>

                {/* Volunteer Badges */}
                <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Earned Badges & Social Contributions
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Peace Facilitator</div>
                        <div className="text-[10px] text-teal-800">Youth Dialogue 2025</div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Legal Aid Helper</div>
                        <div className="text-[10px] text-emerald-800">Baramulla Helpdesk</div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
                        <Flame className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Green Wings Steward</div>
                        <div className="text-[10px] text-sky-800">Dal Cleanup Volunteer</div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Relief Responder</div>
                        <div className="text-[10px] text-amber-800">Winter Warmth Drive</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Submitted Membership Records */}
            {memberships.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">
                  Registered Membership & Onboarding Records
                </h3>

                <div className="space-y-3">
                  {memberships.map((app) => (
                    <div
                      key={app.applicationId}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-teal-800 bg-teal-100/60 px-2.5 py-0.5 rounded border border-teal-200">
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
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          {app.status}
                        </span>
                        <span className="text-xs text-slate-400">{app.appliedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 4: WORKSHOPS & EVENTS */}
        {activeTab === 'events' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
              <h2 className="text-xl font-bold text-slate-900">
                Youth Workshops & Community Campaigns
              </h2>
              <p className="text-xs text-slate-500">
                Register for upcoming leadership seminars, human rights clinics, and peacebuilding forums
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {EVENTS.map((evt) => {
                const isEnrolled = registeredEvents.includes(evt.id);

                return (
                  <div
                    key={evt.id}
                    className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-44 relative overflow-hidden bg-slate-800">
                        <img
                          src={evt.image}
                          alt={evt.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                            {evt.category}
                          </span>
                        </div>
                        {isEnrolled && (
                          <div className="absolute top-3 right-3">
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Enrolled</span>
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-5 space-y-3">
                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {evt.title}
                        </h3>

                        <div className="space-y-1.5 text-xs text-slate-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>{evt.date} {evt.time && `• ${evt.time}`}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span className="truncate">{evt.location}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2">
                          {evt.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <button
                        type="button"
                        onClick={() => toggleEventRegistration(evt.id)}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          isEnrolled
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                        }`}
                      >
                        {isEnrolled ? (
                          <>
                            <span>Cancel Registration</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-teal-400" />
                            <span>Register / RSVP Attendance</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: LEGAL AID & HELPDESK */}
        {activeTab === 'legalaid' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Info Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                  <Scale className="w-4 h-4" />
                  <span>Free Public Legal Helpdesk & Citizen Aid Cell</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white">
                  Baramulla & Srinagar Grievance Cell
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Established to ensure that no citizen or young person in the region remains helpless due to lack of resources, guidance, or administrative access. We provide pro-bono paralegal counseling, government scheme liaison, and document drafting.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowLegalAidModal(true)}
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
              >
                Book Free Consultation
              </button>
            </div>

            {/* 3 Main Services Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Document & RTI Drafting
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Assistance with drafting Right to Information (RTI) petitions, representation letters to district commissioners, and municipal complaints.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Student Scholarship Appeals
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fast-track ombudsman representations for delayed welfare stipends, degree verification, and educational scholarships.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Paralegal Mediation
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Peaceful dispute resolution, intercommunity consensus building, and youth rights counseling by licensed advocates.
                </p>
              </div>
            </div>

            {/* Scheduled Appointments Table */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Your Scheduled Legal Consultations
                  </h3>
                  <p className="text-xs text-slate-500">
                    Confirmed appointment slots with duty legal counselors
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowLegalAidModal(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Book Another Slot</span>
                </button>
              </div>

              {legalAidAppointments.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-500 text-xs">
                  No appointments booked yet. Click above to reserve a free session.
                </div>
              ) : (
                <div className="space-y-3">
                  {legalAidAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-teal-800 bg-teal-100/60 px-2 py-0.5 rounded border border-teal-200">
                            {apt.id}
                          </span>
                          <span className="text-sm font-bold text-slate-900">
                            {apt.serviceType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          {apt.summary}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                          <span>Venue: <strong className="text-slate-700 font-medium">{apt.location}</strong></span>
                          <span>•</span>
                          <span>Time: <strong className="text-slate-700 font-medium">{apt.preferredDate} at {apt.preferredTime}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 6: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  System Alerts & Activity Feed
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time updates regarding grievance progression, event registrations, and announcements
                </p>
              </div>

              <button
                type="button"
                onClick={clearAllNotifications}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Mark All as Read
              </button>
            </div>

            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    n.isRead 
                      ? 'bg-white border-slate-200/80' 
                      : 'bg-teal-50/40 border-teal-300 shadow-xs'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    n.type === 'complaint' ? 'bg-amber-100 text-amber-800' :
                    n.type === 'event' ? 'bg-sky-100 text-sky-800' :
                    n.type === 'membership' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {n.type === 'complaint' ? <ShieldCheck className="w-5 h-5" /> :
                     n.type === 'event' ? <Calendar className="w-5 h-5" /> :
                     n.type === 'membership' ? <Award className="w-5 h-5" /> :
                     <Bell className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-sm font-bold ${n.isRead ? 'text-slate-900' : 'text-teal-950 font-extrabold'}`}>
                        {n.title}
                      </h4>
                      <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                        {n.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: PROFILE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fadeIn max-w-3xl">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Profile & Volunteer Information
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your contact details, regional chapter, and emergency contact numbers
                </p>
              </div>

              {profileSavedToast && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Registered Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City / District
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Blood Group
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                    >
                      <option value="O+">O+</option>
                      <option value="A+">A+</option>
                      <option value="B+">B+</option>
                      <option value="AB+">AB+</option>
                      <option value="O-">O-</option>
                      <option value="A-">A-</option>
                      <option value="B-">B-</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Emergency Contact Number
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      GYF Chapter / Hub
                    </label>
                    <select
                      value={formData.chapter}
                      onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                    >
                      <option value="Central Kashmir Hub (Srinagar & Bemina)">Central Kashmir Hub (Srinagar & Bemina)</option>
                      <option value="North Kashmir Hub (Baramulla)">North Kashmir Hub (Baramulla)</option>
                      <option value="South Kashmir Hub (Anantnag)">South Kashmir Hub (Anantnag)</option>
                      <option value="Jammu Regional Chapter">Jammu Regional Chapter</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bio & Civic Focus Areas
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* Grievance Detail Modal */}
      {selectedComplaint && (
        <GrievanceDetailModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}

      {/* Legal Aid Booking Modal */}
      {showLegalAidModal && (
        <LegalAidBookingModal
          onClose={() => setShowLegalAidModal(false)}
        />
      )}
    </div>
  );
};
