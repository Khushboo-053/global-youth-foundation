import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  GrievanceRecord, 
  MembershipRecord, 
  UserAccount, 
  NotificationItem, 
  ComplaintStatus 
} from '../types';
import { INITIAL_COMPLAINTS } from '../data/mockData';

interface AppContextType {
  user: UserAccount | null;
  complaints: GrievanceRecord[];
  memberships: MembershipRecord[];
  notifications: NotificationItem[];
  submitGrievance: (data: {
    category: string;
    subject: string;
    description: string;
    location: string;
    isAnonymous: boolean;
    complainantEmail?: string;
    complainantPhone?: string;
    attachmentName?: string;
  }) => GrievanceRecord;
  getComplaintById: (id: string) => GrievanceRecord | undefined;
  submitMembership: (data: Omit<MembershipRecord, 'applicationId' | 'appliedAt' | 'status'>) => MembershipRecord;
  login: (email: string, fullName?: string) => void;
  signup: (userData: { fullName: string; email: string; phone: string }) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserAccount>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const STORAGE_KEYS = {
  COMPLAINTS: 'gyf_complaints_v1',
  MEMBERSHIPS: 'gyf_memberships_v1',
  USER: 'gyf_user_session_v1',
  NOTIFICATIONS: 'gyf_notifications_v1',
};

const DEFAULT_USER: UserAccount = {
  id: 'usr-gyf-001',
  fullName: 'Tariq Manzoor',
  email: 'tariq.youth@example.com',
  phone: '9103599292',
  joinedDate: 'January 2025',
  membershipStatus: 'Member',
  membershipId: 'GYF-MEM-2025-084',
  city: 'Srinagar',
  country: 'India',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<GrievanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
      return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
    } catch {
      return INITIAL_COMPLAINTS;
    }
  });

  const [memberships, setMemberships] = useState<MembershipRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMBERSHIPS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
    } catch (e) {
      console.error('Failed to save complaints', e);
    }
  }, [complaints]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(memberships));
    } catch (e) {
      console.error('Failed to save memberships', e);
    }
  }, [memberships]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.error('Failed to save user', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to save notifications', e);
    }
  }, [notifications]);

  const submitGrievance = (data: {
    category: string;
    subject: string;
    description: string;
    location: string;
    isAnonymous: boolean;
    complainantEmail?: string;
    complainantPhone?: string;
    attachmentName?: string;
  }): GrievanceRecord => {
    // Generate unique Complaint ID like GYF-2026-847291
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const generatedId = `GYF-2026-${randomDigits}`;
    
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' • ' + now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newComplaint: GrievanceRecord = {
      id: generatedId,
      category: data.category,
      subject: data.subject,
      description: data.description,
      location: data.location,
      isAnonymous: data.isAnonymous,
      complainantEmail: data.isAnonymous ? undefined : (data.complainantEmail || user?.email),
      complainantPhone: data.isAnonymous ? undefined : (data.complainantPhone || user?.phone),
      attachmentName: data.attachmentName,
      submittedAt: formattedDate,
      currentStatus: 'Submitted' as ComplaintStatus,
      priority: 'Medium',
      assignedDepartment: 'Intake & Verification Desk',
      timeline: [
        {
          status: 'Submitted',
          date: formattedDate,
          description: 'Grievance submitted securely and logged in GYF Registry.',
          updatedBy: 'Automated Registry'
        },
        {
          status: 'Under Review',
          date: 'Scheduled for Initial Review',
          description: 'Case docket will be assigned to a dedicated officer within 24 hours.',
          updatedBy: 'Pending Assignment'
        }
      ]
    };

    setComplaints(prev => [newComplaint, ...prev]);

    // Push notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Grievance Submitted: ${generatedId}`,
      message: `Your grievance '${data.subject.slice(0, 35)}...' has been registered with ID ${generatedId}.`,
      date: 'Just now',
      isRead: false,
      type: 'complaint',
      actionUrl: `/track-complaint?id=${generatedId}`
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newComplaint;
  };

  const getComplaintById = (id: string): GrievanceRecord | undefined => {
    const cleanId = id.trim().toUpperCase();
    return complaints.find(c => c.id.toUpperCase() === cleanId);
  };

  const submitMembership = (data: Omit<MembershipRecord, 'applicationId' | 'appliedAt' | 'status'>): MembershipRecord => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const appId = `GYF-APP-2026-${randomDigits}`;
    
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const newApp: MembershipRecord = {
      ...data,
      applicationId: appId,
      appliedAt: formattedDate,
      status: 'Pending Review'
    };

    setMemberships(prev => [newApp, ...prev]);

    // Push notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Membership Application Submitted',
      message: `Thank you, ${data.fullName}! Your application ID is ${appId}. Our membership team will get in touch soon.`,
      date: 'Just now',
      isRead: false,
      type: 'membership'
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newApp;
  };

  const login = (email: string, fullName?: string) => {
    const loggedInUser: UserAccount = {
      id: `usr-${Date.now().toString(36)}`,
      fullName: fullName || (email.split('@')[0].replace('.', ' ').toUpperCase()),
      email: email,
      phone: '9103599292',
      joinedDate: 'February 2026',
      membershipStatus: 'Member',
      membershipId: `GYF-MEM-2026-${Math.floor(100 + Math.random() * 900)}`,
      city: 'Srinagar',
      country: 'India',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };
    setUser(loggedInUser);
  };

  const signup = (userData: { fullName: string; email: string; phone: string }) => {
    const newUser: UserAccount = {
      id: `usr-${Date.now().toString(36)}`,
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      joinedDate: 'February 2026',
      membershipStatus: 'Member',
      membershipId: `GYF-MEM-2026-${Math.floor(100 + Math.random() * 900)}`,
      city: 'Srinagar',
      country: 'India',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<UserAccount>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        complaints,
        memberships,
        notifications,
        submitGrievance,
        getComplaintById,
        submitMembership,
        login,
        signup,
        logout,
        updateProfile,
        markNotificationRead,
        clearAllNotifications
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
