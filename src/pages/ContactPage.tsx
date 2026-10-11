import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Youtube,
  ShieldCheck
} from 'lucide-react';
import { ORG_INFO } from '../data/mockData';
import { useApp } from '../context/AppContext';

export const ContactPage: React.FC = () => {
  const { submitContactMessage, websiteContent } = useApp();
  const contactPhone = websiteContent?.contactPhone || ORG_INFO.phone;
  const contactEmail = websiteContent?.contactEmail || ORG_INFO.email;
  const secretariatAddress = websiteContent?.hqAddress || ORG_INFO.addressDisplay;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Global Youth Foundation address submitted grievances?',
      a: 'Once a grievance is lodged, our legal and ombudsman committee reviews the facts, coordinates with responsible public bodies or community elders, and tracks the resolution docket transparently on our portal.'
    },
    {
      q: 'Is it completely free to become a member or volunteer?',
      a: 'Yes, Global Youth Foundation is an open, non-discriminatory youth movement. Volunteer onboarding and standard membership are 100% free.'
    },
    {
      q: 'How can I obtain an official donation receipt for tax or auditing?',
      a: 'After transferring funds via NEFT/IMPS/UPI to our official J&K Bank account, please email your transaction reference (UTR) to contact.gyfoffice@gmail.com and we will issue an official stamped receipt.'
    },
    {
      q: 'Can organizations or colleges partner with GYF for workshops?',
      a: 'Absolutely. We regularly conduct human rights bootcamps, environmental drives, and student leadership seminars across academic institutions.'
    }
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) errs.subject = 'Subject is required';
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please enter a detailed message (minimum 10 characters)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await submitContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject.trim(),
        message: formData.message.trim()
      });

      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setErrors({});
    } catch (err) {
      console.error('Error submitting contact message:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-page" className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* Header */}
      <section className="bg-slate-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 opacity-95" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-400/30">
            <Mail className="w-3.5 h-3.5" />
            Secretariat & Helpdesk
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Contact Global Youth Foundation
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Reach out to our leadership council, submit an inquiry, or visit our central office.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: Contact Info Cards & Social Links */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  Official Channels
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  We are here to assist you
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Have inquiries regarding partnerships, donations, or community initiatives? Contact our secretariat team directly.
                </p>
              </div>

              {/* Info Cards */}
              <div className="space-y-4">
                

                {/* Phone */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Official Contact Phone
                    </h4>
                    <a
                      href={`tel:${contactPhone}`}
                      className="text-base font-bold text-slate-900 hover:text-teal-700 block mt-0.5"
                    >
                      {contactPhone}
                    </a>
                    <span className="text-xs text-slate-500">Mon - Sat: 9:30 AM – 5:30 PM IST</span>
                  </div>
                </div>

                {/* Email */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Official Email Address
                    </h4>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-base font-bold text-slate-900 hover:text-teal-700 block mt-0.5 break-all"
                    >
                      {contactEmail}
                    </a>
                    <span className="text-xs text-slate-500">General & Legal Inquiries</span>
                  </div>
                </div>

                {/* Address */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Secretariat Location
                    </h4>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {secretariatAddress}
                    </p>
                    <span className="text-xs text-slate-500">Main Office & Legal Clinic</span>
                  </div>
                </div>

              </div>

              {/* Social Connect */}
              <div className="pt-2 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Follow Our Movements
                </h4>
                <div className="flex items-center gap-3">
                  <a
                    href={ORG_INFO.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-xs"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href={ORG_INFO.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-xs"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href={ORG_INFO.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-xs"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={ORG_INFO.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-xs"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href={ORG_INFO.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-xs"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>

            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-slate-50/70 p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-slate-900">
                    Send Us a Direct Message
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    We review and reply to all communications within 24–48 business hours.
                  </p>
                </div>

                {isSuccess && (
                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center gap-3 text-sm text-teal-900 animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                    <span>Your message has been sent successfully. We will get back to you shortly!</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Aamir Shah"
                      className={`w-full px-4 py-3 rounded-xl bg-white border text-sm focus:outline-none focus:ring-2 ${
                        errors.name ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-teal-500'
                      }`}
                    />
                    {errors.name && <p className="text-xs text-rose-600 font-medium">{errors.name}</p>}
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="aamir@example.com"
                        className={`w-full px-4 py-3 rounded-xl bg-white border text-sm focus:outline-none focus:ring-2 ${
                          errors.email ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-teal-500'
                        }`}
                      />
                      {errors.email && <p className="text-xs text-rose-600 font-medium">{errors.email}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="9103599292"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Subject <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Volunteer Partnership Inquiry"
                      className={`w-full px-4 py-3 rounded-xl bg-white border text-sm focus:outline-none focus:ring-2 ${
                        errors.subject ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-teal-500'
                      }`}
                    />
                    {errors.subject && <p className="text-xs text-rose-600 font-medium">{errors.subject}</p>}
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your detailed inquiry or proposal..."
                      className={`w-full px-4 py-3 rounded-xl bg-white border text-sm focus:outline-none focus:ring-2 ${
                        errors.message ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-teal-500'
                      }`}
                    />
                    {errors.message && <p className="text-xs text-rose-600 font-medium">{errors.message}</p>}
                  </div>

                  {/* Submit button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-sm transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-teal-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
