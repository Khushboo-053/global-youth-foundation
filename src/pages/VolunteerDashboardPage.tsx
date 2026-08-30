import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCheck, 
  ShieldCheck, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Edit3, 
  RefreshCw, 
  LogOut, 
  MapPin, 
  Clock, 
  ListTodo, 
  Bell, 
  User, 
  CheckSquare, 
  AlertTriangle, 
  Send, 
  Key, 
  ChevronRight, 
  Filter, 
  Search, 
  Info, 
  Phone, 
  Mail, 
  Sparkles, 
  Tag, 
  Plus, 
  X, 
  Check, 
  Compass, 
  ArrowUpRight, 
  Activity, 
  Sliders, 
  Briefcase 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  VolunteerProgramAssignment, 
  VolunteerEventAssignment, 
  VolunteerTaskItem, 
  VolunteerNotificationItem, 
  GrievanceRecord 
} from '../types';

type VolunteerTab = 'dashboard' | 'programs' | 'events' | 'grievances' | 'tasks' | 'notifications' | 'profile';

export const VolunteerDashboardPage: React.FC = () => {
  const { 
    user, 
    logout, 
    complaints, 
    volunteerPrograms, 
    volunteerEvents, 
    volunteerTasks, 
    volunteerNotifications,
    updateVolunteerProgramProgress,
    updateVolunteerEventStatus,
    updateVolunteerGrievance,
    updateVolunteerTask,
    markVolunteerNotificationRead,
    markAllVolunteerNotificationsRead,
    updateVolunteerProfile,
    logVolunteerSelfHours,
    refreshVolunteerData,
    refreshAllData 
  } = useApp();

  const navigate = useNavigate();

  // Navigation State
  const [activeTab, setActiveTab] = useState<VolunteerTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter & Search States
  const [programFilter, setProgramFilter] = useState<'All' | 'In Progress' | 'Completed'>('All');
  const [eventFilter, setEventFilter] = useState<'All' | 'Assigned' | 'In Progress' | 'Completed'>('All');
  const [grievanceFilter, setGrievanceFilter] = useState<'All' | 'Assigned' | 'In Progress' | 'Resolved'>('All');
  const [taskFilter, setTaskFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All');
  const [notifFilter, setNotifFilter] = useState<'All' | 'Unread'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Modal / Form States
  // 1. Program progress updater modal
  const [selectedProgram, setSelectedProgram] = useState<VolunteerProgramAssignment | null>(null);
  const [progProgressInput, setProgProgressInput] = useState<number>(0);
  const [progNoteInput, setProgNoteInput] = useState<string>('');

  // 2. Event status / note modal
  const [selectedEvent, setSelectedEvent] = useState<VolunteerEventAssignment | null>(null);
  const [evtStatusInput, setEvtStatusInput] = useState<'Assigned' | 'In Progress' | 'Completed'>('In Progress');
  const [evtNoteInput, setEvtNoteInput] = useState<string>('');

  // 3. Grievance update modal
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceRecord | null>(null);
  const [grievanceStatusInput, setGrievanceStatusInput] = useState<'Assigned' | 'In Progress' | 'Resolved'>('In Progress');
  const [grievanceRemarkInput, setGrievanceRemarkInput] = useState<string>('');

  // 4. Task update modal
  const [selectedTask, setSelectedTask] = useState<VolunteerTaskItem | null>(null);
  const [taskStatusInput, setTaskStatusInput] = useState<'Pending' | 'In Progress' | 'Completed'>('In Progress');
  const [taskNoteInput, setTaskNoteInput] = useState<string>('');

  // 5. Log hours modal
  const [showLogHoursModal, setShowLogHoursModal] = useState(false);
  const [hoursToAdd, setHoursToAdd] = useState(3);
  const [hoursDescription, setHoursDescription] = useState('Community outreach and field documentation');

  // 6. Profile Edit State
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    city: user?.city || 'Baramulla',
    bloodGroup: user?.bloodGroup || 'O+',
    emergencyContact: user?.emergencyContact || '+91 94190 12345',
    bio: user?.bio || 'Dedicated grassroots youth advocate for environment and social justice in North Kashmir.',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  });

  // 7. Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSyncAll = async () => {
    setIsRefreshing(true);
    await Promise.all([refreshVolunteerData(), refreshAllData()]);
    showToast('Synchronized volunteer dashboard data');
    setIsRefreshing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filtered collections strictly scoped to logged-in user
  const myAssignedGrievances = useMemo(() => {
    if (!user) return [];
    return complaints.filter(c => c.assignedVolunteerId === user.id);
  }, [complaints, user?.id]);

  const filteredPrograms = useMemo(() => {
    return volunteerPrograms.filter(p => {
      const matchFilter = programFilter === 'All' || p.status === programFilter;
      const matchSearch = !searchQuery || 
        p.programTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.assignedRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [volunteerPrograms, programFilter, searchQuery]);

  const filteredEvents = useMemo(() => {
    return volunteerEvents.filter(e => {
      const matchFilter = eventFilter === 'All' || e.status === eventFilter;
      const matchSearch = !searchQuery ||
        e.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.assignedRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [volunteerEvents, eventFilter, searchQuery]);

  const filteredGrievances = useMemo(() => {
    return myAssignedGrievances.filter(g => {
      const matchFilter = grievanceFilter === 'All' || g.currentStatus === grievanceFilter;
      const matchSearch = !searchQuery ||
        g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [myAssignedGrievances, grievanceFilter, searchQuery]);

  const filteredTasks = useMemo(() => {
    return volunteerTasks.filter(t => {
      const matchFilter = taskFilter === 'All' || t.status === taskFilter;
      const matchSearch = !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.relatedTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [volunteerTasks, taskFilter, searchQuery]);

  const filteredNotifs = useMemo(() => {
    return volunteerNotifications.filter(n => {
      if (notifFilter === 'Unread') return !n.isRead;
      return true;
    });
  }, [volunteerNotifications, notifFilter]);

  const unreadNotifsCount = useMemo(() => {
    return volunteerNotifications.filter(n => !n.isRead).length;
  }, [volunteerNotifications]);

  // Program update handler
  const handleSaveProgramProgress = async () => {
    if (!selectedProgram) return;
    try {
      await updateVolunteerProgramProgress(selectedProgram.id, progProgressInput, progNoteInput);
      showToast(`Updated progress for "${selectedProgram.programTitle}"`);
      setSelectedProgram(null);
      setProgNoteInput('');
    } catch (err: any) {
      showToast(err.message || 'Failed to update program');
    }
  };

  // Event update handler
  const handleSaveEventStatus = async () => {
    if (!selectedEvent) return;
    try {
      await updateVolunteerEventStatus(
        selectedEvent.id, 
        evtStatusInput, 
        evtStatusInput === 'Completed', 
        evtNoteInput
      );
      showToast(`Updated event status for "${selectedEvent.eventTitle}"`);
      setSelectedEvent(null);
      setEvtNoteInput('');
    } catch (err: any) {
      showToast(err.message || 'Failed to update event');
    }
  };

  // Grievance update handler
  const handleSaveGrievanceStatus = async () => {
    if (!selectedGrievance) return;
    try {
      await updateVolunteerGrievance(selectedGrievance.id, grievanceStatusInput, grievanceRemarkInput);
      showToast(`Grievance ${selectedGrievance.id} updated to ${grievanceStatusInput}`);
      setSelectedGrievance(null);
      setGrievanceRemarkInput('');
    } catch (err: any) {
      showToast(err.message || 'Failed to update grievance');
    }
  };

  // Task update handler
  const handleSaveTaskStatus = async () => {
    if (!selectedTask) return;
    try {
      await updateVolunteerTask(selectedTask.id, taskStatusInput, taskNoteInput);
      showToast(`Updated task "${selectedTask.title}"`);
      setSelectedTask(null);
      setTaskNoteInput('');
    } catch (err: any) {
      showToast(err.message || 'Failed to update task');
    }
  };

  // Profile Save Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateVolunteerProfile(profileForm);
      showToast('Profile information saved successfully');
    } catch (err: any) {
      showToast(err.message || 'Failed to save profile');
    }
  };

  // Password Change Handler
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!passwordForm.currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSuccess(true);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast('Password changed successfully');
  };

  // Log Hours Handler
  const handleLogHours = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hoursToAdd <= 0) return;
    try {
      await logVolunteerSelfHours(hoursToAdd, hoursDescription);
      showToast(`Logged ${hoursToAdd} volunteer service hours`);
      setShowLogHoursModal(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to log hours');
    }
  };

  return (
    <div id="volunteer-dashboard-container" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col lg:flex-row">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div id="volunteer-toast" className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl bg-emerald-950/90 text-emerald-200 text-xs font-semibold shadow-2xl flex items-center gap-3 border border-emerald-700/50 backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SIDEBAR NAVIGATION */}
      {/* ========================================================================= */}
      <aside 
        id="volunteer-sidebar" 
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-teal-400" />
                </div>
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight">GYF Volunteer</h1>
                <p className="text-[11px] text-slate-400 font-medium">Field Operations Portal</p>
              </div>
            </div>
            <button 
              id="close-sidebar-mobile-btn"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Volunteer Mini Profile in Sidebar */}
          <div className="p-5 mx-4 my-4 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center gap-3">
            <img 
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
              alt={user?.fullName || 'Volunteer'} 
              className="w-11 h-11 rounded-full object-cover ring-2 ring-teal-500/40"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-white truncate">{user?.fullName || 'Aisha Begum'}</p>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Active"></span>
              </div>
              <p className="text-[11px] text-teal-400 truncate">{user?.chapter || 'North Kashmir Hub'}</p>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-semibold bg-teal-950 text-teal-300 border border-teal-800/40">
                Volunteer ID: {user?.id?.substring(0, 14) || 'usr-gyf-vol-01'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-1.5 py-2">
            <button
              id="nav-tab-dashboard"
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Compass className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
            </button>

            <button
              id="nav-tab-programs"
              onClick={() => { setActiveTab('programs'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'programs'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4" />
                <span>My Programs</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'programs' ? 'bg-teal-700 text-teal-100' : 'bg-slate-800 text-slate-400'
              }`}>
                {volunteerPrograms.length}
              </span>
            </button>

            <button
              id="nav-tab-events"
              onClick={() => { setActiveTab('events'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'events'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4" />
                <span>My Events</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'events' ? 'bg-teal-700 text-teal-100' : 'bg-slate-800 text-slate-400'
              }`}>
                {volunteerEvents.length}
              </span>
            </button>

            <button
              id="nav-tab-grievances"
              onClick={() => { setActiveTab('grievances'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'grievances'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                <span>My Grievances</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'grievances' ? 'bg-teal-700 text-teal-100' : 'bg-slate-800 text-slate-400'
              }`}>
                {myAssignedGrievances.length}
              </span>
            </button>

            <button
              id="nav-tab-tasks"
              onClick={() => { setActiveTab('tasks'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'tasks'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ListTodo className="w-4 h-4" />
                <span>My Tasks</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'tasks' ? 'bg-teal-700 text-teal-100' : 'bg-slate-800 text-slate-400'
              }`}>
                {volunteerTasks.length}
              </span>
            </button>

            <button
              id="nav-tab-notifications"
              onClick={() => { setActiveTab('notifications'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'notifications'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </div>
              {unreadNotifsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                  {unreadNotifsCount} new
                </span>
              )}
            </button>

            <button
              id="nav-tab-profile"
              onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </div>
            </button>
          </nav>

          {/* Sidebar Footer / Logout */}
          <div className="p-4 border-t border-slate-800/80 space-y-2">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center justify-between text-slate-300 font-semibold">
                <span>Service Hours</span>
                <span className="text-teal-400 font-bold">{user?.volunteerHours || 42} hrs</span>
              </div>
              <button 
                id="sidebar-log-hours-btn"
                onClick={() => setShowLogHoursModal(true)}
                className="w-full mt-2 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-lg font-semibold flex items-center justify-center gap-1.5 text-[11px] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Log Hours
              </button>
            </div>

            <button
              id="volunteer-logout-btn"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)} 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header id="volunteer-top-header" className="h-16 px-6 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              id="open-sidebar-mobile-btn"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800"
            >
              <Sliders className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base font-bold text-white capitalize flex items-center gap-2">
                {activeTab === 'dashboard' && 'Volunteer Overview'}
                {activeTab === 'programs' && 'Assigned Programs'}
                {activeTab === 'events' && 'Assigned Events'}
                {activeTab === 'grievances' && 'My Assigned Grievances'}
                {activeTab === 'tasks' && 'Assigned Tasks & Action Items'}
                {activeTab === 'notifications' && 'Volunteer Notifications'}
                {activeTab === 'profile' && 'Volunteer Profile & Settings'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="sync-volunteer-data-btn"
              onClick={handleSyncAll}
              disabled={isRefreshing}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Refresh and sync data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-teal-400' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            {/* Quick Notification Bell */}
            <button
              id="header-notif-bell"
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-slate-950"></span>
              )}
            </button>

            {/* Chapter Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>{user?.chapter || 'North Kashmir Hub'}</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 max-w-7xl w-full mx-auto space-y-6">

          {/* ------------------------------------------------------------------- */}
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === 'dashboard' && (
            <div id="tab-content-dashboard" className="space-y-6">
              {/* Welcome Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 border border-teal-800/40 p-6 md:p-8">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/60 border border-teal-700/50 text-[11px] font-semibold text-teal-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      Active Field Volunteer
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white">
                      Welcome back, {user?.fullName || 'Aisha Begum'}!
                    </h3>
                    <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
                      You are assigned to the <strong className="text-white">{user?.chapter || 'North Kashmir Hub (Baramulla)'}</strong>. Below is your real-time summary of assigned community programs, events, grievance dockets, and tasks.
                    </p>
                  </div>
                  <div className="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0">
                    <button
                      id="dash-quick-log-hours-btn"
                      onClick={() => setShowLogHoursModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all"
                    >
                      <Plus className="w-4 h-4" /> Log Service Hours
                    </button>
                  </div>
                </div>
              </div>

              {/* Metric KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div 
                  onClick={() => setActiveTab('programs')} 
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">Programs</span>
                    <Layers className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="mt-3 text-2xl font-black text-white">{volunteerPrograms.length}</p>
                  <p className="text-[10px] text-teal-400 font-medium">Assigned by Admin</p>
                </div>

                <div 
                  onClick={() => setActiveTab('events')} 
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">Events</span>
                    <Calendar className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="mt-3 text-2xl font-black text-white">{volunteerEvents.length}</p>
                  <p className="text-[10px] text-emerald-400 font-medium">Field Operations</p>
                </div>

                <div 
                  onClick={() => setActiveTab('grievances')} 
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">Grievances</span>
                    <FileText className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="mt-3 text-2xl font-black text-white">{myAssignedGrievances.length}</p>
                  <p className="text-[10px] text-rose-400 font-medium">Assigned Cases</p>
                </div>

                <div 
                  onClick={() => setActiveTab('tasks')} 
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">My Tasks</span>
                    <ListTodo className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="mt-3 text-2xl font-black text-white">{volunteerTasks.length}</p>
                  <p className="text-[10px] text-amber-400 font-medium">Action Items</p>
                </div>

                <div 
                  onClick={() => setActiveTab('profile')} 
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">Hours Logged</span>
                    <Clock className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="mt-3 text-2xl font-black text-white">{user?.volunteerHours || 42}</p>
                  <p className="text-[10px] text-cyan-400 font-medium">Service Hours</p>
                </div>

                <div 
                  onClick={() => setActiveTab('notifications')} 
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">Alerts</span>
                    <Bell className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="mt-3 text-2xl font-black text-white">{unreadNotifsCount}</p>
                  <p className="text-[10px] text-indigo-400 font-medium">Unread Notices</p>
                </div>
              </div>

              {/* Split Sections: Priority Tasks & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left: Priority Action Items */}
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm font-bold text-white">Priority Action Items</h4>
                    </div>
                    <button 
                      onClick={() => setActiveTab('tasks')} 
                      className="text-xs font-semibold text-teal-400 hover:underline"
                    >
                      View All ({volunteerTasks.length})
                    </button>
                  </div>

                  <div className="space-y-3">
                    {volunteerTasks.slice(0, 3).map((task) => (
                      <div 
                        key={task.id} 
                        className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              task.priority === 'Urgent' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                              task.priority === 'High' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                              'bg-slate-800 text-slate-300'
                            }`}>
                              {task.priority}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              Due: {task.dueDate}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-white truncate">{task.title}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{task.description}</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setTaskStatusInput(task.status);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-[11px] font-semibold shrink-0"
                        >
                          Update
                        </button>
                      </div>
                    ))}

                    {volunteerTasks.length === 0 && (
                      <p className="text-xs text-slate-500 py-4 text-center">No pending tasks at this moment.</p>
                    )}
                  </div>
                </div>

                {/* Right: Assigned Programs Quick View */}
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-teal-400" />
                      <h4 className="text-sm font-bold text-white">Assigned Programs Overview</h4>
                    </div>
                    <button 
                      onClick={() => setActiveTab('programs')} 
                      className="text-xs font-semibold text-teal-400 hover:underline"
                    >
                      View All ({volunteerPrograms.length})
                    </button>
                  </div>

                  <div className="space-y-3">
                    {volunteerPrograms.map((prog) => (
                      <div key={prog.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-white">{prog.programTitle}</p>
                          <span className="text-[11px] font-bold text-teal-400">{prog.progress}%</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Role: <strong className="text-slate-200">{prog.assignedRole}</strong>
                        </p>
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${prog.progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-500">{prog.location}</span>
                          <button
                            onClick={() => {
                              setSelectedProgram(prog);
                              setProgProgressInput(prog.progress);
                            }}
                            className="text-[11px] text-teal-400 font-semibold hover:underline"
                          >
                            Update Progress & Notes
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 2: MY PROGRAMS */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === 'programs' && (
            <div id="tab-content-programs" className="space-y-6">
              
              {/* Header & Filter Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">Assigned Programs</h3>
                  <p className="text-xs text-slate-400">
                    Showing programs assigned to you by Admin. Core program details are managed centrally.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                    {(['All', 'In Progress', 'Completed'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setProgramFilter(filter)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          programFilter === filter ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Programs List */}
              <div className="space-y-6">
                {filteredPrograms.map((prog) => (
                  <div 
                    key={prog.id} 
                    id={`program-card-${prog.id}`}
                    className="p-6 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-xl space-y-5"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-teal-950 text-teal-300 border border-teal-800/60">
                            {prog.category}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                            prog.status === 'Completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {prog.status}
                          </span>
                          <span className="text-xs text-slate-400">
                            Assigned on: {prog.assignedAt}
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-white">{prog.programTitle}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                          {prog.fullDescription || prog.shortDescription}
                        </p>
                      </div>

                      <button
                        id={`btn-update-prog-${prog.id}`}
                        onClick={() => {
                          setSelectedProgram(prog);
                          setProgProgressInput(prog.progress);
                        }}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-teal-600/20 transition-colors shrink-0"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Update Progress & Notes
                      </button>
                    </div>

                    {/* Assigned Responsibility & Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Your Assigned Role</span>
                        <p className="text-xs font-bold text-teal-300 mt-0.5">{prog.assignedRole}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Location & Territory</span>
                        <p className="text-xs font-semibold text-slate-200 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {prog.location}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Date & Schedule</span>
                        <p className="text-xs font-semibold text-slate-200 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" /> {prog.date}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar with Slider Display */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300">Volunteer Milestone Progress</span>
                        <span className="font-bold text-teal-400">{prog.progress}% Completed</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${prog.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Activity Notes Section */}
                    <div className="space-y-3 pt-2 border-t border-slate-800/80">
                      <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-teal-400" />
                        Activity Logs & Field Notes ({prog.activityNotes?.length || 0})
                      </h5>

                      <div className="space-y-2">
                        {prog.activityNotes?.map((n) => (
                          <div key={n.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                            <p className="text-slate-200">{n.note}</p>
                            <div className="flex items-center gap-3 text-[10px] text-slate-500">
                              <span>By {n.addedBy}</span>
                              <span>•</span>
                              <span>{n.timestamp}</span>
                            </div>
                          </div>
                        ))}

                        {(!prog.activityNotes || prog.activityNotes.length === 0) && (
                          <p className="text-xs text-slate-500 italic">No field notes logged yet. Click "Update Progress & Notes" to record an update.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredPrograms.length === 0 && (
                  <div className="p-12 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 space-y-2">
                    <Layers className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="text-sm font-semibold">No assigned programs match your filter.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 3: MY EVENTS */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === 'events' && (
            <div id="tab-content-events" className="space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">Assigned Events & Community Drives</h3>
                  <p className="text-xs text-slate-400">
                    Events assigned to you by Admin. Update your status and log on-ground progress notes.
                  </p>
                </div>

                <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                  {(['All', 'Assigned', 'In Progress', 'Completed'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setEventFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        eventFilter === filter ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents.map((evt) => (
                  <div 
                    key={evt.id} 
                    id={`event-card-${evt.id}`}
                    className="p-6 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-xl flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-900 text-teal-300 border border-teal-800/40">
                          {evt.category}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                          evt.status === 'Completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                          evt.status === 'In Progress' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}>
                          {evt.status}
                        </span>
                      </div>

                      <h4 className="text-base font-black text-white">{evt.eventTitle}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{evt.description}</p>

                      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500">Your Assigned Role</span>
                          <p className="font-bold text-teal-300">{evt.assignedRole}</p>
                        </div>
                        <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {evt.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {evt.time}
                          </span>
                        </div>
                        <p className="text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" /> {evt.location}
                        </p>
                      </div>

                      {/* Event Notes History */}
                      {evt.notes && evt.notes.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Recent Ground Report:</span>
                          <div className="p-2.5 rounded-lg bg-slate-900 text-xs text-slate-300 border border-slate-800">
                            <p>{evt.notes[0].note}</p>
                            <span className="text-[10px] text-slate-500 mt-1 block">{evt.notes[0].timestamp}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                      {evt.status !== 'Completed' ? (
                        <button
                          id={`btn-complete-evt-${evt.id}`}
                          onClick={() => updateVolunteerEventStatus(evt.id, 'Completed', true, 'Marked completed on ground')}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Work Completed
                        </span>
                      )}

                      <button
                        id={`btn-update-evt-${evt.id}`}
                        onClick={() => {
                          setSelectedEvent(evt);
                          setEvtStatusInput(evt.status);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Update & Add Note
                      </button>
                    </div>
                  </div>
                ))}

                {filteredEvents.length === 0 && (
                  <div className="col-span-2 p-12 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 space-y-2">
                    <Calendar className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="text-sm font-semibold">No assigned events match this filter.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 4: MY GRIEVANCES */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === 'grievances' && (
            <div id="tab-content-grievances" className="space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">Assigned Grievance Dockets</h3>
                  <p className="text-xs text-slate-400">
                    Grievances assigned to you by the Ombudsman Desk for field investigation and community mediation.
                  </p>
                </div>

                <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                  {(['All', 'Assigned', 'In Progress', 'Resolved'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setGrievanceFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        grievanceFilter === filter ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grievance Dockets List */}
              <div className="space-y-5">
                {filteredGrievances.map((grv) => (
                  <div 
                    key={grv.id} 
                    id={`grievance-card-${grv.id}`}
                    className="p-6 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-xl space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-teal-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                            {grv.id}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-800">
                            {grv.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            grv.priority === 'Urgent' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                            grv.priority === 'High' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {grv.priority || 'Medium'} Priority
                          </span>
                          <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                            grv.currentStatus === 'Resolved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            grv.currentStatus === 'In Progress' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            'bg-blue-950 text-blue-300 border border-blue-800'
                          }`}>
                            {grv.currentStatus}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white pt-1">{grv.subject}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{grv.description}</p>
                      </div>

                      <button
                        id={`btn-update-grievance-${grv.id}`}
                        onClick={() => {
                          setSelectedGrievance(grv);
                          setGrievanceStatusInput(grv.currentStatus as any);
                        }}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-md shadow-teal-600/20"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Update Docket
                      </button>
                    </div>

                    {/* Complainant & Location Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500">Complainant Contact</span>
                        {grv.isAnonymous ? (
                          <p className="text-slate-400 italic mt-0.5">Anonymous Citizen Report</p>
                        ) : (
                          <div className="space-y-0.5 mt-0.5">
                            {grv.complainantEmail && (
                              <p className="text-slate-200 flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" /> {grv.complainantEmail}
                              </p>
                            )}
                            {grv.complainantPhone && (
                              <p className="text-slate-200 flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" /> {grv.complainantPhone}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500">Incident Location</span>
                        <p className="text-slate-200 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {grv.location}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500">Date Logged</span>
                        <p className="text-slate-200 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" /> {grv.submittedAt}
                        </p>
                      </div>
                    </div>

                    {/* Timeline & Field Logs */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <span className="text-[11px] font-bold text-slate-300">Mediation & Timeline Trail:</span>
                      <div className="space-y-2">
                        {grv.timeline?.map((tl, i) => (
                          <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-start justify-between gap-4">
                            <div className="space-y-0.5">
                              <span className="font-bold text-teal-400 text-[11px]">{tl.status}</span>
                              <p className="text-slate-300">{tl.description}</p>
                              <span className="text-[10px] text-slate-500">Updated by: {tl.updatedBy}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 shrink-0">{tl.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredGrievances.length === 0 && (
                  <div className="p-12 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 space-y-2">
                    <FileText className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="text-sm font-semibold">No assigned grievances match this filter.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 5: MY TASKS */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === 'tasks' && (
            <div id="tab-content-tasks" className="space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">Assigned Field Tasks</h3>
                  <p className="text-xs text-slate-400">
                    Specific action items assigned to you for execution, due dates, and status tracking.
                  </p>
                </div>

                <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                  {(['All', 'Pending', 'In Progress', 'Completed'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTaskFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        taskFilter === filter ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-4">
                {filteredTasks.map((t) => (
                  <div 
                    key={t.id} 
                    id={`task-item-${t.id}`}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-xl space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.priority === 'Urgent' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                            t.priority === 'High' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            t.priority === 'Medium' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {t.priority} Priority
                          </span>
                          <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                            t.status === 'Completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            t.status === 'In Progress' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {t.status}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 text-teal-300 border border-teal-800/30">
                            Related {t.relatedType}: {t.relatedTitle}
                          </span>
                        </div>

                        <h4 className="text-base font-black text-white">{t.title}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{t.description}</p>
                      </div>

                      <button
                        id={`btn-update-task-${t.id}`}
                        onClick={() => {
                          setSelectedTask(t);
                          setTaskStatusInput(t.status);
                        }}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-md shadow-teal-600/20"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Update Status
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" /> Assigned: {t.assignedDate}
                      </span>
                      <span className="flex items-center gap-1 text-amber-300 font-semibold">
                        <Clock className="w-3.5 h-3.5" /> Due: {t.dueDate}
                      </span>
                      {t.completedAt && (
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed: {t.completedAt.substring(0, 10)}
                        </span>
                      )}
                    </div>

                    {/* Progress Notes */}
                    {t.progressNotes && t.progressNotes.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Task Progress Notes:</span>
                        <div className="space-y-1.5">
                          {t.progressNotes.map((pn) => (
                            <div key={pn.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex justify-between gap-2">
                              <span className="text-slate-300">{pn.note}</span>
                              <span className="text-[10px] text-slate-500 shrink-0">{pn.timestamp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {filteredTasks.length === 0 && (
                  <div className="p-12 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 space-y-2">
                    <ListTodo className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="text-sm font-semibold">No tasks found matching your filter.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 6: NOTIFICATIONS */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === 'notifications' && (
            <div id="tab-content-notifications" className="space-y-6">
              
              {/* Header & Mark All as Read */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">Volunteer Notifications</h3>
                  <p className="text-xs text-slate-400">
                    Announcements from Admin, newly assigned programs, events, grievances, and task assignments.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                    <button
                      onClick={() => setNotifFilter('All')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        notifFilter === 'All' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      All ({volunteerNotifications.length})
                    </button>
                    <button
                      onClick={() => setNotifFilter('Unread')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        notifFilter === 'Unread' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Unread ({unreadNotifsCount})
                    </button>
                  </div>

                  {unreadNotifsCount > 0 && (
                    <button
                      id="btn-mark-all-read"
                      onClick={() => {
                        markAllVolunteerNotificationsRead();
                        showToast('All notifications marked as read');
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" /> Mark All Read
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="space-y-3">
                {filteredNotifs.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                      n.isRead 
                        ? 'bg-slate-950/60 border-slate-800/60 text-slate-400' 
                        : 'bg-slate-950 border-teal-800/60 shadow-lg shadow-teal-950/20 text-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        n.type === 'grievance' ? 'bg-rose-950 text-rose-400 border border-rose-800/60' :
                        n.type === 'event' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' :
                        n.type === 'task' ? 'bg-amber-950 text-amber-400 border border-amber-800/60' :
                        n.type === 'program' ? 'bg-teal-950 text-teal-400 border border-teal-800/60' :
                        'bg-indigo-950 text-indigo-400 border border-indigo-800/60'
                      }`}>
                        {n.type === 'grievance' && <FileText className="w-4 h-4" />}
                        {n.type === 'event' && <Calendar className="w-4 h-4" />}
                        {n.type === 'task' && <ListTodo className="w-4 h-4" />}
                        {n.type === 'program' && <Layers className="w-4 h-4" />}
                        {n.type === 'announcement' && <Bell className="w-4 h-4" />}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`text-xs font-bold truncate ${n.isRead ? 'text-slate-300' : 'text-white'}`}>
                            {n.title}
                          </h4>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-slate-500 block pt-0.5">{n.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {n.actionTab && (
                        <button
                          onClick={() => {
                            markVolunteerNotificationRead(n.id);
                            setActiveTab(n.actionTab as VolunteerTab);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-teal-950 hover:bg-teal-900 text-teal-300 text-[11px] font-semibold border border-teal-800/40"
                        >
                          View Tab
                        </button>
                      )}

                      {!n.isRead && (
                        <button
                          onClick={() => markVolunteerNotificationRead(n.id)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {filteredNotifs.length === 0 && (
                  <div className="p-12 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 space-y-2">
                    <Bell className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="text-sm font-semibold">No notifications found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 7: MY PROFILE */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === 'profile' && (
            <div id="tab-content-profile" className="space-y-6">
              
              {/* Profile Card Summary */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center md:items-start gap-6">
                <img 
                  src={profileForm.avatar} 
                  alt={profileForm.fullName} 
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-teal-500/30 shrink-0"
                />

                <div className="flex-1 text-center md:text-left space-y-2 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <h3 className="text-xl font-black text-white">{profileForm.fullName || user?.fullName}</h3>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60 w-fit mx-auto md:mx-0">
                      Active Volunteer
                    </span>
                  </div>

                  <p className="text-xs text-teal-400 font-semibold">{user?.email}</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-2.5 rounded-xl bg-slate-900 text-left border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Assigned Chapter</span>
                      <p className="text-xs font-bold text-slate-200 truncate">{user?.chapter || 'North Kashmir Hub'}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 text-left border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Joining Date</span>
                      <p className="text-xs font-bold text-slate-200">{user?.joinedDate || 'Jan 15, 2026'}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 text-left border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Service Hours</span>
                      <p className="text-xs font-bold text-teal-400">{user?.volunteerHours || 42} hrs</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 text-left border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Volunteer ID</span>
                      <p className="text-xs font-bold text-slate-200 truncate">{user?.id?.substring(0, 14)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Column Grid: Edit Personal Information & Change Password */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left: Edit Basic Personal Info */}
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <User className="w-4 h-4 text-teal-400" />
                    <h4 className="text-sm font-bold text-white">Edit Personal Information</h4>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Full Name</label>
                      <input 
                        type="text"
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">Phone Number</label>
                        <input 
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                          placeholder="+91 97970 88219"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">City / District</label>
                        <input 
                          type="text"
                          value={profileForm.city}
                          onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">Blood Group</label>
                        <select 
                          value={profileForm.bloodGroup}
                          onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                        >
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">Emergency Contact</label>
                        <input 
                          type="tel"
                          value={profileForm.emergencyContact}
                          onChange={(e) => setProfileForm({ ...profileForm, emergencyContact: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Avatar Image URL</label>
                      <input 
                        type="url"
                        value={profileForm.avatar}
                        onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Volunteer Bio & Skills</label>
                      <textarea 
                        rows={3}
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 resize-none"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                      <p className="text-slate-300 font-semibold">Permission Notice:</p>
                      <p>Role & system permissions are administered by the Central Secretariat and cannot be altered by volunteers directly.</p>
                    </div>

                    <button 
                      id="save-volunteer-profile-btn"
                      type="submit" 
                      className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-colors shadow-md shadow-teal-600/20"
                    >
                      Save Profile Changes
                    </button>
                  </form>
                </div>

                {/* Right: Change Password */}
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Key className="w-4 h-4 text-teal-400" />
                    <h4 className="text-sm font-bold text-white">Change Account Password</h4>
                  </div>

                  {passwordSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Password changed successfully!</span>
                    </div>
                  )}

                  {passwordError && (
                    <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSavePassword} className="space-y-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Current Password</label>
                      <input 
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">New Password (min 6 characters)</label>
                      <input 
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Confirm New Password</label>
                      <input 
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="pt-2">
                      <button 
                        id="save-volunteer-password-btn"
                        type="submit" 
                        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold transition-colors border border-slate-700"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. Program Progress Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-950 border border-slate-800 p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-400" />
                <h4 className="text-sm font-bold text-white">Update Program Progress</h4>
              </div>
              <button 
                onClick={() => setSelectedProgram(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-white">{selectedProgram.programTitle}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Role: {selectedProgram.assignedRole}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Progress: {progProgressInput}%</span>
                  <span className="text-[11px] text-teal-400 font-bold">
                    {progProgressInput >= 100 ? 'Completed' : progProgressInput > 0 ? 'In Progress' : 'Assigned'}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={progProgressInput} 
                  onChange={(e) => setProgProgressInput(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Add Field Note / Activity Log</label>
                <textarea 
                  rows={3}
                  value={progNoteInput}
                  onChange={(e) => setProgNoteInput(e.target.value)}
                  placeholder="e.g. Conducted volunteer orientation with 25 student participants..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button 
                onClick={() => setSelectedProgram(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                id="modal-save-prog-btn"
                onClick={handleSaveProgramProgress}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/20"
              >
                Save Progress
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Event Status Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-950 border border-slate-800 p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-400" />
                <h4 className="text-sm font-bold text-white">Update Event Status</h4>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-white">{selectedEvent.eventTitle}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{selectedEvent.date} • {selectedEvent.location}</p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Your Execution Status</label>
                <select 
                  value={evtStatusInput}
                  onChange={(e) => setEvtStatusInput(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="Assigned">Assigned (Preparing)</option>
                  <option value="In Progress">In Progress (Active on Ground)</option>
                  <option value="Completed">Completed (Duties Concluded)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Add Ground Note</label>
                <textarea 
                  rows={3}
                  value={evtNoteInput}
                  onChange={(e) => setEvtNoteInput(e.target.value)}
                  placeholder="e.g. Distributed 100 delegate kits and set up helpdesk..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button 
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                id="modal-save-evt-btn"
                onClick={handleSaveEventStatus}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/20"
              >
                Save Event Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Grievance Update Modal */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-950 border border-slate-800 p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-400" />
                <h4 className="text-sm font-bold text-white">Update Grievance Docket</h4>
              </div>
              <button 
                onClick={() => setSelectedGrievance(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="font-mono text-[11px] font-bold text-teal-400 px-2 py-0.5 rounded bg-slate-900">
                  {selectedGrievance.id}
                </span>
                <p className="text-xs font-bold text-white mt-1">{selectedGrievance.subject}</p>
                <p className="text-[11px] text-slate-400">{selectedGrievance.location}</p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Investigation Status</label>
                <select 
                  value={grievanceStatusInput}
                  onChange={(e) => setGrievanceStatusInput(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress (Field Inquiry Ongoing)</option>
                  <option value="Resolved">Resolved (Redressal Completed)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Field Remarks & Mediation Report
                </label>
                <textarea 
                  rows={3}
                  value={grievanceRemarkInput}
                  onChange={(e) => setGrievanceRemarkInput(e.target.value)}
                  placeholder="Record on-ground inspection findings, official dialogue, or resolution summary..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 resize-none"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button 
                onClick={() => setSelectedGrievance(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                id="modal-save-grv-btn"
                onClick={handleSaveGrievanceStatus}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/20"
              >
                Submit Field Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Task Update Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-950 border border-slate-800 p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-teal-400" />
                <h4 className="text-sm font-bold text-white">Update Task Status</h4>
              </div>
              <button 
                onClick={() => setSelectedTask(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-white">{selectedTask.title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Due: {selectedTask.dueDate}</p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Status</label>
                <select 
                  value={taskStatusInput}
                  onChange={(e) => setTaskStatusInput(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Add Progress Note</label>
                <textarea 
                  rows={3}
                  value={taskNoteInput}
                  onChange={(e) => setTaskNoteInput(e.target.value)}
                  placeholder="Record task completion notes or intermediate status..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button 
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                id="modal-save-task-btn"
                onClick={handleSaveTaskStatus}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/20"
              >
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Log Hours Modal */}
      {showLogHoursModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-950 border border-slate-800 p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400" />
                <h4 className="text-sm font-bold text-white">Log Volunteer Service Hours</h4>
              </div>
              <button 
                onClick={() => setShowLogHoursModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogHours} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Hours to Add</label>
                <input 
                  type="number"
                  min="0.5"
                  max="24"
                  step="0.5"
                  value={hoursToAdd}
                  onChange={(e) => setHoursToAdd(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Service Activity Description</label>
                <textarea 
                  rows={3}
                  value={hoursDescription}
                  onChange={(e) => setHoursDescription(e.target.value)}
                  placeholder="Describe your volunteer work on the ground..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button 
                  type="button"
                  onClick={() => setShowLogHoursModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button 
                  id="modal-submit-hours-btn"
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/20"
                >
                  Confirm & Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
