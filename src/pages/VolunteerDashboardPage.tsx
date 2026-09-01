import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Briefcase,
  Upload,
  MessageSquare,
  Users,
  Award,
  BookOpen,
  ClipboardList
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GyfLogo } from '../components/GyfLogo';
import { EvidenceAttachmentCard } from '../components/common/EvidenceAttachmentCard';
import { 
  VolunteerProgramAssignment, 
  VolunteerEventAssignment, 
  VolunteerTaskItem, 
  VolunteerNotificationItem, 
  VolunteerActivityReport,
  GrievanceRecord,
  UserAccount
} from '../types';

type VolunteerTab = 
  | 'dashboard' 
  | 'programs' 
  | 'events' 
  | 'grievances' 
  | 'tasks' 
  | 'activity-reports' 
  | 'team' 
  | 'notifications' 
  | 'profile';

export const VolunteerDashboardPage: React.FC = () => {
  const { 
    user, 
    users,
    logout, 
    complaints, 
    programs,
    events,
    volunteerPrograms, 
    volunteerEvents, 
    volunteerTasks, 
    volunteerNotifications,
    volunteerActivityReports,
    updateVolunteerProgramProgress,
    updateVolunteerEventStatus,
    updateVolunteerGrievance,
    updateVolunteerTask,
    markVolunteerNotificationRead,
    markAllVolunteerNotificationsRead,
    updateVolunteerProfile,
    logVolunteerSelfHours,
    submitVolunteerActivityReport,
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
  const [reportFilter, setReportFilter] = useState<'All' | 'Submitted' | 'Reviewed by Admin'>('All');
  const [notifFilter, setNotifFilter] = useState<'All' | 'Unread'>('All');
  const [teamSearchQuery, setTeamSearchQuery] = useState('');
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

  // 5. Submit Activity Report modal
  const [showSubmitReportModal, setShowSubmitReportModal] = useState(false);
  const [reportFormData, setReportFormData] = useState({
    title: '',
    category: 'Field Inspection' as VolunteerActivityReport['category'],
    relatedType: 'General' as VolunteerActivityReport['relatedType'],
    relatedTitle: '',
    date: new Date().toISOString().split('T')[0],
    hoursSpent: 3,
    location: user?.chapter ? `${user.chapter} Field Zone` : 'Baramulla / Srinagar Field Belt',
    summary: '',
    accomplishments: '',
    challenges: ''
  });

  // 6. Log hours modal
  const [showLogHoursModal, setShowLogHoursModal] = useState(false);
  const [hoursToAdd, setHoursToAdd] = useState(3);
  const [hoursDescription, setHoursDescription] = useState('Community outreach and grassroots engagement');

  // 7. Profile Edit State
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    city: user?.city || 'Baramulla',
    bloodGroup: user?.bloodGroup || 'O+',
    emergencyContact: user?.emergencyContact || '+91 94190 12345',
    bio: user?.bio || 'Dedicated grassroots youth advocate for environment and social justice in North Kashmir.',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  });

  // 8. Password Change State
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
    showToast('Synchronized volunteer assignments');
    setIsRefreshing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filtered collections strictly scoped to logged-in user
  const myAssignedGrievances = useMemo(() => {
    if (!user) return [];
    return complaints.filter(c => c.assignedVolunteerId === user.id || c.assignedToVolunteerId === user.id);
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

  const filteredReports = useMemo(() => {
    return volunteerActivityReports.filter(r => {
      const matchFilter = reportFilter === 'All' || r.status === reportFilter;
      const matchSearch = !searchQuery ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [volunteerActivityReports, reportFilter, searchQuery]);

  const filteredTeamMembers = useMemo(() => {
    return users.filter(u => {
      const isColleague = u.role === 'volunteer' || u.membershipStatus === 'Volunteer' || u.membershipStatus === 'Member';
      if (!isColleague) return false;
      if (!teamSearchQuery) return true;
      const q = teamSearchQuery.toLowerCase();
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.chapter && u.chapter.toLowerCase().includes(q)) ||
        (u.city && u.city.toLowerCase().includes(q))
      );
    });
  }, [users, teamSearchQuery]);

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
      showToast(`Updated event duty status for "${selectedEvent.eventTitle}"`);
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

  // Activity Report submission handler
  const handleSubmitActivityReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!reportFormData.title || !reportFormData.summary) {
      showToast('Please fill out the report title and summary.');
      return;
    }
    try {
      await submitVolunteerActivityReport({
        volunteerId: user.id,
        volunteerName: user.fullName,
        title: reportFormData.title,
        category: reportFormData.category,
        relatedType: reportFormData.relatedType,
        relatedTitle: reportFormData.relatedTitle || undefined,
        date: reportFormData.date,
        hoursSpent: Number(reportFormData.hoursSpent) || 0,
        location: reportFormData.location,
        summary: reportFormData.summary,
        accomplishments: reportFormData.accomplishments,
        challenges: reportFormData.challenges || undefined
      });
      showToast('Field activity report submitted to Admin successfully!');
      setShowSubmitReportModal(false);
      setReportFormData({
        title: '',
        category: 'Field Inspection',
        relatedType: 'General',
        relatedTitle: '',
        date: new Date().toISOString().split('T')[0],
        hoursSpent: 3,
        location: user?.chapter ? `${user.chapter} Field Zone` : 'Baramulla / Srinagar Field Belt',
        summary: '',
        accomplishments: '',
        challenges: ''
      });
    } catch (err: any) {
      showToast(err.message || 'Failed to submit report');
    }
  };

  // Profile Save Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateVolunteerProfile(profileForm);
      showToast('Profile saved successfully');
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
    showToast('Password updated successfully');
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
    <div id="volunteer-dashboard-container" className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col lg:flex-row font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div id="volunteer-toast" className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SIDEBAR NAVIGATION (Harmonized Brand Navy & Teal Theme) */}
      {/* ========================================================================= */}
      <aside 
        id="volunteer-sidebar" 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1b205a] text-slate-200 border-r border-[#2C3292]/30 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <GyfLogo size="sm" variant="white" />
              <div>
                <h1 className="text-xs font-black text-white uppercase tracking-wider">Volunteer Desk</h1>
                <p className="text-[10px] text-blue-200 font-semibold">Global Youth Foundation</p>
              </div>
            </Link>
            <button 
              id="close-sidebar-mobile-btn"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Volunteer Mini Profile in Sidebar */}
          <div className="p-4 mx-3.5 my-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
                  alt={user?.fullName || 'Volunteer'} 
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover border border-teal-600/60"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#1b205a]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.fullName || 'Aisha Begum'}</p>
                <p className="text-[10.5px] text-teal-300 truncate font-medium">{user?.chapter || 'North Kashmir Hub'}</p>
                <span className="text-[9.5px] text-blue-200/60 font-mono truncate block">
                  ID: {user?.id?.substring(0, 14) || 'usr-gyf-vol-01'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-white/10 text-blue-200/80">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Volunteer</span>
              </span>
              <span className="font-semibold text-white bg-white/10 px-2 py-0.5 rounded">
                {user?.chapter ? user.chapter.split(' ')[0] : 'Baramulla'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-6 flex-1">
            <div>
              <span className="text-[10px] font-extrabold text-blue-300/70 uppercase tracking-wider px-3 mb-2 block">
                Field Operations
              </span>
              <nav className="space-y-1">
                <button
                  id="nav-tab-dashboard"
                  onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-start px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-teal-800 text-white shadow-sm font-black'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Compass className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-teal-200' : 'text-blue-200'}`} />
                    <span>Dashboard Overview</span>
                  </div>
                </button>

                <button
                  id="nav-tab-programs"
                  onClick={() => { setActiveTab('programs'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-start px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'programs'
                      ? 'bg-teal-800 text-white shadow-sm font-black'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className={`w-4 h-4 ${activeTab === 'programs' ? 'text-teal-200' : 'text-blue-200'}`} />
                    <span>Assigned Programs</span>
                  </div>
                </button>

                <button
                  id="nav-tab-events"
                  onClick={() => { setActiveTab('events'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-start px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'events'
                      ? 'bg-teal-800 text-white shadow-sm font-black'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className={`w-4 h-4 ${activeTab === 'events' ? 'text-teal-200' : 'text-blue-200'}`} />
                    <span>Assigned Events</span>
                  </div>
                </button>

                <button
                  id="nav-tab-grievances"
                  onClick={() => { setActiveTab('grievances'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-start px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'grievances'
                      ? 'bg-teal-800 text-white shadow-sm font-black'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className={`w-4 h-4 ${activeTab === 'grievances' ? 'text-teal-200' : 'text-blue-200'}`} />
                    <span>Assigned Grievances</span>
                  </div>
                </button>

                <button
                  id="nav-tab-tasks"
                  onClick={() => { setActiveTab('tasks'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-start px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'tasks'
                      ? 'bg-teal-800 text-white shadow-sm font-black'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ListTodo className={`w-4 h-4 ${activeTab === 'tasks' ? 'text-teal-200' : 'text-blue-200'}`} />
                    <span>Assigned Tasks</span>
                  </div>
                </button>

                <button
                  id="nav-tab-activity-reports"
                  onClick={() => { setActiveTab('activity-reports'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-start px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'activity-reports'
                      ? 'bg-teal-800 text-white shadow-sm font-black'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ClipboardList className={`w-4 h-4 ${activeTab === 'activity-reports' ? 'text-teal-200' : 'text-blue-200'}`} />
                    <span>Field Reports & Logs</span>
                  </div>
                </button>
              </nav>
            </div>

            <div>
              <span className="text-[10px] font-extrabold text-blue-300/70 uppercase tracking-wider px-3 mb-2 block">
                Communications & Controls
              </span>
              <nav className="space-y-1">
                <button
                  id="nav-tab-team"
                  onClick={() => { setActiveTab('team'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-start px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'team'
                      ? 'bg-teal-800 text-white shadow-sm font-black'
                      : 'text-blue-200/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className={`w-4 h-4 ${activeTab === 'team' ? 'text-teal-200' : 'text-blue-300'}`} />
                    <span>Team & Members</span>
                  </div>
                </button>

                <button
                  id="nav-tab-notifications"
                  onClick={() => { setActiveTab('notifications'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-start px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'notifications'
                      ? 'bg-teal-800 text-white shadow-sm font-black'
                      : 'text-blue-200/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Bell className={`w-4 h-4 ${activeTab === 'notifications' ? 'text-teal-200' : 'text-blue-300'}`} />
                    <span>Admin Alerts</span>
                  </div>
                </button>

                <button
                  id="nav-tab-profile"
                  onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-start px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'profile'
                      ? 'bg-teal-800 text-white shadow-sm font-black'
                      : 'text-blue-200/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-teal-200' : 'text-blue-300'}`} />
                    <span>My Profile & ID</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Sidebar Footer / Logout */}
          <div className="p-4 border-t border-white/10 bg-black/20 space-y-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-blue-200 space-y-1">
              <div className="flex items-center justify-between text-slate-200 font-semibold">
                <span>Verified Service</span>
                <span className="text-teal-300 font-bold">{user?.volunteerHours || 42} hrs</span>
              </div>
              <button 
                id="sidebar-log-hours-btn"
                onClick={() => setShowLogHoursModal(true)}
                className="w-full mt-2 py-1.5 px-2 bg-teal-800 hover:bg-teal-700 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 text-[11px] transition-colors border border-teal-600/50"
              >
                <Plus className="w-3.5 h-3.5" /> Log Hours
              </button>
            </div>

            <button
              id="volunteer-logout-btn"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-500/20 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)} 
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-100/70">
        
        {/* Top Header Bar */}
        <header id="volunteer-top-header" className="h-16 px-6 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              id="open-sidebar-mobile-btn"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Sliders className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base font-black text-slate-900 capitalize flex items-center gap-2">
                {activeTab === 'dashboard' && 'Volunteer Overview & Assigned Work'}
                {activeTab === 'programs' && 'Assigned Programs'}
                {activeTab === 'events' && 'Assigned Events & Logistics'}
                {activeTab === 'grievances' && 'Assigned Citizen Grievances'}
                {activeTab === 'tasks' && 'Assigned Tasks & Action Items'}
                {activeTab === 'activity-reports' && 'Field Activity Reports & Updates'}
                {activeTab === 'team' && 'Team & Members Directory (View-Only)'}
                {activeTab === 'notifications' && 'Admin Alerts & Work Notifications'}
                {activeTab === 'profile' && 'Volunteer Profile & Credential ID'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="sync-volunteer-data-btn"
              onClick={handleSyncAll}
              disabled={isRefreshing}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Refresh and sync data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-teal-800' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            {/* Quick Submit Report Button */}
            <button
              onClick={() => setShowSubmitReportModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit Field Report</span>
            </button>

            {/* Quick Notification Bell */}
            <button
              id="header-notif-bell"
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white"></span>
              )}
            </button>

            {/* Chapter Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-bold text-blue-900">
              <MapPin className="w-3.5 h-3.5 text-teal-700" />
              <span>{user?.chapter || 'North Kashmir Hub'}</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">

          {/* ------------------------------------------------------------------- */}
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === 'dashboard' && (
            <div id="tab-content-dashboard" className="space-y-6 animate-in fade-in duration-300">
              {/* Welcome Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1b205a] via-[#21276e] to-[#1b205a] border border-[#2C3292]/40 p-6 md:p-8 shadow-sm text-white">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/80 border border-teal-500/40 text-[11px] font-semibold text-teal-200">
                      <Sparkles className="w-3.5 h-3.5" />
                      Assigned Field Operations
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white">
                      Welcome, {user?.fullName || 'Aisha Begum'}
                    </h3>
                    <p className="text-xs md:text-sm text-blue-100/90 max-w-2xl leading-relaxed">
                      You are operating under <strong className="text-teal-300">{user?.chapter || 'North Kashmir Hub (Baramulla)'}</strong>. You only manage the tasks, programs, events, and grievance dockets assigned directly to you by the Central Secretariat.
                    </p>
                  </div>
                  <div className="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0">
                    <button
                      id="dash-quick-submit-report-btn"
                      onClick={() => setShowSubmitReportModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all"
                    >
                      <ClipboardList className="w-4 h-4" /> Submit Field Report
                    </button>
                    <button
                      id="dash-quick-log-hours-btn"
                      onClick={() => setShowLogHoursModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-blue-100 border border-white/20 text-xs font-bold flex items-center gap-2 transition-all backdrop-blur-xs"
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
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-500/50 hover:shadow-md transition-all cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Programs</span>
                    <Layers className="w-4 h-4 text-teal-700 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="mt-2 text-2xl font-black text-slate-900">{volunteerPrograms.length}</p>
                  <p className="text-[10px] text-teal-700 font-semibold mt-0.5">Assigned by Admin</p>
                </div>

                <div 
                  onClick={() => setActiveTab('events')} 
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-500/50 hover:shadow-md transition-all cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Events</span>
                    <Calendar className="w-4 h-4 text-teal-700 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="mt-2 text-2xl font-black text-slate-900">{volunteerEvents.length}</p>
                  <p className="text-[10px] text-teal-700 font-semibold mt-0.5">Field Operations</p>
                </div>

                <div 
                  onClick={() => setActiveTab('grievances')} 
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-500/50 hover:shadow-md transition-all cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Grievances</span>
                    <FileText className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="mt-2 text-2xl font-black text-slate-900">{myAssignedGrievances.length}</p>
                  <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Assigned Cases</p>
                </div>

                <div 
                  onClick={() => setActiveTab('tasks')} 
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-500/50 hover:shadow-md transition-all cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Tasks</span>
                    <ListTodo className="w-4 h-4 text-teal-700 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="mt-2 text-2xl font-black text-slate-900">{volunteerTasks.length}</p>
                  <p className="text-[10px] text-teal-700 font-semibold mt-0.5">Action Items</p>
                </div>

                <div 
                  onClick={() => setActiveTab('activity-reports')} 
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Field Reports</span>
                    <ClipboardList className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="mt-2 text-2xl font-black text-slate-900">{volunteerActivityReports.length}</p>
                  <p className="text-[10px] text-blue-600 font-semibold mt-0.5">Sent to Admin</p>
                </div>

                <div 
                  onClick={() => setActiveTab('profile')} 
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-500/50 hover:shadow-md transition-all cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Service Hours</span>
                    <Clock className="w-4 h-4 text-teal-700 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="mt-2 text-2xl font-black text-slate-900">{user?.volunteerHours || 42}</p>
                  <p className="text-[10px] text-teal-700 font-semibold mt-0.5">Certified Hours</p>
                </div>
              </div>

              {/* Split Sections: Priority Tasks & Grievance Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left: Assigned Priority Action Items */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ListTodo className="w-4 h-4 text-teal-700" />
                      <h4 className="text-sm font-black text-slate-900">Priority Action Items</h4>
                    </div>
                    <button 
                      onClick={() => setActiveTab('tasks')} 
                      className="text-xs font-bold text-teal-800 hover:underline"
                    >
                      View All ({volunteerTasks.length})
                    </button>
                  </div>

                  <div className="space-y-3">
                    {volunteerTasks.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        No pending tasks assigned by admin.
                      </div>
                    ) : (
                      volunteerTasks.slice(0, 3).map((task) => (
                        <div 
                          key={task.id} 
                          className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 flex items-start justify-between gap-3 hover:border-slate-300 transition-colors"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                task.priority === 'Urgent' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                task.priority === 'High' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                                'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                {task.priority}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">Due: {task.dueDate}</span>
                            </div>
                            <h5 className="text-xs font-bold text-slate-900 truncate">{task.title}</h5>
                            <p className="text-[11px] text-slate-600 line-clamp-1">{task.description}</p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedTask(task);
                              setTaskStatusInput(task.status);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-bold shrink-0 transition-colors border border-teal-200"
                          >
                            Update
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right: Assigned Citizen Grievances */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <h4 className="text-sm font-black text-slate-900">Assigned Grievance Dockets</h4>
                    </div>
                    <button 
                      onClick={() => setActiveTab('grievances')} 
                      className="text-xs font-bold text-teal-800 hover:underline"
                    >
                      View All ({myAssignedGrievances.length})
                    </button>
                  </div>

                  <div className="space-y-3">
                    {myAssignedGrievances.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        No grievance cases currently assigned to your docket.
                      </div>
                    ) : (
                      myAssignedGrievances.slice(0, 3).map((grv) => (
                        <div 
                          key={grv.id} 
                          className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 flex items-start justify-between gap-3 hover:border-slate-300 transition-colors"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-bold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                {grv.id}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                grv.currentStatus === 'Resolved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                                grv.currentStatus === 'In Progress' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                                'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                {grv.currentStatus}
                              </span>
                            </div>
                            <h5 className="text-xs font-bold text-slate-900 truncate">{grv.subject}</h5>
                            <p className="text-[11px] text-slate-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{grv.location}</span>
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedGrievance(grv);
                              setGrievanceStatusInput(grv.currentStatus as any);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-bold shrink-0 transition-colors border border-teal-200"
                          >
                            Update
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Bottom Quick Row: Recent Field Reports & Admin Notes */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-teal-700" />
                    <h4 className="text-sm font-black text-slate-900">Recent Field Activity Reports Sent to Admin</h4>
                  </div>
                  <button 
                    onClick={() => setActiveTab('activity-reports')} 
                    className="text-xs font-bold text-teal-800 hover:underline"
                  >
                    View All ({volunteerActivityReports.length})
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {volunteerActivityReports.slice(0, 2).map((rep) => (
                    <div key={rep.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                          {rep.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          rep.status === 'Reviewed by Admin' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {rep.status}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">{rep.title}</h5>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{rep.summary}</p>
                      {rep.adminFeedback && (
                        <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-[11px] text-teal-900">
                          <strong>Admin Feedback:</strong> {rep.adminFeedback}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 2: ASSIGNED PROGRAMS */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === 'programs' && (
            <div id="tab-content-programs" className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Assigned Community Programs</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Track milestones, update execution percentage, and record field notes for programs assigned by Admin.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white rounded-xl p-1 border border-slate-200 shadow-xs">
                    {(['All', 'In Progress', 'Completed'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setProgramFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          programFilter === f ? 'bg-teal-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {filteredPrograms.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
                  <Layers className="w-10 h-10 text-slate-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-900">No Programs Found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    There are no programs matching your current filter. When the Central Secretariat assigns a program to your profile, it will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPrograms.map((prog) => (
                    <div 
                      key={prog.id} 
                      className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 hover:border-teal-500/50 hover:shadow-md transition-all shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                            {prog.category}
                          </span>
                          <h4 className="text-sm font-black text-slate-900 mt-1.5">{prog.programTitle}</h4>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                          prog.progressPercentage >= 100 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-blue-50 text-blue-900 border border-blue-200'
                        }`}>
                          {prog.progressPercentage >= 100 ? 'Completed' : 'In Progress'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-[11px] p-3 rounded-2xl bg-slate-50/80 border border-slate-200">
                        <div>
                          <span className="text-slate-500 block font-medium">Designated Role</span>
                          <span className="font-bold text-slate-900">{prog.assignedRole}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block font-medium">Target Location</span>
                          <span className="font-bold text-slate-900">{prog.location}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-700">Completion Progress</span>
                          <span className="text-teal-800 font-bold">{prog.progressPercentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div 
                            className="h-full bg-teal-600 rounded-full transition-all duration-500" 
                            style={{ width: `${prog.progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Field Notes / Activity Notes Snippet */}
                      {((prog.activityNotes && prog.activityNotes.length > 0) || (prog.fieldNotes && prog.fieldNotes.length > 0)) && (
                        <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-[11px] text-slate-700 space-y-1">
                          <span className="text-[10px] text-slate-500 uppercase font-bold">Latest Field Note</span>
                          <p className="line-clamp-2 italic">
                            "{prog.activityNotes && prog.activityNotes.length > 0 
                              ? prog.activityNotes[prog.activityNotes.length - 1].note 
                              : typeof prog.fieldNotes?.[prog.fieldNotes.length - 1] === 'object'
                              ? (prog.fieldNotes[prog.fieldNotes.length - 1] as any)?.note || ''
                              : prog.fieldNotes?.[prog.fieldNotes.length - 1]}"
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setSelectedProgram(prog);
                            setProgProgressInput(prog.progressPercentage);
                          }}
                          className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Update Progress & Notes</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 3: ASSIGNED EVENTS */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === 'events' && (
            <div id="tab-content-events" className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Assigned Events & Logistics</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    View upcoming foundation events, manage ground logistics, and record attendance check-ins.
                  </p>
                </div>

                <div className="flex items-center bg-white rounded-xl p-1 border border-slate-200 shadow-xs">
                  {(['All', 'Assigned', 'In Progress', 'Completed'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setEventFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        eventFilter === f ? 'bg-teal-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {filteredEvents.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
                  <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-900">No Event Assignments Found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    You have no events matching this filter. Newly assigned foundation events will be listed here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredEvents.map((evt) => (
                    <div 
                      key={evt.id} 
                      className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 hover:border-teal-500/50 hover:shadow-md transition-all shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                              Role: {evt.assignedRole}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900 mt-1.5">{evt.eventTitle}</h4>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                          evt.isCompleted ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                          evt.status === 'In Progress' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {evt.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-[11px] p-3 rounded-2xl bg-slate-50/80 border border-slate-200">
                        <div>
                          <span className="text-slate-500 block font-medium">Date & Time</span>
                          <span className="font-bold text-slate-900">{evt.date} • {evt.time}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block font-medium">Venue / Hub</span>
                          <span className="font-bold text-slate-900">{evt.location}</span>
                        </div>
                      </div>

                      {evt.notes && evt.notes.length > 0 && (
                        <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-[11px] text-slate-700 space-y-1">
                          <span className="text-[10px] text-slate-500 uppercase font-bold">Logistics Update</span>
                          <p className="line-clamp-2 italic">
                            "{typeof evt.notes[evt.notes.length - 1] === 'object' 
                              ? (evt.notes[evt.notes.length - 1] as any)?.note || ''
                              : evt.notes[evt.notes.length - 1]}"
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setSelectedEvent(evt);
                            setEvtStatusInput(evt.status);
                          }}
                          className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Update Event Duty Status</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 4: ASSIGNED GRIEVANCES */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === 'grievances' && (
            <div id="tab-content-grievances" className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Assigned Citizen Grievance Cases</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Conduct on-ground verification, submit inquiry remarks, and resolve cases assigned to you.
                  </p>
                </div>

                <div className="flex items-center bg-white rounded-xl p-1 border border-slate-200 shadow-xs">
                  {(['All', 'Assigned', 'In Progress', 'Resolved'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setGrievanceFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        grievanceFilter === f ? 'bg-teal-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {filteredGrievances.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
                  <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-900">No Assigned Grievances</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    You currently have no citizen complaints assigned to your docket.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredGrievances.map((grv) => (
                    <div 
                      key={grv.id} 
                      className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 hover:border-amber-500/50 hover:shadow-md transition-all shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {grv.id}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {grv.category}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900 mt-2">{grv.subject}</h4>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                          grv.currentStatus === 'Resolved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                          grv.currentStatus === 'In Progress' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {grv.currentStatus}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-slate-500 text-[11px]">
                          <span>Complainant: <strong className="text-slate-800">{grv.fullName}</strong></span>
                          <span>{grv.date}</span>
                        </div>
                        <p className="text-slate-700 text-[11px] line-clamp-2">{grv.description}</p>
                        <p className="text-slate-500 text-[11px] flex items-center gap-1 pt-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{grv.location}</span>
                        </p>

                        {grv.attachmentName && (
                          <div className="pt-2">
                            <EvidenceAttachmentCard
                              attachmentName={grv.attachmentName}
                              attachmentSize={grv.attachmentSize || '1.4 MB'}
                              attachmentUrl={grv.attachmentUrl}
                              attachmentType={grv.attachmentType}
                              docketId={grv.id}
                              category={grv.category}
                              subject={grv.subject}
                              submittedAt={grv.submittedAt}
                            />
                          </div>
                        )}
                      </div>

                      {grv.remarks && (
                        <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-[11px] text-slate-700 space-y-1">
                          <span className="text-[10px] text-slate-500 uppercase font-bold">Investigation Note</span>
                          <p className="italic">"{grv.remarks}"</p>
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setSelectedGrievance(grv);
                            setGrievanceStatusInput(grv.currentStatus as any);
                          }}
                          className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Update Status & Field Remarks</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 5: ASSIGNED TASKS */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === 'tasks' && (
            <div id="tab-content-tasks" className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Assigned Action Items & Tasks</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Tasks assigned by Admin with deadlines, priority ratings, and progress documentation.
                  </p>
                </div>

                <div className="flex items-center bg-white rounded-xl p-1 border border-slate-200 shadow-xs">
                  {(['All', 'Pending', 'In Progress', 'Completed'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setTaskFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        taskFilter === f ? 'bg-teal-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {filteredTasks.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
                  <ListTodo className="w-10 h-10 text-slate-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-900">No Tasks Found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    You have no tasks matching this filter.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-teal-500/50 hover:shadow-md transition-all shadow-xs"
                    >
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            task.priority === 'Urgent' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            task.priority === 'High' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                            'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {task.priority} Priority
                          </span>
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            task.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                            task.status === 'In Progress' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                            'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {task.status}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">Due: {task.dueDate}</span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900">{task.title}</h4>
                        <p className="text-xs text-slate-600">{task.description}</p>
                        {task.progressNotes && task.progressNotes.length > 0 && (
                          <div className="text-[11px] text-slate-500 italic">
                            Latest Note: "{typeof task.progressNotes[task.progressNotes.length - 1] === 'object' 
                              ? (task.progressNotes[task.progressNotes.length - 1] as any)?.note || ''
                              : task.progressNotes[task.progressNotes.length - 1]}"
                          </div>
                        )}
                      </div>

                      <div className="shrink-0">
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setTaskStatusInput(task.status);
                          }}
                          className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <CheckSquare className="w-3.5 h-3.5" />
                          <span>Update Task</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 6: FIELD ACTIVITY REPORTS */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === 'activity-reports' && (
            <div id="tab-content-activity-reports" className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Field Activity Reports & Progress Updates</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Submit verified grassroots inspection reports directly to the Central Secretariat and review feedback.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-white rounded-xl p-1 border border-slate-200 shadow-xs">
                    {(['All', 'Submitted', 'Reviewed by Admin'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setReportFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          reportFilter === f ? 'bg-teal-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowSubmitReportModal(true)}
                    className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Activity Report</span>
                  </button>
                </div>
              </div>

              {filteredReports.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
                  <ClipboardList className="w-10 h-10 text-slate-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-900">No Activity Reports Found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Click "New Activity Report" to submit your field inspection, outreach, or workshop report to Admin.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <div 
                      key={report.id} 
                      className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 hover:border-teal-500/50 hover:shadow-md transition-all shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                              {report.category}
                            </span>
                            {report.relatedTitle && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                Ref: {report.relatedTitle}
                              </span>
                            )}
                            <span className="text-xs text-slate-500 font-medium">{report.date} • {report.hoursSpent} Hours Logged</span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900">{report.title}</h4>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                          report.status === 'Reviewed by Admin' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {report.status}
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs space-y-2">
                        <p className="text-slate-700 font-medium"><strong className="text-slate-900">Location:</strong> {report.location}</p>
                        <p className="text-slate-700"><strong className="text-slate-900">Summary:</strong> {report.summary}</p>
                        <p className="text-teal-900 font-medium"><strong className="text-slate-900">Key Accomplishments:</strong> {report.accomplishments}</p>
                        {report.challenges && (
                          <p className="text-amber-800"><strong className="text-slate-900">Challenges / Follow-up:</strong> {report.challenges}</p>
                        )}
                      </div>

                      {report.adminFeedback && (
                        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Central Secretariat Admin Review</span>
                          </div>
                          <p className="text-[11px] text-slate-700">{report.adminFeedback}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 7: TEAM & MEMBERS DIRECTORY (READ-ONLY) */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === 'team' && (
            <div id="tab-content-team" className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Fellow Volunteers & Chapter Members</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    View contact and chapter assignments of fellow youth advocates for ground collaboration (Strictly read-only).
                  </p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    placeholder="Search by name or chapter..."
                    value={teamSearchQuery}
                    onChange={(e) => setTeamSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTeamMembers.map((member) => (
                  <div key={member.id} className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-blue-900 font-black flex items-center justify-center text-xs shrink-0">
                        {member.fullName.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-black text-slate-900 truncate">{member.fullName}</h4>
                        <span className="text-[10px] font-bold text-teal-800">{member.membershipStatus || 'Volunteer'}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-700 space-y-1 p-3 rounded-2xl bg-slate-50/80 border border-slate-200">
                      <p className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span className="truncate">{member.chapter || member.city || 'Central Hub'}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span className="truncate">{member.email}</span>
                      </p>
                      {member.phone && (
                        <p className="flex items-center gap-1.5 text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                          <span>{member.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 8: NOTIFICATIONS */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === 'notifications' && (
            <div id="tab-content-notifications" className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Central Admin Broadcasts & Notices</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Official dispatch alerts, grievance case escalations, and assignment notices.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-white rounded-xl p-1 border border-slate-200 shadow-xs">
                    {(['All', 'Unread'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setNotifFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          notifFilter === f ? 'bg-teal-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  {unreadNotifsCount > 0 && (
                    <button
                      onClick={markAllVolunteerNotificationsRead}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-teal-800 border border-slate-200 text-xs font-bold transition-all shadow-xs"
                    >
                      Mark All as Read
                    </button>
                  )}
                </div>
              </div>

              {filteredNotifs.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
                  <Bell className="w-10 h-10 text-slate-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-900">No Notifications</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    You have read all admin alerts and assignment notices.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifs.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => {
                        if (!notif.isRead) markVolunteerNotificationRead(notif.id);
                        if (notif.actionTab && notif.actionTab !== 'dashboard') {
                          setActiveTab(notif.actionTab as VolunteerTab);
                        }
                      }}
                      className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                        notif.isRead 
                          ? 'bg-white border-slate-200 text-slate-600' 
                          : 'bg-blue-50/50 border-blue-200 text-slate-900 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                          notif.type === 'program' ? 'bg-blue-50 text-blue-900 border border-blue-200' :
                          notif.type === 'event' ? 'bg-teal-50 text-teal-900 border border-teal-200' :
                          notif.type === 'grievance' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                          'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs font-black text-slate-900">{notif.title}</h4>
                            {!notif.isRead && (
                              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 block">{notif.date}</span>
                        </div>
                      </div>

                      {notif.actionTab && (
                        <span className="text-[11px] font-bold text-teal-800 hover:underline shrink-0">
                          View →
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* TAB 9: VOLUNTEER PROFILE & ID */}
          {/* ------------------------------------------------------------------- */}
          {activeTab === 'profile' && (
            <div id="tab-content-profile" className="space-y-6 animate-in fade-in duration-300">
              <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-6">
                <img 
                  src={profileForm.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'} 
                  alt="Profile Avatar"
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-teal-600/30 shadow-md shrink-0" 
                />
                <div className="flex-1 text-center md:text-left space-y-2 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900">{profileForm.fullName || user?.fullName}</h3>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-900 border border-blue-200 w-fit mx-auto md:mx-0">
                      Certified Youth Volunteer
                    </span>
                  </div>

                  <p className="text-xs text-teal-800 font-semibold">{user?.email}</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-2.5 rounded-2xl bg-slate-50 text-left border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Assigned Chapter</span>
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.chapter || 'North Kashmir Hub'}</p>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-slate-50 text-left border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Joining Date</span>
                      <p className="text-xs font-bold text-slate-900">{user?.joinedDate || 'Jan 15, 2026'}</p>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-slate-50 text-left border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Service Hours</span>
                      <p className="text-xs font-bold text-teal-800">{user?.volunteerHours || 42} hrs</p>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-slate-50 text-left border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Volunteer ID</span>
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.id?.substring(0, 14)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Column Grid: Edit Personal Information & Change Password */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left: Edit Basic Personal Info */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <User className="w-4 h-4 text-teal-800" />
                    <h4 className="text-sm font-black text-slate-900">Edit Personal Information</h4>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Full Name</label>
                      <input 
                        type="text"
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">Phone Number</label>
                        <input 
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                          placeholder="+91 97970 88219"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">City / District</label>
                        <input 
                          type="text"
                          value={profileForm.city}
                          onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">Blood Group</label>
                        <select 
                          value={profileForm.bloodGroup}
                          onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
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
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">Emergency Contact</label>
                        <input 
                          type="tel"
                          value={profileForm.emergencyContact}
                          onChange={(e) => setProfileForm({ ...profileForm, emergencyContact: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Avatar URL</label>
                      <input 
                        type="url"
                        value={profileForm.avatar}
                        onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Volunteer Bio & Skills</label>
                      <textarea 
                        rows={3}
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600 resize-none"
                      />
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                      <p className="text-teal-800 font-bold">Strict Role Safeguard Notice:</p>
                      <p>Volunteers cannot alter administrative permissions, delete programs, or modify user accounts. All systemic roles are governed by Central Administration.</p>
                    </div>

                    <button 
                      id="save-volunteer-profile-btn"
                      type="submit" 
                      className="w-full py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-xs"
                    >
                      Save Profile Changes
                    </button>
                  </form>
                </div>

                {/* Right: Change Password */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Key className="w-4 h-4 text-teal-800" />
                    <h4 className="text-sm font-black text-slate-900">Change Account Password</h4>
                  </div>

                  {passwordSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Password changed successfully!</span>
                    </div>
                  )}

                  {passwordError && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSavePassword} className="space-y-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Current Password</label>
                      <input 
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">New Password (min 6 characters)</label>
                      <input 
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Confirm New Password</label>
                      <input 
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="pt-2">
                      <button 
                        id="save-volunteer-password-btn"
                        type="submit" 
                        className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition-colors border border-slate-200"
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
      {/* INTERACTIVE ACTION MODALS */}
      {/* ========================================================================= */}

      {/* 1. Program Progress Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-800" />
                <h4 className="text-sm font-black text-slate-900">Update Program Progress</h4>
              </div>
              <button 
                onClick={() => setSelectedProgram(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-black text-slate-900">{selectedProgram.programTitle}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Role: {selectedProgram.assignedRole}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Progress: {progProgressInput}%</span>
                  <span className="text-[11px] text-teal-800 font-bold">
                    {progProgressInput >= 100 ? 'Completed' : progProgressInput > 0 ? 'In Progress' : 'Assigned'}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={progProgressInput} 
                  onChange={(e) => setProgProgressInput(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Add Field Note / Activity Log</label>
                <textarea 
                  rows={3}
                  value={progNoteInput}
                  onChange={(e) => setProgNoteInput(e.target.value)}
                  placeholder="e.g. Conducted volunteer orientation with 25 student participants..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button 
                onClick={() => setSelectedProgram(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                id="modal-save-prog-btn"
                onClick={handleSaveProgramProgress}
                className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
              >
                Save Progress
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Event Status Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-800" />
                <h4 className="text-sm font-black text-slate-900">Update Event Duty Status</h4>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-black text-slate-900">{selectedEvent.eventTitle}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{selectedEvent.date} • {selectedEvent.location}</p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Execution Status</label>
                <select 
                  value={evtStatusInput}
                  onChange={(e) => setEvtStatusInput(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                >
                  <option value="Assigned">Assigned (Preparing Logistics)</option>
                  <option value="In Progress">In Progress (Active on Ground)</option>
                  <option value="Completed">Completed (Duties Concluded)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Ground Logistics Note</label>
                <textarea 
                  rows={3}
                  value={evtNoteInput}
                  onChange={(e) => setEvtNoteInput(e.target.value)}
                  placeholder="e.g. Distributed 100 delegate kits and set up helpdesk..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button 
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                id="modal-save-evt-btn"
                onClick={handleSaveEventStatus}
                className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
              >
                Save Event Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Grievance Update Modal */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-800" />
                <h4 className="text-sm font-black text-slate-900">Update Grievance Docket</h4>
              </div>
              <button 
                onClick={() => setSelectedGrievance(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="font-mono text-[11px] font-bold text-blue-900 px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                  {selectedGrievance.id}
                </span>
                <p className="text-xs font-black text-slate-900 mt-1">{selectedGrievance.subject}</p>
                <p className="text-[11px] text-slate-500">{selectedGrievance.location}</p>
              </div>

              {selectedGrievance.attachmentName && (
                <div className="pt-1">
                  <EvidenceAttachmentCard
                    attachmentName={selectedGrievance.attachmentName}
                    attachmentSize={selectedGrievance.attachmentSize || '1.4 MB'}
                    attachmentUrl={selectedGrievance.attachmentUrl}
                    attachmentType={selectedGrievance.attachmentType}
                    docketId={selectedGrievance.id}
                    category={selectedGrievance.category}
                    subject={selectedGrievance.subject}
                    submittedAt={selectedGrievance.submittedAt}
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Investigation Status</label>
                <select 
                  value={grievanceStatusInput}
                  onChange={(e) => setGrievanceStatusInput(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                >
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress (Field Inquiry Ongoing)</option>
                  <option value="Resolved">Resolved (Redressal Completed)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Field Remarks & Mediation Report
                </label>
                <textarea 
                  rows={3}
                  value={grievanceRemarkInput}
                  onChange={(e) => setGrievanceRemarkInput(e.target.value)}
                  placeholder="Record on-ground inspection findings, official dialogue, or resolution summary..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600 resize-none"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button 
                onClick={() => setSelectedGrievance(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                id="modal-save-grv-btn"
                onClick={handleSaveGrievanceStatus}
                className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
              >
                Submit Field Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Task Update Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-teal-800" />
                <h4 className="text-sm font-black text-slate-900">Update Task Status</h4>
              </div>
              <button 
                onClick={() => setSelectedTask(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-black text-slate-900">{selectedTask.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Due: {selectedTask.dueDate}</p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Status</label>
                <select 
                  value={taskStatusInput}
                  onChange={(e) => setTaskStatusInput(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Add Progress Note</label>
                <textarea 
                  rows={3}
                  value={taskNoteInput}
                  onChange={(e) => setTaskNoteInput(e.target.value)}
                  placeholder="Record task completion notes or intermediate status..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button 
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                id="modal-save-task-btn"
                onClick={handleSaveTaskStatus}
                className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
              >
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Submit Field Activity Report Modal */}
      {showSubmitReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white border border-slate-200 p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-teal-800" />
                <h4 className="text-sm font-black text-slate-900">Submit Field Activity / Progress Report</h4>
              </div>
              <button 
                onClick={() => setShowSubmitReportModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitActivityReport} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Report Title / Headline</label>
                <input 
                  type="text"
                  value={reportFormData.title}
                  onChange={(e) => setReportFormData({ ...reportFormData, title: e.target.value })}
                  placeholder="e.g. Wular Catchment Youth Tree Plantation & Clean-up Drive"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Activity Category</label>
                  <select 
                    value={reportFormData.category}
                    onChange={(e) => setReportFormData({ ...reportFormData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                  >
                    <option value="Field Inspection">Field Inspection</option>
                    <option value="Community Outreach">Community Outreach</option>
                    <option value="Awareness Campaign">Awareness Campaign</option>
                    <option value="Workshop & Logistics">Workshop & Logistics</option>
                    <option value="Grievance Follow-up">Grievance Follow-up</option>
                    <option value="General Activity">General Activity</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Service Hours Spent</label>
                  <input 
                    type="number"
                    min="0.5"
                    max="24"
                    step="0.5"
                    value={reportFormData.hoursSpent}
                    onChange={(e) => setReportFormData({ ...reportFormData, hoursSpent: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Activity Date</label>
                  <input 
                    type="date"
                    value={reportFormData.date}
                    onChange={(e) => setReportFormData({ ...reportFormData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Field Location</label>
                  <input 
                    type="text"
                    value={reportFormData.location}
                    onChange={(e) => setReportFormData({ ...reportFormData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Detailed Activity Summary</label>
                <textarea 
                  rows={3}
                  value={reportFormData.summary}
                  onChange={(e) => setReportFormData({ ...reportFormData, summary: e.target.value })}
                  placeholder="Describe the activities conducted, participants engaged, and methods applied..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600 resize-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Key Accomplishments & Outcomes</label>
                <textarea 
                  rows={2}
                  value={reportFormData.accomplishments}
                  onChange={(e) => setReportFormData({ ...reportFormData, accomplishments: e.target.value })}
                  placeholder="e.g. Enrolled 40 youth eco-cadets, distributed 120 saplings..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600 resize-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Challenges / Required Admin Assistance (Optional)</label>
                <textarea 
                  rows={2}
                  value={reportFormData.challenges}
                  onChange={(e) => setReportFormData({ ...reportFormData, challenges: e.target.value })}
                  placeholder="Any ground resistance, logistical delays, or admin backing required..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowSubmitReportModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button 
                  id="modal-submit-report-btn"
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
                >
                  Submit Report to Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Log Hours Modal */}
      {showLogHoursModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-800" />
                <h4 className="text-sm font-black text-slate-900">Log Volunteer Service Hours</h4>
              </div>
              <button 
                onClick={() => setShowLogHoursModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogHours} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Hours to Add</label>
                <input 
                  type="number"
                  min="0.5"
                  max="24"
                  step="0.5"
                  value={hoursToAdd}
                  onChange={(e) => setHoursToAdd(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Service Activity Description</label>
                <textarea 
                  rows={3}
                  value={hoursDescription}
                  onChange={(e) => setHoursDescription(e.target.value)}
                  placeholder="Describe your volunteer work on the ground..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowLogHoursModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button 
                  id="modal-submit-hours-btn"
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
                >
                  Confirm & Log Hours
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default VolunteerDashboardPage;
