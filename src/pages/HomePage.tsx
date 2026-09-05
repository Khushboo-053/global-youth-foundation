import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  UserPlus, 
  ArrowRight, 
  ShieldCheck, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  Calendar, 
  MessageSquare,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  ChevronRight,
  HeartHandshake
} from 'lucide-react';
import { 
  ORG_INFO, 
  IMPACT_STATS, 
  PROGRAMS, 
  EVENTS, 
  NEWS_ITEMS, 
  TESTIMONIALS 
} from '../data/mockData';
import { StatCounter } from '../components/StatCounter';
import { ProgramCard } from '../components/ProgramCard';
import { EventCard } from '../components/EventCard';
import { NewsCard } from '../components/NewsCard';
import { TestimonialCard } from '../components/TestimonialCard';
import { GalleryGrid } from '../components/GalleryGrid';
import { Modal } from '../components/Modal';
import { VolunteerRegistrationModal } from '../components/VolunteerRegistrationModal';
import { ArticleContentRenderer } from '../components/ArticleContentRenderer';
import { EventItem, NewsItem, ImpactStat } from '../types';
import { useApp } from '../context/AppContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { programs: livePrograms, events: liveEvents, blogs: liveBlogs, websiteContent } = useApp();
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);

  const displayPrograms = (livePrograms && livePrograms.length > 0) ? livePrograms.filter(p => !p.status || p.status === 'Active' || (p.status as any) === 'Published') : PROGRAMS;
  const displayEvents = (liveEvents && liveEvents.length > 0) ? liveEvents.filter(e => !e.status || e.status === 'Upcoming' || e.status === 'Completed' || (e.status as any) === 'Published') : EVENTS;
  const displayNews = (liveBlogs && liveBlogs.length > 0) ? liveBlogs.filter(b => b.isPublished !== false) : NEWS_ITEMS;

  const heroTitle = websiteContent?.heroTitle || 'Empowering Youth. Defending Human Rights. Resolving Grievances.';
  const heroSubtitle = websiteContent?.heroSubtitle || ORG_INFO.description;
  const primaryCta = websiteContent?.primaryCtaText || 'Submit Grievance';
  const secondaryCta = websiteContent?.secondaryCtaText || 'Become a Member';

  const coreImpactStats = useMemo<ImpactStat[]>(() => {
    const rawYouth = websiteContent?.statYouthTrained || '25,000+';
    const rawCases = websiteContent?.statCasesResolved || '1,840+';
    const rawDistricts = websiteContent?.statDistrictsCovered || '10';
    const rawLegal = websiteContent?.statLegalAidProvided || '3,200+';

    return [
      {
        id: 'stat-youth-trained',
        label: 'Youth Trained',
        value: rawYouth,
        numericValue: parseInt(rawYouth.replace(/[^0-9]/g, '')) || 25000,
        suffix: rawYouth.includes('+') ? '+' : (rawYouth.includes('%') ? '%' : ''),
        icon: 'Users',
        description: 'Young leaders, fellows, and students trained in peacebuilding, constitutional literacy & civic leadership across J&K.'
      },
      {
        id: 'stat-cases-resolved',
        label: 'Grievances Resolved',
        value: rawCases,
        numericValue: parseInt(rawCases.replace(/[^0-9]/g, '')) || 1840,
        suffix: rawCases.includes('+') ? '+' : (rawCases.includes('%') ? '%' : ''),
        icon: 'CheckCircle2',
        description: 'Formal citizen complaints, human rights petitions, and public grievances successfully redressed with institutions.'
      },
      {
        id: 'stat-districts-covered',
        label: 'Districts Covered',
        value: rawDistricts,
        numericValue: parseInt(rawDistricts.replace(/[^0-9]/g, '')) || 10,
        suffix: rawDistricts.includes('+') ? '+' : '',
        icon: 'Globe',
        description: 'Active district volunteer chapters, pro-bono ombudsman desks, and community cells operational across the Kashmir valley.'
      },
      {
        id: 'stat-legal-aid',
        label: 'Legal Aid Beneficiaries',
        value: rawLegal,
        numericValue: parseInt(rawLegal.replace(/[^0-9]/g, '')) || 3200,
        suffix: rawLegal.includes('+') ? '+' : (rawLegal.includes('%') ? '%' : ''),
        icon: 'Scale',
        description: 'Marginalized families, youth, and victims of injustice receiving free pro-bono legal counsel and paralegal support.'
      }
    ];
  }, [websiteContent]);

  return (
    <div id="home-page" className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* ========================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================= */}
      <section id="hero-section" className="relative overflow-hidden bg-[#14173d] text-white pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Background Subtle Gradient & Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#12143b] via-[#1f2360] to-[#2C3292]/80 opacity-95" />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#2C3292]/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs font-bold tracking-wide uppercase shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                <span>Youth-Led Global Movement</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
                {heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal">
                {heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <Link
                  to="/grievance"
                  id="hero-submit-grievance-btn"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#2C3292] hover:bg-blue-50 text-sm font-bold shadow-lg shadow-black/20 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <ShieldCheck className="w-4 h-4 text-[#2C3292]" />
                  <span>{primaryCta}</span>
                </Link>

                <Link
                  to="/membership"
                  id="hero-donate-now-btn"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#2C3292] hover:bg-[#3d45ab] text-white text-sm font-bold border border-white/20 backdrop-blur-md shadow-lg shadow-[#2C3292]/30 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Heart className="w-4 h-4 text-blue-200 fill-blue-200/30" />
                  <span>{secondaryCta}</span>
                </Link>
              </div>

              {/* Trust Indicators - 4 Live Public Impact Metrics */}
              <div className="pt-6 border-t border-blue-900/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-blue-200">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                  <div className="font-extrabold text-white text-base font-mono">{websiteContent?.statYouthTrained || '25,000+'}</div>
                  <div className="text-blue-200/90 text-[11px] font-medium mt-0.5">Youth Trained</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                  <div className="font-extrabold text-white text-base font-mono">{websiteContent?.statCasesResolved || '1,840+'}</div>
                  <div className="text-blue-200/90 text-[11px] font-medium mt-0.5">Grievances Resolved</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                  <div className="font-extrabold text-white text-base font-mono">{websiteContent?.statDistrictsCovered || '10'}</div>
                  <div className="text-blue-200/90 text-[11px] font-medium mt-0.5">Districts Covered</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                  <div className="font-extrabold text-white text-base font-mono">{websiteContent?.statLegalAidProvided || '3,200+'}</div>
                  <div className="text-blue-200/90 text-[11px] font-medium mt-0.5">Legal Aid Beneficiaries</div>
                </div>
              </div>
            </div>

            {/* Hero Right Image / Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#2C3292]/40 bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"
                  alt="Young leaders of Global Youth Foundation collaborating on social impact"
                  className="w-full h-80 sm:h-96 lg:h-[460px] object-cover"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14173d]/90 via-[#14173d]/20 to-transparent" />
                
                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#1f2360]/95 backdrop-blur-md border border-blue-400/30 text-white space-y-1">
                  <div className="flex items-center justify-between text-xs text-blue-200 font-bold">
                    <span>Active Field Initiative</span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Live
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    Peacebuilding & Civic Rights Outreach
                  </div>
                  <p className="text-xs text-blue-100/80 line-clamp-1">
                    Uniting youth voices for justice, dignity, and sustainable transformation.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. ABOUT GYF SECTION */}
      {/* ========================================================= */}
      <section id="about-snippet-section" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
                  alt="GYF youth engagement"
                  className="w-full h-80 object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-xs font-bold text-blue-300 uppercase tracking-wider">Our Core Vision</div>
                  <div className="text-base font-bold">Dignity, Equality, and Opportunity for All</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#2C3292] uppercase tracking-wider">
                  About Our Movement
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Creating Change Through Youth
                </h2>
              </div>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                {websiteContent?.missionText || (
                  <>
                    At Global Youth Foundation, we are a dynamic, youth-led movement committed to creating a world defined by peace, justice, rights, and harmony. Our motto, <span className="font-semibold text-slate-900">‘Empowering Youth, Inspiring Change, Building a Better Tomorrow.’</span> reflects our unwavering dedication to empowering young people to take meaningful action and drive positive change.
                  </>
                )}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#f2f4fc] border border-blue-100 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2C3292] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Youth-Centric Leadership</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Empowering young citizens to lead grassroots solutions.</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#f2f4fc] border border-blue-100 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2C3292] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Accountable & Transparent</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Transparent grievance redressal and public integrity.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/about"
                  id="about-read-more-btn"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2C3292] hover:bg-[#1f2360] text-white text-sm font-bold shadow-sm transition-all"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4 text-blue-200" />
                </Link>

                <button
                  type="button"
                  id="join-as-volunteer-btn"
                  onClick={() => setIsVolunteerModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold shadow-sm transition-all cursor-pointer"
                >
                  <HeartHandshake className="w-4 h-4 text-teal-200" />
                  <span>Join as Volunteer</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. IMPACT STATISTICS */}
      {/* ========================================================= */}
      <section id="statistics-section" className="py-20 bg-slate-100/60 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Public Impact Metrics</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Our Footprint & Impact Statistics
            </h2>
            <p className="text-sm text-slate-600">
              Audited statistics featured on homepage counters and official foundation reports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreImpactStats.map((stat) => (
              <StatCounter key={stat.id} stat={stat} />
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. OUR PROGRAMS */}
      {/* ========================================================= */}
      <section id="programs-section" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold text-[#2C3292] uppercase tracking-wider">
                Core Initiatives
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Our Programs
              </h2>
              <p className="text-sm text-slate-600">
                Holistic initiatives designed to develop skills, protect rights, foster peace, and build resilient communities.
              </p>
            </div>

            <Link
              to="/programs"
              id="home-view-all-programs-btn"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-50 text-[#2C3292] hover:bg-blue-100 text-sm font-bold border border-blue-200 transition-colors shrink-0"
            >
              <span>View All Programs</span>
              <ArrowRight className="w-4 h-4 text-[#2C3292]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPrograms.slice(0, 6).map((prog) => (
              <ProgramCard key={prog.id} program={prog} />
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. EVENTS & CAMPAIGNS */}
      {/* ========================================================= */}
      <section id="events-section" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold text-[#2C3292] uppercase tracking-wider">
                Action On Ground
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Events & Campaigns
              </h2>
              <p className="text-sm text-slate-600">
                Workshops, awareness drives, peace forums, and community mobilizations led by youth delegates.
              </p>
            </div>

            <Link
              to="/events"
              id="home-view-all-events-btn"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-800 hover:bg-slate-100 text-sm font-bold border border-slate-200 transition-colors shadow-xs shrink-0"
            >
              <span>View All Events</span>
              <ArrowRight className="w-4 h-4 text-slate-600" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayEvents.slice(0, 3).map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onViewDetails={(ev) => setSelectedEvent(ev)} 
              />
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. NEWS & ANNOUNCEMENTS */}
      {/* ========================================================= */}
      <section id="news-section" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#2C3292] uppercase tracking-wider">
              Stay Informed
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              News & Announcements
            </h2>
            <p className="text-sm text-slate-600">
              Latest field reports, press releases, impact stories, and official notifications from the foundation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayNews.slice(0, 4).map((item) => (
              <NewsCard 
                key={item.id} 
                item={item} 
                onReadMore={(n) => setSelectedNews(n)} 
              />
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. GRIEVANCE SECTION (Visually Prominent) */}
      {/* ========================================================= */}
      <section id="grievance-spotlight-section" className="py-20 bg-gradient-to-r from-[#14173d] via-[#1f2360] to-[#2C3292] text-white relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#2C3292]/30 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-blue-200 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              <span>Confidential Citizen Helpline</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Your Voice Matters
            </h2>

            <p className="text-base sm:text-lg text-blue-100 leading-relaxed">
              “Have a concern or grievance? You can submit it safely and confidentially through Global Youth Foundation.”
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/grievance"
                id="home-submit-grievance-btn"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#2C3292] hover:bg-blue-50 text-sm font-bold shadow-lg transition-all hover:scale-102"
              >
                <ShieldCheck className="w-4 h-4 text-[#2C3292]" />
                <span>Submit a Grievance</span>
              </Link>

              <Link
                to="/track-complaint"
                id="home-track-complaint-btn"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#2C3292]/40 hover:bg-[#2C3292]/60 text-white text-sm font-bold border border-white/20 backdrop-blur-md transition-all hover:scale-102"
              >
                <Search className="w-4 h-4 text-blue-200" />
                <span>Track Complaint</span>
              </Link>
            </div>

            <div className="text-xs text-blue-200/80 pt-2">
              Anonymous submission available • Unique tracking ID issued • Zero disclosure
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. SUCCESS STORIES */}
      {/* ========================================================= */}
      <section id="testimonials-section" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#2C3292] uppercase tracking-wider">
              Real Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Stories of Change
            </h2>
            <p className="text-sm text-slate-600">
              Voices of youth delegates, student activists, and community beneficiaries whose lives were touched by GYF.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 9. GALLERY */}
      {/* ========================================================= */}
      <section id="gallery-section" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#2C3292] uppercase tracking-wider">
              Visual Highlights
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Media & Activity Gallery
            </h2>
            <p className="text-sm text-slate-600">
              Explore snapshots of our grassroots camps, youth assemblies, ecological drives, and community interventions.
            </p>
          </div>

          <GalleryGrid />

        </div>
      </section>

      {/* ========================================================= */}
      {/* 10. GET INVOLVED (Strong CTA) */}
      {/* ========================================================= */}
      <section id="get-involved-section" className="py-20 bg-[#1f2360] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#14173d] via-[#1f2360] to-[#2C3292] opacity-95" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
            Join the Movement
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Be Part of the Change
          </h2>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            “Together, we can empower young people, strengthen communities and build a better tomorrow.”
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/grievance"
              id="cta-submit-grievance-btn"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#2C3292] hover:bg-blue-50 text-sm font-bold shadow-lg transition-all hover:scale-102"
            >
              <ShieldCheck className="w-4 h-4 text-[#2C3292]" />
              <span>Submit Grievance</span>
            </Link>

            <Link
              to="/donate"
              id="cta-donate-now-btn"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#2C3292] hover:bg-[#3d45ab] text-white text-sm font-bold border border-white/20 shadow-lg shadow-black/30 transition-all hover:scale-102"
            >
              <Heart className="w-4 h-4 fill-white/20" />
              <span>Donate Now</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 11. CONTACT PREVIEW */}
      {/* ========================================================= */}
      <section id="contact-preview-section" className="py-16 bg-[#14173d] text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#1f2360] border border-[#2C3292]/40 flex flex-col lg:flex-row items-center justify-between gap-8">
            
            <div className="space-y-3 text-center lg:text-left">
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                Get In Touch
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Global Youth Foundation Secretariat
              </h3>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2 text-sm text-slate-400">
                <a 
                  href={`tel:${ORG_INFO.phone}`} 
                  className="flex items-center gap-2 text-slate-200 hover:text-blue-300 font-bold transition-colors"
                >
                  <Phone className="w-4 h-4 text-blue-300" />
                  <span>{ORG_INFO.phone}</span>
                </a>
                <a 
                  href={`mailto:${ORG_INFO.email}`} 
                  className="flex items-center gap-2 text-slate-200 hover:text-blue-300 font-medium transition-colors"
                >
                  <Mail className="w-4 h-4 text-blue-300" />
                  <span>{ORG_INFO.email}</span>
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/contact"
                id="contact-preview-contact-us-btn"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2C3292] hover:bg-[#3d45ab] text-white text-sm font-bold shadow-sm transition-all"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Social media icons */}
              <div className="flex items-center gap-2">
                <a 
                  href={ORG_INFO.socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-xl bg-[#14173d] text-slate-300 hover:bg-[#2C3292] hover:text-white flex items-center justify-center transition-colors border border-[#2C3292]/30"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a 
                  href={ORG_INFO.socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-xl bg-[#14173d] text-slate-300 hover:bg-[#2C3292] hover:text-white flex items-center justify-center transition-colors border border-[#2C3292]/30"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a 
                  href={ORG_INFO.socialLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-xl bg-[#14173d] text-slate-300 hover:bg-[#2C3292] hover:text-white flex items-center justify-center transition-colors border border-[#2C3292]/30"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href={ORG_INFO.socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-xl bg-[#14173d] text-slate-300 hover:bg-[#2C3292] hover:text-white flex items-center justify-center transition-colors border border-[#2C3292]/30"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Event Details Modal */}
      <Modal
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title || 'Event Details'}
        maxWidth="lg"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="w-full h-56 object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-teal-50 text-teal-800 font-bold">
                {selectedEvent.category}
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium">
                {selectedEvent.date}
              </span>
              {selectedEvent.time && (
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium">
                  {selectedEvent.time}
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>{selectedEvent.location}</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {selectedEvent.fullDetails || selectedEvent.description}
            </p>
            <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <Link
                to="/membership"
                className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
              >
                Register as Volunteer
              </Link>
            </div>
          </div>
        )}
      </Modal>

      {/* News Details Modal */}
      <Modal
        isOpen={selectedNews !== null}
        onClose={() => setSelectedNews(null)}
        title={selectedNews?.title || 'Announcement'}
        maxWidth="2xl"
      >
        {selectedNews && (
          <div className="space-y-4">
            <img
              src={selectedNews.image}
              alt={selectedNews.title}
              className="w-full h-64 object-cover rounded-2xl shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
              <span className="font-extrabold text-teal-800 uppercase tracking-wider">{selectedNews.category}</span>
              <span>{selectedNews.date} • By {selectedNews.author} • {selectedNews.readTime || '3 min read'}</span>
            </div>
            
            {/* Formatted Article Content with Inline Images & Lightbox */}
            <ArticleContentRenderer 
              content={selectedNews.content} 
              articleImages={selectedNews.articleImages}
            />

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                className="px-5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Join as Volunteer Registration Modal */}
      <VolunteerRegistrationModal
        isOpen={isVolunteerModalOpen}
        onClose={() => setIsVolunteerModalOpen(false)}
      />

    </div>
  );
};
