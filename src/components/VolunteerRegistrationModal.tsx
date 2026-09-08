import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartHandshake, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Mail, 
  Phone, 
  User, 
  Sparkles, 
  FileText, 
  Clock, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Award,
  Search,
  Copy,
  Plus,
  X
} from 'lucide-react';
import { Modal } from './Modal';
import { useApp } from '../context/AppContext';
import { UserAccount } from '../types';

interface VolunteerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newVolunteer: UserAccount) => void;
}

const KASHMIR_CHAPTERS = [
  'Central Kashmir Hub (Srinagar & Bemina)',
  'North Kashmir Chapter (Baramulla)',
  'South Kashmir Chapter (Anantnag)',
  'Budgam Youth Division',
  'Pulwama Peace & Rights Unit',
  'Kupwara Frontier Taskforce',
  'Ganderbal Civic Council',
  'Kulgam Community Aid',
  'Bandipora Youth Corps',
  'Shopian Redressal Circle',
  'Jammu Regional Center',
  'Diaspora & Online Taskforce'
];

const VOLUNTEER_DOMAINS = [
  { id: 'Legal Aid & Human Rights', label: 'Legal Aid & Human Rights' },
  { id: 'Ombudsman & Grievances', label: 'Grievance Redressal' },
  { id: 'Youth Leadership Workshops', label: 'Youth Leadership' },
  { id: 'Disaster Relief & First Aid', label: 'Disaster Relief' },
  { id: 'Community Mediation', label: 'Dispute Mediation' },
  { id: 'Digital Media & Campaigns', label: 'Media & Tech' },
  { id: 'Field Surveys & Research', label: 'Field Research' },
  { id: 'Event Operations & Logistics', label: 'Event Operations' },
  { id: 'Women & Girl Child Empowerment', label: 'Women Empowerment' },
  { id: 'Substance Abuse Prevention & De-addiction', label: 'Substance Prevention' },
  { id: 'Environmental Protection & Climate Action', label: 'Climate Action' },
  { id: 'Healthcare, Medical Camps & Blood Donation', label: 'Health & Medical' },
  { id: 'Education, Tutoring & Vocational Skills', label: 'Education & Skills' },
  { id: 'Arts, Kashmiri Heritage & Cultural Revival', label: 'Arts & Heritage' },
  { id: 'Any other (Please specify below)', label: 'Any Other (Specify)' }
];

const AVAILABILITY_OPTIONS = [
  'Weekends Only (4–8 hrs/week)',
  'Part-Time (10–15 hrs/week)',
  'Full-Time Civic Fellow (25+ hrs/week)',
  'On-Call Emergency Responder'
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'];

export const VolunteerRegistrationModal: React.FC<VolunteerRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { applyAsVolunteer, user } = useApp();

  const [formData, setFormData] = useState({
    fullName: user && user.role !== 'admin' ? user.fullName : '',
    email: user && user.role !== 'admin' ? user.email : '',
    phone: user && user.role !== 'admin' ? user.phone : '',
    chapter: KASHMIR_CHAPTERS[0],
    professionOrEducation: '',
    bloodGroup: 'O+',
    emergencyContact: '',
    availability: AVAILABILITY_OPTIONS[0],
    bio: '',
    agreeToCodeOfConduct: false
  });

  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Legal Aid & Human Rights',
    'Youth Leadership Workshops'
  ]);
  const [customSkill, setCustomSkill] = useState('');
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [otherSpecifyText, setOtherSpecifyText] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedVolunteer, setSubmittedVolunteer] = useState<UserAccount | null>(null);

  const toggleSkill = (skillId: string) => {
    if (skillId === 'Any other (Please specify below)') {
      if (isOtherSelected) {
        setIsOtherSelected(false);
        setSelectedSkills(prev => prev.filter(s => s !== 'Any other (Please specify below)' && s !== otherSpecifyText.trim()));
      } else {
        setIsOtherSelected(true);
        if (!selectedSkills.includes('Any other (Please specify below)')) {
          setSelectedSkills(prev => [...prev, 'Any other (Please specify below)']);
        }
      }
      return;
    }

    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  const handleAddCustomSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = customSkill.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
      setCustomSkill('');
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: user && user.role !== 'admin' ? user.fullName : '',
      email: user && user.role !== 'admin' ? user.email : '',
      phone: user && user.role !== 'admin' ? user.phone : '',
      chapter: KASHMIR_CHAPTERS[0],
      professionOrEducation: '',
      bloodGroup: 'O+',
      emergencyContact: '',
      availability: AVAILABILITY_OPTIONS[0],
      bio: '',
      agreeToCodeOfConduct: false
    });
    setSelectedSkills(['Legal Aid & Human Rights', 'Youth Leadership Workshops']);
    setIsOtherSelected(false);
    setOtherSpecifyText('');
    setCustomSkill('');
    setCopiedRef(false);
    setErrorMessage(null);
    setSubmittedVolunteer(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      setErrorMessage('Please enter a valid contact phone number.');
      return;
    }
    if (!formData.bio.trim() || formData.bio.trim().length < 20) {
      setErrorMessage('Please share a brief motivation statement (at least 20 characters) explaining why you wish to volunteer.');
      return;
    }
    if (!formData.agreeToCodeOfConduct) {
      setErrorMessage('You must agree to the GYF Code of Conduct and non-violence charter.');
      return;
    }

    // Finalize skills including any custom specified area of interest
    let finalSkills = selectedSkills.filter(s => s !== 'Any other (Please specify below)');
    if (isOtherSelected && otherSpecifyText.trim()) {
      if (!finalSkills.includes(otherSpecifyText.trim())) {
        finalSkills.push(otherSpecifyText.trim());
      }
    }
    if (customSkill.trim() && !finalSkills.includes(customSkill.trim())) {
      finalSkills.push(customSkill.trim());
    }

    if (finalSkills.length === 0) {
      setErrorMessage('Please select or specify at least one Area of Interest.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newVol = await applyAsVolunteer({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        chapter: formData.chapter,
        skills: finalSkills,
        bio: formData.bio,
        bloodGroup: formData.bloodGroup,
        emergencyContact: formData.emergencyContact,
        availability: formData.availability,
        professionOrEducation: formData.professionOrEducation
      });

      setSubmittedVolunteer(newVol);
      if (onSuccess) onSuccess(newVol);
    } catch (err: any) {
      console.error('Error submitting volunteer application:', err);
      setErrorMessage(err.message || 'Failed to submit application. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="2xl">
      {submittedVolunteer ? (
        /* Success Confirmation Screen */
        <div className="p-6 sm:p-8 space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center animate-in zoom-in-75">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold uppercase tracking-wider">
              Application Submitted • Pending Admin Screening
            </span>
            <h3 className="text-2xl font-black text-slate-900">
              Welcome to the Movement!
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Thank you, <strong className="text-slate-900">{submittedVolunteer.fullName}</strong>. Your volunteer application has been logged into our Secretariat Roster.
            </p>
          </div>

          {/* Reference Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-3 max-w-lg mx-auto">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Application Reference ID
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-teal-800 text-sm bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                  {submittedVolunteer.membershipId || submittedVolunteer.id}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const ref = submittedVolunteer.membershipId || submittedVolunteer.id;
                    navigator.clipboard.writeText(ref);
                    setCopiedRef(true);
                    setTimeout(() => setCopiedRef(false), 2000);
                  }}
                  className="px-2 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold flex items-center gap-1 shadow-2xs cursor-pointer transition-all"
                  title="Copy Reference ID"
                >
                  {copiedRef ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                  <span>{copiedRef ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block">Assigned Chapter:</span>
                <span className="font-bold text-slate-900">{submittedVolunteer.chapter}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Current Status:</span>
                <span className="font-bold text-amber-700">Pending Screening (Accept/Reject)</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-slate-600 text-left space-y-1.5 max-w-lg mx-auto">
            <div className="font-bold text-[#2C3292] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2C3292]" />
              <span>Next Steps in Review</span>
            </div>
            <p>
              1. The GYF Volunteer Taskforce Admin will inspect your application details in the <strong>Admin Volunteers Desk</strong>.
            </p>
            <p>
              2. The administrator will review and either <strong>Accept</strong> or <strong>Reject</strong> the application.
            </p>
            <p>
              3. You can track your screening status at any time on our public <strong>Track Volunteer Form</strong> portal.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={`/track-volunteer?ref=${encodeURIComponent(submittedVolunteer.membershipId || submittedVolunteer.id)}`}
              onClick={handleClose}
              id="volunteer-track-status-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Track Application Status</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              id="volunteer-success-done-btn"
              onClick={handleClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-sm shadow-xs transition-all cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        </div>
      ) : (
        /* Volunteer Application Form */
        <div className="max-h-[85vh] overflow-y-auto">
          {/* Header Banner */}
          <div className="p-6 bg-gradient-to-r from-teal-900 via-[#1f2360] to-[#2C3292] text-white space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-200 border border-teal-400/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-300" />
                <span>Global Youth Taskforce</span>
              </span>
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight">
              Join as Volunteer
            </h3>
            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
              Step forward as a frontline youth advocate. Mobilize for human rights, community redressal, peacebuilding, and civic justice across Jammu & Kashmir.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Section 1: Personal Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-700" />
                <span>1. Personal & Contact Information</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    id="vol-input-name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Sameer Ahmad Mir"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      id="vol-input-email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. sameer@example.org"
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      id="vol-input-phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 94190 XXXXX"
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Regional Chapter / District <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      id="vol-select-chapter"
                      value={formData.chapter}
                      onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-white"
                    >
                      {KASHMIR_CHAPTERS.map((chap) => (
                        <option key={chap} value={chap}>
                          {chap}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Background & Profile */}
            <div className="space-y-3 pt-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-teal-700" />
                <span>2. Background & Demographics</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Profession / Education
                  </label>
                  <input
                    type="text"
                    id="vol-input-profession"
                    value={formData.professionOrEducation}
                    onChange={(e) => setFormData({ ...formData, professionOrEducation: e.target.value })}
                    placeholder="e.g. Law Student / Teacher / IT"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    id="vol-select-blood"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-white"
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Emergency Contact Number
                  </label>
                  <input
                    type="tel"
                    id="vol-input-emergency"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    placeholder="+91 XXXXXXXXXX"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Volunteer Interests & Availability */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-teal-700" />
                  <span>3. Areas of Interest & Volunteer Domain</span>
                </h4>
                <span className="text-[11px] text-slate-500 font-semibold">
                  {selectedSkills.length} selected
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {VOLUNTEER_DOMAINS.map((domain) => {
                  const isSelected = selectedSkills.includes(domain.id) || (domain.id === 'Any other (Please specify below)' && isOtherSelected);
                  return (
                    <button
                      key={domain.id}
                      type="button"
                      onClick={() => toggleSkill(domain.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{domain.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dedicated "Any Other" Area of Interest Specification Input */}
              {isOtherSelected && (
                <div className="p-3.5 rounded-xl bg-teal-50/90 border border-teal-200 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-teal-950 flex items-center gap-1">
                      <span>Specify Custom Area of Interest</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-teal-700 font-semibold">Specialty / Custom Field</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      id="vol-input-other-interest"
                      value={otherSpecifyText}
                      onChange={(e) => setOtherSpecifyText(e.target.value)}
                      placeholder="e.g. Kashmiri Calligraphy, Elderly Care, Sports Coaching, Mental Health..."
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-teal-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const trimmed = otherSpecifyText.trim();
                        if (trimmed && !selectedSkills.includes(trimmed)) {
                          setSelectedSkills([...selectedSkills.filter(s => s !== 'Any other (Please specify below)'), trimmed]);
                        }
                      }}
                      className="px-3 py-2 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shrink-0 transition-all cursor-pointer"
                    >
                      Apply Area
                    </button>
                  </div>
                  <p className="text-[11px] text-teal-800">
                    {otherSpecifyText.trim() 
                      ? <>Selected Custom Area: <strong>"{otherSpecifyText.trim()}"</strong></> 
                      : 'Type your specialized field of interest above. It will be logged with your volunteer profile.'}
                  </p>
                </div>
              )}

              {/* Custom Additional Skill Input */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-[11px] font-semibold text-slate-500">
                  Add Additional Skills or Capabilities (Optional):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyDown={handleAddCustomSkill}
                    placeholder="Other skill (e.g. Urdu/Kashmiri Translation, Videography)..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-700"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer transition-colors"
                  >
                    Add Skill
                  </button>
                </div>
              </div>

              {/* Selected tags list with remove button */}
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-50 text-teal-900 border border-teal-200 text-[11px] font-semibold"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (s === otherSpecifyText.trim() || s === 'Any other (Please specify below)') {
                            setIsOtherSelected(false);
                            setOtherSpecifyText('');
                          }
                          setSelectedSkills(selectedSkills.filter(item => item !== s));
                        }}
                        className="hover:text-rose-600 cursor-pointer ml-0.5"
                        title={`Remove ${s}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Availability */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-700" />
                  <span>Weekly Availability & Commitment</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABILITY_OPTIONS.map((opt) => {
                    const isSelected = formData.availability === opt;
                    return (
                      <label
                        key={opt}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-teal-50/70 border-teal-600 text-teal-900' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="vol_availability"
                          checked={isSelected}
                          onChange={() => setFormData({ ...formData, availability: opt })}
                          className="text-teal-700 focus:ring-teal-700"
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 4: Statement of Motivation */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-700" />
                  <span>4. Why do you want to volunteer with GYF?</span>
                  <span className="text-rose-500">*</span>
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {formData.bio.length}/500 chars
                </span>
              </label>
              <textarea
                required
                rows={3}
                id="vol-input-bio"
                maxLength={500}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Share what drives your passion for youth empowerment, legal aid, peace, and community service in your district..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 resize-none"
              />
            </div>

            {/* Section 5: Code of Conduct & Agreement */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  id="vol-agree-checkbox"
                  checked={formData.agreeToCodeOfConduct}
                  onChange={(e) => setFormData({ ...formData, agreeToCodeOfConduct: e.target.checked })}
                  className="mt-1 rounded text-teal-700 focus:ring-teal-700 w-4 h-4"
                />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-0.5">
                    GYF Non-Violence & Neutrality Charter
                  </span>
                  I solemnly commit to upholding peace, democratic dialogue, transparency, and non-violence in all volunteer responsibilities under Global Youth Foundation.
                </div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                id="submit-volunteer-application-btn"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <HeartHandshake className="w-4 h-4 text-teal-200" />
                    <span>Submit Volunteer Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
};
