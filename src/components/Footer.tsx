import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  UserPlus, 
  ArrowUpRight, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Twitter 
} from 'lucide-react';
import { ORG_INFO } from '../data/mockData';
import { GyfLogo } from './GyfLogo';

export const Footer: React.FC = () => {
  return (
    <footer id="main-footer" className="bg-[#14173d] text-slate-300 pt-16 pb-12 border-t border-[#2C3292]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Col 1 & 2: Organization Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <GyfLogo variant="white" size="md" />
            </Link>

            <p className="text-sm text-blue-200/90 font-medium italic">
              “{ORG_INFO.tagline}”
            </p>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              At Global Youth Foundation, we are a dynamic, youth-led movement committed to creating a world defined by peace, justice, human rights, and social transformation.
            </p>

            <div className="pt-2">
              <Link
                to="/donate"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2C3292] hover:bg-[#3d45ab] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm"
              >
                <Heart className="w-3.5 h-3.5 fill-white/20" />
                <span>Support Our Cause</span>
              </Link>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-slate-400 hover:text-white transition-colors">
                  Programs
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-slate-400 hover:text-white transition-colors">
                  Events Held
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Get Involved */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Get Involved
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/donate" className="text-slate-400 hover:text-blue-300 transition-colors flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-blue-400" />
                  <span>Donate</span>
                </Link>
              </li>
              <li>
                <Link to="/membership" className="text-slate-400 hover:text-blue-300 transition-colors flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-blue-400" />
                  <span>Become a Member</span>
                </Link>
              </li>
              <li>
                <Link to="/grievance" className="text-slate-400 hover:text-blue-300 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Submit a Grievance</span>
                </Link>
              </li>
              <li>
                <Link to="/track-complaint" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Track Complaint</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
                  Login / Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact & Social */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Official Contact
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-500">Official Helpline</div>
                  <a href={`tel:${ORG_INFO.phone}`} className="font-semibold text-slate-200 hover:text-white transition-colors">
                    {ORG_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-500">Official Inquiries</div>
                  <a href={`mailto:${ORG_INFO.email}`} className="text-xs font-medium text-slate-200 hover:text-white break-all transition-colors">
                    {ORG_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-400">
                  Bemina, Srinagar, J&K
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="pt-2">
              <div className="text-xs font-medium text-slate-400 mb-2">Connect With Us</div>
              <div className="flex items-center gap-2">
                <a
                  href={ORG_INFO.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#2C3292] hover:text-white text-slate-400 flex items-center justify-center transition-all duration-200 border border-slate-800"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={ORG_INFO.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#2C3292] hover:text-white text-slate-400 flex items-center justify-center transition-all duration-200 border border-slate-800"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={ORG_INFO.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#2C3292] hover:text-white text-slate-400 flex items-center justify-center transition-all duration-200 border border-slate-800"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={ORG_INFO.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#2C3292] hover:text-white text-slate-400 flex items-center justify-center transition-all duration-200 border border-slate-800"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href={ORG_INFO.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#2C3292] hover:text-white text-slate-400 flex items-center justify-center transition-all duration-200 border border-slate-800"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 Global Youth Foundation. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/about" className="hover:text-slate-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/grievance" className="hover:text-slate-300 transition-colors">
              Grievance Redressal Charter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
