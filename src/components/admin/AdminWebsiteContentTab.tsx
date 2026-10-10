import React, { useState, useEffect } from 'react';
import { DragDropImageUpload } from './DragDropImageUpload';
import {
  Globe,
  Save,
  RotateCcw,
  CheckCircle2,
  Layers,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Sparkles,
  Megaphone,
  TrendingUp,
  Eye,
  FileText,
  Users,
  Plus,
  Trash2,
  Image as ImageIcon,
  Edit3,
  Loader2,
  ChevronRight,
  Scale,
  QrCode,
  Upload,
  UploadCloud
} from 'lucide-react';
import { CouncilMemberModal } from './CouncilMemberModal';
import { useApp } from '../../context/AppContext';
import { LeadershipMember, Testimonial } from '../../types';
import { TESTIMONIALS } from '../../data/mockData';

export type { LeadershipMember };

const DEFAULT_LEADERS: LeadershipMember[] = [
  {
    id: 'lead-1',
    name: 'Adil Farooq',
    role: 'Executive Director & Founder',
    bio: 'Grassroots human rights advocate with 8+ years experience in youth development and community mediation.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'lead-2',
    name: 'Shafia Hassan',
    role: 'Head of Grievance Redressal & Legal Aid',
    bio: 'Paralegal specialist committed to accessible justice and transparent civic complaint resolution.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'lead-3',
    name: 'Muzamil Bashir',
    role: 'Director of Programs & Youth Partnerships',
    bio: 'Mobilizing student councils and environmental chapters across regional higher education centers.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'lead-4',
    name: 'Dr. Rabia Qadir',
    role: 'Chief Advisor - Health & Community Upliftment',
    bio: 'Public health researcher guiding adolescent wellness drives and winter relief campaigns.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
  }
];

export const AdminWebsiteContentTab: React.FC = () => {
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Announcement Bar State
  const [announcementText, setAnnouncementText] = useState(
    'GYF Youth Fellowship 2026'
  );
  const [announcementActive, setAnnouncementActive] = useState(true);
  const [isSavingAnnouncement, setIsSavingAnnouncement] = useState(false);
  const [announcementSavedSuccess, setAnnouncementSavedSuccess] = useState(false);

  // Hero Section
  const [heroTitle, setHeroTitle] = useState('Empowering Youth. Defending Human Rights. Resolving Grievances.');
  const [heroSubtitle, setHeroSubtitle] = useState(
    'Global Youth Foundation operates Kashmir’s leading youth ombudsman network, pro-bono paralegal aid desk, and civic advocacy coalitions for institutional accountability.'
  );
  const [primaryCtaText, setPrimaryCtaText] = useState('Submit a Grievance');
  const [secondaryCtaText, setSecondaryCtaText] = useState('Become a Member');

  // Mission & Vision
  const [missionText, setMissionText] = useState(
    'Our mission is to empower youth, strengthen communities, and promote a peaceful, just, inclusive, and harmonious society.'
  );
  const [visionText, setVisionText] = useState(
    'Our vision is to build a more inclusive, liberal, secular, peaceful, and empowered society where every individual is treated with dignity and has equal opportunities to participate, contribute, and grow.'
  );
  const [visionImageUrl, setVisionImageUrl] = useState('/hero/community-peace.jpg');

  // Impact Metrics
  const [statYouthTrained, setStatYouthTrained] = useState('25,000+');
  const [statCasesResolved, setStatCasesResolved] = useState('1,840+');
  const [statDistrictsCovered, setStatDistrictsCovered] = useState('10');
  const [statLegalAidProvided, setStatLegalAidProvided] = useState('3,200+');
  const [isSavingImpact, setIsSavingImpact] = useState(false);
  const [impactSavedSuccess, setImpactSavedSuccess] = useState(false);

  // Contact & Secretariat Info
  const [contactEmail, setContactEmail] = useState('contact@gyf.org');
  const [contactPhone, setContactPhone] = useState('+91 194 245 8921');
  const [legalAidHotline, setLegalAidHotline] = useState('1800-GYF-LEGAL (Toll Free)');
  const [hqAddress, setHqAddress] = useState('Peace & Civic Action Complex, M.A. Road, Srinagar, J&K 190001');

  // Secretariat Help Desk & Grievance Cell (Shown on User Dashboard)
  const [helpDeskTitle, setHelpDeskTitle] = useState('Baramulla & Srinagar Grievance Cell');
  const [helpDeskBadge, setHelpDeskBadge] = useState('OPEN TODAY');
  const [helpDeskDescription, setHelpDeskDescription] = useState('Offering free citizen document drafting, legal counseling, student scholarship follow-ups, and ombudsman mediation.');
  const [helpDeskHours, setHelpDeskHours] = useState('10:00 AM – 05:00 PM (Mon–Sat)');
  const [helpDeskPhone, setHelpDeskPhone] = useState('+91 91035 99292');
  const [helpDeskLocation, setHelpDeskLocation] = useState('Baramulla Main Town & Srinagar (Bemina)');

  // Bank & Donation Info
  const [bankAccountName, setBankAccountName] = useState('Global Youth Foundation Trust');
  const [bankName, setBankName] = useState('Jammu & Kashmir Bank Ltd.');
  const [bankAccountNumber, setBankAccountNumber] = useState('0012010100009842');
  const [bankIfsc, setBankIfsc] = useState('JAKA0MACOMS');
  const [bankUpi, setBankUpi] = useState('gyf.ombudsman@jkb');
  const [bankQrCodeUrl, setBankQrCodeUrl] = useState<string>('');
  const [qrUploadError, setQrUploadError] = useState<string | null>(null);
  const qrFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleQrPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setQrUploadError('Please select a valid image file (PNG, JPG, WEBP, or SVG).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setQrUploadError('Image file size must be less than 5MB.');
      return;
    }

    setQrUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setBankQrCodeUrl(reader.result);
      }
    };
    reader.onerror = () => {
      setQrUploadError('Failed to read the image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateDefaultQr = () => {
    const defaultUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(`upi://pay?pa=${bankUpi || 'gyf.ombudsman@jkb'}&pn=${encodeURIComponent(bankAccountName || 'Global Youth Foundation Trust')}&cu=INR`)}`;
    setBankQrCodeUrl(defaultUrl);
    setQrUploadError(null);
  };

  // Leadership Team (About Page)
  const [leadershipTeam, setLeadershipTeam] = useState<LeadershipMember[]>(DEFAULT_LEADERS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  const [isCouncilModalOpen, setIsCouncilModalOpen] = useState(false);
  const [editingCouncilMember, setEditingCouncilMember] = useState<LeadershipMember | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { websiteContent, updateWebsiteContent, resetWebsiteContent } = useApp();

  // Load from context state whenever available
  useEffect(() => {
    if (websiteContent) {
      if (websiteContent.announcementText !== undefined) setAnnouncementText(websiteContent.announcementText);
      if (websiteContent.announcementActive !== undefined) setAnnouncementActive(websiteContent.announcementActive);
      if (websiteContent.heroTitle) setHeroTitle(websiteContent.heroTitle);
      if (websiteContent.heroSubtitle) setHeroSubtitle(websiteContent.heroSubtitle);
      if (websiteContent.primaryCtaText) setPrimaryCtaText(websiteContent.primaryCtaText);
      if (websiteContent.secondaryCtaText) setSecondaryCtaText(websiteContent.secondaryCtaText);
      if (websiteContent.missionText) setMissionText(websiteContent.missionText);
      if (websiteContent.visionText) setVisionText(websiteContent.visionText);
      if (websiteContent.visionImageUrl) setVisionImageUrl(websiteContent.visionImageUrl);
      if (websiteContent.statYouthTrained) setStatYouthTrained(websiteContent.statYouthTrained);
      if (websiteContent.statCasesResolved) setStatCasesResolved(websiteContent.statCasesResolved);
      if (websiteContent.statDistrictsCovered) setStatDistrictsCovered(websiteContent.statDistrictsCovered);
      if (websiteContent.statLegalAidProvided) setStatLegalAidProvided(websiteContent.statLegalAidProvided);
      if (websiteContent.contactEmail) setContactEmail(websiteContent.contactEmail);
      if (websiteContent.contactPhone) setContactPhone(websiteContent.contactPhone);
      if (websiteContent.legalAidHotline) setLegalAidHotline(websiteContent.legalAidHotline);
      if (websiteContent.hqAddress) setHqAddress(websiteContent.hqAddress);
      if (websiteContent.bankAccountName) setBankAccountName(websiteContent.bankAccountName);
      if (websiteContent.bankName) setBankName(websiteContent.bankName);
      if (websiteContent.bankAccountNumber) setBankAccountNumber(websiteContent.bankAccountNumber);
      if (websiteContent.bankIfsc) setBankIfsc(websiteContent.bankIfsc);
      if (websiteContent.bankUpi) setBankUpi(websiteContent.bankUpi);
      if (websiteContent.bankQrCodeUrl !== undefined) setBankQrCodeUrl(websiteContent.bankQrCodeUrl);
      if (websiteContent.helpDeskTitle) setHelpDeskTitle(websiteContent.helpDeskTitle);
      if (websiteContent.helpDeskBadge) setHelpDeskBadge(websiteContent.helpDeskBadge);
      if (websiteContent.helpDeskDescription) setHelpDeskDescription(websiteContent.helpDeskDescription);
      if (websiteContent.helpDeskHours) setHelpDeskHours(websiteContent.helpDeskHours);
      if (websiteContent.helpDeskPhone) setHelpDeskPhone(websiteContent.helpDeskPhone);
      if (websiteContent.helpDeskLocation) setHelpDeskLocation(websiteContent.helpDeskLocation);
      if (Array.isArray(websiteContent.leadershipTeam) && websiteContent.leadershipTeam.length > 0) {
        setLeadershipTeam(websiteContent.leadershipTeam);
      }
      if (Array.isArray(websiteContent.testimonials) && websiteContent.testimonials.length > 0) {
        setTestimonials(websiteContent.testimonials);
      }
    }
  }, [websiteContent]);

  const handleQuickSaveAnnouncement = async () => {
    setIsSavingAnnouncement(true);
    try {
      await updateWebsiteContent({
        announcementText,
        announcementActive
      });
      setAnnouncementSavedSuccess(true);
      setTimeout(() => setAnnouncementSavedSuccess(false), 3000);
    } finally {
      setIsSavingAnnouncement(false);
    }
  };

  const handleQuickSaveImpact = async () => {
    setIsSavingImpact(true);
    try {
      await updateWebsiteContent({
        statYouthTrained,
        statCasesResolved,
        statDistrictsCovered,
        statLegalAidProvided
      });
      setImpactSavedSuccess(true);
      setTimeout(() => setImpactSavedSuccess(false), 3500);
    } finally {
      setIsSavingImpact(false);
    }
  };

  const handleResetImpactDefaults = () => {
    setStatYouthTrained('25,000+');
    setStatCasesResolved('1,840+');
    setStatDistrictsCovered('10');
    setStatLegalAidProvided('3,200+');
  };

  const handleOpenAddCouncilModal = () => {
    setEditingCouncilMember(null);
    setIsCouncilModalOpen(true);
  };

  const handleOpenEditCouncilModal = (member: LeadershipMember) => {
    setEditingCouncilMember(member);
    setIsCouncilModalOpen(true);
  };

  const handleSaveCouncilMember = async (member: LeadershipMember) => {
    const exists = leadershipTeam.some(m => m.id === member.id);
    const updated = exists
      ? leadershipTeam.map(m => m.id === member.id ? member : m)
      : [...leadershipTeam, member];

    setLeadershipTeam(updated);
    await updateWebsiteContent({ leadershipTeam: updated });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleUpdateLeader = (id: string, field: keyof LeadershipMember, value: string) => {
    setLeadershipTeam(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);

  const handleLeaderImageUpload = async (id: string, file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image is too large. Max size is 5MB.');
      return;
    }
    setUploadingImageId(id);
    try {
      const body = new FormData();
      body.append('image', file);
      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = await res.json();
      if (res.ok && data.url) {
        handleUpdateLeader(id, 'image', data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed. Please check network.');
    } finally {
      setUploadingImageId(null);
    }
  };

  const handleRemoveLeader = async (id: string) => {
    if (leadershipTeam.length <= 1) {
      alert('You must keep at least one leadership team member on the council.');
      return;
    }
    if (window.confirm('Are you sure you want to remove this member from the Leadership Council?')) {
      const updated = leadershipTeam.filter(m => m.id !== id);
      setLeadershipTeam(updated);
      await updateWebsiteContent({ leadershipTeam: updated });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  const handleUpdateTestimonial = (id: string, field: keyof Testimonial, value: string) => {
    setTestimonials(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleAddTestimonial = async () => {
    const newTestimonial: Testimonial = {
      id: `test-${Date.now()}`,
      name: 'New Personality',
      role: 'Guest Speaker',
      location: 'Srinagar, J&K',
      story: 'Enter genuine feedback here...',
      image: '',
      program: 'General Endorsement',
      year: new Date().getFullYear().toString()
    };
    const updated = [newTestimonial, ...testimonials];
    setTestimonials(updated);
    await updateWebsiteContent({ testimonials: updated });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleRemoveTestimonial = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this feedback?')) {
      const updated = testimonials.filter(t => t.id !== id);
      setTestimonials(updated);
      await updateWebsiteContent({ testimonials: updated });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const content = {
        announcementText,
        announcementActive,
        heroTitle,
        heroSubtitle,
        primaryCtaText,
        secondaryCtaText,
        missionText,
        visionText,
        visionImageUrl,
        statYouthTrained,
        statCasesResolved,
        statDistrictsCovered,
        statLegalAidProvided,
        contactEmail,
        contactPhone,
        legalAidHotline,
        hqAddress,
        bankAccountName,
        bankName,
        bankAccountNumber,
        bankIfsc,
        bankUpi,
        bankQrCodeUrl,
        leadershipTeam,
        testimonials,
        helpDeskTitle,
        helpDeskBadge,
        helpDeskDescription,
        helpDeskHours,
        helpDeskPhone,
        helpDeskLocation
      };

      await updateWebsiteContent(content);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Reset all website content and leadership council back to factory defaults?')) {
      setIsSaving(true);
      try {
        const reset = await resetWebsiteContent();
        setAnnouncementText(reset.announcementText);
        setAnnouncementActive(reset.announcementActive);
        setHeroTitle(reset.heroTitle);
        setHeroSubtitle(reset.heroSubtitle);
        setPrimaryCtaText(reset.primaryCtaText);
        setSecondaryCtaText(reset.secondaryCtaText);
        setMissionText(reset.missionText);
        setVisionText(reset.visionText);
        setVisionImageUrl(reset.visionImageUrl || '/hero/community-peace.jpg');
        setStatYouthTrained(reset.statYouthTrained);
        setStatCasesResolved(reset.statCasesResolved);
        setStatDistrictsCovered(reset.statDistrictsCovered);
        setStatLegalAidProvided(reset.statLegalAidProvided);
        setContactEmail(reset.contactEmail);
        setContactPhone(reset.contactPhone);
        setLegalAidHotline(reset.legalAidHotline);
        setHqAddress(reset.hqAddress);
        setBankAccountName(reset.bankAccountName);
        setBankName(reset.bankName);
        setBankAccountNumber(reset.bankAccountNumber);
        setBankIfsc(reset.bankIfsc);
        setBankUpi(reset.bankUpi);
        setBankQrCodeUrl(reset.bankQrCodeUrl || '');
        setLeadershipTeam(reset.leadershipTeam);
        setTestimonials(reset.testimonials || TESTIMONIALS);
        setHelpDeskTitle(reset.helpDeskTitle || 'Baramulla & Srinagar Grievance Cell');
        setHelpDeskBadge(reset.helpDeskBadge || 'OPEN TODAY');
        setHelpDeskDescription(reset.helpDeskDescription || 'Offering free citizen document drafting, legal counseling, student scholarship follow-ups, and ombudsman mediation.');
        setHelpDeskHours(reset.helpDeskHours || '10:00 AM – 05:00 PM (Mon–Sat)');
        setHelpDeskPhone(reset.helpDeskPhone || '+91 91035 99292');
        setHelpDeskLocation(reset.helpDeskLocation || 'Baramulla Main Town & Srinagar (Bemina)');
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
            <Globe className="w-6 h-6 text-teal-800" />
            <span>Website Content & Live Copy Management</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Control the announcement banner, homepage hero copy, leadership council, mission/vision, public impact stats, and banking details in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Publish Content</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Website content & Leadership Council updated and published live across all public pages!</span>
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-6">

        {/* SECTION 1: Top Announcement Bar */}
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Top Banner Announcement Headline</h3>
                <p className="text-[11px] text-slate-500">Appears at the very top of the website header as an animated headline ticker on all public pages</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors w-fit">
              <span className="text-xs font-bold text-slate-700">Display Active:</span>
              <input
                type="checkbox"
                checked={announcementActive}
                onChange={(e) => setAnnouncementActive(e.target.checked)}
                className="w-4 h-4 rounded text-teal-800 focus:ring-teal-800 border-slate-300 cursor-pointer"
              />
            </label>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
                Announcement Headline Text
              </label>
              <span className="text-[11px] text-slate-400 font-medium">Click a quick preset or type your custom headline below</span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Presets:</span>
              <button
                type="button"
                onClick={() => setAnnouncementText('GYF Youth Fellowship 2026')}
                className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-semibold border border-teal-200 transition-colors cursor-pointer"
              >
                GYF Youth Fellowship 2026
              </button>
              <button
                type="button"
                onClick={() => setAnnouncementText('GYF Youth Fellowship 2026: Applications Now Open for Cohort Fellows')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
              >
                Applications Now Open
              </button>
              <button
                type="button"
                onClick={() => setAnnouncementText('Pro-Bono Paralegal Legal Aid & Ombudsman Desk Active Mon–Sat')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
              >
                Paralegal Legal Aid
              </button>
            </div>

            <textarea
              rows={2}
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="e.g. GYF Youth Fellowship 2026"
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1">
              <div className="text-[11px] text-slate-500">
                You can save this headline individually, or click <span className="font-semibold text-slate-700">Save & Publish All</span> at the bottom.
              </div>
              <div className="flex items-center gap-2">
                {announcementSavedSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Headline updated live!
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleQuickSaveAnnouncement}
                  disabled={isSavingAnnouncement}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-900 disabled:bg-teal-800/60 text-white text-xs font-bold transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
                >
                  {isSavingAnnouncement ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Headline...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Update Announcement Headline</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview Strip */}
          {announcementActive && announcementText && (
            <div className="pt-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Eye className="w-3 h-3 text-teal-600" />
                <span>Live Header Preview Simulation (No Live Bulletin Badge):</span>
              </div>
              <div className="rounded-xl bg-gradient-to-r from-slate-950 via-[#0e1335] to-slate-950 px-3 py-2 overflow-hidden border border-indigo-900/60 flex items-center">
                <div className="overflow-hidden whitespace-nowrap flex-1">
                  <div className="animate-news-ticker inline-flex items-center gap-8 text-xs font-medium text-slate-200">
                    <span>{announcementText}</span>
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{announcementText}</span>
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{announcementText}</span>
                  </div>
                </div>
                <div className="shrink-0 ml-3 pl-3 border-l border-slate-700/60 text-[11px] font-semibold text-amber-300 flex items-center gap-1 bg-white/5 px-2.5 py-0.5 rounded border border-amber-400/30">
                  <span>Apply / Join</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: Youth Leadership Council & Governance Team (About Page) */}
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Youth Leadership Council & Governance Team
                </h3>
                <p className="text-[11px] text-slate-400">
                  Manage the names, roles, bios, and profile photos displayed on the About Us page
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenAddCouncilModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer w-fit"
            >
              <Plus className="w-4 h-4" />
              <span>Add Council Member</span>
            </button>
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leadershipTeam.map((member, index) => (
              <div
                key={member.id || index}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-3 relative group"
              >
                <div className="flex items-start gap-3">
                  {/* Photo Preview */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300 relative shadow-2xs">
                    <img
                      src={member.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                  </div>

                  {/* Name & Role Inputs */}
                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleUpdateLeader(member.id, 'name', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-800"
                        placeholder="e.g. Adil Farooq"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Role / Designation
                      </label>
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => handleUpdateLeader(member.id, 'role', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-teal-800 focus:outline-none focus:ring-1 focus:ring-teal-800"
                        placeholder="e.g. Executive Director & Founder"
                      />
                    </div>
                  </div>

                  {/* Action Buttons: Modal Edit & Remove */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditCouncilModal(member)}
                      title="Edit in Modal"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-teal-800 hover:bg-teal-50 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveLeader(member.id)}
                      title="Remove Member"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Bio / Experience Description
                  </label>
                  <textarea
                    rows={2}
                    value={member.bio}
                    onChange={(e) => handleUpdateLeader(member.id, 'bio', e.target.value)}
                    className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-800"
                    placeholder="Brief background and expertise..."
                  />
                </div>

                {/* Photo URL */}
                <DragDropImageUpload
                  label="Photo URL"
                  value={member.image}
                  onChange={(url) => handleUpdateLeader(member.id, 'image', url)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2.5: Testimonials & Feedback */}
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Testimonials & Feedback (Real Impact)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Manage genuine feedback from respected personalities and community members
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddTestimonial}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer w-fit"
            >
              <Plus className="w-4 h-4" />
              <span>Add Feedback</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id || index}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-3 relative group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300 relative shadow-2xs">
                    <img
                      src={testimonial.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={testimonial.name}
                        onChange={(e) => handleUpdateTestimonial(testimonial.id, 'name', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-600"
                        placeholder="e.g. Dr. John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Role / Designation
                      </label>
                      <input
                        type="text"
                        value={testimonial.role || ''}
                        onChange={(e) => handleUpdateTestimonial(testimonial.id, 'role', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-600"
                        placeholder="e.g. Community Health Partner"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleRemoveTestimonial(testimonial.id)}
                      title="Remove Feedback"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={testimonial.location}
                      onChange={(e) => handleUpdateTestimonial(testimonial.id, 'location', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-600"
                      placeholder="e.g. Srinagar, J&K"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Program / Initiative
                    </label>
                    <input
                      type="text"
                      value={testimonial.program}
                      onChange={(e) => handleUpdateTestimonial(testimonial.id, 'program', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-600"
                      placeholder="e.g. Youth Empowerment"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Feedback / Quote
                  </label>
                  <textarea
                    rows={3}
                    value={testimonial.story}
                    onChange={(e) => handleUpdateTestimonial(testimonial.id, 'story', e.target.value)}
                    className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-600"
                    placeholder="Enter genuine feedback here..."
                  />
                </div>

                <DragDropImageUpload
                  label="Photograph URL"
                  value={testimonial.image}
                  onChange={(url) => handleUpdateTestimonial(testimonial.id, 'image', url)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: Hero & Value Proposition */}
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Homepage Hero & Tagline</h3>
              <p className="text-[11px] text-slate-400">Primary headline, narrative description, and call-to-actions</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
                Hero Main Headline
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
                Hero Narrative Subtitle
              </label>
              <textarea
                rows={3}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
                  Primary Button Label
                </label>
                <input
                  type="text"
                  value={primaryCtaText}
                  onChange={(e) => setPrimaryCtaText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
                  Secondary Button Label
                </label>
                <input
                  type="text"
                  value={secondaryCtaText}
                  onChange={(e) => setSecondaryCtaText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Mission & Vision Statements */}
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Mission & Vision Statements</h3>
              <p className="text-[11px] text-slate-400">Institutional ethos displayed on the About and Charter pages</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
                Official Mission Statement
              </label>
              <textarea
                rows={4}
                value={missionText}
                onChange={(e) => setMissionText(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
                Official Vision Statement
              </label>
              <textarea
                rows={4}
                value={visionText}
                onChange={(e) => setVisionText(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
              />
            </div>
          </div>
          
          <div className="pt-2 border-t border-slate-100">
            <DragDropImageUpload
              label="Our Core Vision Image (Displayed on Homepage)"
              value={visionImageUrl}
              onChange={setVisionImageUrl}
            />
          </div>
        </div>

        {/* SECTION 5: Live Impact Numbers */}
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Live Public Impact Metrics</h3>
                <p className="text-[11px] text-slate-500">Audited statistics featured on homepage counters and reports</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleResetImpactDefaults}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                title="Reset to 25,000+, 1,840+, 10, 3,200+"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Numbers</span>
              </button>

              <button
                type="button"
                onClick={handleQuickSaveImpact}
                disabled={isSavingImpact}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-700/60 text-white text-xs font-bold transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
              >
                {isSavingImpact ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Metrics...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Update Public Impact Metrics</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {impactSavedSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Public impact metrics updated successfully! Changes are live on the website front page.</span>
            </div>
          )}

          {/* Metric Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Youth Trained */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-teal-700" />
                  <span>Youth Trained</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Counter 1</span>
              </div>
              <input
                type="text"
                value={statYouthTrained}
                onChange={(e) => setStatYouthTrained(e.target.value)}
                placeholder="25,000+"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-800 font-mono"
              />
              <div className="flex items-center gap-1 pt-0.5">
                <button
                  type="button"
                  onClick={() => setStatYouthTrained('25,000+')}
                  className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-semibold cursor-pointer"
                >
                  25,000+
                </button>
                <button
                  type="button"
                  onClick={() => setStatYouthTrained('30,000+')}
                  className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-semibold cursor-pointer"
                >
                  30,000+
                </button>
                <button
                  type="button"
                  onClick={() => setStatYouthTrained('50,000+')}
                  className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-semibold cursor-pointer"
                >
                  50,000+
                </button>
              </div>
            </div>

            {/* 2. Grievances Resolved */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Grievances Resolved</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Counter 2</span>
              </div>
              <input
                type="text"
                value={statCasesResolved}
                onChange={(e) => setStatCasesResolved(e.target.value)}
                placeholder="1,840+"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-800 font-mono"
              />
              <div className="flex items-center gap-1 pt-0.5">
                <button
                  type="button"
                  onClick={() => setStatCasesResolved('1,840+')}
                  className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-semibold cursor-pointer"
                >
                  1,840+
                </button>
                <button
                  type="button"
                  onClick={() => setStatCasesResolved('2,000+')}
                  className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-semibold cursor-pointer"
                >
                  2,000+
                </button>
                <button
                  type="button"
                  onClick={() => setStatCasesResolved('2,500+')}
                  className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-semibold cursor-pointer"
                >
                  2,500+
                </button>
              </div>
            </div>

            {/* 3. Districts Covered */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-700" />
                  <span>Districts Covered</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Counter 3</span>
              </div>
              <input
                type="text"
                value={statDistrictsCovered}
                onChange={(e) => setStatDistrictsCovered(e.target.value)}
                placeholder="10"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-800 font-mono"
              />
              <div className="flex items-center gap-1 pt-0.5">
                <button
                  type="button"
                  onClick={() => setStatDistrictsCovered('10')}
                  className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-semibold cursor-pointer"
                >
                  10 (All Valley)
                </button>
                <button
                  type="button"
                  onClick={() => setStatDistrictsCovered('20')}
                  className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-semibold cursor-pointer"
                >
                  20 (All J&K)
                </button>
              </div>
            </div>

            {/* 4. Legal Aid Beneficiaries */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-purple-700" />
                  <span>Legal Aid Beneficiaries</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Counter 4</span>
              </div>
              <input
                type="text"
                value={statLegalAidProvided}
                onChange={(e) => setStatLegalAidProvided(e.target.value)}
                placeholder="3,200+"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-800 font-mono"
              />
              <div className="flex items-center gap-1 pt-0.5">
                <button
                  type="button"
                  onClick={() => setStatLegalAidProvided('3,200+')}
                  className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-semibold cursor-pointer"
                >
                  3,200+
                </button>
                <button
                  type="button"
                  onClick={() => setStatLegalAidProvided('4,500+')}
                  className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-semibold cursor-pointer"
                >
                  4,500+
                </button>
                <button
                  type="button"
                  onClick={() => setStatLegalAidProvided('6,000+')}
                  className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-semibold cursor-pointer"
                >
                  6,000+
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview on Front Page */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3 h-3 text-emerald-600" />
                <span>Live Front Page Counters Simulation:</span>
              </div>
              <span className="text-[11px] text-slate-400">Updates in real time as you edit above</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-900 rounded-xl text-white">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-teal-300 font-semibold">Youth Trained</span>
                  <Users className="w-3.5 h-3.5 text-teal-400" />
                </div>
                <div className="text-xl font-extrabold font-mono text-white tracking-tight">{statYouthTrained}</div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">Fellows & changemakers</div>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-emerald-300 font-semibold">Grievances Resolved</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-xl font-extrabold font-mono text-white tracking-tight">{statCasesResolved}</div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">Redressed with authorities</div>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-blue-300 font-semibold">Districts Covered</span>
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-xl font-extrabold font-mono text-white tracking-tight">{statDistrictsCovered}</div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">Active regional units</div>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-purple-300 font-semibold">Legal Aid</span>
                  <Scale className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="text-xl font-extrabold font-mono text-white tracking-tight">{statLegalAidProvided}</div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">Pro-bono beneficiaries</div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 6: Contact, Hotline & Banking Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Contact Details */}
          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Secretariat & Hotlines</h3>
                <p className="text-[11px] text-slate-400">Public contact and emergency redressal channels</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">Legal Aid Toll-Free Hotline</label>
                <input
                  type="text"
                  value={legalAidHotline}
                  onChange={(e) => setLegalAidHotline(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">Official Contact Phone</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">Official Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">Secretariat Address</label>
                <textarea
                  rows={2}
                  value={hqAddress}
                  onChange={(e) => setHqAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Member Dashboard Help Desk Card (Baramulla & Srinagar Grievance Cell) */}
          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-teal-200/80 shadow-2xs space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-teal-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">User Dashboard Help Desk Card</h3>
                  <p className="text-[11px] text-slate-400">Controls the dark "Secretariat Help Desk / Grievance Cell" card on member portals</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-900">Live on Dashboard</span>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">Cell / Center Title</label>
                  <input
                    type="text"
                    value={helpDeskTitle}
                    onChange={(e) => setHelpDeskTitle(e.target.value)}
                    placeholder="e.g. Baramulla & Srinagar Grievance Cell"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:border-teal-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">Status Badge</label>
                  <input
                    type="text"
                    value={helpDeskBadge}
                    onChange={(e) => setHelpDeskBadge(e.target.value)}
                    placeholder="e.g. OPEN TODAY"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">Services Description</label>
                <textarea
                  rows={2}
                  value={helpDeskDescription}
                  onChange={(e) => setHelpDeskDescription(e.target.value)}
                  placeholder="Offering free citizen document drafting, legal counseling, student scholarship follow-ups, and ombudsman mediation."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:border-teal-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">Operating Hours</label>
                  <input
                    type="text"
                    value={helpDeskHours}
                    onChange={(e) => setHelpDeskHours(e.target.value)}
                    placeholder="e.g. 10:00 AM – 05:00 PM (Mon–Sat)"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:border-teal-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">Hotline Number</label>
                  <input
                    type="text"
                    value={helpDeskPhone}
                    onChange={(e) => setHelpDeskPhone(e.target.value)}
                    placeholder="e.g. +91 91035 99292"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">Center Locations / Branch Coverage</label>
                <input
                  type="text"
                  value={helpDeskLocation}
                  onChange={(e) => setHelpDeskLocation(e.target.value)}
                  placeholder="e.g. Baramulla Main Town & Srinagar (Bemina)"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:border-teal-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Bank & Donation Details */}
          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Official Donation Bank Account</h3>
                <p className="text-[11px] text-slate-400">Displayed on the Public Donation & UTR verification page</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">Account Name</label>
                <input
                  type="text"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">Account Number</label>
                  <input
                    type="text"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">IFSC Code</label>
                  <input
                    type="text"
                    value={bankIfsc}
                    onChange={(e) => setBankIfsc(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">Official UPI VPA</label>
                  <input
                    type="text"
                    value={bankUpi}
                    onChange={(e) => setBankUpi(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Official UPI QR Code Photo Upload Section */}
              <div className="pt-3 border-t border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-teal-800" />
                    <span>Official Donation QR Code Photo</span>
                  </label>
                  {bankQrCodeUrl ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Photo Attached
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-semibold">
                      Optional (QR scanner for donors)
                    </span>
                  )}
                </div>

                {qrUploadError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                    {qrUploadError}
                  </div>
                )}

                <input
                  type="file"
                  ref={qrFileInputRef}
                  onChange={handleQrPhotoUpload}
                  accept="image/*"
                  className="hidden"
                  id="bank-qr-upload-input"
                />

                {bankQrCodeUrl ? (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-white p-2 border border-slate-200 shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={bankQrCodeUrl}
                        alt="Official Donation QR Code"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 space-y-2 text-center sm:text-left min-w-0">
                      <div>
                        <p className="text-xs font-bold text-slate-900">Official Donation QR Code</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          This QR is displayed on the public Donation & UTR verification page for donors to scan and transfer funds.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                        <button
                          type="button"
                          id="change-qr-photo-btn"
                          onClick={() => qrFileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-bold border border-teal-200 transition-colors cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Change Photo</span>
                        </button>
                        <button
                          type="button"
                          id="remove-qr-photo-btn"
                          onClick={() => setBankQrCodeUrl('')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Photo</span>
                        </button>
                        <button
                          type="button"
                          id="regenerate-qr-btn"
                          onClick={handleGenerateDefaultQr}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
                          title="Generate standard QR for current UPI VPA"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Generate From UPI ID</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div
                      id="upload-qr-dropzone"
                      onClick={() => qrFileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-teal-500 hover:bg-teal-50/30 rounded-2xl p-4 text-center cursor-pointer transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-teal-100 text-slate-500 group-hover:text-teal-800 flex items-center justify-center mx-auto mb-2 transition-colors">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-teal-900">
                        Upload Donation QR Code Photo
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Click or drag & drop image (PNG, JPG, WEBP, or SVG up to 5MB)
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                      <span>Need an immediate QR code?</span>
                      <button
                        type="button"
                        id="generate-instant-qr-btn"
                        onClick={handleGenerateDefaultQr}
                        className="font-bold text-teal-800 hover:text-teal-900 underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Generate Instant UPI QR</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 disabled:bg-teal-800/60 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing Updates...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Publish All Website Updates</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Council Member Add / Edit Modal */}
      <CouncilMemberModal
        isOpen={isCouncilModalOpen}
        onClose={() => {
          setIsCouncilModalOpen(false);
          setEditingCouncilMember(null);
        }}
        onSave={handleSaveCouncilMember}
        initialMember={editingCouncilMember}
      />

    </div>
  );
};
