import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Heart, 
  LogIn, 
  ShieldCheck, 
  ChevronRight, 
  Phone, 
  Mail
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ORG_INFO } from '../data/mockData';
import { GyfLogo } from './GyfLogo';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
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
      <div className="bg-[#1f2360] text-blue-100 text-xs py-1.5 px-4 hidden md:block border-b border-[#2C3292]/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-blue-300" />
              <a href={`tel:${ORG_INFO.phone}`}>{ORG_INFO.phone}</a>
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-blue-300" />
              <a href={`mailto:${ORG_INFO.email}`}>{ORG_INFO.email}</a>
            </span>
          </div>
          <div className="flex items-center gap-4 text-blue-200">
            <Link to="/grievance" className="hover:text-white transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" /> Confidential Grievance Desk
            </Link>
            <span>•</span>
            <Link to="/track-complaint" className="hover:text-white transition-colors">
              Track Docket
            </Link>
            <span>•</span>
            <Link to="/login" className="hover:text-white font-bold text-teal-300 transition-colors">
              Portal Login
            </Link>
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

              {user ? (
                <Link
                  to={user.role === 'admin' ? '/admin' : user.role === 'volunteer' ? '/volunteer' : '/dashboard'}
                  id="nav-dashboard-btn"
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 whitespace-nowrap ${
                    user.role === 'admin'
                      ? 'bg-teal-900 text-white hover:bg-teal-950 border-teal-800 shadow-xs'
                      : user.role === 'volunteer'
                      ? 'bg-emerald-700 text-white hover:bg-emerald-800 border-emerald-600 shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>
                    {user.role === 'admin' ? 'Admin Desk' : user.role === 'volunteer' ? 'Volunteer Desk' : 'My Dashboard'}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  id="nav-login-btn"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold border border-slate-200 transition-all duration-200 whitespace-nowrap"
                >
                  <LogIn className="w-4 h-4 text-[#2C3292]" />
                  <span>Login</span>
                </Link>
              )}
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
                to="/grievance"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                <ShieldCheck className="w-4 h-4 text-[#2C3292]" />
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
                <ShieldCheck className="w-4 h-4 text-blue-300" />
                <span>Submit Grievance</span>
              </Link>
              
              {user ? (
                <Link
                  to={user.role === 'admin' ? '/admin' : user.role === 'volunteer' ? '/volunteer' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm text-center ${
                    user.role === 'admin'
                      ? 'bg-teal-900 text-white'
                      : user.role === 'volunteer'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>
                    {user.role === 'admin' ? 'Admin Desk' : user.role === 'volunteer' ? 'Volunteer Desk' : 'My Dashboard'}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm text-center"
                >
                  <LogIn className="w-4 h-4 text-[#2C3292]" />
                  <span>Login</span>
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
