import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Heart, 
  ShieldCheck, 
  ChevronRight, 
  Phone, 
  Mail,
  Megaphone,
  LogOut,
  HeartHandshake
} from 'lucide-react';
import { ORG_INFO } from '../data/mockData';
import { GyfLogo } from './GyfLogo';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { websiteContent, user, logout } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (
      location.pathname.startsWith('/dashboard') ||
      location.pathname.startsWith('/admin') ||
      location.pathname.startsWith('/volunteer')
    ) {
      navigate('/login');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Events Held', path: '/events' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const displayPhone = websiteContent?.contactPhone || ORG_INFO.phone;
  const displayEmail = websiteContent?.contactEmail || ORG_INFO.email;
  const announcementText = websiteContent?.announcementText?.trim();
  const isAnnouncementActive = websiteContent?.announcementActive !== false && Boolean(announcementText);

  return (
    <>
      {/* Top Banner Announcements - Continuous News Headline Ticker */}
      {isAnnouncementActive && (
        <div 
          id="top-banner-announcements" 
          className="bg-gradient-to-r from-slate-950 via-[#0e1335] to-slate-950 text-white text-xs border-b border-indigo-900/60 overflow-hidden relative z-50 shadow-xs"
        >
          <div className="max-w-7xl mx-auto flex items-center h-8 sm:h-9 px-3 sm:px-4">
            {/* News Headline Ticker Marquee */}
            <div className="flex-1 overflow-hidden relative py-0.5">
              <div 
                className="animate-news-ticker flex items-center gap-10 font-medium text-slate-100 text-xs sm:text-[13px] tracking-wide cursor-default hover:text-white"
                title="Hover to pause announcement"
              >
                <span className="flex items-center gap-2">
                  {announcementText}
                </span>
                <span className="text-amber-400 font-bold opacity-80 select-none">•</span>
                <span className="flex items-center gap-2">
                  {announcementText}
                </span>
                <span className="text-amber-400 font-bold opacity-80 select-none">•</span>
                <span className="flex items-center gap-2">
                  {announcementText}
                </span>
                <span className="text-amber-400 font-bold opacity-80 select-none">•</span>
                <span className="flex items-center gap-2">
                  {announcementText}
                </span>
              </div>
            </div>

            {/* Quick Action Link / Button on Right */}
            <div className="shrink-0 ml-3 hidden md:flex items-center gap-2 z-10 pl-3 border-l border-slate-700/60">
              <Link 
                to="/membership" 
                className="text-[11px] font-semibold text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2.5 py-0.5 rounded border border-amber-400/30"
              >
                <span>Apply / Join</span> <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Top micro bar for quick official contact */}
      <div className="bg-[#1f2360] text-blue-100 text-xs py-1.5 px-4 hidden md:block border-b border-[#2C3292]/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-blue-300" />
              <a href={`tel:${displayPhone}`}>{displayPhone}</a>
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-blue-300" />
              <a href={`mailto:${displayEmail}`}>{displayEmail}</a>
            </span>
          </div>
          <div className="flex items-center gap-4 text-blue-200">
            <Link to="/grievance" className="hover:text-white transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" /> Confidential Grievance Desk
            </Link>
            <span>•</span>
            <Link to="/track-complaint" className="hover:text-white transition-colors flex items-center gap-1">
              <span>Track Complaint</span>
            </Link>
            <span>•</span>
            <Link to="/track-volunteer" className="text-teal-300 hover:text-white font-semibold transition-colors flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-teal-400" />
              <span>Track Volunteer Form</span>
            </Link>
            <span>•</span>
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                id="nav-auth-toggle-btn"
                className="hover:text-rose-300 font-bold text-teal-300 transition-colors cursor-pointer flex items-center gap-1"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            ) : (
              <Link 
                to="/login" 
                id="nav-auth-toggle-btn"
                className="hover:text-white font-bold text-teal-300 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header 
        id="main-navbar"
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/98 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-2.5' 
            : 'bg-white border-b border-slate-100 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Name */}
            <Link 
              to="/" 
              id="nav-brand-logo"
              className="flex items-center group focus:outline-none focus:ring-2 focus:ring-[#2C3292] rounded-lg p-1"
            >
              <GyfLogo size="md" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-3 shrink-0 whitespace-nowrap">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive(link.path)
                      ? 'text-[#2C3292] bg-[#f0f2fc] font-bold shadow-xs'
                      : 'text-slate-600 hover:text-[#2C3292] hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-2.5 shrink-0 whitespace-nowrap">
              <Link
                to="/donate"
                id="nav-donate-btn"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2C3292] hover:bg-[#222665] text-white text-sm font-semibold shadow-xs hover:shadow transition-all duration-200 whitespace-nowrap"
              >
                <Heart className="w-4 h-4 fill-white/20" />
                <span>Donate</span>
              </Link>

              <Link
                to="/grievance"
                id="nav-grievance-btn"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold shadow-xs transition-all duration-200 whitespace-nowrap"
              >
                <ShieldCheck className="w-4 h-4 text-blue-300" />
                <span>Submit Grievance</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center gap-2">
              <Link
                to="/donate"
                id="nav-mobile-donate-quick"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2C3292] text-white text-xs font-semibold"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Donate</span>
              </Link>
              
              <button
                type="button"
                id="nav-hamburger-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:text-[#2C3292] hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#2C3292]"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-lg px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200 shadow-xl">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                    isActive(link.path)
                      ? 'text-[#2C3292] bg-[#f0f2fc] font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-xs font-semibold text-slate-400 px-3 uppercase tracking-wider">
                Services & Grievance
              </div>
              <Link
                to="/track-volunteer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm text-teal-800 bg-teal-50/80 font-bold hover:bg-teal-100"
              >
                <HeartHandshake className="w-4 h-4 text-teal-700" />
                <span>Track Volunteer Form</span>
              </Link>
              <Link
                to="/grievance"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                <ShieldCheck className="w-4 h-4 text-[#2C3292]" />
                <span>Submit Grievance</span>
              </Link>
              <Link
                to="/track-complaint"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">#</div>
                <span>Track Complaint</span>
              </Link>
            </div>

            {/* Mobile Authentication & Portal */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5">
              <div className="text-xs font-semibold text-slate-400 px-3 uppercase tracking-wider">
                Account & Portal
              </div>
              {user ? (
                <>
                  <Link
                    to={user.role === 'admin' ? '/admin' : user.role === 'volunteer' ? '/volunteer' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100/70 transition-colors"
                  >
                    <span>{user.role === 'admin' ? 'Admin Desk' : user.role === 'volunteer' ? 'Volunteer Desk' : 'My Portal'}</span>
                    <ChevronRight className="w-4 h-4 text-teal-600" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                  >
                    <span>Logout</span>
                    <LogOut className="w-4 h-4 text-rose-500" />
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold text-[#2C3292] bg-[#f0f2fc] hover:bg-[#e6e9f8] transition-colors"
                >
                  <span>Login</span>
                  <ChevronRight className="w-4 h-4 text-[#2C3292]" />
                </Link>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/donate"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#2C3292] text-white font-semibold text-sm text-center shadow-xs"
              >
                <Heart className="w-4 h-4" />
                <span>Donate to Foundation</span>
              </Link>
            </div>

            <div className="pt-2 text-center text-xs text-slate-500">
              Helpline: <a href={`tel:${ORG_INFO.phone}`} className="font-semibold text-slate-700">{ORG_INFO.phone}</a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
