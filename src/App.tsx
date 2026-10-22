import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { EventsPage } from './pages/EventsPage';
import { ContactPage } from './pages/ContactPage';
import { DonatePage } from './pages/DonatePage';
import { MembershipPage } from './pages/MembershipPage';
import { GrievancePage } from './pages/GrievancePage';
import { TrackComplaintPage } from './pages/TrackComplaintPage';
import { TrackVolunteerPage } from './pages/TrackVolunteerPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { VolunteerDashboardPage } from './pages/VolunteerDashboardPage';
import { BlogsPage } from './pages/BlogsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ArrowLeft, Compass } from 'lucide-react';

// Scroll to top helper on navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
};

// Automatic Background Visitor Tracking (Public Pages only, excluded on Admin routes)
const VisitorTracker: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Exclude internal admin dashboard routes from public visitor stats
    if (pathname.startsWith('/admin')) {
      return;
    }

    try {
      let visitorId = localStorage.getItem('gyf_visitor_id');
      if (!visitorId) {
        visitorId = 'vis_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('gyf_visitor_id', visitorId);
      }

      // Avoid double-counting rapid repeat hits in same tab within 15s
      const sessionKey = 'gyf_last_tracked_' + pathname;
      const lastTracked = sessionStorage.getItem(sessionKey);
      const now = Date.now();
      if (lastTracked && now - parseInt(lastTracked, 10) < 15000) {
        return;
      }
      sessionStorage.setItem(sessionKey, now.toString());

      fetch('/api/visitors/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          path: pathname,
          referrer: document.referrer || '',
          screenWidth: window.innerWidth
        })
      }).catch(() => {});
    } catch {
      // Safe non-blocking fallback
    }
  }, [pathname]);

  return null;
};

// 404 Fallback
const NotFoundPage: React.FC = () => (
  <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto">
        <Compass className="w-7 h-7" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900">404</h1>
      <h2 className="text-lg font-bold text-slate-800">Page Not Found</h2>
      <p className="text-xs text-slate-500">
        The page you are looking for might have been moved or does not exist.
      </p>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs hover:bg-slate-800 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  </div>
);

export function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isVolunteerRoute = location.pathname.startsWith('/volunteer');
  const hidePublicChrome = isLoginPage || isSignupPage || isDashboardRoute || isAdminRoute || isVolunteerRoute;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white font-sans antialiased">
      <ScrollToTop />
      <VisitorTracker />
      
      {/* Global Navigation - hidden on Auth pages and Portals (Normal User, Volunteer, Admin) */}
      {!hidePublicChrome && <Navbar />}

      {/* Main App Content Viewport */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:id" element={<BlogsPage />} />
          <Route path="/blog" element={<BlogsPage />} />
          <Route path="/blog/:id" element={<BlogsPage />} />
          <Route path="/news" element={<BlogsPage />} />
          <Route path="/news/:id" element={<BlogsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/grievance" element={<GrievancePage />} />
          <Route path="/track-complaint" element={<TrackComplaintPage />} />
          <Route path="/track-volunteer" element={<TrackVolunteerPage />} />
          <Route path="/track-application" element={<TrackVolunteerPage />} />
          <Route path="/track-form" element={<TrackVolunteerPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Authenticated Dashboards */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/volunteer" 
            element={
              <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
                <VolunteerDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/volunteer/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
                <VolunteerDashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Global Footer - hidden on Login page, Admin Desk, and Volunteer Dashboards */}
      {!hidePublicChrome && <Footer />}

      {/* Floating AI / Helpdesk Assistant */}
      <Chatbot />
    </div>
  );
}

export default App;
