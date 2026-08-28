import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  UserCheck, 
  Clock, 
  Building2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ComplaintTimeline } from '../components/ComplaintTimeline';
import { GrievanceRecord } from '../types';

export const TrackComplaintPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getComplaintById, complaints } = useApp();

  const [inputQuery, setInputQuery] = useState(searchParams.get('id') || '');
  const [searchedRecord, setSearchedRecord] = useState<GrievanceRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const sampleIds = ['GYF-2026-847291', 'GYF-2026-319042', 'GYF-2026-552108'];

  const handleSearch = (idToSearch?: string) => {
    const id = (idToSearch || inputQuery).trim().toUpperCase();
    if (!id) {
      setErrorMessage('Please enter a valid Complaint ID');
      return;
    }

    setErrorMessage('');
    setHasSearched(true);
    setSearchParams({ id });

    const found = getComplaintById(id);
    if (found) {
      setSearchedRecord(found);
    } else {
      setSearchedRecord(null);
    }
  };

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) {
      setInputQuery(idParam);
      handleSearch(idParam);
    }
  }, [searchParams]);

  return (
    <div id="track-complaint-page" className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* Header */}
      <section className="bg-slate-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 opacity-95" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-400/30">
            <Search className="w-3.5 h-3.5" />
            Transparent Redressal Registry
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Track Your Complaint
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Check the real-time status of your grievance docket securely without exposing private complainant details.
          </p>
        </div>
      </section>

      {/* Main Search & Results */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Search Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs space-y-4">
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
                  placeholder="Enter Complaint ID (e.g. GYF-2026-847291)"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-mono tracking-wider font-semibold text-slate-900"
                />
              </div>

              <button
                type="submit"
                id="track-complaint-search-btn"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-sm transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Track Complaint</span>
              </button>
            </form>

            {errorMessage && (
              <p className="text-xs text-rose-600 font-semibold">{errorMessage}</p>
            )}

            {/* Quick Sample Dockets for testing */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>Quick Sample IDs:</span>
              {sampleIds.map((sampleId) => (
                <button
                  key={sampleId}
                  type="button"
                  onClick={() => {
                    setInputQuery(sampleId);
                    handleSearch(sampleId);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-teal-50 hover:text-teal-800 border border-slate-200 font-mono text-[11px] font-semibold transition-colors"
                >
                  {sampleId}
                </button>
              ))}
            </div>
          </div>

          {/* Results Display */}
          {hasSearched && searchedRecord && (
            <div className="p-6 sm:p-10 rounded-3xl bg-white border-2 border-teal-500/30 shadow-md space-y-8 animate-in fade-in duration-300">
              
              {/* Top Meta info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                      Docket Reference
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-900 border border-teal-200 text-xs font-mono font-bold">
                      {searchedRecord.id}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {searchedRecord.subject}
                  </h2>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-xs text-slate-400">Current Status:</span>
                  <span className="px-3.5 py-1 rounded-full bg-teal-600 text-white font-bold text-xs shadow-xs">
                    {searchedRecord.currentStatus}
                  </span>
                </div>
              </div>

              {/* Safe Public Case Parameters (No Complainant Identity Exposed) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-slate-400 font-medium">Category</span>
                  <div className="font-bold text-slate-800 line-clamp-1">{searchedRecord.category}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-slate-400 font-medium">Location</span>
                  <div className="font-bold text-slate-800 line-clamp-1">{searchedRecord.location}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-slate-400 font-medium">Date Registered</span>
                  <div className="font-bold text-slate-800 font-mono">{searchedRecord.submittedAt}</div>
                </div>
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
                  Complainant personal identifiers are masked under the Global Youth Foundation Privacy & Ombudsman Protection Protocol.
                </span>
              </div>

            </div>
          )}

          {/* Not Found Screen */}
          {hasSearched && !searchedRecord && (
            <div className="p-10 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">No Docket Found</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  We could not find a complaint matching <span className="font-mono font-bold text-slate-700">“{inputQuery}”</span>. Please double-check your Complaint ID or submit a new grievance.
                </p>
              </div>
              <Link
                to="/grievance"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xs hover:bg-teal-700"
              >
                Submit New Grievance
              </Link>
            </div>
          )}

        </div>
      </section>

    </div>
  );
};
