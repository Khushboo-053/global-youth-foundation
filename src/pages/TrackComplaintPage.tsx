import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Building2,
  Lock,
  ArrowRight,
  UserCheck,
  Tag,
  Copy,
  Check,
  Eye
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ComplaintTimeline } from '../components/ComplaintTimeline';
import { GrievanceRecord } from '../types';
import { EvidenceAttachmentCard } from '../components/common/EvidenceAttachmentCard';

export const TrackComplaintPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, complaints } = useApp();

  const [inputQuery, setInputQuery] = useState(searchParams.get('id') || '');
  const [searchedRecord, setSearchedRecord] = useState<GrievanceRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const userEmail = user?.email?.toLowerCase().trim() || '';
  const userName = user?.fullName?.toLowerCase().trim() || '';
  const isAdministrator = user?.role === 'admin';

  // Citizens can ONLY track grievances filed under their own account
  const myComplaints = useMemo(() => {
    if (!user) return [];
    if (isAdministrator) return complaints;
    return complaints.filter(c => {
      const matchEmail = c.complainantEmail && c.complainantEmail.toLowerCase().trim() === userEmail;
      const matchName = c.fullName && userName && c.fullName.toLowerCase().trim() === userName;
      return matchEmail || matchName;
    });
  }, [complaints, user, isAdministrator, userEmail, userName]);

  const normalizeId = (raw: string) => raw.replace(/\s+/g, '').toUpperCase();

  const handleSearch = (idToSearch?: string) => {
    const rawId = (idToSearch || inputQuery).trim();
    const id = normalizeId(rawId);

    if (!id) {
      setErrorMessage('Please enter a valid Complaint Docket ID');
      return;
    }

    setErrorMessage('');
    setHasSearched(true);
    setSearchParams({ id });

    // Search strictly within user's allowed grievances
    const found = myComplaints.find(c => normalizeId(c.id) === id);
    if (found) {
      setSearchedRecord(found);
      setErrorMessage('');
    } else {
      setSearchedRecord(null);
      if (!isAdministrator && complaints.some(c => normalizeId(c.id) === id)) {
        setErrorMessage(`Docket "${id}" is not registered to your account (${user?.email}). Under citizen privacy rules, you can only track grievances filed by you.`);
      }
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam && user) {
      setInputQuery(idParam);
      handleSearch(idParam);
    }
  }, [searchParams, user]);

  // Case 1: Citizen is NOT logged in -> Require Authentication Gate
  if (!user) {
    return (
      <div id="track-complaint-auth-gate" className="min-h-screen bg-slate-50 flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto w-full space-y-8">
          
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider border border-teal-200">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Confidential Citizen Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Track Your Grievance
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Please sign in to your verified account to review investigation status, ombudsman audit notes, and docket records.
            </p>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-lg font-bold text-slate-900">
                Authentication Required
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                Under the Global Youth Foundation Privacy & Ombudsman Protection Protocol, grievance tracking is restricted to logged-in users so citizens can securely view only their own filed grievances.
              </p>
            </div>

            {/* Quick Benefits / Protections */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Confidential docket history & evidence security</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Restricted access: you only check your personal cases</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Direct ombudsman updates and field report access</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-2">
              <Link
                to="/login"
                id="track-login-btn"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#272d8a] hover:bg-[#1f246e] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <span>Log In to Check My Grievance</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-between gap-3 text-xs pt-1">
                <Link
                  to="/signup"
                  className="w-1/2 py-2.5 text-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                >
                  Create Account
                </Link>
                <Link
                  to="/grievance"
                  className="w-1/2 py-2.5 text-center rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold transition-colors"
                >
                  Submit New Grievance
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Case 2: Citizen IS logged in -> Can check ONLY their own grievances
  return (
    <div id="track-complaint-page" className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* Header */}
      <section className="bg-slate-900 text-white py-14 lg:py-18 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-[#161c47] to-teal-950 opacity-95" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-400/30">
                <Search className="w-3.5 h-3.5" />
                Confidential Citizen Redressal Desk
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Track My Grievance
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl">
                Check real-time status progression, legal scrutiny notes, and investigation reports for grievances registered under your account.
              </p>
            </div>

            {/* User Account Capsule */}
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center font-bold">
                {user.fullName?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="font-bold flex items-center gap-1.5">
                  <span>{user.fullName}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-400/20 text-teal-300 font-mono">
                    {isAdministrator ? 'Admin' : 'Verified Citizen'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 font-mono">
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Search & Results */}
      <section className="py-12 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Search Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="complaint-id-input" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-teal-700" />
                <span>Search My Grievances by Docket ID</span>
              </label>
              <span className="text-xs font-semibold text-slate-500">
                {myComplaints.length} registered docket{myComplaints.length === 1 ? '' : 's'} on file
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="complaint-id-input"
                  value={inputQuery}
                  onChange={(e) => {
                    setInputQuery(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter Docket ID (e.g. GYF-2026-847291)"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-sm font-mono tracking-wider font-semibold text-slate-900"
                />
              </div>

              <button
                type="submit"
                id="track-complaint-search-btn"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-xs transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Track Docket</span>
              </button>
            </form>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Quick Clickable Dockets registered to this citizen */}
            {myComplaints.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Your Registered Dockets:</span>
                {myComplaints.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setInputQuery(c.id);
                      handleSearch(c.id);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                      searchedRecord?.id === c.id
                        ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-900 hover:border-teal-300 border-slate-200'
                    }`}
                  >
                    <span>{c.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans font-bold ${
                      c.currentStatus === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                      c.currentStatus === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                      c.currentStatus === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                      'bg-sky-100 text-sky-800'
                    }`}>
                      {c.currentStatus}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results Display */}
          {hasSearched && searchedRecord && (
            <div className="p-6 sm:p-10 rounded-3xl bg-white border-2 border-teal-500/30 shadow-md space-y-8 animate-in fade-in duration-300">
              
              {/* Top Meta info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                      Docket Reference
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-900 border border-teal-200 text-xs font-mono font-bold flex items-center gap-1.5">
                      <span>{searchedRecord.id}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyId(searchedRecord.id)}
                        className="text-teal-700 hover:text-teal-900"
                        title="Copy Docket ID"
                      >
                        {copiedId === searchedRecord.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Registered on {searchedRecord.submittedAt}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {searchedRecord.subject}
                  </h2>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-xs text-slate-400">Current Status:</span>
                  <span className={`px-3.5 py-1 rounded-full font-bold text-xs shadow-xs ${
                    searchedRecord.currentStatus === 'Resolved' ? 'bg-emerald-600 text-white' :
                    searchedRecord.currentStatus === 'Rejected' ? 'bg-rose-600 text-white' :
                    searchedRecord.currentStatus === 'In Progress' ? 'bg-amber-600 text-white' :
                    'bg-teal-600 text-white'
                  }`}>
                    {searchedRecord.currentStatus}
                  </span>
                </div>
              </div>

              {/* Case Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-slate-400 font-medium">Category</span>
                  <div className="font-bold text-slate-800 line-clamp-1">{searchedRecord.category}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-slate-400 font-medium">Location</span>
                  <div className="font-bold text-slate-800 line-clamp-1">{searchedRecord.location}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-slate-400 font-medium">Assigned Department</span>
                  <div className="font-bold text-slate-800 line-clamp-1">{searchedRecord.assignedDepartment || 'Ombudsman Secretariat'}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-slate-400 font-medium">Priority</span>
                  <div className="font-bold text-slate-800 font-mono">{searchedRecord.priority}</div>
                </div>
              </div>

              {/* Grievance Statement & Attached Evidence */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Statement of Grievance
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {searchedRecord.description}
                </p>

                {searchedRecord.remarks && (
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-slate-900 block text-[11px]">Ombudsman Officer Remarks:</span>
                    <p className="text-slate-600">{searchedRecord.remarks}</p>
                  </div>
                )}

                {searchedRecord.attachmentName && (
                  <div className="pt-2 border-t border-slate-200">
                    <EvidenceAttachmentCard
                      attachmentName={searchedRecord.attachmentName}
                      attachmentSize={searchedRecord.attachmentSize || '1.4 MB'}
                      attachmentUrl={searchedRecord.attachmentUrl}
                      attachmentType={searchedRecord.attachmentType}
                      docketId={searchedRecord.id}
                      category={searchedRecord.category}
                      subject={searchedRecord.subject}
                      submittedAt={searchedRecord.submittedAt}
                    />
                  </div>
                )}
              </div>

              {/* Status Timeline */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Resolution Progress Timeline
                </h3>
                <ComplaintTimeline 
                  currentStatus={searchedRecord.currentStatus} 
                  events={searchedRecord.timeline}
                />
              </div>

              {/* Privacy Notice */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>
                  Protected under the Global Youth Foundation Ombudsman Privacy Charter. This file is accessible solely to you and assigned case officers.
                </span>
              </div>

            </div>
          )}

          {/* Not Found Screen */}
          {hasSearched && !searchedRecord && !errorMessage && (
            <div className="p-10 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">No Matching Docket Found</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  We could not find a complaint matching <span className="font-mono font-bold text-slate-700">“{inputQuery}”</span> under your registered account ({user.email}).
                </p>
              </div>
              <div className="flex justify-center gap-3">
                <Link
                  to="/grievance"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xs hover:bg-teal-700"
                >
                  Submit New Grievance
                </Link>
              </div>
            </div>
          )}

          {/* Comprehensive List of User's Filed Grievances */}
          <div className="space-y-5 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  My Filed Grievance Dockets ({myComplaints.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Select any docket below to view its chronological action log and field updates.
                </p>
              </div>

              <Link
                to="/grievance"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-auto"
              >
                <span>Lodge New Appeal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {myComplaints.length === 0 ? (
              <div className="p-10 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-3">
                <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No Grievances Filed Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You do not have any registered grievance dockets under {user.email}. If you encounter human rights, scholarship, or civic infrastructure issues, our ombudsman desk is ready to assist.
                </p>
                <div className="pt-2">
                  <Link
                    to="/grievance"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Submit a Grievance Now
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {myComplaints.map((item) => {
                  const isCurrentlySelected = searchedRecord?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`p-5 sm:p-6 rounded-2xl bg-white border transition-all space-y-3.5 ${
                        isCurrentlySelected
                          ? 'border-teal-500 ring-2 ring-teal-100 shadow-md'
                          : 'border-slate-200 hover:border-teal-300 shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-extrabold text-teal-950 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200">
                            {item.id}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            item.currentStatus === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                            item.currentStatus === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                            item.currentStatus === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                            'bg-sky-100 text-sky-800'
                          }`}>
                            {item.currentStatus}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {item.submittedAt}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setInputQuery(item.id);
                              handleSearch(item.id);
                              window.scrollTo({ top: 300, behavior: 'smooth' });
                            }}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isCurrentlySelected
                                ? 'bg-teal-700 text-white shadow-xs'
                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isCurrentlySelected ? 'Viewing Timeline' : 'Track This Case'}</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {item.subject}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span>Category: <strong className="text-slate-700 font-medium">{item.category}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{item.location}</span>
                          </span>
                        </div>
                        <span className="font-semibold text-slate-600">
                          Priority: {item.priority}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
};
