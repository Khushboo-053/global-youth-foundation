import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShieldCheck, 
  Landmark, 
  Receipt, 
  FileText, 
  CheckCircle2, 
  Users, 
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';
import { ORG_INFO } from '../data/mockData';
import { BankDetailsCard } from '../components/BankDetailsCard';

export const DonatePage: React.FC = () => {
  return (
    <div id="donate-page" className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* Header */}
      <section className="bg-slate-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 opacity-95" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-400/30">
            <Heart className="w-3.5 h-3.5 fill-teal-300" />
            Direct NGO Contribution
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Support Our Mission
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            “Your contribution helps Global Youth Foundation empower young people, support communities and create meaningful social change.”
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Top Intro Notice */}
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Direct & Transparent Bank Transfer
            </h2>
            <p className="text-sm text-slate-600">
              To ensure full regulatory compliance, zero intermediary gateway deductions, and complete transparency, Global Youth Foundation accepts contributions directly into our designated institutional bank account.
            </p>
          </div>

          {/* Official Bank Account Details Component */}
          <BankDetailsCard showExtraGuide={true} />

          {/* How Your Contribution Creates Impact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">Youth Fellowships</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Funds leadership bootcamps, student public policy mentorship, and skill modules for underprivileged youth.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">Legal & Grievance Aid</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enables free paralegal clinics, administrative mediation, and citizen advocacy for rights protection.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">Emergency & Climate Relief</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Purchases tree saplings for environmental restoration and thermal kits for winter community relief drives.
              </p>
            </div>
          </div>

          {/* Financial Transparency Charter */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Public Accountability
              </span>
              <h3 className="text-xl font-bold">Audited NGO Accounts & Formal Receipts</h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Every rupee transferred to GYF is accounted for under annual audited reports. For official receipt issuance, please email your transaction reference or UTR number to our finance team.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <a
                href={`mailto:${ORG_INFO.email}?subject=Donation Acknowledgement / UTR Transfer`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send UTR for Receipt</span>
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
              >
                <span>Contact Office</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
