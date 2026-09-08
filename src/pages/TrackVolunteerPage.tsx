import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  ShieldCheck, 
  Copy, 
  Check, 
  ArrowRight, 
  UserCheck, 
  MapPin, 
  Calendar, 
  Sparkles, 
  HeartHandshake, 
  Mail, 
  Phone, 
  ExternalLink, 
  Printer, 
  HelpCircle,
  Award,
  FileCheck,
  ChevronRight,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserAccount, MembershipRecord } from '../types';

export const TrackVolunteerPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { users, memberships, user } = useApp();

  const [inputQuery, setInputQuery] = useState(searchParams.get('ref') || searchParams.get('id') || '');
  const [hasSearched, setHasSearched] = useState(false);
  const [matchedRecord, setMatchedRecord] = useState<{
    type: 'volunteer' | 'membership';
    refId: string;
    fullName: string;
    email: string;
    phone?: string;
    appliedDate: string;
    chapter: string;
    areasOfInterest: string[];
    availability?: string;
    professionOrEducation?: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    statusRaw: string;
    remarks?: string;
    volunteerHours?: number;
    rawUser?: UserAccount;
    rawMembership?: MembershipRecord;
  } | null>(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  // Normalize string for clean matching
  const cleanStr = (s?: string) => (s ? s.trim().toLowerCase() : '');
  const cleanRef = (s?: string) => (s ? s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : '');

  // Pre-fill if query parameter exists
  const initialQuery = searchParams.get('ref') || searchParams.get('id') || '';

  const handleSearch = (queryToSearch?: string) => {
    const raw = (queryToSearch !== undefined ? queryToSearch : inputQuery).trim();
    if (!raw) {
      setErrorMessage('Please enter an Application Reference ID (e.g. GYF-VOL-1082 or GYF-MEM-2026-4921), registered email, or phone number.');
      setMatchedRecord(null);
      setHasSearched(true);
      return;
    }

    setErrorMessage('');
    setHasSearched(true);
    setSearchParams({ ref: raw });

    const normalizedTarget = cleanRef(raw);
    const textTarget = cleanStr(raw);

    // 1. Search in users (Volunteers, Applicants, Members)
    const foundUser = users.find(u => {
      const matchMemId = u.membershipId && cleanRef(u.membershipId) === normalizedTarget;
      const matchId = cleanRef(u.id) === normalizedTarget;
      const matchEmail = u.email && cleanStr(u.email) === textTarget;
      const matchPhone = u.phone && cleanStr(u.phone).replace(/[^0-9]/g, '').includes(raw.replace(/[^0-9]/g, '')) && raw.replace(/[^0-9]/g, '').length >= 7;
      return matchMemId || matchId || matchEmail || matchPhone;
    });

    if (foundUser) {
      const isApproved = foundUser.isActive || foundUser.membershipStatus === 'Volunteer' || foundUser.membershipStatus === 'Member';
      const isRejected = foundUser.membershipStatus === 'Rejected';
      const status: 'Pending' | 'Approved' | 'Rejected' = isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending';

      setMatchedRecord({
        type: 'volunteer',
        refId: foundUser.membershipId || foundUser.id,
        fullName: foundUser.fullName,
        email: foundUser.email,
        phone: foundUser.phone,
        appliedDate: foundUser.joinedDate || 'Recent Intake',
        chapter: foundUser.chapter || 'Central Kashmir Hub (Srinagar)',
        areasOfInterest: foundUser.skills && foundUser.skills.length > 0 ? foundUser.skills : ['Youth Mobilization', 'Human Rights'],
        availability: foundUser.availability || 'Flexible / Active Civic Responder',
        professionOrEducation: foundUser.professionOrEducation || 'Civic Fellow',
        status,
        statusRaw: foundUser.membershipStatus,
        remarks: isApproved 
          ? 'Application successfully verified by GYF Secretariat. Volunteer credentials and district taskforce rights are active.' 
          : isRejected 
          ? 'Application reviewed by Chapter Review Committee. Candidate does not meet current deployment criteria.' 
          : 'Application received and logged. Initial background screening and chapter committee review are underway.',
        volunteerHours: foundUser.volunteerHours || 0,
        rawUser: foundUser
      });
      return;
    }

    // 2. Search in memberships (General Membership & Volunteer Onboarding)
    const foundMem = memberships.find(m => {
      const matchAppId = cleanRef(m.applicationId) === normalizedTarget;
      const matchEmail = cleanStr(m.email) === textTarget;
      const matchPhone = m.phone && cleanStr(m.phone).replace(/[^0-9]/g, '').includes(raw.replace(/[^0-9]/g, '')) && raw.replace(/[^0-9]/g, '').length >= 7;
      return matchAppId || matchEmail || matchPhone;
    });

    if (foundMem) {
      const isApproved = foundMem.status === 'Approved' || foundMem.status === 'Active Member';
      const isRejected = foundMem.status === 'Rejected';
      const status: 'Pending' | 'Approved' | 'Rejected' = isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending';

      setMatchedRecord({
        type: 'membership',
        refId: foundMem.applicationId,
        fullName: foundMem.fullName,
        email: foundMem.email,
        phone: foundMem.phone,
        appliedDate: foundMem.appliedAt,
        chapter: `${foundMem.city || 'Kashmir'} Regional Chapter`,
        areasOfInterest: [foundMem.areaOfInterest || 'Youth Leadership & Fellowships'],
        availability: 'Standard Civic Volunteer Membership',
        professionOrEducation: 'Member Applicant',
        status,
        statusRaw: foundMem.status,
        remarks: isApproved
          ? 'Membership and volunteer credentials verified by Secretariat.'
          : isRejected
          ? 'Application concluded following review.'
          : 'Application is undergoing credentials verification and chapter committee evaluation.',
        rawMembership: foundMem
      });
      return;
    }

    // Not found
    setMatchedRecord(null);
    setErrorMessage(`No volunteer or membership record found matching "${raw}". Please verify your Reference ID (e.g. GYF-VOL-XXXX) or check that you entered the registered email/phone.`);
  };

  useEffect(() => {
    if (initialQuery) {
      setInputQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const copyRefId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Mask sensitive contact details for privacy
  const maskEmail = (email: string) => {
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    const name = parts[0];
    const masked = name.length > 2 ? `${name[0]}••••${name[name.length - 1]}` : `${name[0]}•`;
    return `${masked}@${parts[1]}`;
  };

  const maskPhone = (phone?: string) => {
    if (!phone) return 'Not provided';
    const cleaned = phone.replace(/\s+/g, '');
    if (cleaned.length < 6) return phone;
    return `${cleaned.slice(0, 4)} •••• ${cleaned.slice(-2)}`;
  };

  // Quick sample IDs for users to easily test tracking
  const sampleRefList = useMemo(() => {
    const list: { id: string; name: string; type: string }[] = [];
    users.filter(u => u.membershipId && (u.role === 'volunteer' || u.membershipStatus === 'Applicant')).slice(0, 3).forEach(u => {
      list.push({ id: u.membershipId!, name: u.fullName, type: 'Volunteer Application' });
    });
    memberships.slice(0, 2).forEach(m => {
      list.push({ id: m.applicationId, name: m.fullName, type: 'Membership Form' });
    });
    return list;
  }, [users, memberships]);

  return (
    <div id="track-volunteer-page" className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      
      {/* Top Banner & Switcher */}
      <section className="bg-slate-900 text-white pt-12 pb-16 lg:pt-16 lg:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-teal-950 to-[#1f2360] opacity-95" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4 text-teal-300" />
            <span>Volunteer & Membership Taskforce</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Track Volunteer Form Status
          </h1>

          <p className="text-sm sm:text-base text-teal-100/90 max-w-2xl mx-auto leading-relaxed">
            Enter your official <strong>Application Reference ID (Ref. No.)</strong> generated upon submission to inspect screening progress, chapter review, and taskforce induction in real-time.
          </p>

          {/* Quick Switch to Complaint Tracker */}
          <div className="pt-1">
            <Link
              to="/track-complaint"
              className="inline-flex items-center gap-1.5 text-xs text-blue-300 hover:text-white underline underline-offset-4 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Looking to track a confidential Ombudsman Grievance instead? Click here</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Search Bar Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/80 p-4 sm:p-7">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  id="track-ref-input"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Enter Ref. No. (e.g. GYF-VOL-4821 or GYF-MEM-2026-1049), email or phone"
                  className="w-full pl-11 pr-4 py-3.5 text-sm sm:text-base rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 font-medium"
                />
              </div>

              <button
                type="submit"
                id="track-search-submit-btn"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md transition-all cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Track Status</span>
              </button>
            </div>

            {/* Quick helper for users */}
            {sampleRefList.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
                <span className="font-semibold text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  Quick Test Applications:
                </span>
                {sampleRefList.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setInputQuery(s.id);
                      handleSearch(s.id);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 text-[11px] font-mono font-bold transition-all cursor-pointer"
                  >
                    {s.id} ({s.name.split(' ')[0]})
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Results / Details View */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Error State */}
        {hasSearched && errorMessage && (
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-rose-900">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>No Application Found</span>
            </div>
            <p className="text-xs sm:text-sm text-rose-700 leading-relaxed pl-7">
              {errorMessage}
            </p>
            <div className="pl-7 pt-2">
              <Link 
                to="/membership" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:underline"
              >
                <span>Haven't submitted yet? Open Volunteer & Membership Registration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Found Record Dossier */}
        {matchedRecord && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            
            {/* Header Status Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 font-bold text-xs uppercase tracking-wider">
                      {matchedRecord.type === 'volunteer' ? 'Volunteer Taskforce Application' : 'Membership & Volunteer Onboarding'}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">Logged on {matchedRecord.appliedDate}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {matchedRecord.fullName}
                  </h2>
                </div>

                {/* Status Badge */}
                <div>
                  {matchedRecord.status === 'Approved' ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 text-sm font-black border border-emerald-300 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Approved • Active Taskforce</span>
                    </span>
                  ) : matchedRecord.status === 'Rejected' ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-100 text-rose-900 text-sm font-black border border-rose-300 shadow-2xs">
                      <XCircle className="w-4 h-4 text-rose-700" />
                      <span>Application Concluded</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-100 text-amber-900 text-sm font-black border border-amber-300 shadow-2xs">
                      <Clock className="w-4 h-4 text-amber-700 animate-pulse" />
                      <span>Pending Screening Review</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Reference ID Bar */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Application Reference ID:
                  </span>
                  <span className="font-mono font-black text-teal-900 text-base sm:text-lg bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
                    {matchedRecord.refId}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyRefId(matchedRecord.refId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{copiedId ? 'Copied to Clipboard' : 'Copy Ref ID'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                    title="Print Application Docket"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">Print Slip</span>
                  </button>
                </div>
              </div>

              {/* Multi-Stage Screening Timeline */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-teal-800" />
                  <span>Application Progress Timeline</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  
                  {/* Step 1 */}
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <div className="flex items-center justify-between text-emerald-800">
                      <span className="text-xs font-bold">1. Docketed</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-[11px] text-emerald-950 font-medium">Logged in Secretariat Roster</p>
                    <span className="text-[10px] text-emerald-700 block">Completed</span>
                  </div>

                  {/* Step 2 */}
                  <div className={`p-3.5 rounded-xl border space-y-1 ${
                    matchedRecord.status === 'Approved'
                      ? 'bg-emerald-50 border-emerald-200'
                      : matchedRecord.status === 'Rejected'
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">2. Screening</span>
                      {matchedRecord.status === 'Approved' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium">Identity & Domains Check</p>
                    <span className="text-[10px] font-bold text-slate-500">
                      {matchedRecord.status === 'Approved' ? 'Verified' : 'In Progress'}
                    </span>
                  </div>

                  {/* Step 3 */}
                  <div className={`p-3.5 rounded-xl border space-y-1 ${
                    matchedRecord.status === 'Approved'
                      ? 'bg-emerald-50 border-emerald-200'
                      : matchedRecord.status === 'Rejected'
                      ? 'bg-rose-50 border-rose-200'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">3. Chapter Review</span>
                      {matchedRecord.status === 'Approved' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : matchedRecord.status === 'Rejected' ? (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">{matchedRecord.chapter.split('(')[0]}</p>
                    <span className="text-[10px] font-bold text-slate-500">
                      {matchedRecord.status === 'Approved' ? 'Endorsed' : matchedRecord.status === 'Rejected' ? 'Concluded' : 'Queued'}
                    </span>
                  </div>

                  {/* Step 4 */}
                  <div className={`p-3.5 rounded-xl border space-y-1 ${
                    matchedRecord.status === 'Approved'
                      ? 'bg-emerald-100/70 border-emerald-300'
                      : matchedRecord.status === 'Rejected'
                      ? 'bg-rose-50 border-rose-200'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">4. Induction</span>
                      {matchedRecord.status === 'Approved' ? (
                        <Award className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">Digital Taskforce ID</p>
                    <span className="text-[10px] font-bold text-slate-500">
                      {matchedRecord.status === 'Approved' ? 'Activated' : 'Awaiting Review'}
                    </span>
                  </div>

                </div>
              </div>

              {/* Dossier Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 text-xs border-t border-slate-100">
                
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                  <div className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-800" />
                    <span>Assigned Regional Chapter</span>
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">
                    {matchedRecord.chapter}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Under administrative oversight of the GYF Central Secretariat.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                  <div className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-800" />
                    <span>Availability & Commitment</span>
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">
                    {matchedRecord.availability}
                  </p>
                  {matchedRecord.volunteerHours !== undefined && (
                    <p className="text-teal-800 font-bold text-[11px]">
                      Logged Service Hours: {matchedRecord.volunteerHours} hrs
                    </p>
                  )}
                </div>

                {/* Areas of Interest & Volunteer Domains */}
                <div className="sm:col-span-2 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2.5">
                  <div className="font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-teal-800" />
                      <span>Areas of Interest & Focus Domains</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      {matchedRecord.areasOfInterest.length} registered
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {matchedRecord.areasOfInterest.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-teal-50 text-teal-900 border border-teal-200 text-xs font-bold flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 text-teal-700" />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Privacy Protected Contact Details */}
                <div className="sm:col-span-2 p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider">
                      Applicant Contact Verification (Masked for Privacy)
                    </span>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#2C3292]" />
                        <span>{maskEmail(matchedRecord.email)}</span>
                      </span>
                      {matchedRecord.phone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#2C3292]" />
                          <span>{maskPhone(matchedRecord.phone)}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] text-blue-800/80 font-medium">
                    Notifications sent via Email/WhatsApp
                  </span>
                </div>

              </div>

              {/* Official Review Notice */}
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 text-xs text-slate-700 space-y-1.5">
                <div className="font-bold text-teal-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-800" />
                  <span>Secretariat Review Note</span>
                </div>
                <p className="leading-relaxed">
                  {matchedRecord.remarks}
                </p>
                {matchedRecord.status === 'Pending' && (
                  <p className="text-slate-500 text-[11px]">
                    Standard screening turnaround is <strong>48 to 72 hours</strong>. Once approved, you will receive activation confirmation and access to the Volunteer Portal.
                  </p>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setMatchedRecord(null);
                    setHasSearched(false);
                    setInputQuery('');
                    setSearchParams({});
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  ← Track Another Application
                </button>

                <div className="flex items-center gap-2">
                  {matchedRecord.status === 'Approved' ? (
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-all"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Log into Volunteer Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
                    >
                      <span>Contact Secretariat Desk</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Guidance / FAQ Section */}
        {!matchedRecord && (
          <div className="mt-12 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-teal-800" />
              <span>Volunteer Application Tracking Guide</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs text-slate-600">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-900 block text-sm">Where is my Ref. No.?</span>
                <p>
                  Your unique Reference Number (e.g. <code>GYF-VOL-4821</code>) was displayed on the screen immediately upon submitting the volunteer form.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-900 block text-sm">How long does screening take?</span>
                <p>
                  The GYF Taskforce Admin reviews applications within 48–72 hours. You can return to this page anytime to check your live status.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-900 block text-sm">What happens after approval?</span>
                <p>
                  Upon approval, your official Digital Taskforce ID is generated and you can log in to view assigned community tasks and log service hours.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
              <span className="text-slate-500">Need immediate assistance with an ongoing volunteer form?</span>
              <Link to="/contact" className="font-bold text-teal-800 hover:underline flex items-center gap-1">
                <span>Reach Secretariat Helpdesk</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
