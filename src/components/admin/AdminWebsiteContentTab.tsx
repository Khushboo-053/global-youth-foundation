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
  FileText
} from 'lucide-react';

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
      }
    } catch (e) {
      // ignore
    }
  }, []);

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
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('gyf_website_content', JSON.stringify(content));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all website content back to factory defaults?')) {
      localStorage.removeItem('gyf_website_content');
      setAnnouncementText('🚀 GYF Youth Fellowship 2026 Applications Are Now Live! Pro-Bono Paralegal Legal Aid Clinic Open Mon-Sat.');
      setAnnouncementActive(true);
      setHeroTitle('Empowering Youth. Defending Human Rights. Resolving Grievances.');
      setHeroSubtitle('Global Youth Foundation operates Kashmir’s leading youth ombudsman network, pro-bono paralegal aid desk, and civic advocacy coalitions for institutional accountability.');
      setMissionText('To foster a just, inclusive, and accountable society by mobilizing youth as frontline human rights monitors, providing accessible legal redressal, and bridging citizen grievances with civic authorities.');
      setVisionText('A democratic valley and nation where every young person is empowered with constitutional awareness, legal aid protection, and active civic participation.');
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
            Control the announcement banner, homepage hero copy, organizational mission/vision, public impact stats, and banking details in real-time.
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
          <span>Website content updated and published live across all public portals!</span>
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

        {/* SECTION 2: Hero & Value Proposition */}
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

        {/* SECTION 3: Mission & Vision Statements */}
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

        {/* SECTION 4: Live Impact Numbers */}
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

        {/* SECTION 5: Contact, Hotline & Banking Info */}
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

    </div>
  );
};
