import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  UploadCloud, 
  Lock, 
  EyeOff, 
  Check, 
  Copy, 
  ArrowRight, 
  AlertCircle, 
  FileText, 
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GrievanceRecord } from '../types';

export const GrievancePage: React.FC = () => {
  const { submitGrievance, user } = useApp();
  const navigate = useNavigate();

  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Human Rights & Civic Liberties',
    subject: '',
    description: '',
    location: '',
    email: user?.email || '',
    phone: user?.phone || '',
    attachmentName: '',
    attachmentSize: '',
    attachmentUrl: '',
    attachmentType: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<GrievanceRecord | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const categories = [
    'Human Rights & Civic Liberties',
    'Education & Scholarship Assistance',
    'Environmental & Civic Hygiene',
    'Community Safety & Street Lighting',
    'Youth Harassment & Discrimination',
    'Healthcare & Emergency Relief Access',
    'Other Public Interest Matter'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.max(1, Math.round(file.size / 1024))} KB`;

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          attachmentName: file.name,
          attachmentSize: sizeStr,
          attachmentUrl: event.target?.result as string,
          attachmentType: file.type || 'application/octet-stream'
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.subject.trim() || formData.subject.trim().length < 5) {
      errs.subject = 'Please provide a clear subject (minimum 5 characters)';
    }
    if (!formData.description.trim() || formData.description.trim().length < 15) {
      errs.description = 'Please describe your grievance in detail (minimum 15 characters)';
    }
    if (!formData.location.trim()) {
      errs.location = 'Please state the incident location / district';
    }

    if (!isAnonymous) {
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errs.email = 'Please enter a valid email or leave blank';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const record = await submitGrievance({
        category: formData.category,
        subject: formData.subject.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        isAnonymous: isAnonymous,
        complainantEmail: isAnonymous ? undefined : formData.email.trim(),
        complainantPhone: isAnonymous ? undefined : formData.phone.trim(),
        attachmentName: formData.attachmentName || undefined,
        attachmentSize: formData.attachmentSize || undefined,
        attachmentUrl: formData.attachmentUrl || undefined,
        attachmentType: formData.attachmentType || undefined
      });

      setIsSubmitting(false);
      setSubmittedComplaint(record);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting grievance:', error);
      setIsSubmitting(false);
    }
  };

  const copyComplaintId = () => {
    if (!submittedComplaint) return;
    navigator.clipboard.writeText(submittedComplaint.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div id="grievance-page" className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* Header */}
      <section className="bg-slate-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 opacity-95" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-400/30">
            <Lock className="w-3.5 h-3.5" />
            Confidential Ombudsman Portal
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Submit a Grievance
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Report human rights concerns, educational barriers, civic negligence, or community grievances with complete privacy protection.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Privacy Message Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/70 border border-teal-200 flex items-start gap-3.5 mb-8">
            <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-teal-950 leading-relaxed">
              <span className="font-bold block text-teal-900 mb-0.5">Confidentiality Guarantee:</span>
              “Your information will be handled confidentially. You may submit a grievance anonymously.”
            </div>
          </div>

          {/* Success Screen */}
          {submittedComplaint ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Grievance submitted successfully.
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Your docket has been lodged with the Global Youth Foundation Grievance Redressal Committee.
                </p>
              </div>

              {/* Complaint ID Card */}
              <div className="p-6 rounded-2xl bg-white border-2 border-teal-500/40 shadow-xs max-w-md mx-auto space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Your Unique Complaint ID
                </span>
                
                <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between gap-3">
                  <span className="font-mono font-extrabold text-teal-950 text-xl sm:text-2xl">
                    {submittedComplaint.id}
                  </span>
                  
                  <button
                    type="button"
                    id="copy-complaint-id-btn"
                    onClick={copyComplaintId}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId ? 'Copied!' : 'Copy Complaint ID'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-500">
                  Save this ID to track your complaint status at any time.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to={`/track-complaint?id=${submittedComplaint.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all"
                >
                  <span>Track This Complaint Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setSubmittedComplaint(null);
                    setFormData({
                      category: 'Human Rights & Civic Liberties',
                      subject: '',
                      description: '',
                      location: '',
                      email: '',
                      phone: '',
                      attachmentName: ''
                    });
                    setIsAnonymous(false);
                  }}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200"
                >
                  Submit Another Grievance
                </button>
              </div>
            </div>
          ) : (
            /* Grievance Form */
            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-50/50 p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs">
              
              {/* Anonymous Submission Checkbox Toggle */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <EyeOff className="w-5 h-5" />
                  </div>
                  <div>
                    <label htmlFor="anonymous-checkbox" className="text-sm font-bold text-slate-900 cursor-pointer">
                      Anonymous Submission
                    </label>
                    <p className="text-xs text-slate-500">
                      Hide personal identity completely. Name, email, and phone will not be recorded.
                    </p>
                  </div>
                </div>

                <input
                  id="anonymous-checkbox"
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-5 h-5 text-teal-600 rounded-md border-slate-300 focus:ring-teal-500 cursor-pointer"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Grievance Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Subject / Summary of Grievance <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Unaddressed municipal waste accumulation near high school"
                  className={`w-full px-4 py-3 rounded-xl bg-white border text-sm focus:outline-none focus:ring-2 ${
                    errors.subject ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-teal-500'
                  }`}
                />
                {errors.subject && <p className="text-xs text-rose-600 font-medium">{errors.subject}</p>}
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Location / Area / District <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Bemina / Srinagar"
                  className={`w-full px-4 py-3 rounded-xl bg-white border text-sm focus:outline-none focus:ring-2 ${
                    errors.location ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-teal-500'
                  }`}
                />
                {errors.location && <p className="text-xs text-rose-600 font-medium">{errors.location}</p>}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Full Description & Specific Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide timeline of events, authorities contacted earlier (if any), and impact on youth/community..."
                  className={`w-full px-4 py-3 rounded-xl bg-white border text-sm focus:outline-none focus:ring-2 ${
                    errors.description ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-teal-500'
                  }`}
                />
                {errors.description && <p className="text-xs text-rose-600 font-medium">{errors.description}</p>}
              </div>

              {/* Optional Contact fields when NOT anonymous */}
              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white border border-slate-200">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Email (Optional for Updates)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="citizen@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    {errors.email && <p className="text-xs text-rose-600 font-medium">{errors.email}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="9103599292"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              )}

              {/* Attachment - Optional */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Supporting Document / Evidence Photo (Optional)
                </label>
                <label className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white border-2 border-dashed border-slate-200 hover:border-teal-400 cursor-pointer transition-colors group">
                  <UploadCloud className="w-7 h-7 text-slate-400 group-hover:text-teal-600 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">
                    {formData.attachmentName ? formData.attachmentName : 'Click to select or drop file here'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    PDF, JPG, PNG up to 10MB
                  </span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Encrypted submission • No third-party data tracking</span>
                </div>

                <button
                  type="submit"
                  id="submit-grievance-btn"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Registering Grievance...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Submit Grievance</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </section>

    </div>
  );
};
