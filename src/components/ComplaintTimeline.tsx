import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Wrench, 
  CheckCircle, 
  Archive, 
  CircleDot,
  AlertCircle 
} from 'lucide-react';
import { ComplaintStatus, ComplaintTimelineEvent } from '../types';

interface ComplaintTimelineProps {
  currentStatus: ComplaintStatus;
  events?: ComplaintTimelineEvent[];
}

const ALL_STATUS_STEPS: { status: ComplaintStatus; label: string; icon: any; description: string }[] = [
  { 
    status: 'Submitted', 
    label: 'Submitted', 
    icon: Clock, 
    description: 'Complaint docket received in registry.' 
  },
  { 
    status: 'Under Review', 
    label: 'Under Review', 
    icon: CircleDot, 
    description: 'Preliminary scrutiny by grievance board.' 
  },
  { 
    status: 'Assigned', 
    label: 'Assigned', 
    icon: UserCheck, 
    description: 'Designated officer or legal counselor allocated.' 
  },
  { 
    status: 'In Progress', 
    label: 'In Progress', 
    icon: Wrench, 
    description: 'Active mediation, inquiry or administrative liaison.' 
  },
  { 
    status: 'Resolved', 
    label: 'Resolved', 
    icon: CheckCircle, 
    description: 'Redressal achieved with formal report.' 
  },
  { 
    status: 'Closed', 
    label: 'Closed', 
    icon: Archive, 
    description: 'Case completed and archived in record.' 
  },
];

export const ComplaintTimeline: React.FC<ComplaintTimelineProps> = ({ currentStatus, events = [] }) => {
  const currentIndex = ALL_STATUS_STEPS.findIndex(s => s.status === currentStatus);
  const effectiveIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="space-y-8">
      {/* Visual Step Progress Bar */}
      <div className="relative">
        {/* Desktop / Tablet horizontal progression */}
        <div className="hidden md:grid grid-cols-6 gap-2">
          {ALL_STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx < effectiveIndex;
            const isCurrent = idx === effectiveIndex;
            const isUpcoming = idx > effectiveIndex;
            const Icon = step.icon;

            return (
              <div key={step.status} className="flex flex-col items-center text-center relative group">
                {/* Horizontal connecting connector */}
                {idx < ALL_STATUS_STEPS.length - 1 && (
                  <div 
                    className={`absolute top-4 left-1/2 w-full h-1 -z-0 transition-colors ${
                      idx < effectiveIndex ? 'bg-teal-500' : 'bg-slate-200'
                    }`}
                  />
                )}

                {/* Step Circle */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center relative z-10 transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-teal-600 text-white'
                      : isCurrent
                      ? 'bg-sky-600 text-white ring-4 ring-sky-100 animate-pulse'
                      : 'bg-white border-2 border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                {/* Step Text */}
                <div className="mt-2.5 space-y-0.5">
                  <div
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-sky-700 font-extrabold'
                        : isCompleted
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </div>
                  <div className="text-[11px] text-slate-500 leading-tight hidden lg:block px-1">
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile vertical progression */}
        <div className="md:hidden space-y-4">
          {ALL_STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx < effectiveIndex;
            const isCurrent = idx === effectiveIndex;
            const Icon = step.icon;

            return (
              <div key={step.status} className="flex items-start gap-3.5 relative">
                {idx < ALL_STATUS_STEPS.length - 1 && (
                  <div 
                    className={`absolute top-6 left-4 w-0.5 h-full -ml-[1px] ${
                      idx < effectiveIndex ? 'bg-teal-500' : 'bg-slate-200'
                    }`}
                  />
                )}
                <div
                  className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center z-10 ${
                    isCompleted
                      ? 'bg-teal-600 text-white'
                      : isCurrent
                      ? 'bg-sky-600 text-white ring-4 ring-sky-100'
                      : 'bg-white border-2 border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <div className="pt-0.5">
                  <div
                    className={`text-sm font-bold ${
                      isCurrent ? 'text-sky-700' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {idx + 1}. {step.label}
                  </div>
                  <div className="text-xs text-slate-500">
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Detailed Log entries */}
      {events.length > 0 && (
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Status Activity Log
          </h4>
          <div className="space-y-3">
            {events.map((evt, i) => (
              <div 
                key={i} 
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 px-2 py-0.5 rounded bg-white border border-slate-200">
                      {evt.status}
                    </span>
                    <span className="text-slate-600 font-medium">{evt.description}</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Action by: <span className="font-semibold text-slate-600">{evt.updatedBy}</span>
                  </div>
                </div>
                <div className="text-slate-400 font-mono text-[11px] shrink-0">
                  {evt.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
