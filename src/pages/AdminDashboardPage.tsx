import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  UserCheck,
  FileText,
  Heart,
  Calendar,
  Layers,
  Bot,
  Activity,
  Search,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  EyeOff,
  Check,
  X,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  LogOut,
  ChevronRight,
  Filter,
  Download,
  DollarSign,
  Menu,
  LayoutDashboard,
  User,
  Sparkles,
  Bell,
  CreditCard,
  Globe,
  KeyRound,
  ClipboardList
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Program, EventItem, ContactMessage, NewsItem, FAQItem, GrievanceRecord, UserAccount } from '../types';

import { AdminOverviewTab } from '../components/admin/AdminOverviewTab';
import { AdminProgramsTab } from '../components/admin/AdminProgramsTab';
import { AdminEventsTab } from '../components/admin/AdminEventsTab';
import { AdminContactTab } from '../components/admin/AdminContactTab';
import { AdminProfileTab } from '../components/admin/AdminProfileTab';
import { AdminUsersTab } from '../components/admin/AdminUsersTab';
import { AdminVolunteersTab } from '../components/admin/AdminVolunteersTab';
import { AdminBlogsTab } from '../components/admin/AdminBlogsTab';
import { AdminDonationsTab } from '../components/admin/AdminDonationsTab';
import { AdminGrievancesTab } from '../components/admin/AdminGrievancesTab';
import { AdminNotificationsTab } from '../components/admin/AdminNotificationsTab';
import { AdminChatbotTab } from '../components/admin/AdminChatbotTab';
import { AdminMembershipsTab } from '../components/admin/AdminMembershipsTab';
import { AdminWebsiteContentTab } from '../components/admin/AdminWebsiteContentTab';
import { AdminVolunteerAssignmentsTab } from '../components/admin/AdminVolunteerAssignmentsTab';
import { ProgramModal } from '../components/admin/ProgramModal';
import { EventModal } from '../components/admin/EventModal';
import { ContactDetailModal } from '../components/admin/ContactDetailModal';
import { UserEditModal } from '../components/admin/UserEditModal';
import { GyfLogo } from '../components/GyfLogo';

export type AdminTab =
  | 'overview'
  | 'users'
  | 'volunteers'
  | 'blogs'
  | 'donations'
  | 'grievances'
  | 'chatbot'
  | 'events'
  | 'programs'
  | 'membership'
  | 'contact'
  | 'website-content'
  | 'volunteer-assignments'
  | 'volunteer-reports'
  | 'notifications'
  | 'profile';

export const AdminDashboardPage: React.FC = () => {
  const {
    user,
    logout,
    updateProfile,
    updateWebsiteContent,
    users,
    volunteers,
    volunteerPermissions,
    volunteerActivityReports,
    blogs,
    donations,
    complaints,
    events,
    programs,
    contactMessages,
    notifications,
    chatbotFaqs,
    createProgram,
    updateProgram,
    deleteProgram,
    toggleProgramPublish,
    createEvent,
    updateEvent,
    deleteEvent,
    toggleEventPublish,
    toggleReadContactMessage,
    deleteContactMessage,
    createBlog,
    updateBlog,
    deleteBlog,
    toggleBlogPublish,
    updateDonationStatus,
    deleteDonation,
    updateComplaintStatus,
    updateComplaintPriority,
    assignGrievance,
    deleteComplaint,
    createUser,
    updateUser,
    updateUserRole,
    toggleUserStatus,
    deleteUser,
    updateVolunteerStatus,
    updateVolunteerPermissions,
    logVolunteerHours,
    broadcastNotification,
    deleteNotification,
    createChatbotFaq,
    updateChatbotFaq,
    deleteChatbotFaq,
    refreshAllData
  } = useApp();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Modals state for Overview shortcuts
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const [selectedContactMessage, setSelectedContactMessage] = useState<ContactMessage | null>(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserAccount | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleRefresh = async () => {
    setIsSyncing(true);
    await refreshAllData();
    setIsSyncing(false);
    showToast('Platform data refreshed successfully');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Program Handlers
  const handleSaveProgram = async (data: any) => {
    if (editingProgram) {
      await updateProgram(editingProgram.id, data);
      showToast('Program updated successfully');
    } else {
      await createProgram(data);
      showToast('New program created successfully');
    }
  };

  const handleDeleteProgram = async (id: string) => {
    await deleteProgram(id);
    showToast('Program deleted');
  };

  const handleToggleProgramPublish = async (id: string) => {
    await toggleProgramPublish(id);
    showToast('Program status toggled');
  };

  // Event Handlers
  const handleSaveEvent = async (data: any) => {
    if (editingEvent) {
      await updateEvent(editingEvent.id, data);
      showToast('Event updated successfully');
    } else {
      await createEvent(data);
      showToast('New event scheduled successfully');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    await deleteEvent(id);
    showToast('Event deleted');
  };

  const handleToggleEventPublish = async (id: string) => {
    await toggleEventPublish(id);
    showToast('Event status updated');
  };

  // Contact Handlers
  const handleToggleReadContact = async (id: string, isRead: boolean) => {
    await toggleReadContactMessage(id, isRead);
    if (selectedContactMessage && selectedContactMessage.id === id) {
      setSelectedContactMessage({ ...selectedContactMessage, isRead });
    }
    showToast(isRead ? 'Marked as read' : 'Marked as unread');
  };

  const handleDeleteContact = async (id: string) => {
    await deleteContactMessage(id);
    showToast('Message deleted');
  };

  // Unread contact messages count
  const unreadContactCount = contactMessages.filter(m => !m.isRead).length;
  const pendingGrievanceCount = complaints.filter(c => c.currentStatus === 'Submitted' || c.currentStatus === 'Under Review').length;
  const pendingDonationsCount = donations.filter(d => d.paymentStatus === 'Pending Verification').length;
  const pendingMembershipCount = users.filter(u => u.membershipStatus === 'Applicant' && u.role !== 'volunteer').length;
  const pendingVolunteersCount = volunteers.filter(v => v.membershipStatus === 'Applicant').length;
  const pendingReportsCount = (volunteerActivityReports || []).filter(r => r.status === 'Submitted').length;

  interface NavItem {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    unreadCount?: number;
  }

  const primaryNavItems: NavItem[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users, count: users.length },
    { id: 'volunteers', label: 'Volunteers', icon: UserCheck, count: volunteers.length, unreadCount: pendingVolunteersCount },
    { id: 'blogs', label: 'Blogs', icon: FileText, count: blogs.length },
    { id: 'donations', label: 'Donations', icon: Heart, unreadCount: pendingDonationsCount },
    { id: 'grievances', label: 'Grievances', icon: ShieldCheck, unreadCount: pendingGrievanceCount },
    { id: 'chatbot', label: 'Chatbot', icon: Bot, count: chatbotFaqs.length },
    { id: 'events', label: 'Events', icon: Calendar, count: events.length },
    { id: 'programs', label: 'Programs', icon: Layers, count: programs.length },
    { id: 'membership', label: 'Membership / Become a Member', icon: CreditCard, unreadCount: pendingMembershipCount },
    { id: 'contact', label: 'Contact Messages', icon: Mail, unreadCount: unreadContactCount },
    { id: 'website-content', label: 'Website content', icon: Globe },
    { id: 'volunteer-assignments', label: 'Volunteer assignments & permissions', icon: KeyRound, count: volunteers.filter(v => v.isActive).length },
    { id: 'volunteer-reports', label: 'Volunteer Field Reports', icon: ClipboardList, count: (volunteerActivityReports || []).length, unreadCount: pendingReportsCount },
  ];

  const secondaryNavItems: NavItem[] = [
    { id: 'notifications', label: 'Broadcast Dispatch', icon: Bell, count: notifications.length },
    { id: 'profile', label: 'Admin Security Profile', icon: User }
  ];

  // Map notifications to SystemNotification schema for tab
  const systemNotifications = notifications.map(n => ({
    id: n.id,
    title: n.title,
    message: n.message,
    timestamp: n.date,
    type: (n.type === 'complaint' ? 'warning' : n.type === 'event' ? 'info' : 'info') as any,
    targetRole: 'all' as any,
    actionLink: n.actionUrl
  }));

  const adminCount = users.filter(u => u.role === 'admin').length;

  return (
    <div id="admin-dashboard-page" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="px-5 py-3.5 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-xl border border-slate-700 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Admin Frame Container */}
      <div className="flex-1 flex overflow-hidden">

        {/* ========================================================= */}
        {/* SIDEBAR NAVIGATION */}
        {/* ========================================================= */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1b205a] text-slate-200 border-r border-[#2C3292]/30 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="flex flex-col flex-1 overflow-y-auto">
            {/* Sidebar Brand Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3 group">
                <GyfLogo size="sm" variant="white" />
                <div>
                  <h2 className="text-xs font-black text-white uppercase tracking-wider">
                    Admin Command Desk
                  </h2>
                  <p className="text-[10px] text-blue-200 font-semibold">
                    Global Youth Foundation
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Primary Navigation Menu */}
            <div className="p-4 space-y-6">
              <div>
                <span className="text-[10px] font-extrabold text-blue-300/70 uppercase tracking-wider px-3 mb-2 block">
                  Core Management
                </span>
                <nav className="space-y-1">
                  {primaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        id={`admin-nav-${item.id}`}
                        onClick={() => {
                          setActiveTab(item.id as AdminTab);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-start px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${isActive
                            ? 'bg-teal-800 text-white shadow-sm font-black'
                            : 'text-blue-100 hover:bg-white/10 hover:text-white'
                          }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-teal-200' : 'text-blue-200'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.unreadCount !== undefined && item.unreadCount > 0 && (
                            <span
                              id={`admin-nav-${item.id}-badge`}
                              className="ml-auto px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-slate-950 shrink-0 shadow-xs ring-1 ring-amber-300 min-w-[20px] text-center"
                              title={`${item.unreadCount} pending application${item.unreadCount > 1 ? 's' : ''} awaiting review`}
                            >
                              {item.unreadCount}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Secondary Navigation Menu */}
              <div>
                <span className="text-[10px] font-extrabold text-blue-300/70 uppercase tracking-wider px-3 mb-2 block">
                  Communications & Controls
                </span>
                <nav className="space-y-1">
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        id={`admin-nav-${item.id}`}
                        onClick={() => {
                          setActiveTab(item.id as AdminTab);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-start px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${isActive
                            ? 'bg-teal-800 text-white shadow-sm font-black'
                            : 'text-blue-200/90 hover:bg-white/10 hover:text-white'
                          }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-teal-200' : 'text-blue-300'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Sidebar Footer User Info & Logout */}
          <div className="p-4 border-t border-white/10 bg-black/20 space-y-3">
            <div className="flex items-center gap-3 px-1">
              <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-black text-xs shrink-0">
                {user?.fullName ? user.fullName.charAt(0) : 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">
                  {user?.fullName || 'Super Administrator'}
                </p>
                <p className="text-[10px] text-teal-300 truncate">
                  {user?.email || 'admin@gyf.org'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Link
                to="/"
                className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold text-center transition-colors"
              >
                Public Site
              </Link>
              <button
                type="button"
                id="admin-sidebar-logout-btn"
                onClick={handleLogout}
                className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-200 hover:text-white transition-colors"
                title="Log Out of Admin Panel"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* ========================================================= */}
        {/* MAIN DASHBOARD CONTENT AREA */}
        {/* ========================================================= */}
        <main className="flex-1 overflow-y-auto flex flex-col min-w-0">

          {/* Top Bar Header */}
          <header className="sticky top-0 z-20 bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors relative"
                title="Open Administration Menu"
              >
                <Menu className="w-5 h-5" />
                {pendingVolunteersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center ring-2 ring-white">
                    {pendingVolunteersCount}
                  </span>
                )}
              </button>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Administration</span>
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                  <span className="text-teal-800 font-bold capitalize">
                    {activeTab === 'overview' ? 'Executive Dashboard' : `${activeTab} Management`}
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-black text-slate-900">
                  {activeTab === 'overview' && 'Executive Administration Dashboard'}
                  {activeTab === 'users' && 'Users Management Roster'}
                  {activeTab === 'volunteers' && 'Youth Volunteer Taskforce'}
                  {activeTab === 'blogs' && 'News & Editorial Dispatches'}
                  {activeTab === 'donations' && 'Philanthropic Treasury & UTR Audit'}
                  {activeTab === 'grievances' && 'Ombudsman Citizen Grievance Desk'}
                  {activeTab === 'chatbot' && 'AI Helpdesk Knowledge Base'}
                  {activeTab === 'events' && 'Conventions & Event Calendars'}
                  {activeTab === 'programs' && 'Flagship Programs Directory'}
                  {activeTab === 'membership' && 'Membership & Citizen Credentials'}
                  {activeTab === 'contact' && 'Public Inquiries & Messages'}
                  {activeTab === 'website-content' && 'Website Content & Copy Management'}
                  {activeTab === 'volunteer-assignments' && 'Volunteer Assignments & Permissions Matrix'}
                  {activeTab === 'volunteer-reports' && 'Volunteer Field Activity Reports & Evidence Proofs'}
                  {activeTab === 'notifications' && 'System Broadcast Dispatcher'}
                  {activeTab === 'profile' && 'Administrator Security & Profile'}
                </h1>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isSyncing}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Refresh Live Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-teal-800' : ''}`} />
                <span className="hidden sm:inline">Refresh Data</span>
              </button>

              <Link
                to="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Public Site</span>
              </Link>

              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-teal-800 text-white font-bold text-[10px] flex items-center justify-center">
                  {user?.fullName ? user.fullName.charAt(0) : 'A'}
                </div>
                <span className="text-xs font-extrabold text-teal-950 hidden md:inline">
                  Admin Profile
                </span>
              </button>
            </div>
          </header>

          {/* Viewport Content */}
          <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8 flex-1">

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <AdminOverviewTab
                programs={programs}
                events={events}
                contactMessages={contactMessages}
                complaints={complaints}
                donations={donations}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenAddProgram={() => {
                  setEditingProgram(null);
                  setShowProgramModal(true);
                }}
                onOpenAddEvent={() => {
                  setEditingEvent(null);
                  setShowEventModal(true);
                }}
                onOpenMessageModal={(msg) => setSelectedContactMessage(msg)}
              />
            )}

            {/* TAB 2: USERS MANAGEMENT */}
            {activeTab === 'users' && (
              <AdminUsersTab
                users={users}
                currentUserId={user?.id}
                onUpdateRole={updateUserRole}
                onToggleStatus={toggleUserStatus}
                onDeleteUser={deleteUser}
                onUpdateUser={updateUser}
              />
            )}

            {/* TAB 3: VOLUNTEERS */}
            {activeTab === 'volunteers' && (
              <AdminVolunteersTab
                volunteers={volunteers}
                volunteerPermissions={volunteerPermissions}
                programs={programs}
                events={events}
                complaints={complaints}
                onUpdateStatus={updateVolunteerStatus}
                onUpdatePermissions={updateVolunteerPermissions}
                onLogHours={logVolunteerHours}
                onAssignGrievance={assignGrievance}
                onEditVolunteer={(vol) => setSelectedUserForEdit(vol)}
                onNavigateTab={setActiveTab}
              />
            )}

            {/* TAB 4: CITIZEN GRIEVANCES */}
            {activeTab === 'grievances' && (
              <AdminGrievancesTab
                complaints={complaints}
                volunteers={volunteers}
                onUpdateStatus={updateComplaintStatus}
                onUpdatePriority={updateComplaintPriority}
                onAssignVolunteer={assignGrievance}
                onDeleteComplaint={deleteComplaint}
              />
            )}

            {/* TAB 5: DONATIONS & UTR AUDIT */}
            {activeTab === 'donations' && (
              <AdminDonationsTab
                donations={donations}
                onUpdateStatus={updateDonationStatus}
                onDeleteDonation={deleteDonation}
              />
            )}

            {/* TAB 6: BLOGS & EDITORIAL */}
            {activeTab === 'blogs' && (
              <AdminBlogsTab
                blogs={blogs}
                onCreateBlog={createBlog}
                onUpdateBlog={updateBlog}
                onDeleteBlog={deleteBlog}
                onTogglePublish={toggleBlogPublish}
              />
            )}

            {/* TAB 7: PROGRAMS */}
            {activeTab === 'programs' && (
              <AdminProgramsTab
                programs={programs}
                onCreateProgram={createProgram}
                onUpdateProgram={updateProgram}
                onDeleteProgram={deleteProgram}
              />
            )}

            {/* TAB 8: EVENTS */}
            {activeTab === 'events' && (
              <AdminEventsTab
                events={events}
                onCreateEvent={createEvent}
                onUpdateEvent={updateEvent}
                onDeleteEvent={deleteEvent}
              />
            )}

            {/* TAB 9: CONTACT INQUIRIES */}
            {activeTab === 'contact' && (
              <AdminContactTab
                contactMessages={contactMessages}
                onOpenMessageModal={(msg) => setSelectedContactMessage(msg)}
                onToggleRead={handleToggleReadContact}
                onDeleteMessage={handleDeleteContact}
                onRefresh={handleRefresh}
              />
            )}

            {/* TAB 10: MEMBERSHIP & BECOME A MEMBER */}
            {activeTab === 'membership' && (
              <AdminMembershipsTab
                users={users}
                onCreateUser={createUser}
                onUpdateUser={updateUser}
                onDeleteUser={deleteUser}
              />
            )}

            {/* TAB 11: WEBSITE CONTENT */}
            {activeTab === 'website-content' && (
              <AdminWebsiteContentTab />
            )}

            {/* TAB 12: VOLUNTEER ASSIGNMENTS & PERMISSIONS */}
            {activeTab === 'volunteer-assignments' && (
              <AdminVolunteerAssignmentsTab
                volunteers={volunteers}
                volunteerPermissions={volunteerPermissions}
                programs={programs}
                events={events}
                complaints={complaints}
                onUpdatePermissions={updateVolunteerPermissions}
                onAssignGrievance={assignGrievance}
                onLogHours={logVolunteerHours}
                initialSubTab="roster"
              />
            )}

            {/* TAB 12B: DIRECT VOLUNTEER FIELD REPORTS & EVIDENCE */}
            {activeTab === 'volunteer-reports' && (
              <AdminVolunteerAssignmentsTab
                volunteers={volunteers}
                volunteerPermissions={volunteerPermissions}
                programs={programs}
                events={events}
                complaints={complaints}
                onUpdatePermissions={updateVolunteerPermissions}
                onAssignGrievance={assignGrievance}
                onLogHours={logVolunteerHours}
                initialSubTab="reports"
              />
            )}

            {/* TAB 13: BROADCAST DISPATCH */}
            {activeTab === 'notifications' && (
              <AdminNotificationsTab
                notifications={systemNotifications}
                onBroadcast={async (notif) => {
                  await broadcastNotification({
                    title: notif.title,
                    message: notif.message,
                    type: notif.type === 'alert' || notif.type === 'warning' ? 'complaint' : 'info',
                    actionUrl: notif.actionLink
                  });
                }}
                onDeleteNotification={deleteNotification}
              />
            )}

            {/* TAB 14: CHATBOT KNOWLEDGE BASE */}
            {activeTab === 'chatbot' && (
              <AdminChatbotTab
                faqs={chatbotFaqs}
                onCreateFaq={createChatbotFaq}
                onUpdateFaq={updateChatbotFaq}
                onDeleteFaq={deleteChatbotFaq}
              />
            )}

            {/* TAB 15: PROFILE */}
            {activeTab === 'profile' && (
              <AdminProfileTab
                user={user}
                onLogout={handleLogout}
                onUpdateProfile={async (data) => {
                  await updateProfile(data);
                  if (data.email || data.phone) {
                    await updateWebsiteContent({
                      ...(data.email ? { contactEmail: data.email } : {}),
                      ...(data.phone ? { contactPhone: data.phone, helpDeskPhone: data.phone } : {})
                    });
                  }
                }}
              />
            )}

          </div>
        </main>

      </div>

      {/* ========================================================= */}
      {/* MODALS */}
      {/* ========================================================= */}

      {/* Program Create / Edit Modal (from overview shortcut) */}
      <ProgramModal
        isOpen={showProgramModal}
        onClose={() => {
          setShowProgramModal(false);
          setEditingProgram(null);
        }}
        program={editingProgram}
        onSave={handleSaveProgram}
      />

      {/* Event Create / Edit Modal (from overview shortcut) */}
      <EventModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setEditingEvent(null);
        }}
        event={editingEvent}
        onSave={handleSaveEvent}
      />

      {/* Contact Message Detail Modal */}
      <ContactDetailModal
        isOpen={!!selectedContactMessage}
        onClose={() => setSelectedContactMessage(null)}
        message={selectedContactMessage}
        onToggleRead={handleToggleReadContact}
        onDelete={handleDeleteContact}
      />

      {/* User / Volunteer Edit Modal */}
      <UserEditModal
        isOpen={!!selectedUserForEdit}
        onClose={() => setSelectedUserForEdit(null)}
        user={selectedUserForEdit}
        onSave={updateUser}
        isLastAdmin={selectedUserForEdit?.role === 'admin' && adminCount <= 1}
      />

    </div>
  );
};
