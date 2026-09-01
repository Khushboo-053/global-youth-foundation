import { supabase, isSupabaseConfigured } from './supabase';
import { 
  UserAccount, 
  VolunteerPermissions, 
  NewsItem, 
  DonationRecord, 
  GrievanceRecord, 
  ComplaintTimelineEvent, 
  ComplaintStatus, 
  MembershipRecord, 
  EventItem, 
  Program, 
  FAQItem, 
  ChatbotQueryLog, 
  ActivityLog, 
  UserRole,
  ContactMessage,
  VolunteerProgramAssignment,
  VolunteerEventAssignment,
  VolunteerTaskItem,
  VolunteerNotificationItem,
  VolunteerActivityReport
} from '../types';
import { 
  PROGRAMS as INITIAL_PROGRAMS, 
  EVENTS as INITIAL_EVENTS, 
  NEWS_ITEMS as INITIAL_BLOGS, 
  INITIAL_COMPLAINTS, 
  FAQS as INITIAL_FAQS,
  INITIAL_CONTACT_MESSAGES 
} from '../data/mockData';

// Local storage persistent fallback keys
const STORAGE_KEYS = {
  USERS: 'gyf_db_users_v2',
  VOLUNTEER_PERMS: 'gyf_db_volunteer_perms_v2',
  BLOGS: 'gyf_db_blogs_v2',
  DONATIONS: 'gyf_db_donations_v2',
  GRIEVANCES: 'gyf_db_grievances_v2',
  EVENTS: 'gyf_db_events_v2',
  EVENT_REGISTRATIONS: 'gyf_db_event_registrations_v2',
  PROGRAMS: 'gyf_db_programs_v2',
  MEMBERSHIPS: 'gyf_db_memberships_v2',
  CHATBOT_FAQS: 'gyf_db_chatbot_faqs_v2',
  CHATBOT_LOGS: 'gyf_db_chatbot_logs_v2',
  ACTIVITY_LOGS: 'gyf_db_activity_logs_v2',
  CONTACT_MESSAGES: 'gyf_db_contact_messages_v2',
  NOTIFICATIONS: 'gyf_db_notifications_v2',
  VOLUNTEER_PROGRAMS: 'gyf_db_vol_programs_v2',
  VOLUNTEER_EVENTS: 'gyf_db_vol_events_v2',
  VOLUNTEER_TASKS: 'gyf_db_vol_tasks_v2',
  VOLUNTEER_NOTIFICATIONS: 'gyf_db_vol_notifs_v2',
  VOLUNTEER_ACTIVITY_REPORTS: 'gyf_db_vol_reports_v2',
};

const SEED_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Youth Leadership Summit 2026 Announced',
    message: 'Registrations are now open for the annual Youth Leadership & Social Innovation Summit at SKICC Srinagar.',
    date: '2 hours ago',
    isRead: false,
    type: 'event' as const,
    actionUrl: '/events'
  },
  {
    id: 'notif-2',
    title: 'New Ombudsman Docket Review Queue',
    message: '3 community grievances have been assigned to North and Central Kashmir volunteer desks for field inspection.',
    date: '1 day ago',
    isRead: true,
    type: 'complaint' as const,
    actionUrl: '/admin/dashboard'
  },
  {
    id: 'notif-3',
    title: 'Official Banking Reconciliation Completed',
    message: 'Monthly donation auditing and receipt generation for Winter Warmth Relief Drive completed.',
    date: '2 days ago',
    isRead: true,
    type: 'info' as const,
    actionUrl: '/donate'
  }
];

// Initial Seed Users
export const SEED_USERS: UserAccount[] = [
  {
    id: 'usr-gyf-admin-01',
    fullName: 'Executive Administrator',
    email: 'admin@gyf.org',
    phone: '+91 91035 99292',
    joinedDate: 'January 2024',
    membershipStatus: 'Admin',
    membershipId: 'GYF-ADM-2024-001',
    city: 'Srinagar',
    country: 'India',
    role: 'admin',
    roleTitle: 'Secretariat Director',
    bloodGroup: 'O+',
    emergencyContact: '+91 91035 99292',
    chapter: 'Central Kashmir Hub (Headquarter Secretariat)',
    skills: ['Policy Governance', 'Executive Management', 'Legal Redressal'],
    bio: 'Overseeing youth initiatives, grievance redressal, foundation compliance, and grassroots program deployment.',
    volunteerHours: 350,
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'usr-gyf-vol-01',
    fullName: 'Aisha Begum',
    email: 'volunteer@gyf.org',
    phone: '+91 98580 44211',
    joinedDate: 'June 2024',
    membershipStatus: 'Volunteer',
    membershipId: 'GYF-VOL-2024-042',
    city: 'Baramulla',
    country: 'India',
    role: 'volunteer',
    roleTitle: 'Green Wings Volunteer Lead',
    bloodGroup: 'B+',
    emergencyContact: '+91 99060 55432',
    chapter: 'North Kashmir Hub (Baramulla)',
    skills: ['Environmental Action', 'Community Mobilization', 'Grievance Field Intake'],
    bio: 'Active volunteer coordinating tree planting, youth dialogues, and community grievance verification in Baramulla.',
    volunteerHours: 120,
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'usr-gyf-user-01',
    fullName: 'Tariq Manzoor',
    email: 'user@gyf.org',
    phone: '+91 94190 88231',
    joinedDate: 'February 2025',
    membershipStatus: 'Member',
    membershipId: 'GYF-MEM-2025-084',
    city: 'Srinagar',
    country: 'India',
    role: 'user',
    roleTitle: 'Active Youth Member',
    bloodGroup: 'O+',
    emergencyContact: '+91 94190 12345',
    chapter: 'Central Kashmir Hub (Srinagar & Bemina)',
    skills: ['Youth Leadership', 'Student Civic Engagement'],
    bio: 'University student advocate passionate about youth rights, scholarship access, and environmental sustainability.',
    volunteerHours: 45,
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'usr-gyf-user-02',
    fullName: 'Zahoor Ahmed Lone',
    email: 'zahoor.fellow@gyf.org',
    phone: '+91 97970 11928',
    joinedDate: 'May 2025',
    membershipStatus: 'Member',
    membershipId: 'GYF-MEM-2025-119',
    city: 'Anantnag',
    country: 'India',
    role: 'user',
    roleTitle: 'Youth Fellow',
    bloodGroup: 'A+',
    chapter: 'South Kashmir Hub (Anantnag)',
    skills: ['Public Speaking', 'Peer Mentoring'],
    bio: 'Leading youth peer-to-peer tutoring circles in South Kashmir.',
    volunteerHours: 30,
    isActive: true
  }
];

export const SEED_VOLUNTEER_PERMS: Record<string, VolunteerPermissions> = {
  'usr-gyf-vol-01': {
    volunteerId: 'usr-gyf-vol-01',
    canManageGrievances: true,
    canManageEvents: true,
    canManagePrograms: true,
    canViewMembers: true,
    assignedChapter: 'North Kashmir Hub (Baramulla)',
    notes: 'Approved for grievance field verification and event attendance management.'
  }
};

const SEED_DONATIONS: DonationRecord[] = [
  {
    id: 'don-2026-001',
    donorName: 'Dr. Rafiq Ahmad Qadri',
    email: 'rafiq.qadri@example.com',
    phone: '+91 94190 00112',
    amount: 15000,
    currency: 'INR',
    donationDate: '2026-02-20',
    paymentStatus: 'Verified',
    transactionId: 'UTR-JAKB-2901928371',
    notes: 'Contribution towards 2026 Youth Fellowship Study Material & Kits',
    createdAt: '2026-02-20T10:15:00Z'
  },
  {
    id: 'don-2026-002',
    donorName: 'Kashmir Valley Green Supporters',
    email: 'green.supporters@example.org',
    phone: '+91 98581 22334',
    amount: 25000,
    currency: 'INR',
    donationDate: '2026-02-24',
    paymentStatus: 'Verified',
    transactionId: 'UTR-HDFC-9918237123',
    notes: 'Support for Lake Cleanup drives and native sapling tree purchases',
    createdAt: '2026-02-24T14:30:00Z'
  },
  {
    id: 'don-2026-003',
    donorName: 'Anonymous Community Donor',
    email: 'citizen.donor@gmail.com',
    phone: '+91 91035 00000',
    amount: 5000,
    currency: 'INR',
    donationDate: '2026-02-27',
    paymentStatus: 'Pending Verification',
    transactionId: 'UTR-SBIN-8472910482',
    notes: 'Winter Warmth Ration Kits distribution fund',
    createdAt: '2026-02-27T09:00:00Z'
  }
];

const SEED_MEMBERSHIPS: MembershipRecord[] = [
  {
    applicationId: 'GYF-MEM-2026-9102',
    fullName: 'Mehak Fatima',
    email: 'mehak.fatima@example.com',
    phone: '+91 97971 88293',
    dob: '2002-04-15',
    address: 'Habba Kadal',
    city: 'Srinagar',
    state: 'Jammu & Kashmir',
    country: 'India',
    areaOfInterest: 'Human Rights & Legal Literacy',
    motivation: 'I want to help organize civic rights seminars for young women in my community.',
    appliedAt: '2026-02-18 11:20 AM',
    status: 'Approved'
  },
  {
    applicationId: 'GYF-MEM-2026-4419',
    fullName: 'Danish Mushtaq',
    email: 'danish.mushtaq@example.org',
    phone: '+91 99060 11223',
    dob: '2001-09-22',
    address: 'Model Town',
    city: 'Sopore',
    state: 'Jammu & Kashmir',
    country: 'India',
    areaOfInterest: 'Environmental Sustainability & Climate Action',
    motivation: 'Passionate about wetland rejuvenation and organizing youth plastic-free campaigns.',
    appliedAt: '2026-02-25 04:45 PM',
    status: 'Pending Review'
  }
];

const SEED_VOLUNTEER_PROGRAMS: VolunteerProgramAssignment[] = [
  {
    id: 'vprog-01',
    programId: 'green-kashmir',
    volunteerId: 'usr-gyf-vol-01',
    volunteerName: 'Aisha Begum',
    programTitle: 'Green Kashmir & Environmental Sustainability',
    category: 'Environment',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Valley-wide afforestation, wetland rejuvenation, and youth plastic-free movements.',
    fullDescription: 'Green Wings is the dedicated environmental flagship of GYF, engaging youth clubs in extensive reforestation, lake cleanup drives, environmental education in schools, and sustainable waste reduction campaigns across Jammu & Kashmir.',
    objectives: [
      'Plant 50,000 indigenous conifers and fruit trees by late 2026',
      'Establish 30 Eco-Clubs in high schools across North and Central Kashmir',
      'Conduct monthly plastic collection and citizen awareness drives'
    ],
    impactStats: '22,000+ Saplings Planted • 18 Wetlands Monitored',
    beneficiariesTarget: '15,000 Youth & Local Communities',
    assignedRole: 'District Plantation Supervisor & School Eco-Club Coordinator',
    location: 'Baramulla District (Eco-Park, Sopore & Wular Catchment)',
    date: 'March 2026 – Ongoing Spring Campaign',
    progress: 65,
    status: 'In Progress',
    activityNotes: [
      {
        id: 'note-p1',
        note: 'Completed site inspection with Divisional Forest Officer on Feb 26. Finalized delivery of 500 pine & deodar saplings.',
        timestamp: '2026-02-26 03:30 PM',
        addedBy: 'Aisha Begum'
      },
      {
        id: 'note-p2',
        note: 'Conducted volunteer orientation with 25 student participants at Government Boys Degree College Baramulla.',
        timestamp: '2026-02-28 11:15 AM',
        addedBy: 'Aisha Begum'
      }
    ],
    assignedAt: '2026-01-15'
  },
  {
    id: 'vprog-02',
    programId: 'legal-literacy',
    volunteerId: 'usr-gyf-vol-01',
    volunteerName: 'Aisha Begum',
    programTitle: 'Youth Legal Literacy & Citizen Rights Aid',
    category: 'Human Rights',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Free legal consultations, RTI assistance, consumer rights education, and civic redressal clinics.',
    fullDescription: 'Providing essential constitutional awareness, legal aid clinics, and ombudsman guidance for marginalized youth and citizens facing institutional barriers.',
    objectives: [
      'Deliver bi-weekly legal aid camps in rural community halls',
      'Distribute 5,000 bilingual citizen rights handbooks in Urdu and English',
      'Provide pro-bono consultation for youth civic grievances'
    ],
    impactStats: '450+ Citizens Assisted • 12 Seminars Conducted',
    beneficiariesTarget: 'Students, Rural Youth & Local Complainants',
    assignedRole: 'Field Intake & Community Legal Helpdesk Liaison',
    location: 'Baramulla Legal Aid Desk & Rural Panchayat Hubs',
    date: 'April 2026 – Active Phase',
    progress: 35,
    status: 'In Progress',
    activityNotes: [
      {
        id: 'note-p3',
        note: 'Distributed 200 copies of Citizen Grievance Redressal Manual to local community elders and student leaders.',
        timestamp: '2026-02-22 04:00 PM',
        addedBy: 'Aisha Begum'
      }
    ],
    assignedAt: '2026-02-01'
  }
];

const SEED_VOLUNTEER_EVENTS: VolunteerEventAssignment[] = [
  {
    id: 'vevt-01',
    eventId: 'event-1',
    volunteerId: 'usr-gyf-vol-01',
    volunteerName: 'Aisha Begum',
    eventTitle: 'Youth Leadership Workshop 2026',
    category: 'Workshop',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    description: 'An intensive, interactive seminar focusing on public policy advocacy, conflict resolution strategies, and civic leadership.',
    date: 'March 18, 2026',
    time: '10:00 AM - 04:30 PM',
    location: 'Srinagar Convention Centre, J&K',
    assignedRole: 'Speaker Hospitality & Delegate Registration Desk Lead',
    status: 'Assigned',
    isCompleted: false,
    notes: [
      {
        id: 'ne-1',
        note: 'Received verified list of 85 delegate registrations from Central Secretariat.',
        timestamp: '2026-02-27 10:00 AM',
        addedBy: 'Aisha Begum'
      }
    ],
    assignedAt: '2026-02-10'
  },
  {
    id: 'vevt-02',
    eventId: 'event-4',
    volunteerId: 'usr-gyf-vol-01',
    volunteerName: 'Aisha Begum',
    eventTitle: 'Environmental Awareness Drive & Lake Clean-Up',
    category: 'Environment',
    image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1000&q=80',
    description: 'Community environmental action day targeting lake banks and municipal park reforestation.',
    date: 'March 22, 2026',
    time: '08:30 AM - 01:30 PM',
    location: 'Baramulla Eco-Park & Riverside Trail',
    assignedRole: 'On-Ground Safety, Equipment & Kit Distribution Coordinator',
    status: 'In Progress',
    isCompleted: false,
    notes: [
      {
        id: 'ne-2',
        note: 'Confirmed supply of 100 pairs of gloves, tree guards, and pruning tools.',
        timestamp: '2026-02-28 02:30 PM',
        addedBy: 'Aisha Begum'
      }
    ],
    assignedAt: '2026-02-14'
  },
  {
    id: 'vevt-03',
    eventId: 'event-3',
    volunteerId: 'usr-gyf-vol-01',
    volunteerName: 'Aisha Begum',
    eventTitle: 'Peacebuilding Initiative & Youth Dialogue',
    category: 'Peacebuilding',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
    description: 'A cross-generational dialogue bringing young voices and community leaders together to build mutual trust.',
    date: 'January 24, 2026',
    time: '02:00 PM - 06:00 PM',
    location: 'Community Peace Hall, Rajbagh',
    assignedRole: 'Venue Logistical Setup & Attendee Feedback Collector',
    status: 'Completed',
    isCompleted: true,
    notes: [
      {
        id: 'ne-3',
        note: 'Facilitated 95 participants. Collected feedback surveys and submitted to Admin Secretariat.',
        timestamp: '2026-01-24 06:30 PM',
        addedBy: 'Aisha Begum'
      }
    ],
    assignedAt: '2026-01-10'
  }
];

const SEED_VOLUNTEER_TASKS: VolunteerTaskItem[] = [
  {
    id: 'vtask-01',
    volunteerId: 'usr-gyf-vol-01',
    volunteerName: 'Aisha Begum',
    title: 'Collect Soil Moisture Samples for Eco-Park Tree Drive',
    description: 'Conduct 4 soil core tests across Baramulla Eco-Park sector 3 to confirm moisture readiness for pine saplings before the March 22 plantation drive.',
    assignedDate: '2026-03-01',
    dueDate: '2026-03-12',
    relatedType: 'Program',
    relatedTitle: 'Green Kashmir & Environmental Sustainability',
    priority: 'High',
    status: 'In Progress',
    progressNotes: [
      {
        id: 'tp-1',
        note: 'Collected 2 samples from the northern ridge. Soil texture and moisture levels are optimal.',
        timestamp: '2026-03-02 11:30 AM'
      }
    ],
    createdAt: '2026-03-01'
  },
  {
    id: 'vtask-02',
    volunteerId: 'usr-gyf-vol-01',
    volunteerName: 'Aisha Begum',
    title: 'Assemble 85 Delegate Welcome Badges for Youth Summit',
    description: 'Cross-check verified attendee list, print badge cards, attach official GYF lanyards, and package conference schedule booklets.',
    assignedDate: '2026-03-03',
    dueDate: '2026-03-14',
    relatedType: 'Event',
    relatedTitle: 'Youth Leadership Workshop 2026',
    priority: 'Urgent',
    status: 'Pending',
    progressNotes: [],
    createdAt: '2026-03-03'
  },
  {
    id: 'vtask-03',
    volunteerId: 'usr-gyf-vol-01',
    volunteerName: 'Aisha Begum',
    title: 'Conduct Field Inspection for Wular Dumping Grievance (GYF-2026-319042)',
    description: 'Perform on-site photographic documentation of plastic waste accumulation near the irrigation feeder canal and record statements from local residents.',
    assignedDate: '2026-02-28',
    dueDate: '2026-03-08',
    relatedType: 'Grievance',
    relatedTitle: 'Grievance Docket GYF-2026-319042',
    priority: 'High',
    status: 'In Progress',
    progressNotes: [
      {
        id: 'tp-2',
        note: 'Met with municipal sanitation inspector on site; documented 4 waste accumulation points.',
        timestamp: '2026-03-01 03:00 PM'
      }
    ],
    createdAt: '2026-02-28'
  },
  {
    id: 'vtask-04',
    volunteerId: 'usr-gyf-vol-01',
    volunteerName: 'Aisha Begum',
    title: 'Review Annual Volunteer Safeguarding & Ethics Code',
    description: 'Read the updated 2026 Youth Safety & Field Operations Handbook and submit digital acknowledgement.',
    assignedDate: '2026-02-15',
    dueDate: '2026-02-25',
    relatedType: 'General',
    relatedTitle: 'GYF Secretariat Compliance',
    priority: 'Low',
    status: 'Completed',
    completedAt: '2026-02-24',
    progressNotes: [
      {
        id: 'tp-3',
        note: 'Completed reading and submitted signed digital form to Executive Administrator.',
        timestamp: '2026-02-24 05:15 PM'
      }
    ],
    createdAt: '2026-02-15'
  }
];

const SEED_VOLUNTEER_NOTIFICATIONS: VolunteerNotificationItem[] = [
  {
    id: 'vnotif-01',
    volunteerId: 'usr-gyf-vol-01',
    title: 'New Grievance Docket Assigned: GYF-2026-319042',
    message: 'Executive Admin assigned Wular catchment illegal dumping case to you for field inspection and community mediation.',
    type: 'grievance',
    date: '2 hours ago',
    isRead: false,
    actionTab: 'grievances',
    createdAt: '2026-03-03T10:00:00Z'
  },
  {
    id: 'vnotif-02',
    volunteerId: 'usr-gyf-vol-01',
    title: 'Event Responsibility Assigned: Youth Leadership Workshop',
    message: 'You have been designated as Speaker Hospitality & Delegate Registration Desk Lead for SKICC Srinagar on March 18.',
    type: 'event',
    date: '1 day ago',
    isRead: false,
    actionTab: 'events',
    createdAt: '2026-03-02T09:00:00Z'
  },
  {
    id: 'vnotif-03',
    volunteerId: 'usr-gyf-vol-01',
    title: 'New Task Assigned by Admin',
    message: 'Task "Collect Soil Moisture Samples for Eco-Park Tree Drive" has been assigned to you. Due by March 12, 2026.',
    type: 'task',
    date: '2 days ago',
    isRead: true,
    actionTab: 'tasks',
    createdAt: '2026-03-01T14:30:00Z'
  },
  {
    id: 'vnotif-04',
    volunteerId: 'usr-gyf-vol-01',
    title: 'Program Milestone: Green Kashmir Spring Campaign',
    message: 'North Kashmir division sapling quota raised to 500 trees. Review your assigned responsibility.',
    type: 'program',
    date: '3 days ago',
    isRead: true,
    actionTab: 'programs',
    createdAt: '2026-02-28T11:00:00Z'
  },
  {
    id: 'vnotif-05',
    volunteerId: 'all_volunteers',
    title: 'Announcement from Admin: Monthly District Coordination Call',
    message: 'All active district volunteers are requested to join the monthly field briefing on Sunday at 7:00 PM.',
    type: 'announcement',
    date: '4 days ago',
    isRead: true,
    actionTab: 'dashboard',
    createdAt: '2026-02-27T16:00:00Z'
  }
];

const SEED_VOLUNTEER_REPORTS: VolunteerActivityReport[] = [
  {
    id: 'rep-01',
    volunteerId: 'usr-gyf-vol-01',
    volunteerName: 'Aisha Begum',
    title: 'Wular Catchment Wetland Inspection & Community Dialogue',
    category: 'Field Inspection',
    relatedType: 'Grievance',
    relatedId: 'GYF-2026-319042',
    relatedTitle: 'Grievance Docket GYF-2026-319042',
    date: '2026-03-02',
    hoursSpent: 4.5,
    location: 'Wular Lake Catchment, Bandipora/Baramulla Belt',
    summary: 'Visited the site alongside village elders and documented 4 dumping points. Conducted community dialogue regarding proper waste segregation.',
    accomplishments: 'Obtained written agreement from local dairy units to cease nocturnal dumping; submitted GPS-tagged photographic evidence to municipal authority.',
    challenges: 'Resistance from unauthorized landfill operators; requested administrative backing.',
    status: 'Reviewed by Admin',
    adminFeedback: 'Excellent grassroots investigation. Field evidence forwarded to Divisional Commissioner Office.',
    createdAt: '2026-03-02T16:45:00Z'
  },
  {
    id: 'rep-02',
    volunteerId: 'usr-gyf-vol-01',
    volunteerName: 'Aisha Begum',
    title: 'Sapling Procurement & School Eco-Club Briefing',
    category: 'Community Outreach',
    relatedType: 'Program',
    relatedId: 'prog-01',
    relatedTitle: 'Green Kashmir Youth Climate Action',
    date: '2026-02-27',
    hoursSpent: 3.5,
    location: 'Government Higher Secondary School, Baramulla',
    summary: 'Delivered interactive presentation to 85 high school students regarding tree stewardship and climate resilience.',
    accomplishments: 'Enrolled 40 youth eco-cadets and distributed 120 deodar and chinar saplings with care guides.',
    status: 'Submitted',
    createdAt: '2026-02-27T14:30:00Z'
  }
];

// Helper to get local data safely
function getLocal<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    return JSON.parse(raw);
  } catch {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Local storage write error:', e);
  }
}

// Initialize seed data in local storage on first load
export function initSeedDataIfEmpty(): void {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setLocal(STORAGE_KEYS.USERS, SEED_USERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.VOLUNTEER_PERMS)) {
    setLocal(STORAGE_KEYS.VOLUNTEER_PERMS, SEED_VOLUNTEER_PERMS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.BLOGS)) {
    setLocal(STORAGE_KEYS.BLOGS, INITIAL_BLOGS.map(b => ({ ...b, isPublished: true })));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DONATIONS)) {
    setLocal(STORAGE_KEYS.DONATIONS, SEED_DONATIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.GRIEVANCES)) {
    const initialWithVolunteer = INITIAL_COMPLAINTS.map(c => {
      if (c.id === 'GYF-2026-319042') {
        return {
          ...c,
          assignedVolunteerId: 'usr-gyf-vol-01',
          assignedVolunteerName: 'Aisha Begum',
          complainantEmail: 'peerzada.nabi@gmail.com',
          complainantPhone: '+91 97970 88219'
        };
      }
      return c;
    });
    setLocal(STORAGE_KEYS.GRIEVANCES, initialWithVolunteer);
  }
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    setLocal(STORAGE_KEYS.EVENTS, INITIAL_EVENTS.map(e => ({ ...e, isPublished: true })));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROGRAMS)) {
    setLocal(STORAGE_KEYS.PROGRAMS, INITIAL_PROGRAMS.map(p => ({ ...p, isPublished: true })));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MEMBERSHIPS)) {
    setLocal(STORAGE_KEYS.MEMBERSHIPS, SEED_MEMBERSHIPS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CHATBOT_FAQS)) {
    setLocal(STORAGE_KEYS.CHATBOT_FAQS, INITIAL_FAQS.map(f => ({ ...f, isActive: true })));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONTACT_MESSAGES)) {
    setLocal(STORAGE_KEYS.CONTACT_MESSAGES, INITIAL_CONTACT_MESSAGES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    setLocal(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.VOLUNTEER_PROGRAMS)) {
    setLocal(STORAGE_KEYS.VOLUNTEER_PROGRAMS, SEED_VOLUNTEER_PROGRAMS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.VOLUNTEER_EVENTS)) {
    setLocal(STORAGE_KEYS.VOLUNTEER_EVENTS, SEED_VOLUNTEER_EVENTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.VOLUNTEER_TASKS)) {
    setLocal(STORAGE_KEYS.VOLUNTEER_TASKS, SEED_VOLUNTEER_TASKS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.VOLUNTEER_NOTIFICATIONS)) {
    setLocal(STORAGE_KEYS.VOLUNTEER_NOTIFICATIONS, SEED_VOLUNTEER_NOTIFICATIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.VOLUNTEER_ACTIVITY_REPORTS)) {
    setLocal(STORAGE_KEYS.VOLUNTEER_ACTIVITY_REPORTS, SEED_VOLUNTEER_REPORTS);
  }
}

// --------------------------------------------------------------------------
// API SERVICE IMPLEMENTATIONS
// --------------------------------------------------------------------------

export const api = {
  // 1. USERS API
  users: {
    async getAll(): Promise<UserAccount[]> {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            fullName: d.full_name,
            email: d.email,
            phone: d.phone || '',
            joinedDate: d.created_at ? new Date(d.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '2025',
            membershipStatus: d.membership_status || 'Applicant',
            membershipId: d.membership_id,
            avatar: d.avatar,
            city: d.city,
            country: d.country || 'India',
            role: d.role as UserRole,
            roleTitle: d.role_title,
            bloodGroup: d.blood_group,
            emergencyContact: d.emergency_contact,
            chapter: d.chapter,
            skills: d.skills || [],
            bio: d.bio,
            volunteerHours: d.volunteer_hours || 0,
            isActive: d.is_active ?? true
          }));
        }
      }
      return getLocal<UserAccount[]>(STORAGE_KEYS.USERS, SEED_USERS);
    },

    async create(user: UserAccount): Promise<UserAccount> {
      const users = getLocal<UserAccount[]>(STORAGE_KEYS.USERS, SEED_USERS);
      const existingIdx = users.findIndex(u => u.id === user.id || (u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase()));
      if (existingIdx !== -1) {
        users[existingIdx] = { ...users[existingIdx], ...user };
        setLocal(STORAGE_KEYS.USERS, users);
        return users[existingIdx];
      }
      users.unshift(user);
      setLocal(STORAGE_KEYS.USERS, users);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('profiles').insert({
          id: user.id,
          full_name: user.fullName,
          email: user.email,
          phone: user.phone,
          chapter: user.chapter,
          blood_group: user.bloodGroup,
          membership_status: user.membershipStatus,
          membership_id: user.membershipId,
          role_title: user.roleTitle,
          role: user.role,
          created_at: new Date().toISOString(),
          is_active: user.isActive ?? true,
          skills: user.skills || [],
          volunteer_hours: user.volunteerHours || 0
        });
      }
      return user;
    },

    async update(id: string, updates: Partial<UserAccount>): Promise<UserAccount | null> {
      if (isSupabaseConfigured && supabase) {
        const payload: any = {};
        if (updates.fullName) payload.full_name = updates.fullName;
        if (updates.phone) payload.phone = updates.phone;
        if (updates.role) payload.role = updates.role;
        if (updates.roleTitle) payload.role_title = updates.roleTitle;
        if (updates.membershipStatus) payload.membership_status = updates.membershipStatus;
        if (updates.membershipId) payload.membership_id = updates.membershipId;
        if (updates.city) payload.city = updates.city;
        if (updates.bloodGroup) payload.blood_group = updates.bloodGroup;
        if (updates.emergencyContact) payload.emergency_contact = updates.emergencyContact;
        if (updates.chapter) payload.chapter = updates.chapter;
        if (updates.skills) payload.skills = updates.skills;
        if (updates.bio) payload.bio = updates.bio;
        if (updates.volunteerHours !== undefined) payload.volunteer_hours = updates.volunteerHours;
        if (updates.isActive !== undefined) payload.is_active = updates.isActive;

        await supabase.from('profiles').update(payload).eq('id', id);
      }

      const users = getLocal<UserAccount[]>(STORAGE_KEYS.USERS, SEED_USERS);
      const idx = users.findIndex(u => u.id === id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        setLocal(STORAGE_KEYS.USERS, users);
        return users[idx];
      } else {
        const newUser: UserAccount = {
          id,
          fullName: updates.fullName || 'Citizen User',
          email: updates.email || '',
          phone: updates.phone || '',
          joinedDate: updates.joinedDate || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          membershipStatus: updates.membershipStatus || 'Member',
          membershipId: updates.membershipId,
          role: updates.role || 'user',
          roleTitle: updates.roleTitle || 'Registered Member',
          chapter: updates.chapter || 'Central Kashmir Hub (Srinagar & Bemina)',
          bloodGroup: updates.bloodGroup || 'O+',
          skills: updates.skills || [],
          isActive: updates.isActive ?? true,
          ...updates
        };
        users.unshift(newUser);
        setLocal(STORAGE_KEYS.USERS, users);
        return newUser;
      }
    },

    async updateRole(id: string, role: UserRole, roleTitle?: string): Promise<boolean> {
      const users = getLocal<UserAccount[]>(STORAGE_KEYS.USERS, SEED_USERS);
      const user = users.find(u => u.id === id);
      if (!user) return false;

      const title = roleTitle || (role === 'admin' ? 'Administrator' : role === 'volunteer' ? 'Youth Volunteer' : 'Member');
      user.role = role;
      user.roleTitle = title;
      if (role === 'admin') user.membershipStatus = 'Admin';
      else if (role === 'volunteer') user.membershipStatus = 'Volunteer';

      setLocal(STORAGE_KEYS.USERS, users);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('profiles').update({ role, role_title: title, membership_status: user.membershipStatus }).eq('id', id);
      }
      return true;
    },

    async toggleStatus(id: string): Promise<boolean> {
      const users = getLocal<UserAccount[]>(STORAGE_KEYS.USERS, SEED_USERS);
      const user = users.find(u => u.id === id);
      if (!user) return false;
      user.isActive = !user.isActive;
      setLocal(STORAGE_KEYS.USERS, users);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('profiles').update({ is_active: user.isActive }).eq('id', id);
      }
      return true;
    },

    async delete(id: string): Promise<boolean> {
      let users = getLocal<UserAccount[]>(STORAGE_KEYS.USERS, SEED_USERS);
      users = users.filter(u => u.id !== id);
      setLocal(STORAGE_KEYS.USERS, users);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('profiles').delete().eq('id', id);
      }
      return true;
    }
  },

  // 2. VOLUNTEERS API
  volunteers: {
    async getAll(): Promise<UserAccount[]> {
      const users = await api.users.getAll();
      return users.filter(u => u.role === 'volunteer' || u.membershipStatus === 'Volunteer');
    },

    async getPermissions(volunteerId: string): Promise<VolunteerPermissions> {
      const perms = getLocal<Record<string, VolunteerPermissions>>(STORAGE_KEYS.VOLUNTEER_PERMS, SEED_VOLUNTEER_PERMS);
      return perms[volunteerId] || {
        volunteerId,
        canManageGrievances: true,
        canManageEvents: true,
        canManagePrograms: false,
        canViewMembers: true,
        assignedChapter: 'Central Kashmir Hub (Srinagar & Bemina)'
      };
    },

    async updatePermissions(volunteerId: string, updates: Partial<VolunteerPermissions>): Promise<VolunteerPermissions> {
      const perms = getLocal<Record<string, VolunteerPermissions>>(STORAGE_KEYS.VOLUNTEER_PERMS, SEED_VOLUNTEER_PERMS);
      const current = perms[volunteerId] || {
        volunteerId,
        canManageGrievances: true,
        canManageEvents: true,
        canManagePrograms: false,
        canViewMembers: true,
        assignedChapter: 'Central Kashmir Hub (Srinagar & Bemina)'
      };

      const updated = { ...current, ...updates };
      perms[volunteerId] = updated;
      setLocal(STORAGE_KEYS.VOLUNTEER_PERMS, perms);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('volunteer_permissions').upsert({
          volunteer_id: volunteerId,
          can_manage_grievances: updated.canManageGrievances,
          can_manage_events: updated.canManageEvents,
          can_manage_programs: updated.canManagePrograms,
          can_view_members: updated.canViewMembers,
          assigned_chapter: updated.assignedChapter,
          notes: updated.notes
        });
      }
      return updated;
    },

    async logHours(volunteerId: string, hoursToAdd: number): Promise<number> {
      const users = getLocal<UserAccount[]>(STORAGE_KEYS.USERS, SEED_USERS);
      const user = users.find(u => u.id === volunteerId);
      if (!user) return 0;
      user.volunteerHours = (user.volunteerHours || 0) + hoursToAdd;
      setLocal(STORAGE_KEYS.USERS, users);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('profiles').update({ volunteer_hours: user.volunteerHours }).eq('id', volunteerId);
      }
      return user.volunteerHours;
    }
  },

  // 3. BLOGS / NEWS ARTICLES API
  blogs: {
    async getAll(): Promise<NewsItem[]> {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            title: d.title,
            category: d.category,
            date: d.date,
            shortDescription: d.short_description,
            content: d.content,
            image: d.image,
            author: d.author,
            readTime: d.read_time,
            isPublished: d.is_published ?? true
          }));
        }
      }
      return getLocal<NewsItem[]>(STORAGE_KEYS.BLOGS, INITIAL_BLOGS);
    },

    async getPublished(): Promise<NewsItem[]> {
      const all = await api.blogs.getAll();
      return all.filter(b => b.isPublished !== false);
    },

    async create(blogData: Omit<NewsItem, 'id'>): Promise<NewsItem> {
      const id = `blog-${Date.now()}`;
      const newBlog: NewsItem = {
        ...blogData,
        id,
        isPublished: blogData.isPublished ?? true,
        createdAt: new Date().toISOString()
      };

      const blogs = getLocal<NewsItem[]>(STORAGE_KEYS.BLOGS, INITIAL_BLOGS);
      blogs.unshift(newBlog);
      setLocal(STORAGE_KEYS.BLOGS, blogs);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('blogs').insert({
          id,
          title: newBlog.title,
          category: newBlog.category,
          date: newBlog.date,
          short_description: newBlog.shortDescription,
          content: newBlog.content,
          image: newBlog.image,
          author: newBlog.author,
          read_time: newBlog.readTime,
          is_published: newBlog.isPublished
        });
      }
      return newBlog;
    },

    async update(id: string, updates: Partial<NewsItem>): Promise<NewsItem | null> {
      const blogs = getLocal<NewsItem[]>(STORAGE_KEYS.BLOGS, INITIAL_BLOGS);
      const idx = blogs.findIndex(b => b.id === id);
      if (idx !== -1) {
        blogs[idx] = { ...blogs[idx], ...updates, updatedAt: new Date().toISOString() };
        setLocal(STORAGE_KEYS.BLOGS, blogs);

        if (isSupabaseConfigured && supabase) {
          const payload: any = {};
          if (updates.title) payload.title = updates.title;
          if (updates.category) payload.category = updates.category;
          if (updates.date) payload.date = updates.date;
          if (updates.shortDescription) payload.short_description = updates.shortDescription;
          if (updates.content) payload.content = updates.content;
          if (updates.image) payload.image = updates.image;
          if (updates.author) payload.author = updates.author;
          if (updates.readTime) payload.read_time = updates.readTime;
          if (updates.isPublished !== undefined) payload.is_published = updates.isPublished;
          await supabase.from('blogs').update(payload).eq('id', id);
        }
        return blogs[idx];
      }
      return null;
    },

    async togglePublish(id: string): Promise<boolean> {
      const blogs = getLocal<NewsItem[]>(STORAGE_KEYS.BLOGS, INITIAL_BLOGS);
      const blog = blogs.find(b => b.id === id);
      if (!blog) return false;
      blog.isPublished = !blog.isPublished;
      setLocal(STORAGE_KEYS.BLOGS, blogs);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('blogs').update({ is_published: blog.isPublished }).eq('id', id);
      }
      return true;
    },

    async delete(id: string): Promise<boolean> {
      let blogs = getLocal<NewsItem[]>(STORAGE_KEYS.BLOGS, INITIAL_BLOGS);
      blogs = blogs.filter(b => b.id !== id);
      setLocal(STORAGE_KEYS.BLOGS, blogs);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('blogs').delete().eq('id', id);
      }
      return true;
    }
  },

  // 4. DONATIONS API
  donations: {
    async getAll(): Promise<DonationRecord[]> {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.from('donations').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            donorName: d.donor_name,
            email: d.email,
            phone: d.phone || '',
            amount: Number(d.amount),
            currency: d.currency || 'INR',
            donationDate: d.donation_date ? d.donation_date.split('T')[0] : '2026-02-20',
            paymentStatus: d.payment_status,
            transactionId: d.transaction_id,
            notes: d.notes,
            createdAt: d.created_at
          }));
        }
      }
      return getLocal<DonationRecord[]>(STORAGE_KEYS.DONATIONS, SEED_DONATIONS);
    },

    async create(donationData: Omit<DonationRecord, 'id' | 'createdAt'>): Promise<DonationRecord> {
      const id = `don-${Date.now()}`;
      const newDonation: DonationRecord = {
        ...donationData,
        id,
        createdAt: new Date().toISOString()
      };

      const list = getLocal<DonationRecord[]>(STORAGE_KEYS.DONATIONS, SEED_DONATIONS);
      list.unshift(newDonation);
      setLocal(STORAGE_KEYS.DONATIONS, list);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('donations').insert({
          donor_name: newDonation.donorName,
          email: newDonation.email,
          phone: newDonation.phone,
          amount: newDonation.amount,
          currency: newDonation.currency,
          donation_date: newDonation.donationDate,
          payment_status: newDonation.paymentStatus,
          transaction_id: newDonation.transactionId,
          notes: newDonation.notes
        });
      }
      return newDonation;
    },

    async updateStatus(id: string, status: 'Verified' | 'Pending Verification' | 'Failed'): Promise<boolean> {
      const list = getLocal<DonationRecord[]>(STORAGE_KEYS.DONATIONS, SEED_DONATIONS);
      const don = list.find(d => d.id === id);
      if (!don) return false;
      don.paymentStatus = status;
      setLocal(STORAGE_KEYS.DONATIONS, list);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('donations').update({ payment_status: status }).eq('id', id);
      }
      return true;
    }
  },

  // 5. GRIEVANCES API
  grievances: {
    async getAll(): Promise<GrievanceRecord[]> {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.from('grievances').select('*, timeline:grievance_timeline(*)').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            category: d.category,
            subject: d.subject,
            description: d.description,
            location: d.location,
            isAnonymous: d.is_anonymous,
            complainantEmail: d.complainant_email,
            complainantPhone: d.complainant_phone,
            attachmentName: d.attachment_name,
            attachmentSize: d.attachment_size,
            submittedAt: d.created_at,
            currentStatus: d.current_status as ComplaintStatus,
            priority: d.priority,
            assignedDepartment: d.assigned_department,
            assignedVolunteerId: d.assigned_volunteer_id,
            assignedVolunteerName: d.assigned_volunteer_name,
            timeline: (d.timeline || []).map((t: any) => ({
              status: t.status,
              date: t.date,
              description: t.description,
              updatedBy: t.updated_by
            }))
          }));
        }
      }
      return getLocal<GrievanceRecord[]>(STORAGE_KEYS.GRIEVANCES, INITIAL_COMPLAINTS);
    },

    async getById(id: string): Promise<GrievanceRecord | undefined> {
      const list = await api.grievances.getAll();
      return list.find(g => g.id.toLowerCase() === id.trim().toLowerCase());
    },

    async create(data: {
      category: string;
      subject: string;
      description: string;
      location: string;
      isAnonymous: boolean;
      complainantEmail?: string;
      complainantPhone?: string;
      attachmentName?: string;
      attachmentSize?: string;
      priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
    }): Promise<GrievanceRecord> {
      const randomSix = Math.floor(100000 + Math.random() * 900000);
      const id = `GYF-2026-${randomSix}`;
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const submittedAt = `${dateStr} • ${timeStr}`;

      const initialTimeline: ComplaintTimelineEvent[] = [
        {
          status: 'Submitted',
          date: submittedAt,
          description: 'Grievance received and registered under standard procedural docket.',
          updatedBy: 'Automated System'
        }
      ];

      const newRecord: GrievanceRecord = {
        id,
        category: data.category,
        subject: data.subject,
        description: data.description,
        location: data.location,
        isAnonymous: data.isAnonymous,
        complainantEmail: data.complainantEmail,
        complainantPhone: data.complainantPhone,
        attachmentName: data.attachmentName,
        attachmentSize: data.attachmentSize,
        submittedAt,
        currentStatus: 'Submitted',
        priority: data.priority || 'Medium',
        assignedDepartment: 'Central Grievance Redressal Committee',
        timeline: initialTimeline
      };

      const list = getLocal<GrievanceRecord[]>(STORAGE_KEYS.GRIEVANCES, INITIAL_COMPLAINTS);
      list.unshift(newRecord);
      setLocal(STORAGE_KEYS.GRIEVANCES, list);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('grievances').insert({
          id,
          category: newRecord.category,
          subject: newRecord.subject,
          description: newRecord.description,
          location: newRecord.location,
          is_anonymous: newRecord.isAnonymous,
          complainant_email: newRecord.complainantEmail,
          complainant_phone: newRecord.complainantPhone,
          attachment_name: newRecord.attachmentName,
          attachment_size: newRecord.attachmentSize,
          priority: newRecord.priority,
          current_status: 'Submitted',
          assigned_department: newRecord.assignedDepartment
        });
        await supabase.from('grievance_timeline').insert({
          grievance_id: id,
          status: 'Submitted',
          date: submittedAt,
          description: initialTimeline[0].description,
          updated_by: 'Automated System'
        });
      }

      return newRecord;
    },

    async updateStatus(id: string, newStatus: ComplaintStatus, remarks?: string, officerName?: string): Promise<boolean> {
      const list = getLocal<GrievanceRecord[]>(STORAGE_KEYS.GRIEVANCES, INITIAL_COMPLAINTS);
      const record = list.find(g => g.id === id);
      if (!record) return false;

      record.currentStatus = newStatus;
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const stamp = `${dateStr} • ${timeStr}`;

      const timelineItem: ComplaintTimelineEvent = {
        status: newStatus,
        date: stamp,
        description: remarks || `Status updated to ${newStatus}`,
        updatedBy: officerName || 'Ombudsman Desk'
      };

      record.timeline.push(timelineItem);
      setLocal(STORAGE_KEYS.GRIEVANCES, list);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('grievances').update({ current_status: newStatus, updated_at: new Date().toISOString() }).eq('id', id);
        await supabase.from('grievance_timeline').insert({
          grievance_id: id,
          status: newStatus,
          date: stamp,
          description: timelineItem.description,
          updated_by: timelineItem.updatedBy
        });
      }
      return true;
    },

    async assignVolunteer(id: string, volunteerId: string, volunteerName: string, department?: string): Promise<boolean> {
      const list = getLocal<GrievanceRecord[]>(STORAGE_KEYS.GRIEVANCES, INITIAL_COMPLAINTS);
      const record = list.find(g => g.id === id);
      if (!record) return false;

      record.assignedVolunteerId = volunteerId;
      record.assignedVolunteerName = volunteerName;
      if (department) record.assignedDepartment = department;

      const now = new Date();
      const stamp = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
      
      record.timeline.push({
        status: 'Assigned',
        date: stamp,
        description: `Case assigned to ${volunteerName} for field review and documentation.`,
        updatedBy: 'Grievance Committee'
      });

      setLocal(STORAGE_KEYS.GRIEVANCES, list);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('grievances').update({
          assigned_volunteer_id: volunteerId,
          assigned_volunteer_name: volunteerName,
          assigned_department: department || record.assignedDepartment,
          current_status: 'Assigned'
        }).eq('id', id);
      }
      return true;
    },

    async delete(id: string): Promise<boolean> {
      let list = getLocal<GrievanceRecord[]>(STORAGE_KEYS.GRIEVANCES, INITIAL_COMPLAINTS);
      list = list.filter(g => g.id !== id);
      setLocal(STORAGE_KEYS.GRIEVANCES, list);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('grievances').delete().eq('id', id);
      }
      return true;
    }
  },

  // 6. EVENTS API
  events: {
    async getAll(): Promise<EventItem[]> {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setLocal(STORAGE_KEYS.EVENTS, data);
            return data;
          }
        }
      } catch (e) {
        // Fallback to local
      }

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            title: d.title,
            date: d.date,
            time: d.time,
            location: d.location,
            category: d.category,
            description: d.description,
            fullDetails: d.full_details,
            image: d.image,
            status: d.status,
            attendeesCount: d.attendees_count || 0,
            isPublished: d.is_published ?? true
          }));
        }
      }
      return getLocal<EventItem[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    },

    async getPublished(): Promise<EventItem[]> {
      const all = await api.events.getAll();
      return all.filter(e => e.isPublished !== false && e.status !== 'Draft');
    },

    async create(eventData: Omit<EventItem, 'id'>): Promise<EventItem> {
      const id = `event-${Date.now()}`;
      const newEvent: EventItem = {
        ...eventData,
        id,
        isPublished: eventData.isPublished ?? (eventData.status !== 'Draft'),
        attendeesCount: eventData.attendeesCount || 0,
        createdAt: new Date().toISOString()
      };

      try {
        await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEvent)
        });
      } catch (e) {
        // Server fallback
      }

      const events = getLocal<EventItem[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
      events.unshift(newEvent);
      setLocal(STORAGE_KEYS.EVENTS, events);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('events').insert({
          id,
          title: newEvent.title,
          date: newEvent.date,
          time: newEvent.time,
          location: newEvent.location,
          category: newEvent.category,
          description: newEvent.description,
          full_details: newEvent.fullDetails,
          image: newEvent.image,
          status: newEvent.status,
          attendees_count: newEvent.attendeesCount,
          is_published: newEvent.isPublished
        });
      }
      return newEvent;
    },

    async update(id: string, updates: Partial<EventItem>): Promise<EventItem | null> {
      try {
        await fetch(`/api/events/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
      } catch (e) {
        // Server fallback
      }

      const events = getLocal<EventItem[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
      const idx = events.findIndex(e => e.id === id);
      if (idx !== -1) {
        events[idx] = { ...events[idx], ...updates };
        setLocal(STORAGE_KEYS.EVENTS, events);

        if (isSupabaseConfigured && supabase) {
          const payload: any = {};
          if (updates.title) payload.title = updates.title;
          if (updates.date) payload.date = updates.date;
          if (updates.time) payload.time = updates.time;
          if (updates.location) payload.location = updates.location;
          if (updates.category) payload.category = updates.category;
          if (updates.description) payload.description = updates.description;
          if (updates.fullDetails) payload.full_details = updates.fullDetails;
          if (updates.image) payload.image = updates.image;
          if (updates.status) payload.status = updates.status;
          if (updates.attendeesCount !== undefined) payload.attendees_count = updates.attendeesCount;
          if (updates.isPublished !== undefined) payload.is_published = updates.isPublished;
          await supabase.from('events').update(payload).eq('id', id);
        }
        return events[idx];
      }
      return null;
    },

    async togglePublish(id: string): Promise<boolean> {
      const events = getLocal<EventItem[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
      const event = events.find(e => e.id === id);
      if (!event) return false;
      event.isPublished = !event.isPublished;
      setLocal(STORAGE_KEYS.EVENTS, events);

      try {
        await fetch(`/api/events/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isPublished: event.isPublished })
        });
      } catch (e) {
        // Fallback
      }

      if (isSupabaseConfigured && supabase) {
        await supabase.from('events').update({ is_published: event.isPublished }).eq('id', id);
      }
      return true;
    },

    async delete(id: string): Promise<boolean> {
      try {
        await fetch(`/api/events/${id}`, { method: 'DELETE' });
      } catch (e) {
        // Fallback
      }

      let events = getLocal<EventItem[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
      events = events.filter(e => e.id !== id);
      setLocal(STORAGE_KEYS.EVENTS, events);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('events').delete().eq('id', id);
      }
      return true;
    }
  },

  // 7. PROGRAMS API
  programs: {
    async getAll(): Promise<Program[]> {
      try {
        const res = await fetch('/api/programs');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setLocal(STORAGE_KEYS.PROGRAMS, data);
            return data;
          }
        }
      } catch (e) {
        // Fallback
      }

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.from('programs').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            title: d.title,
            shortDescription: d.short_description,
            fullDescription: d.full_description,
            objectives: d.objectives || [],
            impactStats: d.impact_stats,
            iconName: d.icon_name || 'Zap',
            image: d.image,
            category: d.category,
            beneficiariesTarget: d.beneficiaries_target,
            date: d.date,
            status: d.status || 'Active',
            isPublished: d.is_published ?? true
          }));
        }
      }
      return getLocal<Program[]>(STORAGE_KEYS.PROGRAMS, INITIAL_PROGRAMS);
    },

    async getPublished(): Promise<Program[]> {
      const all = await api.programs.getAll();
      return all.filter(p => p.isPublished !== false && p.status !== 'Draft');
    },

    async create(programData: Omit<Program, 'id'>): Promise<Program> {
      const id = programData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `prog-${Date.now()}`;
      const newProgram: Program = {
        ...programData,
        id,
        date: programData.date || new Date().toISOString().split('T')[0],
        status: programData.status || 'Active',
        isPublished: programData.isPublished ?? (programData.status !== 'Draft'),
        createdAt: new Date().toISOString()
      };

      try {
        await fetch('/api/programs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProgram)
        });
      } catch (e) {
        // Fallback
      }

      const progs = getLocal<Program[]>(STORAGE_KEYS.PROGRAMS, INITIAL_PROGRAMS);
      progs.unshift(newProgram);
      setLocal(STORAGE_KEYS.PROGRAMS, progs);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('programs').insert({
          id,
          title: newProgram.title,
          short_description: newProgram.shortDescription,
          full_description: newProgram.fullDescription,
          objectives: newProgram.objectives,
          impact_stats: newProgram.impactStats,
          icon_name: newProgram.iconName,
          image: newProgram.image,
          category: newProgram.category,
          beneficiaries_target: newProgram.beneficiariesTarget,
          is_published: newProgram.isPublished
        });
      }
      return newProgram;
    },

    async update(id: string, updates: Partial<Program>): Promise<Program | null> {
      try {
        await fetch(`/api/programs/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
      } catch (e) {
        // Fallback
      }

      const progs = getLocal<Program[]>(STORAGE_KEYS.PROGRAMS, INITIAL_PROGRAMS);
      const idx = progs.findIndex(p => p.id === id);
      if (idx !== -1) {
        progs[idx] = { ...progs[idx], ...updates };
        setLocal(STORAGE_KEYS.PROGRAMS, progs);

        if (isSupabaseConfigured && supabase) {
          const payload: any = {};
          if (updates.title) payload.title = updates.title;
          if (updates.shortDescription) payload.short_description = updates.shortDescription;
          if (updates.fullDescription) payload.full_description = updates.fullDescription;
          if (updates.objectives) payload.objectives = updates.objectives;
          if (updates.impactStats) payload.impact_stats = updates.impactStats;
          if (updates.iconName) payload.icon_name = updates.iconName;
          if (updates.image) payload.image = updates.image;
          if (updates.category) payload.category = updates.category;
          if (updates.beneficiariesTarget) payload.beneficiaries_target = updates.beneficiariesTarget;
          if (updates.isPublished !== undefined) payload.is_published = updates.isPublished;
          await supabase.from('programs').update(payload).eq('id', id);
        }
        return progs[idx];
      }
      return null;
    },

    async togglePublish(id: string): Promise<boolean> {
      const progs = getLocal<Program[]>(STORAGE_KEYS.PROGRAMS, INITIAL_PROGRAMS);
      const prog = progs.find(p => p.id === id);
      if (!prog) return false;
      prog.isPublished = !prog.isPublished;
      setLocal(STORAGE_KEYS.PROGRAMS, progs);

      try {
        await fetch(`/api/programs/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isPublished: prog.isPublished })
        });
      } catch (e) {
        // Fallback
      }

      if (isSupabaseConfigured && supabase) {
        await supabase.from('programs').update({ is_published: prog.isPublished }).eq('id', id);
      }
      return true;
    },

    async delete(id: string): Promise<boolean> {
      try {
        await fetch(`/api/programs/${id}`, { method: 'DELETE' });
      } catch (e) {
        // Fallback
      }

      let progs = getLocal<Program[]>(STORAGE_KEYS.PROGRAMS, INITIAL_PROGRAMS);
      progs = progs.filter(p => p.id !== id);
      setLocal(STORAGE_KEYS.PROGRAMS, progs);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('programs').delete().eq('id', id);
      }
      return true;
    }
  },

  // 7b. CONTACT MESSAGES API
  contact: {
    async getAll(): Promise<ContactMessage[]> {
      try {
        const res = await fetch('/api/contact');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setLocal(STORAGE_KEYS.CONTACT_MESSAGES, data);
            return data;
          }
        }
      } catch (e) {
        // Fallback
      }
      return getLocal<ContactMessage[]>(STORAGE_KEYS.CONTACT_MESSAGES, INITIAL_CONTACT_MESSAGES);
    },

    async create(msgData: { name: string; email: string; phone?: string; subject: string; message: string }): Promise<ContactMessage> {
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(msgData)
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            const list = getLocal<ContactMessage[]>(STORAGE_KEYS.CONTACT_MESSAGES, INITIAL_CONTACT_MESSAGES);
            list.unshift(json.data);
            setLocal(STORAGE_KEYS.CONTACT_MESSAGES, list);
            return json.data;
          }
        }
      } catch (e) {
        // Fallback
      }

      const now = new Date();
      const dateStr = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
      const newMsg: ContactMessage = {
        id: `msg-${Date.now()}`,
        name: msgData.name,
        email: msgData.email,
        phone: msgData.phone,
        subject: msgData.subject,
        message: msgData.message,
        isRead: false,
        status: 'unread',
        createdAt: dateStr
      };

      const list = getLocal<ContactMessage[]>(STORAGE_KEYS.CONTACT_MESSAGES, INITIAL_CONTACT_MESSAGES);
      list.unshift(newMsg);
      setLocal(STORAGE_KEYS.CONTACT_MESSAGES, list);
      return newMsg;
    },

    async toggleRead(id: string, isRead?: boolean): Promise<boolean> {
      try {
        await fetch(`/api/contact/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isRead })
        });
      } catch (e) {
        // Fallback
      }

      const list = getLocal<ContactMessage[]>(STORAGE_KEYS.CONTACT_MESSAGES, INITIAL_CONTACT_MESSAGES);
      const item = list.find(m => m.id === id);
      if (item) {
        item.isRead = typeof isRead === 'boolean' ? isRead : !item.isRead;
        item.status = item.isRead ? 'read' : 'unread';
        setLocal(STORAGE_KEYS.CONTACT_MESSAGES, list);
        return true;
      }
      return false;
    },

    async delete(id: string): Promise<boolean> {
      try {
        await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      } catch (e) {
        // Fallback
      }

      let list = getLocal<ContactMessage[]>(STORAGE_KEYS.CONTACT_MESSAGES, INITIAL_CONTACT_MESSAGES);
      list = list.filter(m => m.id !== id);
      setLocal(STORAGE_KEYS.CONTACT_MESSAGES, list);
      return true;
    }
  },

  // 8. MEMBERSHIP APPLICATIONS API
  memberships: {
    async getAll(): Promise<MembershipRecord[]> {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.from('membership_applications').select('*').order('applied_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            applicationId: d.application_id,
            fullName: d.full_name,
            email: d.email,
            phone: d.phone,
            dob: d.dob,
            address: d.address || '',
            city: d.city,
            state: d.state,
            country: d.country || 'India',
            areaOfInterest: d.area_of_interest,
            motivation: d.motivation,
            appliedAt: d.applied_at ? new Date(d.applied_at).toLocaleString() : 'Recent',
            status: d.status
          }));
        }
      }
      return getLocal<MembershipRecord[]>(STORAGE_KEYS.MEMBERSHIPS, SEED_MEMBERSHIPS);
    },

    async create(data: Omit<MembershipRecord, 'applicationId' | 'appliedAt' | 'status'>): Promise<MembershipRecord> {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const applicationId = `GYF-MEM-2026-${randomNum}`;
      const now = new Date();
      const appliedAt = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

      const newRecord: MembershipRecord = {
        ...data,
        applicationId,
        appliedAt,
        status: 'Pending Review'
      };

      const list = getLocal<MembershipRecord[]>(STORAGE_KEYS.MEMBERSHIPS, SEED_MEMBERSHIPS);
      list.unshift(newRecord);
      setLocal(STORAGE_KEYS.MEMBERSHIPS, list);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('membership_applications').insert({
          application_id: applicationId,
          full_name: newRecord.fullName,
          email: newRecord.email,
          phone: newRecord.phone,
          dob: newRecord.dob,
          address: newRecord.address,
          city: newRecord.city,
          state: newRecord.state,
          country: newRecord.country,
          area_of_interest: newRecord.areaOfInterest,
          motivation: newRecord.motivation,
          status: 'Pending Review'
        });
      }
      return newRecord;
    },

    async updateStatus(applicationId: string, status: 'Pending Review' | 'Approved' | 'Active Member' | 'Rejected'): Promise<boolean> {
      const list = getLocal<MembershipRecord[]>(STORAGE_KEYS.MEMBERSHIPS, SEED_MEMBERSHIPS);
      const record = list.find(m => m.applicationId === applicationId);
      if (!record) return false;
      record.status = status;
      setLocal(STORAGE_KEYS.MEMBERSHIPS, list);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('membership_applications').update({ status }).eq('application_id', applicationId);
      }
      return true;
    },

    async delete(applicationId: string): Promise<boolean> {
      let list = getLocal<MembershipRecord[]>(STORAGE_KEYS.MEMBERSHIPS, SEED_MEMBERSHIPS);
      list = list.filter(m => m.applicationId !== applicationId);
      setLocal(STORAGE_KEYS.MEMBERSHIPS, list);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('membership_applications').delete().eq('application_id', applicationId);
      }
      return true;
    }
  },

  // 9. CHATBOT FAQS & LOGS API
  chatbot: {
    async getFaqs(): Promise<FAQItem[]> {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.from('chatbot_faqs').select('*').order('created_at', { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            question: d.question,
            answer: d.answer,
            category: d.category as any,
            isActive: d.is_active ?? true
          }));
        }
      }
      return getLocal<FAQItem[]>(STORAGE_KEYS.CHATBOT_FAQS, INITIAL_FAQS);
    },

    async createFaq(faq: Omit<FAQItem, 'id'>): Promise<FAQItem> {
      const id = `faq-${Date.now()}`;
      const newFaq: FAQItem = { ...faq, id, isActive: true };
      const faqs = getLocal<FAQItem[]>(STORAGE_KEYS.CHATBOT_FAQS, INITIAL_FAQS);
      faqs.push(newFaq);
      setLocal(STORAGE_KEYS.CHATBOT_FAQS, faqs);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('chatbot_faqs').insert({
          question: newFaq.question,
          answer: newFaq.answer,
          category: newFaq.category,
          is_active: true
        });
      }
      return newFaq;
    },

    async updateFaq(id: string, updates: Partial<FAQItem>): Promise<FAQItem | null> {
      const faqs = getLocal<FAQItem[]>(STORAGE_KEYS.CHATBOT_FAQS, INITIAL_FAQS);
      const idx = faqs.findIndex(f => f.id === id);
      if (idx !== -1) {
        faqs[idx] = { ...faqs[idx], ...updates };
        setLocal(STORAGE_KEYS.CHATBOT_FAQS, faqs);

        if (isSupabaseConfigured && supabase) {
          await supabase.from('chatbot_faqs').update({
            question: updates.question,
            answer: updates.answer,
            category: updates.category,
            is_active: updates.isActive
          }).eq('id', id);
        }
        return faqs[idx];
      }
      return null;
    },

    async deleteFaq(id: string): Promise<boolean> {
      let faqs = getLocal<FAQItem[]>(STORAGE_KEYS.CHATBOT_FAQS, INITIAL_FAQS);
      faqs = faqs.filter(f => f.id !== id);
      setLocal(STORAGE_KEYS.CHATBOT_FAQS, faqs);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('chatbot_faqs').delete().eq('id', id);
      }
      return true;
    },

    async logQuery(query: string, response: string, userEmail?: string): Promise<void> {
      const log: ChatbotQueryLog = {
        id: `chatlog-${Date.now()}`,
        userEmail,
        query,
        response,
        createdAt: new Date().toISOString()
      };
      const logs = getLocal<ChatbotQueryLog[]>(STORAGE_KEYS.CHATBOT_LOGS, []);
      logs.unshift(log);
      if (logs.length > 50) logs.pop();
      setLocal(STORAGE_KEYS.CHATBOT_LOGS, logs);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('chatbot_queries').insert({
          user_email: userEmail,
          query,
          response
        });
      }
    },

    async getQueryLogs(): Promise<ChatbotQueryLog[]> {
      return getLocal<ChatbotQueryLog[]>(STORAGE_KEYS.CHATBOT_LOGS, []);
    }
  },

  // 10. ACTIVITY LOGS API
  activity: {
    async getLogs(): Promise<ActivityLog[]> {
      return getLocal<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, [
        {
          id: 'act-1',
          userId: 'usr-gyf-admin-01',
          userName: 'Executive Administrator',
          action: 'Resolved Grievance',
          module: 'Grievance System',
          details: 'Grievance GYF-2026-847291 status updated to Resolved with sanction order verified.',
          timestamp: '2 hours ago'
        },
        {
          id: 'act-2',
          userId: 'usr-gyf-admin-01',
          userName: 'Executive Administrator',
          action: 'Verified Donation',
          module: 'Donations',
          details: 'Verified bank transfer UTR-JAKB-2901928371 for INR 15,000.',
          timestamp: '5 hours ago'
        },
        {
          id: 'act-3',
          userId: 'usr-gyf-vol-01',
          userName: 'Aisha Begum',
          action: 'Field Inspection',
          module: 'Grievance Taskforce',
          details: 'Completed on-site plastic waste inspection for GYF-2026-319042.',
          timestamp: '1 day ago'
        }
      ]);
    },

    async log(userId: string, userName: string, action: string, module: string, details: string): Promise<void> {
      const newLog: ActivityLog = {
        id: `act-${Date.now()}`,
        userId,
        userName,
        action,
        module,
        details,
        timestamp: 'Just now'
      };
      const logs = getLocal<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, []);
      logs.unshift(newLog);
      if (logs.length > 100) logs.pop();
      setLocal(STORAGE_KEYS.ACTIVITY_LOGS, logs);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('activity_logs').insert({
          user_id: userId,
          user_name: userName,
          action,
          module,
          details
        });
      }
    }
  },

  // 11. NOTIFICATIONS API
  notifications: {
    async getAll(): Promise<any[]> {
      return getLocal<any[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    },

    async broadcast(notification: {
      title: string;
      message: string;
      type: 'info' | 'complaint' | 'membership' | 'event';
      actionUrl?: string;
    }): Promise<any> {
      const newNotif = {
        id: `notif-${Date.now()}`,
        title: notification.title,
        message: notification.message,
        date: 'Just now',
        isRead: false,
        type: notification.type,
        actionUrl: notification.actionUrl || '/events'
      };
      const notifs = getLocal<any[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
      notifs.unshift(newNotif);
      setLocal(STORAGE_KEYS.NOTIFICATIONS, notifs);
      return newNotif;
    },

    async markAsRead(id: string): Promise<void> {
      const notifs = getLocal<any[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
      const updated = notifs.map(n => n.id === id ? { ...n, isRead: true } : n);
      setLocal(STORAGE_KEYS.NOTIFICATIONS, updated);
    },

    async delete(id: string): Promise<boolean> {
      let notifs = getLocal<any[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
      notifs = notifs.filter(n => n.id !== id);
      setLocal(STORAGE_KEYS.NOTIFICATIONS, notifs);
      return true;
    },

    async clearAll(): Promise<void> {
      setLocal(STORAGE_KEYS.NOTIFICATIONS, []);
    }
  },

  // 12. VOLUNTEER DASHBOARD SECURE API (SCOPED EXCLUSIVELY TO LOGGED-IN VOLUNTEER)
  volunteerData: {
    // 12.1 Programs Assigned to Volunteer
    async getPrograms(volunteerId: string): Promise<VolunteerProgramAssignment[]> {
      if (!volunteerId) return [];
      const allAssignments = getLocal<VolunteerProgramAssignment[]>(STORAGE_KEYS.VOLUNTEER_PROGRAMS, SEED_VOLUNTEER_PROGRAMS);
      return allAssignments.filter(p => p.volunteerId === volunteerId);
    },

    async updateProgramProgress(
      assignmentId: string, 
      volunteerId: string, 
      progress: number, 
      newNote?: string,
      volunteerName?: string
    ): Promise<VolunteerProgramAssignment | null> {
      if (!volunteerId) throw new Error('Unauthorized volunteer request');
      const all = getLocal<VolunteerProgramAssignment[]>(STORAGE_KEYS.VOLUNTEER_PROGRAMS, SEED_VOLUNTEER_PROGRAMS);
      const index = all.findIndex(p => p.id === assignmentId && p.volunteerId === volunteerId);
      if (index === -1) {
        throw new Error('Program assignment not found or access denied');
      }

      const clampedProgress = Math.max(0, Math.min(100, progress));
      const target = all[index];
      const updatedNotes = [...(target.activityNotes || [])];

      if (newNote && newNote.trim()) {
        const nowStr = new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        updatedNotes.unshift({
          id: `note-${Date.now()}`,
          note: newNote.trim(),
          timestamp: nowStr,
          addedBy: volunteerName || target.volunteerName || 'Volunteer'
        });
      }

      const newStatus = clampedProgress >= 100 ? 'Completed' : (clampedProgress > 0 ? 'In Progress' : target.status);
      const updatedAssignment: VolunteerProgramAssignment = {
        ...target,
        progress: clampedProgress,
        status: newStatus,
        activityNotes: updatedNotes,
        updatedAt: new Date().toISOString()
      };

      all[index] = updatedAssignment;
      setLocal(STORAGE_KEYS.VOLUNTEER_PROGRAMS, all);

      // Also log activity for transparency to Admin
      await api.activity.log(
        volunteerId,
        volunteerName || target.volunteerName || 'Volunteer',
        'Volunteer Progress Update',
        'Programs',
        `Volunteer updated progress on program "${target.programTitle}" to ${clampedProgress}%`
      );

      return updatedAssignment;
    },

    // 12.2 Events Assigned to Volunteer
    async getEvents(volunteerId: string): Promise<VolunteerEventAssignment[]> {
      if (!volunteerId) return [];
      const all = getLocal<VolunteerEventAssignment[]>(STORAGE_KEYS.VOLUNTEER_EVENTS, SEED_VOLUNTEER_EVENTS);
      return all.filter(e => e.volunteerId === volunteerId);
    },

    async updateEventStatus(
      assignmentId: string, 
      volunteerId: string, 
      status: 'Assigned' | 'In Progress' | 'Completed', 
      isCompleted: boolean, 
      newNote?: string,
      volunteerName?: string
    ): Promise<VolunteerEventAssignment | null> {
      if (!volunteerId) throw new Error('Unauthorized volunteer request');
      const all = getLocal<VolunteerEventAssignment[]>(STORAGE_KEYS.VOLUNTEER_EVENTS, SEED_VOLUNTEER_EVENTS);
      const index = all.findIndex(e => e.id === assignmentId && e.volunteerId === volunteerId);
      if (index === -1) {
        throw new Error('Event assignment not found or access denied');
      }

      const target = all[index];
      const updatedNotes = [...(target.notes || [])];

      if (newNote && newNote.trim()) {
        const nowStr = new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        updatedNotes.unshift({
          id: `ne-${Date.now()}`,
          note: newNote.trim(),
          timestamp: nowStr,
          addedBy: volunteerName || target.volunteerName || 'Volunteer'
        });
      }

      const updatedEvent: VolunteerEventAssignment = {
        ...target,
        status,
        isCompleted: status === 'Completed' ? true : isCompleted,
        notes: updatedNotes,
        updatedAt: new Date().toISOString()
      };

      all[index] = updatedEvent;
      setLocal(STORAGE_KEYS.VOLUNTEER_EVENTS, all);

      // Log activity
      await api.activity.log(
        volunteerId,
        volunteerName || target.volunteerName || 'Volunteer',
        'Volunteer Event Status Update',
        'Events',
        `Volunteer updated event status for "${target.eventTitle}" to ${status}`
      );

      return updatedEvent;
    },

    // 12.3 Grievances Assigned to Volunteer
    async getGrievances(volunteerId: string): Promise<GrievanceRecord[]> {
      if (!volunteerId) return [];
      const all = getLocal<GrievanceRecord[]>(STORAGE_KEYS.GRIEVANCES, INITIAL_COMPLAINTS);
      return all.filter(g => g.assignedVolunteerId === volunteerId);
    },

    async updateGrievanceStatus(
      grievanceId: string,
      volunteerId: string,
      status: 'Assigned' | 'In Progress' | 'Resolved',
      remark: string,
      volunteerName: string
    ): Promise<GrievanceRecord | null> {
      if (!volunteerId) throw new Error('Unauthorized volunteer request');
      const all = getLocal<GrievanceRecord[]>(STORAGE_KEYS.GRIEVANCES, INITIAL_COMPLAINTS);
      const index = all.findIndex(g => g.id === grievanceId && g.assignedVolunteerId === volunteerId);
      if (index === -1) {
        throw new Error('Grievance not found or not assigned to you');
      }

      const target = all[index];
      const nowStr = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const newTimelineEntry: ComplaintTimelineEvent = {
        status: status as ComplaintStatus,
        date: nowStr,
        description: remark && remark.trim() ? remark.trim() : `Volunteer updated status to ${status}`,
        updatedBy: `${volunteerName} (Field Volunteer)`
      };

      const updatedGrievance: GrievanceRecord = {
        ...target,
        currentStatus: status as ComplaintStatus,
        timeline: [...(target.timeline || []), newTimelineEntry]
      };

      all[index] = updatedGrievance;
      setLocal(STORAGE_KEYS.GRIEVANCES, all);

      // Also log activity visible to Admin
      await api.activity.log(
        volunteerId,
        volunteerName,
        'Volunteer Grievance Update',
        'Grievances',
        `Volunteer ${volunteerName} updated Grievance [${grievanceId}] to ${status}`
      );

      return updatedGrievance;
    },

    // 12.4 Tasks Assigned to Volunteer
    async getTasks(volunteerId: string): Promise<VolunteerTaskItem[]> {
      if (!volunteerId) return [];
      const all = getLocal<VolunteerTaskItem[]>(STORAGE_KEYS.VOLUNTEER_TASKS, SEED_VOLUNTEER_TASKS);
      return all.filter(t => t.volunteerId === volunteerId);
    },

    async updateTaskStatus(
      taskId: string,
      volunteerId: string,
      status: 'Pending' | 'In Progress' | 'Completed',
      newNote?: string
    ): Promise<VolunteerTaskItem | null> {
      if (!volunteerId) throw new Error('Unauthorized volunteer request');
      const all = getLocal<VolunteerTaskItem[]>(STORAGE_KEYS.VOLUNTEER_TASKS, SEED_VOLUNTEER_TASKS);
      const index = all.findIndex(t => t.id === taskId && t.volunteerId === volunteerId);
      if (index === -1) {
        throw new Error('Task not found or not assigned to you');
      }

      const target = all[index];
      const updatedNotes = [...(target.progressNotes || [])];

      if (newNote && newNote.trim()) {
        const nowStr = new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        updatedNotes.unshift({
          id: `tn-${Date.now()}`,
          note: newNote.trim(),
          timestamp: nowStr
        });
      }

      const updatedTask: VolunteerTaskItem = {
        ...target,
        status,
        progressNotes: updatedNotes,
        completedAt: status === 'Completed' ? new Date().toISOString() : target.completedAt,
        updatedAt: new Date().toISOString()
      };

      all[index] = updatedTask;
      setLocal(STORAGE_KEYS.VOLUNTEER_TASKS, all);

      return updatedTask;
    },

    // 12.5 Notifications
    async getNotifications(volunteerId: string): Promise<VolunteerNotificationItem[]> {
      if (!volunteerId) return [];
      const all = getLocal<VolunteerNotificationItem[]>(STORAGE_KEYS.VOLUNTEER_NOTIFICATIONS, SEED_VOLUNTEER_NOTIFICATIONS);
      return all.filter(n => n.volunteerId === volunteerId || n.volunteerId === 'all_volunteers');
    },

    async markNotificationRead(id: string, volunteerId: string): Promise<void> {
      if (!volunteerId) return;
      const all = getLocal<VolunteerNotificationItem[]>(STORAGE_KEYS.VOLUNTEER_NOTIFICATIONS, SEED_VOLUNTEER_NOTIFICATIONS);
      const updated = all.map(n => {
        if (n.id === id && (n.volunteerId === volunteerId || n.volunteerId === 'all_volunteers')) {
          return { ...n, isRead: true };
        }
        return n;
      });
      setLocal(STORAGE_KEYS.VOLUNTEER_NOTIFICATIONS, updated);
    },

    async markAllNotificationsRead(volunteerId: string): Promise<void> {
      if (!volunteerId) return;
      const all = getLocal<VolunteerNotificationItem[]>(STORAGE_KEYS.VOLUNTEER_NOTIFICATIONS, SEED_VOLUNTEER_NOTIFICATIONS);
      const updated = all.map(n => {
        if (n.volunteerId === volunteerId || n.volunteerId === 'all_volunteers') {
          return { ...n, isRead: true };
        }
        return n;
      });
      setLocal(STORAGE_KEYS.VOLUNTEER_NOTIFICATIONS, updated);
    },

    // 12.6 Profile & Hours
    async updateProfile(volunteerId: string, updates: Partial<UserAccount>): Promise<UserAccount | null> {
      if (!volunteerId) throw new Error('Unauthorized volunteer request');
      
      // CRITICAL: Strip role or permission updates from volunteer payload
      const safeUpdates: Partial<UserAccount> = {
        fullName: updates.fullName,
        phone: updates.phone,
        avatar: updates.avatar,
        bio: updates.bio,
        city: updates.city,
        bloodGroup: updates.bloodGroup,
        emergencyContact: updates.emergencyContact,
        skills: updates.skills
      };

      const users = getLocal<UserAccount[]>(STORAGE_KEYS.USERS, SEED_USERS);
      const index = users.findIndex(u => u.id === volunteerId);
      if (index === -1) throw new Error('Volunteer account not found');

      const updatedUser: UserAccount = {
        ...users[index],
        ...safeUpdates
      };

      users[index] = updatedUser;
      setLocal(STORAGE_KEYS.USERS, users);

      return updatedUser;
    },

    async logVolunteerHours(volunteerId: string, hours: number, description: string): Promise<number> {
      if (!volunteerId) throw new Error('Unauthorized volunteer request');
      const users = getLocal<UserAccount[]>(STORAGE_KEYS.USERS, SEED_USERS);
      const index = users.findIndex(u => u.id === volunteerId);
      if (index === -1) throw new Error('Volunteer account not found');

      const currentHours = users[index].volunteerHours || 0;
      const newTotal = currentHours + Math.max(0, hours);
      users[index].volunteerHours = newTotal;
      setLocal(STORAGE_KEYS.USERS, users);

      await api.activity.log(
        volunteerId,
        users[index].fullName,
        'Volunteer Hours Logged',
        'Volunteer',
        `Volunteer ${users[index].fullName} logged ${hours} hour(s): "${description}"`
      );

      return newTotal;
    },

    // 12.7 Activity & Field Reports
    async getActivityReports(volunteerId?: string): Promise<VolunteerActivityReport[]> {
      const all = getLocal<VolunteerActivityReport[]>(STORAGE_KEYS.VOLUNTEER_ACTIVITY_REPORTS, SEED_VOLUNTEER_REPORTS);
      if (volunteerId) {
        return all.filter(r => r.volunteerId === volunteerId);
      }
      return all;
    },

    async submitActivityReport(
      reportData: Omit<VolunteerActivityReport, 'id' | 'createdAt' | 'status'>
    ): Promise<VolunteerActivityReport> {
      const all = getLocal<VolunteerActivityReport[]>(STORAGE_KEYS.VOLUNTEER_ACTIVITY_REPORTS, SEED_VOLUNTEER_REPORTS);
      const newReport: VolunteerActivityReport = {
        ...reportData,
        id: `rep-${Date.now()}`,
        status: 'Submitted',
        createdAt: new Date().toISOString()
      };
      all.unshift(newReport);
      setLocal(STORAGE_KEYS.VOLUNTEER_ACTIVITY_REPORTS, all);

      if (reportData.hoursSpent > 0 && reportData.volunteerId) {
        const users = getLocal<UserAccount[]>(STORAGE_KEYS.USERS, SEED_USERS);
        const uIdx = users.findIndex(u => u.id === reportData.volunteerId);
        if (uIdx !== -1) {
          users[uIdx].volunteerHours = (users[uIdx].volunteerHours || 0) + reportData.hoursSpent;
          setLocal(STORAGE_KEYS.USERS, users);
        }
      }

      await api.activity.log(
        reportData.volunteerId,
        reportData.volunteerName,
        'Field Activity Report Submitted',
        'Volunteer',
        `Submitted progress update: "${reportData.title}" (${reportData.category})`
      );

      return newReport;
    },

    async reviewActivityReport(reportId: string, feedback: string): Promise<VolunteerActivityReport> {
      const all = getLocal<VolunteerActivityReport[]>(STORAGE_KEYS.VOLUNTEER_ACTIVITY_REPORTS, SEED_VOLUNTEER_REPORTS);
      const index = all.findIndex(r => r.id === reportId);
      if (index === -1) throw new Error('Activity report not found');

      all[index] = {
        ...all[index],
        status: 'Reviewed by Admin',
        adminFeedback: feedback
      };
      setLocal(STORAGE_KEYS.VOLUNTEER_ACTIVITY_REPORTS, all);

      // Create notification for volunteer
      await api.volunteerData.sendNotification(
        all[index].volunteerId,
        'Admin Feedback on Field Report',
        `Admin reviewed your report "${all[index].title}": "${feedback.substring(0, 80)}..."`,
        'announcement',
        'activity-reports'
      );

      return all[index];
    },

    // 12.8 Admin Assignment Actions (Admin assigns work -> Volunteer receives it)
    async assignProgram(
      programId: string,
      volunteerId: string,
      assignedRole: string,
      customLocation?: string
    ): Promise<VolunteerProgramAssignment> {
      const programs = getLocal<Program[]>(STORAGE_KEYS.PROGRAMS, INITIAL_PROGRAMS);
      const prog = programs.find(p => p.id === programId);
      const users = getLocal<UserAccount[]>(STORAGE_KEYS.USERS, SEED_USERS);
      const vol = users.find(u => u.id === volunteerId);

      const all = getLocal<VolunteerProgramAssignment[]>(STORAGE_KEYS.VOLUNTEER_PROGRAMS, SEED_VOLUNTEER_PROGRAMS);
      
      const newAssignment: VolunteerProgramAssignment = {
        id: `vpa-${Date.now()}`,
        volunteerId,
        volunteerName: vol?.fullName || 'Volunteer',
        programId,
        programTitle: prog?.title || 'Community Program',
        category: prog?.category || 'Youth Welfare',
        location: customLocation || 'Kashmir Division',
        assignedRole,
        progress: 0,
        progressPercentage: 0,
        status: 'Assigned',
        fieldNotes: [],
        assignedAt: new Date().toISOString()
      };

      all.unshift(newAssignment);
      setLocal(STORAGE_KEYS.VOLUNTEER_PROGRAMS, all);

      await api.volunteerData.sendNotification(
        volunteerId,
        `New Program Responsibility: ${prog?.title || 'Program'}`,
        `You have been assigned as "${assignedRole}" for ${prog?.title || 'this program'}.`,
        'program',
        'programs'
      );

      await api.activity.log(
        'usr-gyf-admin-01',
        'Admin',
        'Program Assigned to Volunteer',
        'Volunteer Management',
        `Assigned program "${prog?.title}" to volunteer ${vol?.fullName || volunteerId}`
      );

      return newAssignment;
    },

    async assignEvent(
      eventId: string,
      volunteerId: string,
      assignedRole: string
    ): Promise<VolunteerEventAssignment> {
      const events = getLocal<EventItem[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
      const evt = events.find(e => e.id === eventId);
      const users = getLocal<UserAccount[]>(STORAGE_KEYS.USERS, SEED_USERS);
      const vol = users.find(u => u.id === volunteerId);

      const all = getLocal<VolunteerEventAssignment[]>(STORAGE_KEYS.VOLUNTEER_EVENTS, SEED_VOLUNTEER_EVENTS);
      
      const newAssignment: VolunteerEventAssignment = {
        id: `vea-${Date.now()}`,
        volunteerId,
        volunteerName: vol?.fullName || 'Volunteer',
        eventId,
        eventTitle: evt?.title || 'Public Event',
        category: evt?.category || 'Community',
        date: evt?.date || 'Upcoming',
        time: evt?.time || '10:00 AM',
        location: evt?.location || 'Srinagar Hub',
        assignedRole,
        status: 'Assigned',
        isCompleted: false,
        notes: [],
        assignedAt: new Date().toISOString()
      };

      all.unshift(newAssignment);
      setLocal(STORAGE_KEYS.VOLUNTEER_EVENTS, all);

      await api.volunteerData.sendNotification(
        volunteerId,
        `New Event Assignment: ${evt?.title || 'Event'}`,
        `You are designated as "${assignedRole}" for event on ${evt?.date || 'upcoming date'}.`,
        'event',
        'events'
      );

      await api.activity.log(
        'usr-gyf-admin-01',
        'Admin',
        'Event Assigned to Volunteer',
        'Volunteer Management',
        `Assigned event "${evt?.title}" to volunteer ${vol?.fullName || volunteerId}`
      );

      return newAssignment;
    },

    async assignTask(
      taskData: Omit<VolunteerTaskItem, 'id' | 'createdAt' | 'status' | 'progressNotes'>
    ): Promise<VolunteerTaskItem> {
      const all = getLocal<VolunteerTaskItem[]>(STORAGE_KEYS.VOLUNTEER_TASKS, SEED_VOLUNTEER_TASKS);
      const newTask: VolunteerTaskItem = {
        ...taskData,
        id: `tsk-${Date.now()}`,
        status: 'Pending',
        progressNotes: [],
        createdAt: new Date().toISOString()
      };

      all.unshift(newTask);
      setLocal(STORAGE_KEYS.VOLUNTEER_TASKS, all);

      await api.volunteerData.sendNotification(
        taskData.volunteerId,
        `New Task: ${taskData.title}`,
        `Task "${taskData.title}" assigned by Admin. Due: ${taskData.dueDate}`,
        'task',
        'tasks'
      );

      await api.activity.log(
        'usr-gyf-admin-01',
        'Admin',
        'Task Assigned to Volunteer',
        'Volunteer Management',
        `Assigned task "${taskData.title}" (Priority: ${taskData.priority}) to volunteer`
      );

      return newTask;
    },

    async sendNotification(
      volunteerId: string,
      title: string,
      message: string,
      type: 'program' | 'event' | 'grievance' | 'task' | 'announcement',
      actionTab?: 'programs' | 'events' | 'grievances' | 'tasks' | 'activity-reports' | 'dashboard'
    ): Promise<VolunteerNotificationItem> {
      const all = getLocal<VolunteerNotificationItem[]>(STORAGE_KEYS.VOLUNTEER_NOTIFICATIONS, SEED_VOLUNTEER_NOTIFICATIONS);
      const newNotif: VolunteerNotificationItem = {
        id: `vnotif-${Date.now()}`,
        volunteerId,
        title,
        message,
        type,
        date: 'Just now',
        isRead: false,
        actionTab,
        createdAt: new Date().toISOString()
      };
      all.unshift(newNotif);
      setLocal(STORAGE_KEYS.VOLUNTEER_NOTIFICATIONS, all);
      return newNotif;
    }
  }
};
