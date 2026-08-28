import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Heart, 
  UserPlus, 
  LogIn, 
  User, 
  ShieldCheck, 
  ChevronRight, 
  Phone, 
  Mail 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ORG_INFO } from '../data/mockData';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useApp();

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

  return (
    <>
      {/* Top micro bar for quick official contact */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <a href={`tel:${ORG_INFO.phone}`}>{ORG_INFO.phone}</a>
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-teal-400" />
              <a href={`mailto:${ORG_INFO.email}`}>{ORG_INFO.email}</a>
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/grievance" className="hover:text-teal-300 transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Confidential Grievance Desk
            </Link>
            <span>•</span>
            <Link to="/track-complaint" className="hover:text-teal-300 transition-colors">
              Track Docket
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header 
        id="main-navbar"
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3' 
            : 'bg-white border-b border-slate-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Name */}
            <Link 
              to="/" 
              id="nav-brand-logo"
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-teal-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-base tracking-tighter">GYF</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-lg leading-tight tracking-tight group-hover:text-teal-700 transition-colors">
                  Global Youth Foundation
                </span>
                <span className="text-[11px] font-medium text-slate-500 tracking-wider uppercase">
                  Empowering Youth • Inspiring Change
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive(link.path)
                      ? 'text-teal-700 bg-teal-50/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-2.5">
              <Link
                to="/donate"
                id="nav-donate-btn"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm hover:shadow transition-all duration-200"
              >
                <Heart className="w-4 h-4 fill-white/20" />
                <span>Donate</span>
              </Link>

              <Link
                to="/grievance"
                id="nav-grievance-btn"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold shadow-xs transition-all duration-200"
              >
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Submit Grievance</span>
              </Link>

              {user ? (
                <Link
                  to="/dashboard"
                  id="nav-dashboard-btn"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="hidden xl:inline max-w-[100px] truncate">{user.fullName}</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  id="nav-login-btn"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-sm font-semibold transition-all duration-200"
                >
                  <LogIn className="w-4 h-4 text-slate-500" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center gap-2">
              <Link
                to="/donate"
                id="nav-mobile-donate-quick"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Donate</span>
              </Link>
              
              <button
                type="button"
                id="nav-hamburger-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                      ? 'text-teal-800 bg-teal-50 font-semibold'
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
                to="/grievance"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Submit Grievance</span>
              </Link>
              <Link
                to="/track-complaint"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">#</div>
                <span>Track Complaint</span>
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/grievance"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-sm text-center shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Submit Grievance</span>
              </Link>
              
              {user ? (
                <Link
                  to="/dashboard"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-sm text-center"
                >
                  <User className="w-4 h-4" />
                  <span>My Dashboard ({user.fullName})</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm text-center"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login / Register</span>
                </Link>
              )}
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
