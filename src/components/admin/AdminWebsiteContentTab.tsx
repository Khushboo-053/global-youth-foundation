import React, { useState, useEffect } from 'react';
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
  Edit3
} from 'lucide-react';
import { CouncilMemberModal } from './CouncilMemberModal';

export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

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
    '🚀 GYF Youth Fellowship 2026 Applications Are Now Live! Pro-Bono Paralegal Legal Aid Clinic Open Mon-Sat.'
  );
  const [announcementActive, setAnnouncementActive] = useState(true);

  // Hero Section
  const [heroTitle, setHeroTitle] = useState('Empowering Youth. Defending Human Rights. Resolving Grievances.');
  const [heroSubtitle, setHeroSubtitle] = useState(
    'Global Youth Foundation operates Kashmir’s leading youth ombudsman network, pro-bono paralegal aid desk, and civic advocacy coalitions for institutional accountability.'
  );
  const [primaryCtaText, setPrimaryCtaText] = useState('Submit a Grievance');
  const [secondaryCtaText, setSecondaryCtaText] = useState('Become a Member');

  // Mission & Vision
  const [missionText, setMissionText] = useState(
    'To foster a just, inclusive, and accountable society by mobilizing youth as frontline human rights monitors, providing accessible legal redressal, and bridging citizen grievances with civic authorities.'
  );
  const [visionText, setVisionText] = useState(
    'A democratic valley and nation where every young person is empowered with constitutional awareness, legal aid protection, and active civic participation.'
  );

  // Impact Metrics
  const [statYouthTrained, setStatYouthTrained] = useState('25,000+');
  const [statCasesResolved, setStatCasesResolved] = useState('1,840+');
  const [statDistrictsCovered, setStatDistrictsCovered] = useState('10');
  const [statLegalAidProvided, setStatLegalAidProvided] = useState('3,200+');

  // Contact & Secretariat Info
  const [contactEmail, setContactEmail] = useState('contact@gyf.org');
  const [contactPhone, setContactPhone] = useState('+91 194 245 8921');
  const [legalAidHotline, setLegalAidHotline] = useState('1800-GYF-LEGAL (Toll Free)');
  const [hqAddress, setHqAddress] = useState('Peace & Civic Action Complex, M.A. Road, Srinagar, J&K 190001');

  // Bank & Donation Info
  const [bankAccountName, setBankAccountName] = useState('Global Youth Foundation Trust');
  const [bankName, setBankName] = useState('Jammu & Kashmir Bank Ltd.');
  const [bankAccountNumber, setBankAccountNumber] = useState('0012010100009842');
  const [bankIfsc, setBankIfsc] = useState('JAKA0MACOMS');
  const [bankUpi, setBankUpi] = useState('gyf.ombudsman@jkb');

  // Leadership Team (About Page)
  const [leadershipTeam, setLeadershipTeam] = useState<LeadershipMember[]>(DEFAULT_LEADERS);
  const [isCouncilModalOpen, setIsCouncilModalOpen] = useState(false);
  const [editingCouncilMember, setEditingCouncilMember] = useState<LeadershipMember | null>(null);

  // Load from local storage if previously edited
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gyf_website_content');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.announcementText) setAnnouncementText(data.announcementText);
        if (data.announcementActive !== undefined) setAnnouncementActive(data.announcementActive);
        if (data.heroTitle) setHeroTitle(data.heroTitle);
        if (data.heroSubtitle) setHeroSubtitle(data.heroSubtitle);
        if (data.missionText) setMissionText(data.missionText);
        if (data.visionText) setVisionText(data.visionText);
        if (data.statYouthTrained) setStatYouthTrained(data.statYouthTrained);
        if (data.statCasesResolved) setStatCasesResolved(data.statCasesResolved);
        if (data.statDistrictsCovered) setStatDistrictsCovered(data.statDistrictsCovered);
        if (data.statLegalAidProvided) setStatLegalAidProvided(data.statLegalAidProvided);
        if (data.contactEmail) setContactEmail(data.contactEmail);
        if (data.contactPhone) setContactPhone(data.contactPhone);
        if (data.legalAidHotline) setLegalAidHotline(data.legalAidHotline);
        if (data.hqAddress) setHqAddress(data.hqAddress);
        if (data.bankAccountName) setBankAccountName(data.bankAccountName);
        if (data.bankAccountNumber) setBankAccountNumber(data.bankAccountNumber);
        if (data.bankIfsc) setBankIfsc(data.bankIfsc);
        if (data.bankUpi) setBankUpi(data.bankUpi);
        if (Array.isArray(data.leadershipTeam) && data.leadershipTeam.length > 0) {
          setLeadershipTeam(data.leadershipTeam);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleOpenAddCouncilModal = () => {
    setEditingCouncilMember(null);
    setIsCouncilModalOpen(true);
  };

  const handleOpenEditCouncilModal = (member: LeadershipMember) => {
    setEditingCouncilMember(member);
    setIsCouncilModalOpen(true);
  };

  const handleSaveCouncilMember = (member: LeadershipMember) => {
    setLeadershipTeam(prev => {
      const exists = prev.some(m => m.id === member.id);
      let updated: LeadershipMember[];
      if (exists) {
        updated = prev.map(m => m.id === member.id ? member : m);
      } else {
        updated = [...prev, member];
      }

      // Auto-persist immediately to localStorage
      try {
        const saved = localStorage.getItem('gyf_website_content');
        const existingData = saved ? JSON.parse(saved) : {};
        localStorage.setItem('gyf_website_content', JSON.stringify({
          ...existingData,
          leadershipTeam: updated,
          updatedAt: new Date().toISOString()
        }));
      } catch (e) {
        // ignore
      }

      return updated;
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleUpdateLeader = (id: string, field: keyof LeadershipMember, value: string) => {
    setLeadershipTeam(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleRemoveLeader = (id: string) => {
    if (leadershipTeam.length <= 1) {
      alert('You must keep at least one leadership team member on the council.');
      return;
    }
    if (window.confirm('Are you sure you want to remove this member from the Leadership Council?')) {
      setLeadershipTeam(prev => {
        const updated = prev.filter(m => m.id !== id);
        try {
          const saved = localStorage.getItem('gyf_website_content');
          const existingData = saved ? JSON.parse(saved) : {};
          localStorage.setItem('gyf_website_content', JSON.stringify({
            ...existingData,
            leadershipTeam: updated,
            updatedAt: new Date().toISOString()
          }));
        } catch (e) {
          // ignore
        }
        return updated;
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    const content = {
      announcementText,
      announcementActive,
      heroTitle,
      heroSubtitle,
      primaryCtaText,
      secondaryCtaText,
      missionText,
      visionText,
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
      leadershipTeam,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('gyf_website_content', JSON.stringify(content));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all website content and leadership council back to factory defaults?')) {
      localStorage.removeItem('gyf_website_content');
      setAnnouncementText('🚀 GYF Youth Fellowship 2026 Applications Are Now Live! Pro-Bono Paralegal Legal Aid Clinic Open Mon-Sat.');
      setAnnouncementActive(true);
      setHeroTitle('Empowering Youth. Defending Human Rights. Resolving Grievances.');
      setHeroSubtitle('Global Youth Foundation operates Kashmir’s leading youth ombudsman network, pro-bono paralegal aid desk, and civic advocacy coalitions for institutional accountability.');
      setMissionText('To foster a just, inclusive, and accountable society by mobilizing youth as frontline human rights monitors, providing accessible legal redressal, and bridging citizen grievances with civic authorities.');
      setVisionText('A democratic valley and nation where every young person is empowered with constitutional awareness, legal aid protection, and active civic participation.');
      setLeadershipTeam(DEFAULT_LEADERS);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
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
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Top Banner Announcements</h3>
                <p className="text-[11px] text-slate-400">Appears at the very top of the website header</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs font-bold text-slate-600">Active Live:</span>
              <input
                type="checkbox"
                checked={announcementActive}
                onChange={(e) => setAnnouncementActive(e.target.checked)}
                className="w-4 h-4 rounded text-teal-800 focus:ring-teal-800 border-slate-300"
              />
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
              Announcement Message Text
            </label>
            <textarea
              rows={2}
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
            />
          </div>
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
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-slate-400" />
                    <span>Photo Image URL</span>
                  </label>
                  <input
                    type="url"
                    value={member.image}
                    onChange={(e) => handleUpdateLeader(member.id, 'image', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-mono text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-800"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
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
        </div>

        {/* SECTION 5: Live Impact Numbers */}
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Live Public Impact Metrics</h3>
              <p className="text-[11px] text-slate-400">Audited statistics featured on homepage counters and reports</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
                Youth Trained
              </label>
              <input
                type="text"
                value={statYouthTrained}
                onChange={(e) => setStatYouthTrained(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
                Grievances Resolved
              </label>
              <input
                type="text"
                value={statCasesResolved}
                onChange={(e) => setStatCasesResolved(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
                Districts Covered
              </label>
              <input
                type="text"
                value={statDistrictsCovered}
                onChange={(e) => setStatDistrictsCovered(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
                Legal Aid Beneficiaries
              </label>
              <input
                type="text"
                value={statLegalAidProvided}
                onChange={(e) => setStatLegalAidProvided(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-800"
              />
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
            </div>
          </div>

        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish All Website Updates</span>
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
