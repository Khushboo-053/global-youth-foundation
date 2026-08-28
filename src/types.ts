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
  status: 'Upcoming' | 'Completed';
  attendeesCount?: number;
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
  status: 'Pending Review' | 'Approved' | 'Active Member';
}

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
  role?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  chapter?: string;
  skills?: string[];
  bio?: string;
  volunteerHours?: number;
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
  type: 'info' | 'complaint' | 'membership' | 'event';
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string; path?: string }[];
}
