import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  ShieldAlert, 
  Scale, 
  Leaf, 
  Building2, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle 
} from 'lucide-react';
import { Program } from '../types';

const PROGRAM_ICONS: Record<string, any> = {
  Zap,
  ShieldAlert,
  Scale,
  Leaf,
  Building2,
  GraduationCap
};

export const ProgramCard: React.FC<{ 
  program: Program; 
  onSelect?: (program: Program) => void;
}> = ({ program, onSelect }) => {
  const Icon = PROGRAM_ICONS[program.iconName] || Zap;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-teal-300 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* Image Banner */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={program.image}
          alt={program.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        
        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold shadow-xs">
          {program.category}
        </span>

        {/* Floating Icon */}
        <div className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-teal-600/90 text-white backdrop-blur-md flex items-center justify-center shadow-md">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
            {program.title}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {program.shortDescription}
          </p>

          {/* Quick Key Objectives list */}
          <div className="pt-2 space-y-1.5 border-t border-slate-100 text-xs text-slate-500">
            {program.objectives.slice(0, 2).map((obj, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400">
            {program.impactStats}
          </span>
          <Link
            to={`/programs#${program.id}`}
            onClick={() => onSelect && onSelect(program)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors group-hover:translate-x-1 duration-200"
          >
            <span>Learn More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
