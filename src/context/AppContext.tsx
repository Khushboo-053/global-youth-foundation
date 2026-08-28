import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  GrievanceRecord, 
  MembershipRecord, 
  UserAccount, 
  NotificationItem, 
  ComplaintStatus,
  LegalAidAppointment 
} from '../types';
import { INITIAL_COMPLAINTS } from '../data/mockData';

interface AppContextType {
  user: UserAccount | null;
  complaints: GrievanceRecord[];
  memberships: MembershipRecord[];
  notifications: NotificationItem[];
  registeredEvents: string[];
  legalAidAppointments: LegalAidAppointment[];
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
  }) => GrievanceRecord;
  getComplaintById: (id: string) => GrievanceRecord | undefined;
  updateComplaintStatus: (id: string, newStatus: ComplaintStatus, officerNote?: string) => void;
  deleteComplaint: (id: string) => void;
  submitMembership: (data: Omit<MembershipRecord, 'applicationId' | 'appliedAt' | 'status'>) => MembershipRecord;
  toggleEventRegistration: (eventId: string) => boolean;
  bookLegalAidAppointment: (data: Omit<LegalAidAppointment, 'id' | 'status' | 'createdAt'>) => LegalAidAppointment;
  login: (email: string, fullName?: string) => void;
  loginAsDemo: (roleType: 'member' | 'volunteer' | 'officer') => void;
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
  REGISTERED_EVENTS: 'gyf_registered_events_v1',
  LEGAL_APPOINTMENTS: 'gyf_legal_appointments_v1',
};

export const DEMO_USERS: Record<string, UserAccount> = {
  member: {
    id: 'usr-gyf-001',
    fullName: 'Tariq Manzoor',
    email: 'tariq.manzoor@gyf.org',
    phone: '+91 91035 99292',
    joinedDate: 'January 2025',
    membershipStatus: 'Member',
    membershipId: 'GYF-MEM-2025-084',
    city: 'Srinagar',
    country: 'India',
    role: 'Active Youth Delegate',
    bloodGroup: 'O+',
    emergencyContact: '+91 94190 12345',
    chapter: 'Central Kashmir Hub (Srinagar & Bemina)',
    skills: ['Peacebuilding & Conflict Mediation', 'Youth Leadership', 'Community Outreach'],
    bio: 'Passionate youth advocate working towards grassroots educational access and community peace dialogues in Kashmir.',
    volunteerHours: 64,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  },
  volunteer: {
    id: 'usr-gyf-002',
    fullName: 'Aisha Begum',
    email: 'aisha.begum@gyf.org',
    phone: '+91 98580 44211',
    joinedDate: 'June 2025',
    membershipStatus: 'Volunteer',
    membershipId: 'GYF-VOL-2025-142',
    city: 'Baramulla',
    country: 'India',
    role: 'Green Wings Volunteer Lead',
    bloodGroup: 'B+',
    emergencyContact: '+91 99060 55432',
    chapter: 'North Kashmir Hub (Baramulla)',
    skills: ['Eco-conservation', 'Legal Aid Assistance', 'Field Organization'],
    bio: 'Dedicated volunteer coordinating tree plantation initiatives and legal helpdesk document drafting in Baramulla.',
    volunteerHours: 92,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  officer: {
    id: 'usr-gyf-003',
    fullName: 'Adv. Farooq Ahmad Mir',
    email: 'ombudsman.desk@gyf.org',
    phone: '+91 91035 99292',
    joinedDate: 'August 2024',
    membershipStatus: 'Admin',
    membershipId: 'GYF-STAFF-019',
    city: 'Srinagar',
    country: 'India',
    role: 'Grievance Redressal Ombudsman',
    bloodGroup: 'A+',
    emergencyContact: '+91 91035 99292',
    chapter: 'GYF Headquarter Secretariat',
    skills: ['Legal Advisory', 'Grievance Investigation', 'Mediation'],
    bio: 'Legal counselor overseeing citizen grievances, RTI documentation, and government departmental liaison.',
    volunteerHours: 180,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  }
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
      return saved ? JSON.parse(saved) : [
        {
          applicationId: 'GYF-APP-2025-084',
          fullName: 'Tariq Manzoor',
          email: 'tariq.manzoor@gyf.org',
          phone: '+91 91035 99292',
          dob: '2001-04-15',
          address: 'Main Town, Bemina',
          city: 'Srinagar',
          state: 'Jammu & Kashmir',
          country: 'India',
          areaOfInterest: 'Peace & Justice / Legal Aid',
          motivation: 'To actively engage in youth empowerment, student advocacy and community peacebuilding.',
          appliedAt: 'Jan 10, 2025',
          status: 'Active Member'
        }
      ];
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : DEMO_USERS.member;
    } catch {
      return DEMO_USERS.member;
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REGISTERED_EVENTS, JSON.stringify(registeredEvents));
    } catch (e) {
      console.error('Failed to save registered events', e);
    }
  }, [registeredEvents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEGAL_APPOINTMENTS, JSON.stringify(legalAidAppointments));
    } catch (e) {
      console.error('Failed to save legal appointments', e);
    }
  }, [legalAidAppointments]);

  const submitGrievance = (data: {
    category: string;
    subject: string;
    description: string;
    location: string;
    isAnonymous: boolean;
    complainantEmail?: string;
    complainantPhone?: string;
    attachmentName?: string;
    priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  }): GrievanceRecord => {
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
      priority: data.priority || 'Medium',
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

  const updateComplaintStatus = (id: string, newStatus: ComplaintStatus, officerNote?: string) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' • ' + now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    setComplaints(prev => prev.map(item => {
      if (item.id === id) {
        const newTimelineEvent = {
          status: newStatus,
          date: formattedDate,
          description: officerNote || `Status updated to ${newStatus} by GYF Grievance Officer.`,
          updatedBy: user ? `${user.fullName} (${user.membershipStatus})` : 'Grievance Officer'
        };
        return {
          ...item,
          currentStatus: newStatus,
          timeline: [...item.timeline, newTimelineEvent]
        };
      }
      return item;
    }));

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Docket ${id} Updated: ${newStatus}`,
      message: officerNote || `Status changed to ${newStatus}.`,
      date: 'Just now',
      isRead: false,
      type: 'complaint',
      actionUrl: `/track-complaint?id=${id}`
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const deleteComplaint = (id: string) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
  };

  const toggleEventRegistration = (eventId: string): boolean => {
    let isNowRegistered = false;
    setRegisteredEvents(prev => {
      if (prev.includes(eventId)) {
        isNowRegistered = false;
        return prev.filter(id => id !== eventId);
      } else {
        isNowRegistered = true;
        return [...prev, eventId];
      }
    });

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: isNowRegistered ? 'Event Registration Confirmed' : 'Event Registration Cancelled',
      message: isNowRegistered 
        ? 'You have successfully registered for the workshop. Check your dashboard for details.'
        : 'Your registration for the event has been withdrawn.',
      date: 'Just now',
      isRead: false,
      type: 'event'
    };
    setNotifications(prev => [notif, ...prev]);

    return isNowRegistered;
  };

  const bookLegalAidAppointment = (data: Omit<LegalAidAppointment, 'id' | 'status' | 'createdAt'>): LegalAidAppointment => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const newApt: LegalAidAppointment = {
      ...data,
      id: `APT-2026-${randomNum}`,
      status: 'Confirmed',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setLegalAidAppointments(prev => [newApt, ...prev]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Legal Aid Consultation Booked: ${newApt.id}`,
      message: `Your appointment on ${data.preferredDate} at ${data.preferredTime} (${data.location}) is confirmed.`,
      date: 'Just now',
      isRead: false,
      type: 'info'
    };
    setNotifications(prev => [notif, ...prev]);

    return newApt;
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
    const cleanName = fullName || (email.split('@')[0].replace('.', ' ').toUpperCase());
    const loggedInUser: UserAccount = {
      id: `usr-${Date.now().toString(36)}`,
      fullName: cleanName,
      email: email,
      phone: '+91 91035 99292',
      joinedDate: 'February 2026',
      membershipStatus: 'Member',
      membershipId: `GYF-MEM-2026-${Math.floor(100 + Math.random() * 900)}`,
      city: 'Srinagar',
      country: 'India',
      role: 'Member Delegate',
      bloodGroup: 'O+',
      emergencyContact: '+91 91035 99292',
      chapter: 'Srinagar Regional Chapter',
      skills: ['Community Outreach', 'Civic Action'],
      bio: 'Active Global Youth Foundation member working on youth welfare and civil rights.',
      volunteerHours: 40,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };
    setUser(loggedInUser);
  };

  const loginAsDemo = (roleType: 'member' | 'volunteer' | 'officer') => {
    setUser(DEMO_USERS[roleType] || DEMO_USERS.member);
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
      role: 'Community Member',
      bloodGroup: 'B+',
      chapter: 'Srinagar Regional Chapter',
      skills: ['Volunteer Service'],
      bio: 'Enthusiastic young changemaker supporting Global Youth Foundation programs.',
      volunteerHours: 12,
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
        registeredEvents,
        legalAidAppointments,
        submitGrievance,
        getComplaintById,
        updateComplaintStatus,
        deleteComplaint,
        submitMembership,
        toggleEventRegistration,
        bookLegalAidAppointment,
        login,
        loginAsDemo,
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

