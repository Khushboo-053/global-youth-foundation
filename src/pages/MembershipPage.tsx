import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserPlus, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  HeartHandshake, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MembershipRecord } from '../types';

export const MembershipPage: React.FC = () => {
  const { submitMembership } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    areaOfInterest: 'Youth Leadership & Fellowships',
    motivation: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<MembershipRecord | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const interestOptions = [
    'Youth Leadership & Fellowships',
    'Human Rights & Legal Literacy',
    'Peacebuilding & Community Dialogues',
    'Environmental Sustainability & Climate Action',
    'Community Development & Relief',
    'Education & Skill Workshops',
    'Media, Communications & Research'
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (formData.phone.trim().length < 8) {
      errs.phone = 'Please enter a valid phone number';
    }
    if (!formData.dob) errs.dob = 'Date of Birth is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State / UT is required';
    if (!formData.motivation.trim() || formData.motivation.trim().length < 15) {
      errs.motivation = 'Please share a brief motivation (minimum 15 characters)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const record = submitMembership({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        dob: formData.dob,
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim(),
        areaOfInterest: formData.areaOfInterest,
        motivation: formData.motivation.trim()
      });

      setIsSubmitting(false);
      setSubmittedApp(record);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const copyAppId = () => {
    if (!submittedApp) return;
    navigator.clipboard.writeText(submittedApp.applicationId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div id="membership-page" className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* Header */}
      <section className="bg-slate-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 opacity-95" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider border border-sky-400/30">
            <UserPlus className="w-3.5 h-3.5" />
            Youth Changemaker Network
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Become a Member
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Join thousands of passionate young leaders dedicated to human rights, environmental protection, and community welfare.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Success State Screen */}
          {submittedApp ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-teal-50/60 border border-teal-200 shadow-sm text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-600/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Application Received Successfully!
                </h2>
                <p className="text-base text-slate-700 max-w-xl mx-auto">
                  “Thank you for your interest in joining Global Youth Foundation. Your membership application has been received.”
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-teal-100 max-w-md mx-auto space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Your Official Application Reference ID
                </span>
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-mono font-extrabold text-teal-900 text-lg sm:text-xl">
                    {submittedApp.applicationId}
                  </span>
                  <button
                    type="button"
                    onClick={copyAppId}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-all shadow-xs"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId ? 'Copied!' : 'Copy ID'}</span>
                  </button>
                </div>
                <div className="text-[11px] text-slate-500">
                  Applicant: <span className="font-semibold text-slate-800">{submittedApp.fullName}</span> • Area: <span className="font-semibold text-slate-800">{submittedApp.areaOfInterest}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/dashboard"
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
                >
                  View in Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedApp(null);
                    setFormData({
                      fullName: '',
                      email: '',
                      phone: '',
                      dob: '',
                      address: '',
                      city: '',
                      state: '',
                      country: 'India',
                      areaOfInterest: 'Youth Leadership & Fellowships',
                      motivation: ''
                    });
                  }}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200"
                >
                  Submit Another Application
                </button>
              </div>
            </div>
          ) : (
            /* Membership Form */
            <form onSubmit={handleSubmit} className="space-y-8 bg-slate-50/50 p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs">
              
              <div className="space-y-1 pb-4 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900">
                  Membership & Volunteer Registration
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Please provide your personal information to apply for youth volunteer and member onboarding.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Tariq Manzoor"
                    className={`w-full px-4 py-3 rounded-xl bg-white border text-sm focus:outline-none focus:ring-2 ${
                      errors.fullName ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-teal-500'
                    }`}
                  />
                  {errors.fullName && <p className="text-xs text-rose-600 font-medium">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tariq@example.com"
                    className={`w-full px-4 py-3 rounded-xl bg-white border text-sm focus:outline-none focus:ring-2 ${
                      errors.email ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-teal-500'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-rose-600 font-medium">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Contact Phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9103599292"
                    className={`w-full px-4 py-3 rounded-xl bg-white border text-sm focus:outline-none focus:ring-2 ${
                      errors.phone ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-teal-500'
                    }`}
                  />
                  {errors.phone && <p className="text-xs text-rose-600 font-medium">{errors.phone}</p>}
                </div>

                {/* DOB */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Date of Birth <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl bg-white border text-sm focus:outline-none focus:ring-2 ${
                      errors.dob ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-teal-500'
                    }`}
                  />
                  {errors.dob && <p className="text-xs text-rose-600 font-medium">{errors.dob}</p>}
                </div>

                {/* Area of Interest */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Area of Interest <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.areaOfInterest}
                    onChange={(e) => setFormData({ ...formData, areaOfInterest: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {interestOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Address */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Street Address / Locality
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. Bemina Housing Colony"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Srinagar"
                    className={`w-full px-4 py-3 rounded-xl bg-white border text-sm focus:outline-none focus:ring-2 ${
                      errors.city ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-teal-500'
                    }`}
                  />
                  {errors.city && <p className="text-xs text-rose-600 font-medium">{errors.city}</p>}
                </div>

                {/* State */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    State / Union Territory <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Jammu & Kashmir"
                    className={`w-full px-4 py-3 rounded-xl bg-white border text-sm focus:outline-none focus:ring-2 ${
                      errors.state ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-teal-500'
                    }`}
                  />
                  {errors.state && <p className="text-xs text-rose-600 font-medium">{errors.state}</p>}
                </div>

                {/* Country */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Motivation / Why join */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Why do you want to join GYF? <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.motivation}
                    onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                    placeholder="Describe your passion for youth empowerment, civic initiatives, or community peace..."
                    className={`w-full px-4 py-3 rounded-xl bg-white border text-sm focus:outline-none focus:ring-2 ${
                      errors.motivation ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-teal-500'
                    }`}
                  />
                  {errors.motivation && <p className="text-xs text-rose-600 font-medium">{errors.motivation}</p>}
                </div>

              </div>

              {/* Submit Button */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Free volunteer registration • Open to all youth</span>
                </div>

                <button
                  type="submit"
                  id="submit-membership-btn"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Apply for Membership</span>
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
