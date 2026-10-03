-- ==============================================================================
-- GLOBAL YOUTH FOUNDATION (GYF) - SUPABASE DATABASE SCHEMA
-- PostgreSQL Schema with Row Level Security (RLS) & Role-Based Access Control (RBAC)
-- Roles: 'admin', 'volunteer', 'user'
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'volunteer', 'user')),
  role_title TEXT DEFAULT 'Member',
  membership_status TEXT NOT NULL DEFAULT 'Applicant' CHECK (membership_status IN ('Member', 'Volunteer', 'Applicant', 'Guest', 'Admin')),
  membership_id TEXT UNIQUE,
  avatar TEXT,
  city TEXT,
  country TEXT DEFAULT 'India',
  blood_group TEXT,
  emergency_contact TEXT,
  chapter TEXT DEFAULT 'Central Kashmir Hub (Srinagar & Bemina)',
  skills TEXT[] DEFAULT '{}',
  bio TEXT,
  volunteer_hours INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. VOLUNTEER PERMISSIONS TABLE (Managed by Admin)
CREATE TABLE IF NOT EXISTS public.volunteer_permissions (
  volunteer_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  can_manage_grievances BOOLEAN DEFAULT TRUE,
  can_manage_events BOOLEAN DEFAULT TRUE,
  can_manage_programs BOOLEAN DEFAULT FALSE,
  can_view_members BOOLEAN DEFAULT TRUE,
  assigned_chapter TEXT DEFAULT 'Central Kashmir Hub (Srinagar & Bemina)',
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROGRAMS TABLE
CREATE TABLE IF NOT EXISTS public.programs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  objectives TEXT[] NOT NULL DEFAULT '{}',
  impact_stats TEXT,
  icon_name TEXT DEFAULT 'Zap',
  image TEXT,
  category TEXT NOT NULL,
  beneficiaries_target TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  full_details TEXT,
  image TEXT,
  status TEXT NOT NULL DEFAULT 'Upcoming',
  attendees_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EVENT REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- 6. BLOGS / NEWS ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  short_description TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  author TEXT NOT NULL DEFAULT 'GYF Communications Directorate',
  read_time TEXT DEFAULT '3 min read',
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DONATIONS TABLE
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  donation_date TIMESTAMPTZ DEFAULT NOW(),
  payment_status TEXT NOT NULL DEFAULT 'Pending Verification' CHECK (payment_status IN ('Verified', 'Pending Verification', 'Failed')),
  transaction_id TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. GRIEVANCES TABLE
CREATE TABLE IF NOT EXISTS public.grievances (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  complainant_email TEXT,
  complainant_phone TEXT,
  attachment_name TEXT,
  attachment_size TEXT,
  priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
  current_status TEXT NOT NULL DEFAULT 'Submitted' CHECK (current_status IN ('Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed')),
  assigned_department TEXT,
  assigned_volunteer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_volunteer_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. GRIEVANCE TIMELINE EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.grievance_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grievance_id TEXT REFERENCES public.grievances(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. MEMBERSHIP APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.membership_applications (
  application_id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  dob TEXT NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  area_of_interest TEXT NOT NULL,
  motivation TEXT NOT NULL,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'Pending Review' CHECK (status IN ('Pending Review', 'Approved', 'Active Member', 'Rejected'))
);

-- 11. CHATBOT FAQS TABLE
CREATE TABLE IF NOT EXISTS public.chatbot_faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CHATBOT CONVERSATION QUERIES LOG
CREATE TABLE IF NOT EXISTS public.chatbot_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT,
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ACTIVITY LOGS (Auditing actions)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  details TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievance_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin' AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_volunteer()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'volunteer') AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles can be viewed by anyone" ON public.profiles;
CREATE POLICY "Public profiles can be viewed by anyone" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- Volunteer Permissions Policies
DROP POLICY IF EXISTS "Volunteers can view their own permissions" ON public.volunteer_permissions;
CREATE POLICY "Volunteers can view their own permissions" ON public.volunteer_permissions FOR SELECT USING (auth.uid() = volunteer_id OR public.is_admin());
DROP POLICY IF EXISTS "Admins can manage volunteer permissions" ON public.volunteer_permissions;
CREATE POLICY "Admins can manage volunteer permissions" ON public.volunteer_permissions FOR ALL USING (public.is_admin());

-- Programs Policies
DROP POLICY IF EXISTS "Published programs are viewable by everyone" ON public.programs;
CREATE POLICY "Published programs are viewable by everyone" ON public.programs FOR SELECT USING (is_published = true OR public.is_volunteer());
DROP POLICY IF EXISTS "Admins can manage programs" ON public.programs;
CREATE POLICY "Admins can manage programs" ON public.programs FOR ALL USING (public.is_admin());

-- Events Policies
DROP POLICY IF EXISTS "Published events are viewable by everyone" ON public.events;
CREATE POLICY "Published events are viewable by everyone" ON public.events FOR SELECT USING (is_published = true OR public.is_volunteer());
DROP POLICY IF EXISTS "Volunteers and admins can manage events" ON public.events;
CREATE POLICY "Volunteers and admins can manage events" ON public.events FOR ALL USING (public.is_volunteer());

-- Event Registrations Policies
DROP POLICY IF EXISTS "Users can view their own registrations" ON public.event_registrations;
CREATE POLICY "Users can view their own registrations" ON public.event_registrations FOR SELECT USING (auth.uid() = user_id OR public.is_volunteer());
DROP POLICY IF EXISTS "Users can register for events" ON public.event_registrations;
CREATE POLICY "Users can register for events" ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can cancel their registration" ON public.event_registrations;
CREATE POLICY "Users can cancel their registration" ON public.event_registrations FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- Blogs Policies
DROP POLICY IF EXISTS "Published blogs are viewable by everyone" ON public.blogs;
CREATE POLICY "Published blogs are viewable by everyone" ON public.blogs FOR SELECT USING (is_published = true OR public.is_admin());
DROP POLICY IF EXISTS "Admins can manage blogs" ON public.blogs;
CREATE POLICY "Admins can manage blogs" ON public.blogs FOR ALL USING (public.is_admin());

-- Donations Policies
DROP POLICY IF EXISTS "Donors can view their own donations" ON public.donations;
CREATE POLICY "Donors can view their own donations" ON public.donations FOR SELECT USING (email = auth.jwt() ->> 'email' OR public.is_admin());
DROP POLICY IF EXISTS "Anyone can submit a donation report" ON public.donations;
CREATE POLICY "Anyone can submit a donation report" ON public.donations FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can manage donations" ON public.donations;
CREATE POLICY "Admins can manage donations" ON public.donations FOR ALL USING (public.is_admin());

-- Grievances Policies
DROP POLICY IF EXISTS "Anyone can submit a grievance" ON public.grievances;
CREATE POLICY "Anyone can submit a grievance" ON public.grievances FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public can view grievances with tracking ID" ON public.grievances;
CREATE POLICY "Public can view grievances with tracking ID" ON public.grievances FOR SELECT USING (true);
DROP POLICY IF EXISTS "Volunteers and Admins can update grievances" ON public.grievances;
CREATE POLICY "Volunteers and Admins can update grievances" ON public.grievances FOR UPDATE USING (public.is_volunteer());
DROP POLICY IF EXISTS "Admins can delete grievances" ON public.grievances;
CREATE POLICY "Admins can delete grievances" ON public.grievances FOR DELETE USING (public.is_admin());

-- Grievance Timeline Policies
DROP POLICY IF EXISTS "Timeline is viewable with grievance" ON public.grievance_timeline;
CREATE POLICY "Timeline is viewable with grievance" ON public.grievance_timeline FOR SELECT USING (true);
DROP POLICY IF EXISTS "Volunteers and Admins can add timeline events" ON public.grievance_timeline;
CREATE POLICY "Volunteers and Admins can add timeline events" ON public.grievance_timeline FOR INSERT WITH CHECK (public.is_volunteer());

-- Membership Applications Policies
DROP POLICY IF EXISTS "Anyone can apply for membership" ON public.membership_applications;
CREATE POLICY "Anyone can apply for membership" ON public.membership_applications FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Users can view their own applications" ON public.membership_applications;
CREATE POLICY "Users can view their own applications" ON public.membership_applications FOR SELECT USING (email = auth.jwt() ->> 'email' OR public.is_admin() OR public.is_volunteer());
DROP POLICY IF EXISTS "Admins can manage membership applications" ON public.membership_applications;
CREATE POLICY "Admins can manage membership applications" ON public.membership_applications FOR ALL USING (public.is_admin());

-- Chatbot FAQs Policies
DROP POLICY IF EXISTS "Active FAQs viewable by everyone" ON public.chatbot_faqs;
CREATE POLICY "Active FAQs viewable by everyone" ON public.chatbot_faqs FOR SELECT USING (is_active = true OR public.is_admin());
DROP POLICY IF EXISTS "Admins can manage chatbot FAQs" ON public.chatbot_faqs;
CREATE POLICY "Admins can manage chatbot FAQs" ON public.chatbot_faqs FOR ALL USING (public.is_admin());

-- Chatbot Queries Policies
DROP POLICY IF EXISTS "Anyone can log a chatbot query" ON public.chatbot_queries;
CREATE POLICY "Anyone can log a chatbot query" ON public.chatbot_queries FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can view chatbot query logs" ON public.chatbot_queries;
CREATE POLICY "Admins can view chatbot query logs" ON public.chatbot_queries FOR SELECT USING (public.is_admin());

-- Activity Logs Policies
DROP POLICY IF EXISTS "Admins can view activity logs" ON public.activity_logs;
CREATE POLICY "Admins can view activity logs" ON public.activity_logs FOR SELECT USING (public.is_admin());
DROP POLICY IF EXISTS "System and users can insert activity logs" ON public.activity_logs;
CREATE POLICY "System and users can insert activity logs" ON public.activity_logs FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER (When user signs up via Supabase Auth)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, role_title, membership_status, is_active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' = 'admin' THEN 'Administrator'
      WHEN NEW.raw_user_meta_data->>'role' = 'volunteer' THEN 'Youth Volunteer'
      ELSE 'Member'
    END,
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' = 'admin' THEN 'Admin'
      WHEN NEW.raw_user_meta_data->>'role' = 'volunteer' THEN 'Volunteer'
      ELSE 'Applicant'
    END,
    TRUE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
