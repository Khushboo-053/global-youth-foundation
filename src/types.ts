export type UserRole = 'admin' | 'volunteer' | 'user';

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  joinedDate: string;
  membershipStatus: 'Member' | 'Volunteer' | 'Applicant' | 'Guest' | 'Admin';
  membershipId?: string;
  avatar?: string;
  city?: string;
  country?: string;
  role: UserRole;
  roleTitle?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  chapter?: string;
  skills?: string[];
  bio?: string;
  volunteerHours?: number;
  isActive: boolean;
  createdAt?: string;
}

export interface VolunteerPermissions {
  volunteerId: string;
  canManageGrievances: boolean;
  canManageEvents: boolean;
  canManagePrograms: boolean;
  canViewMembers: boolean;
  assignedChapter: string;
  notes?: string;
}

export interface VolunteerProgramAssignment {
  id: string;
  programId: string;
  volunteerId: string;
  volunteerName?: string;
  programTitle: string;
  category: string;
  image?: string;
  fullDescription?: string;
  shortDescription?: string;
  objectives?: string[];
  impactStats?: string;
  beneficiariesTarget?: string;
  assignedRole: string;
  location: string;
  date: string;
  progress: number; // 0 - 100
  status: 'Assigned' | 'In Progress' | 'Completed';
  activityNotes: { id: string; note: string; timestamp: string; addedBy: string }[];
  assignedAt: string;
  updatedAt?: string;
}

export interface VolunteerEventAssignment {
  id: string;
  eventId: string;
  volunteerId: string;
  volunteerName?: string;
  eventTitle: string;
  category: string;
  image?: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  assignedRole: string;
  status: 'Assigned' | 'In Progress' | 'Completed';
  isCompleted: boolean;
  notes: { id: string; note: string; timestamp: string; addedBy: string }[];
  assignedAt: string;
  updatedAt?: string;
}

export interface VolunteerTaskItem {
  id: string;
  volunteerId: string;
  volunteerName?: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  relatedType: 'Program' | 'Event' | 'Grievance' | 'General';
  relatedTitle: string;
  relatedId?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Pending' | 'In Progress' | 'Completed';
  progressNotes: { id: string; note: string; timestamp: string }[];
  completedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface VolunteerNotificationItem {
  id: string;
  volunteerId: string;
  title: string;
  message: string;
  type: 'program' | 'event' | 'grievance' | 'task' | 'announcement';
  date: string;
  isRead: boolean;
  actionTab?: 'programs' | 'events' | 'grievances' | 'tasks' | 'activity-reports' | 'dashboard';
  createdAt: string;
}

export interface VolunteerActivityReport {
  id: string;
  volunteerId: string;
  volunteerName: string;
  title: string;
  category: 'Field Inspection' | 'Community Outreach' | 'Awareness Campaign' | 'Workshop & Logistics' | 'Grievance Follow-up' | 'General Activity';
  relatedType: 'Program' | 'Event' | 'Grievance' | 'General';
  relatedId?: string;
  relatedTitle?: string;
  date: string;
  hoursSpent: number;
  location: string;
  summary: string;
  accomplishments: string;
  challenges?: string;
  attachmentUrl?: string;
  status: 'Submitted' | 'Reviewed by Admin';
  adminFeedback?: string;
  createdAt: string;
}

export interface Program {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  objectives: string[];
  impactStats: string;
  iconName: string;
  image: string;
  category: string;
  beneficiariesTarget: string;
  date?: string;
  status?: 'Active' | 'Upcoming' | 'Completed' | 'Draft';
  isPublished?: boolean;
  createdAt?: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  category: 'Workshop' | 'Campaign' | 'Peacebuilding' | 'Environment' | 'Outreach' | 'Leadership';
  description: string;
  fullDetails?: string;
  image: string;
  status: 'Upcoming' | 'Completed' | 'Draft';
  attendeesCount?: number;
  isPublished?: boolean;
  createdAt?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  registeredAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  shortDescription: string;
  content: string;
  image: string;
  author: string;
  readTime: string;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  location: string;
  story: string;
  image: string;
  program: string;
  year: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Events' | 'Campaigns' | 'Workshops' | 'Community Work' | 'Youth Activities';
  type: 'photo' | 'video';
  url: string;
  thumbnail: string;
  caption: string;
  date: string;
}

export interface ImpactStat {
  id: string;
  label: string;
  value: string;
  numericValue: number;
  suffix: string;
  icon: string;
  description: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Membership' | 'Donations' | 'Grievances' | 'Programs';
  isActive?: boolean;
  createdAt?: string;
}

export type ComplaintStatus = 
  | 'Submitted' 
  | 'Under Review' 
  | 'Assigned' 
  | 'In Progress' 
  | 'Resolved' 
  | 'Closed';

export interface ComplaintTimelineEvent {
  status: ComplaintStatus;
  date: string;
  description: string;
  updatedBy: string;
}

export interface GrievanceRecord {
  id: string;
  category: string;
  subject: string;
  description: string;
  location: string;
  isAnonymous: boolean;
  complainantEmail?: string;
  complainantPhone?: string;
  attachmentName?: string;
  attachmentSize?: string;
  submittedAt: string;
  currentStatus: ComplaintStatus;
  timeline: ComplaintTimelineEvent[];
  assignedDepartment?: string;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
}

export interface MembershipRecord {
  applicationId: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  country: string;
  areaOfInterest: string;
  motivation: string;
  appliedAt: string;
  status: 'Pending Review' | 'Approved' | 'Active Member' | 'Rejected';
}

export interface DonationRecord {
  id: string;
  donorName: string;
  email: string;
  phone: string;
  amount: number;
  currency: string;
  donationDate: string;
  paymentStatus: 'Verified' | 'Pending Verification' | 'Failed';
  transactionId: string;
  notes?: string;
  createdAt: string;
}

export interface LegalAidAppointment {
  id: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  citizenName: string;
  phone: string;
  summary: string;
  status: 'Confirmed' | 'Pending Review' | 'Completed';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'info' | 'complaint' | 'membership' | 'event' | 'alert' | 'warning' | 'success';
  actionUrl?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  targetRole?: UserRole | 'all';
  actionLink?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string; path?: string }[];
}

export interface ChatbotQueryLog {
  id: string;
  userEmail?: string;
  query: string;
  response: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}
