import React, { useState, useMemo, useEffect } from 'react';
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
import { ARCHIVAL_EVENTS, ArchivalEventData } from '../data/archivalEvents';
import { StatCounter } from '../components/StatCounter';
import { ProgramCard } from '../components/ProgramCard';
import { EventCard } from '../components/EventCard';
import { ArchivalMonographPage } from '../components/ArchivalMonographPage';
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
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const heroBackgrounds = useMemo(() => [
    { src: '/hero/peace-with-justice.jpg', alt: 'GYF Peace With Justice march — students and volunteers carrying the foundation banner' },
    { src: '/hero/nasha-mukt.jpg', alt: 'GYF Nasha Mukt Jammu & Kashmir Abhiyan — field campaign with community members' },
    { src: '/hero/flag-hoisting.jpg', alt: 'GYF youth delegates at a hilltop flag hoisting in Jammu and Kashmir' },
    { src: '/hero/peace-day.jpg', alt: 'GYF International Peace Day candle vigil for justice, dignity, and peace' }
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % heroBackgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroBackgrounds.length]);

  const displayPrograms = (livePrograms && livePrograms.length > 0) ? livePrograms.filter(p => !p.status || p.status === 'Active' || (p.status as any) === 'Published') : PROGRAMS;
  const displayEvents = (liveEvents && liveEvents.length > 0)
    ? liveEvents.filter(e => e.isPublished !== false && (e.status as any) !== 'Draft')
    : EVENTS;
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
      <section id="hero-section" className="relative overflow-hidden text-white min-h-[92vh] flex flex-col justify-center">
        {/* Full-bleed photograph carousel — real GYF field photos, rotating every 5s */}
        <div className="absolute inset-0 z-0 bg-[#0d0f2e]">
          {heroBackgrounds.map((bg, index) => (
            <img
              key={bg.src}
              src={bg.src}
              alt={bg.alt}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${index === currentBgIndex ? 'opacity-100' : 'opacity-0'}`}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0f2e]/75 via-[#14173d]/45 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f2e]/70 via-transparent to-[#0d0f2e]/20" />
        </div>

        {/* Decorative blur blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none z-0" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
          <div className="max-w-3xl space-y-7">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/25 text-blue-200 text-xs font-bold tracking-widest uppercase shadow backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Youth-Led Global Movement — J&amp;K, India</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-xl">
              {heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-blue-100/90 leading-relaxed max-w-2xl font-normal drop-shadow-md">
              {heroSubtitle}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/grievance"
                id="hero-submit-grievance-btn"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-[#2C3292] hover:bg-blue-50 text-sm font-bold shadow-xl shadow-black/30 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
              >
                <ShieldCheck className="w-4 h-4 text-[#2C3292]" />
                <span>{primaryCta}</span>
              </Link>

              <Link
                to="/membership"
                id="hero-donate-now-btn"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#2C3292]/80 hover:bg-[#2C3292] text-white text-sm font-bold border border-white/30 backdrop-blur-md shadow-xl shadow-[#2C3292]/40 transition-all duration-200 hover:-translate-y-1"
              >
                <Heart className="w-4 h-4 text-blue-200 fill-blue-200/30" />
                <span>{secondaryCta}</span>
              </Link>
            </div>

            {/* Live Impact Metrics */}
            <div className="pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-black/30 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:border-white/25 transition-all duration-200 hover:bg-black/40">
                <div className="font-extrabold text-white text-xl font-mono">{websiteContent?.statYouthTrained || '25,000+'}</div>
                <div className="text-blue-200/80 text-[11px] font-semibold mt-1 uppercase tracking-wide">Youth Trained</div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:border-white/25 transition-all duration-200 hover:bg-black/40">
                <div className="font-extrabold text-white text-xl font-mono">{websiteContent?.statCasesResolved || '1,840+'}</div>
                <div className="text-blue-200/80 text-[11px] font-semibold mt-1 uppercase tracking-wide">Grievances Resolved</div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:border-white/25 transition-all duration-200 hover:bg-black/40">
                <div className="font-extrabold text-white text-xl font-mono">{websiteContent?.statDistrictsCovered || '10'}</div>
                <div className="text-blue-200/80 text-[11px] font-semibold mt-1 uppercase tracking-wide">Districts Covered</div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:border-white/25 transition-all duration-200 hover:bg-black/40">
                <div className="font-extrabold text-white text-xl font-mono">{websiteContent?.statLegalAidProvided || '3,200+'}</div>
                <div className="text-blue-200/80 text-[11px] font-semibold mt-1 uppercase tracking-wide">Legal Aid Beneficiaries</div>
              </div>
            </div>

          </div>

          {/* Photograph carousel indicators */}
          <div className="absolute bottom-8 left-4 sm:left-6 lg:left-10 flex items-center gap-2" aria-hidden="true">
            {heroBackgrounds.map((bg, index) => (
              <button
                key={bg.src}
                type="button"
                onClick={() => setCurrentBgIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentBgIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'}`}
                aria-label={`Show photograph ${index + 1}`}
              />
            ))}
          </div>

          {/* Live badge — bottom right */}
          <div className="absolute bottom-10 right-6 lg:right-10 hidden sm:flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 text-white shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Active Field Initiative</div>
              <div className="text-[11px] text-blue-200/80">Peacebuilding &amp; Civic Rights Outreach</div>
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
                onReadMore={(n) => navigate(`/blogs?id=${encodeURIComponent(n.id)}`)}
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
                  href={`tel:${websiteContent?.contactPhone || websiteContent?.helpDeskPhone || ORG_INFO.phone}`}
                  className="flex items-center gap-2 text-slate-200 hover:text-blue-300 font-bold transition-colors"
                >
                  <Phone className="w-4 h-4 text-blue-300" />
                  <span>{websiteContent?.contactPhone || websiteContent?.helpDeskPhone || ORG_INFO.phone}</span>
                </a>
                <a
                  href={`mailto:${websiteContent?.contactEmail || ORG_INFO.email}`}
                  className="flex items-center gap-2 text-slate-200 hover:text-blue-300 font-medium transition-colors"
                >
                  <Mail className="w-4 h-4 text-blue-300" />
                  <span>{websiteContent?.contactEmail || ORG_INFO.email}</span>
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
        title={selectedEvent ? `Document Page ${selectedEvent.documentPage}: ${selectedEvent.title}` : 'Event Report'}
        maxWidth="2xl"
      >
        {selectedEvent && (() => {
          const archivalData: ArchivalEventData = ARCHIVAL_EVENTS.find(
            e => e.id === selectedEvent.id || e.documentPage === selectedEvent.documentPage
          ) || {
            ...selectedEvent,
            documentPage: selectedEvent.documentPage || 2,
            layoutType: 'single',
            banners: [],
            archivalPhotos: [{ id: 'p1', caption: selectedEvent.title }]
          } as ArchivalEventData;

          return (
            <div className="space-y-4">
              <ArchivalMonographPage event={archivalData} />

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500 font-mono">
                  Official Global Youth Foundation Archives
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Close
                  </button>
                  <Link
                    to="/events"
                    onClick={() => setSelectedEvent(null)}
                    className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
                  >
                    Explore All 17 Archival Events
                  </Link>
                </div>
              </div>
            </div>
          );
        })()}
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
