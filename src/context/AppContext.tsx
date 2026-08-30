import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  UserAccount, 
  UserRole,
  VolunteerPermissions,
  GrievanceRecord, 
  MembershipRecord, 
  NotificationItem, 
  ComplaintStatus,
  LegalAidAppointment,
  NewsItem,
  EventItem,
  Program,
  DonationRecord,
  FAQItem,
  ActivityLog,
  ContactMessage,
  VolunteerProgramAssignment,
  VolunteerEventAssignment,
  VolunteerTaskItem,
  VolunteerNotificationItem,
  VolunteerActivityReport
} from '../types';
import { api, initSeedDataIfEmpty, SEED_USERS } from '../services/api';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface AppContextType {
  user: UserAccount | null;
  users: UserAccount[];
  volunteers: UserAccount[];
  volunteerPermissions: Record<string, VolunteerPermissions>;
  blogs: NewsItem[];
  donations: DonationRecord[];
  complaints: GrievanceRecord[];
  events: EventItem[];
  programs: Program[];
  memberships: MembershipRecord[];
  notifications: NotificationItem[];
  chatbotFaqs: FAQItem[];
  activityLogs: ActivityLog[];
  contactMessages: ContactMessage[];
  registeredEvents: string[];
  legalAidAppointments: LegalAidAppointment[];
  isLoadingData: boolean;

  // Volunteer Scoped State & Methods
  volunteerPrograms: VolunteerProgramAssignment[];
  volunteerEvents: VolunteerEventAssignment[];
  volunteerTasks: VolunteerTaskItem[];
  volunteerNotifications: VolunteerNotificationItem[];
  volunteerActivityReports: VolunteerActivityReport[];
  updateVolunteerProgramProgress: (assignmentId: string, progress: number, newNote?: string) => Promise<void>;
  updateVolunteerEventStatus: (assignmentId: string, status: 'Assigned' | 'In Progress' | 'Completed', isCompleted: boolean, newNote?: string) => Promise<void>;
  updateVolunteerGrievance: (grievanceId: string, status: 'Assigned' | 'In Progress' | 'Resolved', remark: string) => Promise<void>;
  updateVolunteerTask: (taskId: string, status: 'Pending' | 'In Progress' | 'Completed', newNote?: string) => Promise<void>;
  markVolunteerNotificationRead: (notifId: string) => Promise<void>;
  markAllVolunteerNotificationsRead: () => Promise<void>;
  updateVolunteerProfile: (updates: Partial<UserAccount>) => Promise<void>;
  logVolunteerSelfHours: (hours: number, description: string) => Promise<void>;
  submitVolunteerActivityReport: (report: Omit<VolunteerActivityReport, 'id' | 'createdAt' | 'status'>) => Promise<VolunteerActivityReport>;
  reviewVolunteerActivityReport: (reportId: string, feedback: string) => Promise<VolunteerActivityReport>;
  assignProgramToVolunteer: (programId: string, volunteerId: string, assignedRole: string, location?: string) => Promise<VolunteerProgramAssignment>;
  assignEventToVolunteer: (eventId: string, volunteerId: string, assignedRole: string) => Promise<VolunteerEventAssignment>;
  assignTaskToVolunteer: (task: Omit<VolunteerTaskItem, 'id' | 'createdAt' | 'status' | 'progressNotes'>) => Promise<VolunteerTaskItem>;
  refreshVolunteerData: () => Promise<void>;
  
  // Auth
  login: (email: string, password?: string) => Promise<{ success: boolean; user?: UserAccount; error?: string }>;
  loginAsDemo: (roleType: 'admin' | 'volunteer' | 'user' | 'member' | 'officer') => void;
  signup: (userData: { fullName: string; email: string; phone: string; password?: string; role?: UserRole }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<UserAccount>) => Promise<void>;
  
  // Users & Volunteers Management
  updateUser: (userId: string, data: Partial<UserAccount>) => Promise<void>;
  updateUserRole: (userId: string, role: UserRole, roleTitle?: string) => Promise<{ success: boolean; error?: string }>;
  toggleUserStatus: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<{ success: boolean; error?: string }>;
  updateVolunteerPermissions: (volunteerId: string, perms: Partial<VolunteerPermissions>) => Promise<void>;
  updateVolunteerStatus: (volunteerId: string, status: 'Active' | 'Inactive' | 'Approved' | 'Rejected') => Promise<void>;
  logVolunteerHours: (volunteerId: string, hours: number) => Promise<void>;

  // Blogs Management
  createBlog: (blog: Omit<NewsItem, 'id'>) => Promise<NewsItem>;
  updateBlog: (id: string, updates: Partial<NewsItem>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  toggleBlogPublish: (id: string) => Promise<void>;

  // Events Management
  createEvent: (event: Omit<EventItem, 'id'>) => Promise<EventItem>;
  updateEvent: (id: string, updates: Partial<EventItem>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  toggleEventPublish: (id: string) => Promise<void>;
  toggleEventRegistration: (eventId: string) => boolean;

  // Programs Management
  createProgram: (program: Omit<Program, 'id'>) => Promise<Program>;
  updateProgram: (id: string, updates: Partial<Program>) => Promise<void>;
  deleteProgram: (id: string) => Promise<void>;
  toggleProgramPublish: (id: string) => Promise<void>;

  // Contact Messages Management
  submitContactMessage: (data: { name: string; email: string; phone?: string; subject: string; message: string }) => Promise<ContactMessage>;
  toggleReadContactMessage: (id: string, isRead?: boolean) => Promise<void>;
  deleteContactMessage: (id: string) => Promise<void>;

  // Donations Management
  submitDonation: (donation: Omit<DonationRecord, 'id' | 'createdAt'>) => Promise<DonationRecord>;
  updateDonationStatus: (id: string, status: 'Verified' | 'Pending Verification' | 'Failed') => Promise<void>;

  // Grievance System
  submitGrievance: (data: {
    category: string;
    subject: string;
    description: string;
    location: string;
    isAnonymous: boolean;
    complainantEmail?: string;
    complainantPhone?: string;
    attachmentName?: string;
    priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  }) => Promise<GrievanceRecord>;
  getComplaintById: (id: string) => GrievanceRecord | undefined;
  updateComplaintStatus: (id: string, newStatus: ComplaintStatus, officerNote?: string) => Promise<void>;
  assignGrievance: (id: string, volunteerId: string, volunteerName: string, department?: string) => Promise<void>;
  deleteComplaint: (id: string) => Promise<void>;

  // Membership
  submitMembership: (data: Omit<MembershipRecord, 'applicationId' | 'appliedAt' | 'status'>) => Promise<MembershipRecord>;
  updateMembershipStatus: (applicationId: string, status: 'Pending Review' | 'Approved' | 'Active Member' | 'Rejected') => Promise<void>;
  deleteMembership: (applicationId: string) => Promise<void>;

  // Chatbot
  createChatbotFaq: (faq: Omit<FAQItem, 'id'>) => Promise<FAQItem>;
  updateChatbotFaq: (id: string, updates: Partial<FAQItem>) => Promise<void>;
  deleteChatbotFaq: (id: string) => Promise<void>;
  logChatbotQuery: (query: string, response: string) => Promise<void>;

  // Notifications
  broadcastNotification: (notif: { title: string; message: string; type: 'info' | 'complaint' | 'membership' | 'event'; actionUrl?: string }) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;

  // Other utilities
  bookLegalAidAppointment: (data: Omit<LegalAidAppointment, 'id' | 'status' | 'createdAt'>) => LegalAidAppointment;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  refreshAllData: () => Promise<void>;
}

const STORAGE_KEYS = {
  USER_SESSION: 'gyf_auth_session_v2',
  NOTIFICATIONS: 'gyf_notifications_v2',
  REGISTERED_EVENTS: 'gyf_registered_events_v2',
  LEGAL_APPOINTMENTS: 'gyf_legal_appointments_v2',
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Welcome to Global Youth Foundation Portal',
    message: 'Explore our programs, submit community grievances securely, and participate in upcoming workshops.',
    date: 'Just now',
    isRead: false,
    type: 'info'
  },
  {
    id: 'notif-2',
    title: 'Grievance Docket GYF-2026-847291 Resolved',
    message: 'The scholarship delay appeal has been successfully resolved by the Ombudsman Desk.',
    date: '2 hours ago',
    isRead: false,
    type: 'complaint',
    actionUrl: '/track-complaint'
  },
  {
    id: 'notif-3',
    title: 'Upcoming: Youth Leadership Workshop 2026',
    message: 'Seats are filling quickly for the March 18 workshop in Srinagar.',
    date: '1 day ago',
    isRead: true,
    type: 'event',
    actionUrl: '/events'
  }
];

const INITIAL_APPOINTMENTS: LegalAidAppointment[] = [
  {
    id: 'APT-2026-104',
    serviceType: 'Free Paralegal Consultation & Legal Aid',
    preferredDate: '2026-03-12',
    preferredTime: '11:30 AM',
    location: 'Baramulla Grievance Cell & Help Desk',
    citizenName: 'Tariq Manzoor',
    phone: '+91 91035 99292',
    summary: 'Guidance regarding RTI appeal for local municipal development fund utilization.',
    status: 'Confirmed',
    createdAt: '2026-02-27'
  }
];

export const DEMO_USERS = SEED_USERS;

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize storage seed data
  useEffect(() => {
    initSeedDataIfEmpty();
  }, []);

  // Primary states
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState<UserAccount[]>([]);
  const [volunteers, setVolunteers] = useState<UserAccount[]>([]);
  const [volunteerPermissions, setVolunteerPermissions] = useState<Record<string, VolunteerPermissions>>({});
  const [blogs, setBlogs] = useState<NewsItem[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [complaints, setComplaints] = useState<GrievanceRecord[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [memberships, setMemberships] = useState<MembershipRecord[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [chatbotFaqs, setChatbotFaqs] = useState<FAQItem[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Volunteer scoped state
  const [volunteerPrograms, setVolunteerPrograms] = useState<VolunteerProgramAssignment[]>([]);
  const [volunteerEvents, setVolunteerEvents] = useState<VolunteerEventAssignment[]>([]);
  const [volunteerTasks, setVolunteerTasks] = useState<VolunteerTaskItem[]>([]);
  const [volunteerNotifications, setVolunteerNotifications] = useState<VolunteerNotificationItem[]>([]);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [registeredEvents, setRegisteredEvents] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REGISTERED_EVENTS);
      return saved ? JSON.parse(saved) : ['event-1'];
    } catch {
      return ['event-1'];
    }
  });

  const [legalAidAppointments, setLegalAidAppointments] = useState<LegalAidAppointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEGAL_APPOINTMENTS);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  // Sync state to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REGISTERED_EVENTS, JSON.stringify(registeredEvents));
  }, [registeredEvents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEGAL_APPOINTMENTS, JSON.stringify(legalAidAppointments));
  }, [legalAidAppointments]);

  // Load all backend entities
  const refreshAllData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [
        fetchedUsers, 
        fetchedBlogs, 
        fetchedDonations, 
        fetchedComplaints, 
        fetchedEvents, 
        fetchedPrograms, 
        fetchedMemberships,
        fetchedFaqs,
        fetchedLogs,
        fetchedContactMessages,
        fetchedNotifs
      ] = await Promise.all([
        api.users.getAll(),
        api.blogs.getAll(),
        api.donations.getAll(),
        api.grievances.getAll(),
        api.events.getAll(),
        api.programs.getAll(),
        api.memberships.getAll(),
        api.chatbot.getFaqs(),
        api.activity.getLogs(),
        api.contact.getAll(),
        api.notifications.getAll()
      ]);

      setUsers(fetchedUsers);
      const vols = fetchedUsers.filter(u => u.role === 'volunteer' || u.membershipStatus === 'Volunteer');
      setVolunteers(vols);

      // Load permissions for each volunteer
      const permsMap: Record<string, VolunteerPermissions> = {};
      for (const v of vols) {
        permsMap[v.id] = await api.volunteers.getPermissions(v.id);
      }
      setVolunteerPermissions(permsMap);

      setBlogs(fetchedBlogs);
      setDonations(fetchedDonations);
      setComplaints(fetchedComplaints);
      setEvents(fetchedEvents);
      setPrograms(fetchedPrograms);
      setMemberships(fetchedMemberships);
      setChatbotFaqs(fetchedFaqs);
      setActivityLogs(fetchedLogs);
      setContactMessages(fetchedContactMessages);
      if (fetchedNotifs && fetchedNotifs.length > 0) {
        setNotifications(fetchedNotifs);
      }

      // Update current user state if updated in backend
      if (user) {
        const found = fetchedUsers.find(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
        if (found) {
          setUser(found);
        }
      }
    } catch (err) {
      console.error('Error refreshing backend data:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Supabase Auth listener if connected
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const allUsers = await api.users.getAll();
          const matched = allUsers.find(u => u.id === session.user.id || u.email.toLowerCase() === session.user.email?.toLowerCase());
          if (matched) {
            setUser(matched);
          }
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  // --------------------------------------------------------------------------
  // AUTH METHODS
  // --------------------------------------------------------------------------
  const login = async (email: string, password?: string): Promise<{ success: boolean; user?: UserAccount; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Supabase Auth if configured
    if (isSupabaseConfigured && supabase && password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!error && data.user) {
        const allUsers = await api.users.getAll();
        let current = allUsers.find(u => u.id === data.user.id || u.email.toLowerCase() === cleanEmail);
        if (!current) {
          current = {
            id: data.user.id,
            fullName: data.user.user_metadata?.full_name || 'Member',
            email: cleanEmail,
            phone: '',
            joinedDate: 'Recent',
            membershipStatus: (data.user.user_metadata?.role === 'admin' ? 'Admin' : data.user.user_metadata?.role === 'volunteer' ? 'Volunteer' : 'Member'),
            role: (data.user.user_metadata?.role || 'user') as UserRole,
            isActive: true
          };
        }
        setUser(current);
        await api.activity.log(current.id, current.fullName, 'User Sign In', 'Authentication', `${current.fullName} logged into portal.`);
        return { success: true, user: current };
      }
    }

    // 2. Direct user matching from database/seed users
    const allUsers = await api.users.getAll();
    const matched = allUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (matched) {
      if (!matched.isActive) {
        return { success: false, error: 'This account has been deactivated by administrator.' };
      }
      setUser(matched);
      await api.activity.log(matched.id, matched.fullName, 'User Sign In', 'Authentication', `${matched.fullName} logged in with role ${matched.role}.`);
      return { success: true, user: matched };
    }

    // Fallback automatic demo account provisioning for exploration
    const newDemoUser: UserAccount = {
      id: `usr-${Date.now()}`,
      fullName: cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email: cleanEmail,
      phone: '+91 91035 00000',
      joinedDate: 'March 2026',
      membershipStatus: 'Member',
      membershipId: `GYF-MEM-2026-${Math.floor(100 + Math.random() * 900)}`,
      role: cleanEmail.includes('admin') ? 'admin' : cleanEmail.includes('vol') ? 'volunteer' : 'user',
      roleTitle: cleanEmail.includes('admin') ? 'Administrator' : cleanEmail.includes('vol') ? 'Youth Volunteer' : 'Member',
      city: 'Srinagar',
      country: 'India',
      isActive: true
    };

    setUser(newDemoUser);
    return { success: true, user: newDemoUser };
  };

  const loginAsDemo = (roleType: 'admin' | 'volunteer' | 'user' | 'member' | 'officer') => {
    let demoAcc: UserAccount;
    if (roleType === 'admin') {
      demoAcc = SEED_USERS[0];
    } else if (roleType === 'volunteer' || roleType === 'officer') {
      demoAcc = SEED_USERS[1];
    } else {
      demoAcc = SEED_USERS[2];
    }
    setUser(demoAcc);
    api.activity.log(demoAcc.id, demoAcc.fullName, 'Demo Switch', 'Authentication', `Switched to demo role: ${roleType}`);
  };

  const signup = async (userData: { fullName: string; email: string; phone: string; password?: string; role?: UserRole }): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = userData.email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase && userData.password) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName.trim(),
            role: userData.role || 'user'
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      fullName: userData.fullName.trim(),
      email: cleanEmail,
      phone: userData.phone.trim(),
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      membershipStatus: userData.role === 'admin' ? 'Admin' : userData.role === 'volunteer' ? 'Volunteer' : 'Member',
      membershipId: `GYF-MEM-2026-${Math.floor(100 + Math.random() * 900)}`,
      city: 'Srinagar',
      country: 'India',
      role: userData.role || 'user',
      roleTitle: userData.role === 'admin' ? 'Administrator' : userData.role === 'volunteer' ? 'Youth Volunteer' : 'Member',
      isActive: true,
      volunteerHours: 0
    };

    const currentUsers = await api.users.getAll();
    const existing = currentUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!existing) {
      await api.users.update(newUser.id, newUser);
    }

    setUser(newUser);
    await refreshAllData();
    return { success: true };
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
    setUser(null);
  };

  const updateProfile = async (data: Partial<UserAccount>) => {
    if (!user) return;
    const updated = await api.users.update(user.id, data);
    if (updated) {
      setUser(updated);
      await refreshAllData();
    }
  };

  // --------------------------------------------------------------------------
  // USER & VOLUNTEER MANAGEMENT
  // --------------------------------------------------------------------------
  const updateUser = async (userId: string, data: Partial<UserAccount>) => {
    await api.users.update(userId, data);
    await api.activity.log(user?.id || 'admin', user?.fullName || 'Admin', 'Updated User Info', 'User Management', `Updated profile data for user ${userId}`);
    await refreshAllData();
  };

  const updateUserRole = async (userId: string, role: UserRole, roleTitle?: string): Promise<{ success: boolean; error?: string }> => {
    const target = users.find(u => u.id === userId);
    if (target && target.role === 'admin' && role !== 'admin') {
      const adminCount = users.filter(u => u.role === 'admin').length;
      if (adminCount <= 1) {
        return {
          success: false,
          error: 'Safety Guard: You cannot remove the last remaining Administrator from the system.'
        };
      }
    }

    await api.users.updateRole(userId, role, roleTitle);
    await api.activity.log(user?.id || 'admin', user?.fullName || 'Admin', 'Updated User Role', 'User Management', `Changed user role to ${role}`);
    await refreshAllData();
    return { success: true };
  };

  const toggleUserStatus = async (userId: string) => {
    await api.users.toggleStatus(userId);
    await refreshAllData();
  };

  const deleteUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
    if (user?.id === userId) {
      return {
        success: false,
        error: 'Action Forbidden: You cannot delete your own active admin account.'
      };
    }

    const target = users.find(u => u.id === userId);
    if (target && target.role === 'admin') {
      const adminCount = users.filter(u => u.role === 'admin').length;
      if (adminCount <= 1) {
        return {
          success: false,
          error: 'Safety Guard: You cannot delete the last remaining Administrator from the system.'
        };
      }
    }

    await api.users.delete(userId);
    await api.activity.log(user?.id || 'admin', user?.fullName || 'Admin', 'Deleted User Account', 'User Management', `Deleted user account ${userId}`);
    await refreshAllData();
    return { success: true };
  };

  const updateVolunteerPermissions = async (volunteerId: string, perms: Partial<VolunteerPermissions>) => {
    await api.volunteers.updatePermissions(volunteerId, perms);
    await api.activity.log(user?.id || 'admin', user?.fullName || 'Admin', 'Updated Volunteer Permissions', 'Volunteer Management', `Permissions updated for volunteer ${volunteerId}`);
    await refreshAllData();
  };

  const updateVolunteerStatus = async (volunteerId: string, status: 'Active' | 'Inactive' | 'Approved' | 'Rejected') => {
    const isApproved = status === 'Approved' || status === 'Active';
    await api.users.update(volunteerId, {
      membershipStatus: isApproved ? 'Volunteer' : 'Applicant',
      isActive: status !== 'Inactive' && status !== 'Rejected'
    });
    await api.activity.log(user?.id || 'admin', user?.fullName || 'Admin', 'Updated Volunteer Status', 'Volunteer Desk', `Volunteer status set to ${status} for ${volunteerId}`);
    await refreshAllData();
  };

  const logVolunteerHours = async (volunteerId: string, hours: number) => {
    await api.volunteers.logHours(volunteerId, hours);
    await refreshAllData();
  };

  // --------------------------------------------------------------------------
  // BLOGS CRUD
  // --------------------------------------------------------------------------
  const createBlog = async (blog: Omit<NewsItem, 'id'>): Promise<NewsItem> => {
    const res = await api.blogs.create(blog);
    await api.activity.log(user?.id || 'admin', user?.fullName || 'Admin', 'Created Blog Article', 'Blogs & News', `Created blog: ${blog.title}`);
    await refreshAllData();
    return res;
  };

  const updateBlog = async (id: string, updates: Partial<NewsItem>) => {
    await api.blogs.update(id, updates);
    await api.activity.log(user?.id || 'admin', user?.fullName || 'Admin', 'Updated Blog Article', 'Blogs & News', `Updated blog ID: ${id}`);
    await refreshAllData();
  };

  const deleteBlog = async (id: string) => {
    await api.blogs.delete(id);
    await api.activity.log(user?.id || 'admin', user?.fullName || 'Admin', 'Deleted Blog Article', 'Blogs & News', `Deleted blog ID: ${id}`);
    await refreshAllData();
  };

  const toggleBlogPublish = async (id: string) => {
    await api.blogs.togglePublish(id);
    await refreshAllData();
  };

  // --------------------------------------------------------------------------
  // EVENTS CRUD
  // --------------------------------------------------------------------------
  const createEvent = async (event: Omit<EventItem, 'id'>): Promise<EventItem> => {
    const res = await api.events.create(event);
    await api.activity.log(user?.id || 'admin', user?.fullName || 'Admin', 'Created Event', 'Events Management', `Created event: ${event.title}`);
    await refreshAllData();
    return res;
  };

  const updateEvent = async (id: string, updates: Partial<EventItem>) => {
    await api.events.update(id, updates);
    await api.activity.log(user?.id || 'admin', user?.fullName || 'Admin', 'Updated Event', 'Events Management', `Updated event ID: ${id}`);
    await refreshAllData();
  };

  const deleteEvent = async (id: string) => {
    await api.events.delete(id);
    await api.activity.log(user?.id || 'admin', user?.fullName || 'Admin', 'Deleted Event', 'Events Management', `Deleted event ID: ${id}`);
    await refreshAllData();
  };

  const toggleEventPublish = async (id: string) => {
    await api.events.togglePublish(id);
    await refreshAllData();
  };

  const toggleEventRegistration = (eventId: string): boolean => {
    let nextRegistered: string[];
    let isNowRegistered = false;

    if (registeredEvents.includes(eventId)) {
      nextRegistered = registeredEvents.filter(id => id !== eventId);
      isNowRegistered = false;
    } else {
      nextRegistered = [...registeredEvents, eventId];
      isNowRegistered = true;
      const targetEvent = events.find(e => e.id === eventId);
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Event Seat Confirmed',
        message: `You are confirmed for ${targetEvent?.title || 'the workshop'}. Access pass added to your dashboard.`,
        date: 'Just now',
        isRead: false,
        type: 'event',
        actionUrl: '/dashboard?tab=events'
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
    setRegisteredEvents(nextRegistered);
    return isNowRegistered;
  };

  // --------------------------------------------------------------------------
  // PROGRAMS CRUD
  // --------------------------------------------------------------------------
  const createProgram = async (program: Omit<Program, 'id'>): Promise<Program> => {
    const res = await api.programs.create(program);
    await api.activity.log(user?.id || 'admin', user?.fullName || 'Admin', 'Created Program', 'Programs Management', `Created program: ${program.title}`);
    await refreshAllData();
    return res;
  };

  const updateProgram = async (id: string, updates: Partial<Program>) => {
    await api.programs.update(id, updates);
    await api.activity.log(user?.id || 'admin', user?.fullName || 'Admin', 'Updated Program', 'Programs Management', `Updated program ID: ${id}`);
    await refreshAllData();
  };

  const deleteProgram = async (id: string) => {
    await api.programs.delete(id);
    await api.activity.log(user?.id || 'admin', user?.fullName || 'Admin', 'Deleted Program', 'Programs Management', `Deleted program ID: ${id}`);
    await refreshAllData();
  };

  const toggleProgramPublish = async (id: string) => {
    await api.programs.togglePublish(id);
    await refreshAllData();
  };

  // --------------------------------------------------------------------------
  // CONTACT MESSAGES
  // --------------------------------------------------------------------------
  const submitContactMessage = async (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<ContactMessage> => {
    const res = await api.contact.create(data);
    await api.activity.log('visitor', data.name, 'Submitted Contact Message', 'Contact Desk', `Subject: ${data.subject}`);
    await refreshAllData();
    return res;
  };

  const toggleReadContactMessage = async (id: string, isRead?: boolean) => {
    await api.contact.toggleRead(id, isRead);
    await refreshAllData();
  };

  const deleteContactMessage = async (id: string) => {
    await api.contact.delete(id);
    await api.activity.log(user?.id || 'admin', user?.fullName || 'Admin', 'Deleted Contact Message', 'Contact Desk', `Deleted message ID: ${id}`);
    await refreshAllData();
  };

  // --------------------------------------------------------------------------
  // DONATIONS
  // --------------------------------------------------------------------------
  const submitDonation = async (donation: Omit<DonationRecord, 'id' | 'createdAt'>): Promise<DonationRecord> => {
    const res = await api.donations.create(donation);
    await api.activity.log('donor', donation.donorName, 'Submitted Donation Reference', 'Donations', `Donation UTR submitted: ${donation.transactionId} for ₹${donation.amount}`);
    
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Donation Acknowledgement Received',
      message: `Your contribution of ₹${donation.amount} (Ref: ${donation.transactionId}) is logged for official auditing.`,
      date: 'Just now',
      isRead: false,
      type: 'info'
    };
    setNotifications(prev => [newNotif, ...prev]);
    await refreshAllData();
    return res;
  };

  const updateDonationStatus = async (id: string, status: 'Verified' | 'Pending Verification' | 'Failed') => {
    await api.donations.updateStatus(id, status);
    await api.activity.log(user?.id || 'admin', user?.fullName || 'Admin', 'Updated Donation Status', 'Donations', `Donation ${id} set to ${status}`);
    await refreshAllData();
  };

  // --------------------------------------------------------------------------
  // GRIEVANCES
  // --------------------------------------------------------------------------
  const submitGrievance = async (data: {
    category: string;
    subject: string;
    description: string;
    location: string;
    isAnonymous: boolean;
    complainantEmail?: string;
    complainantPhone?: string;
    attachmentName?: string;
    priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  }): Promise<GrievanceRecord> => {
    const record = await api.grievances.create(data);
    await api.activity.log('citizen', data.isAnonymous ? 'Anonymous Citizen' : (data.complainantEmail || 'Citizen'), 'Submitted Grievance', 'Grievance System', `Docket ${record.id} registered: ${data.subject}`);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Grievance Docket Registered: ${record.id}`,
      message: `Your docket "${record.subject.slice(0, 45)}..." has been assigned for ombudsman review.`,
      date: 'Just now',
      isRead: false,
      type: 'complaint',
      actionUrl: '/track-complaint'
    };
    setNotifications(prev => [newNotif, ...prev]);
    await refreshAllData();
    return record;
  };

  const getComplaintById = (id: string): GrievanceRecord | undefined => {
    return complaints.find(c => c.id.toLowerCase() === id.trim().toLowerCase());
  };

  const updateComplaintStatus = async (id: string, newStatus: ComplaintStatus, officerNote?: string) => {
    await api.grievances.updateStatus(id, newStatus, officerNote, user?.fullName);
    await api.activity.log(user?.id || 'staff', user?.fullName || 'Staff', 'Updated Grievance Status', 'Grievance System', `Docket ${id} updated to ${newStatus}`);
    await refreshAllData();
  };

  const assignGrievance = async (id: string, volunteerId: string, volunteerName: string, department?: string) => {
    await api.grievances.assignVolunteer(id, volunteerId, volunteerName, department);
    await api.activity.log(user?.id || 'admin', user?.fullName || 'Admin', 'Assigned Grievance', 'Grievance System', `Docket ${id} assigned to ${volunteerName}`);
    await refreshAllData();
  };

  const deleteComplaint = async (id: string) => {
    await api.grievances.delete(id);
    await refreshAllData();
  };

  // --------------------------------------------------------------------------
  // MEMBERSHIP APPLICATIONS
  // --------------------------------------------------------------------------
  const submitMembership = async (data: Omit<MembershipRecord, 'applicationId' | 'appliedAt' | 'status'>): Promise<MembershipRecord> => {
    const record = await api.memberships.create(data);
    await api.activity.log('applicant', data.fullName, 'Submitted Membership Application', 'Membership', `Application ID: ${record.applicationId}`);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Membership Application Submitted',
      message: `Application ${record.applicationId} is queued for credentials verification.`,
      date: 'Just now',
      isRead: false,
      type: 'membership'
    };
    setNotifications(prev => [newNotif, ...prev]);
    await refreshAllData();
    return record;
  };

  const updateMembershipStatus = async (applicationId: string, status: 'Pending Review' | 'Approved' | 'Active Member' | 'Rejected') => {
    await api.memberships.updateStatus(applicationId, status);
    await api.activity.log(user?.id || 'admin', user?.fullName || 'Admin', 'Updated Membership Status', 'Membership', `Application ${applicationId} marked as ${status}`);
    await refreshAllData();
  };

  const deleteMembership = async (applicationId: string) => {
    await api.memberships.delete(applicationId);
    await refreshAllData();
  };

  // --------------------------------------------------------------------------
  // CHATBOT FAQS
  // --------------------------------------------------------------------------
  const createChatbotFaq = async (faq: Omit<FAQItem, 'id'>): Promise<FAQItem> => {
    const res = await api.chatbot.createFaq(faq);
    await api.activity.log(user?.id || 'admin', user?.fullName || 'Admin', 'Created Chatbot FAQ', 'Chatbot Panel', `Added FAQ: ${faq.question}`);
    await refreshAllData();
    return res;
  };

  const updateChatbotFaq = async (id: string, updates: Partial<FAQItem>) => {
    await api.chatbot.updateFaq(id, updates);
    await api.activity.log(user?.id || 'admin', user?.fullName || 'Admin', 'Updated Chatbot FAQ', 'Chatbot Panel', `Updated FAQ ID: ${id}`);
    await refreshAllData();
  };

  const deleteChatbotFaq = async (id: string) => {
    await api.chatbot.deleteFaq(id);
    await refreshAllData();
  };

  const logChatbotQuery = async (query: string, response: string) => {
    await api.chatbot.logQuery(query, response, user?.email);
  };

  // --------------------------------------------------------------------------
  // OTHER UTILITIES
  // --------------------------------------------------------------------------
  const bookLegalAidAppointment = (data: Omit<LegalAidAppointment, 'id' | 'status' | 'createdAt'>): LegalAidAppointment => {
    const randomThree = Math.floor(100 + Math.random() * 900);
    const newAppointment: LegalAidAppointment = {
      ...data,
      id: `APT-2026-${randomThree}`,
      status: 'Pending Review',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLegalAidAppointments(prev => [newAppointment, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Legal Aid Appointment Booked',
      message: `Appointment request ${newAppointment.id} registered for ${newAppointment.preferredDate}.`,
      date: 'Just now',
      isRead: false,
      type: 'info',
      actionUrl: '/dashboard?tab=legalaid'
    };
    setNotifications(prev => [newNotif, ...prev]);
    return newAppointment;
  };

  const broadcastNotification = async (notif: {
    title: string;
    message: string;
    type: 'info' | 'complaint' | 'membership' | 'event';
    actionUrl?: string;
  }) => {
    await api.notifications.broadcast(notif);
    await api.activity.log(user?.id || 'admin', user?.fullName || 'Admin', 'Broadcast Announcement', 'Notifications', `Broadcast: ${notif.title}`);
    await refreshAllData();
  };

  const deleteNotification = async (id: string) => {
    await api.notifications.delete(id);
    await refreshAllData();
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // --------------------------------------------------------------------------
  // VOLUNTEER ACTIONS & SCOPED STATE ENGINE
  // --------------------------------------------------------------------------
  const refreshVolunteerData = useCallback(async () => {
    if (!user || (user.role !== 'volunteer' && user.membershipStatus !== 'Volunteer')) {
      setVolunteerPrograms([]);
      setVolunteerEvents([]);
      setVolunteerTasks([]);
      setVolunteerNotifications([]);
      return;
    }
    try {
      const [progs, evts, tsks, notifs] = await Promise.all([
        api.volunteerData.getPrograms(user.id),
        api.volunteerData.getEvents(user.id),
        api.volunteerData.getTasks(user.id),
        api.volunteerData.getNotifications(user.id)
      ]);
      setVolunteerPrograms(progs);
      setVolunteerEvents(evts);
      setVolunteerTasks(tsks);
      setVolunteerNotifications(notifs);
    } catch (err) {
      console.error('Error fetching volunteer data:', err);
    }
  }, [user?.id, user?.role, user?.membershipStatus]);

  useEffect(() => {
    if (user && (user.role === 'volunteer' || user.membershipStatus === 'Volunteer')) {
      refreshVolunteerData();
    }
  }, [user, refreshVolunteerData]);

  const updateVolunteerProgramProgress = async (assignmentId: string, progress: number, newNote?: string) => {
    if (!user) return;
    await api.volunteerData.updateProgramProgress(assignmentId, user.id, progress, newNote, user.fullName);
    await refreshVolunteerData();
  };

  const updateVolunteerEventStatus = async (
    assignmentId: string, 
    status: 'Assigned' | 'In Progress' | 'Completed', 
    isCompleted: boolean, 
    newNote?: string
  ) => {
    if (!user) return;
    await api.volunteerData.updateEventStatus(assignmentId, user.id, status, isCompleted, newNote, user.fullName);
    await refreshVolunteerData();
  };

  const updateVolunteerGrievance = async (
    grievanceId: string, 
    status: 'Assigned' | 'In Progress' | 'Resolved', 
    remark: string
  ) => {
    if (!user) return;
    await api.volunteerData.updateGrievanceStatus(grievanceId, user.id, status, remark, user.fullName);
    await refreshAllData();
  };

  const updateVolunteerTask = async (
    taskId: string, 
    status: 'Pending' | 'In Progress' | 'Completed', 
    newNote?: string
  ) => {
    if (!user) return;
    await api.volunteerData.updateTaskStatus(taskId, user.id, status, newNote);
    await refreshVolunteerData();
  };

  const markVolunteerNotificationRead = async (notifId: string) => {
    if (!user) return;
    await api.volunteerData.markNotificationRead(notifId, user.id);
    setVolunteerNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
  };

  const markAllVolunteerNotificationsRead = async () => {
    if (!user) return;
    await api.volunteerData.markAllNotificationsRead(user.id);
    setVolunteerNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const updateVolunteerProfile = async (updates: Partial<UserAccount>) => {
    if (!user) return;
    const updated = await api.volunteerData.updateProfile(user.id, updates);
    if (updated) {
      setUser(updated);
      setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
    }
  };

  const logVolunteerSelfHours = async (hours: number, description: string) => {
    if (!user) return;
    const newTotal = await api.volunteerData.logVolunteerHours(user.id, hours, description);
    setUser(prev => prev ? { ...prev, volunteerHours: newTotal } : prev);
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, volunteerHours: newTotal } : u));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        users,
        volunteers,
        volunteerPermissions,
        blogs,
        donations,
        complaints,
        events,
        programs,
        memberships,
        notifications,
        chatbotFaqs,
        activityLogs,
        contactMessages,
        registeredEvents,
        legalAidAppointments,
        isLoadingData,
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
        login,
        loginAsDemo,
        signup,
        logout,
        updateProfile,
        updateUser,
        updateUserRole,
        toggleUserStatus,
        deleteUser,
        updateVolunteerPermissions,
        updateVolunteerStatus,
        logVolunteerHours,
        createBlog,
        updateBlog,
        deleteBlog,
        toggleBlogPublish,
        createEvent,
        updateEvent,
        deleteEvent,
        toggleEventPublish,
        toggleEventRegistration,
        createProgram,
        updateProgram,
        deleteProgram,
        toggleProgramPublish,
        submitContactMessage,
        toggleReadContactMessage,
        deleteContactMessage,
        submitDonation,
        updateDonationStatus,
        submitGrievance,
        getComplaintById,
        updateComplaintStatus,
        assignGrievance,
        deleteComplaint,
        submitMembership,
        updateMembershipStatus,
        deleteMembership,
        createChatbotFaq,
        updateChatbotFaq,
        deleteChatbotFaq,
        logChatbotQuery,
        bookLegalAidAppointment,
        broadcastNotification,
        deleteNotification,
        markNotificationRead,
        clearAllNotifications,
        refreshAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
