import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Scale, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  CheckCircle2,
  HelpCircle,
  Building
} from 'lucide-react';

interface LegalAidBookingModalProps {
  onClose: () => void;
}

const SERVICE_TYPES = [
  'Free Paralegal Consultation & Advisory',
  'Official Document & Application Drafting',
  'Right to Information (RTI) Drafting & Follow-up',
  'Student Scholarship Appeal & Academic Representation',
  'Civic Amenity / Public Works Formal Grievance',
  'Youth Rights & Conflict Mediation'
];

const LOCATIONS = [
  'Baramulla Grievance Cell & Public Help Desk',
  'Srinagar Headquarter Hub (Bemina)',
  'Virtual Video/Telephonic Legal Advisory'
];

export const LegalAidBookingModal: React.FC<LegalAidBookingModalProps> = ({ onClose }) => {
  const { user, bookLegalAidAppointment } = useApp();

  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [preferredDate, setPreferredDate] = useState('2026-03-15');
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [citizenName, setCitizenName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '+91 91035 99292');
  const [summary, setSummary] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookedId, setBookedId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName || !phone || !summary) return;

    const apt = bookLegalAidAppointment({
      serviceType,
      preferredDate,
      preferredTime,
      location,
      citizenName,
      phone,
      summary
    });

    setBookedId(apt.id);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 text-teal-300 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Book Free Legal Aid & Helpdesk Appointment
              </h3>
              <p className="text-xs text-slate-400">
                GYF Secretariat Baramulla & Srinagar
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                Booking ID: {bookedId}
              </span>
              <h4 className="text-xl font-extrabold text-slate-900 pt-2">
                Consultation Appointment Confirmed!
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Your consultation slot has been reserved for <strong className="text-slate-800">{preferredDate} at {preferredTime}</strong> at the <strong className="text-slate-800">{location}</strong>. Our duty counselor will contact you via {phone} prior to the session.
              </p>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
              >
                Done & Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Advisory Service <span className="text-rose-500">*</span>
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              >
                {SERVICE_TYPES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Location / Mode <span className="text-rose-500">*</span>
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                >
                  {LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Time Slot <span className="text-rose-500">*</span>
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                >
                  <option value="10:30 AM">10:30 AM - Morning Slot</option>
                  <option value="11:30 AM">11:30 AM - Mid-Day Slot</option>
                  <option value="02:30 PM">02:30 PM - Afternoon Slot</option>
                  <option value="04:00 PM">04:00 PM - Evening Slot</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Applicant / Citizen Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Brief Summary of Issue or Required Guidance <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Please outline the legal concern, documentation requirement, or institutional department involved..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-teal-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Free Public Service</span>
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-xs transition-all"
                >
                  Confirm Appointment
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
