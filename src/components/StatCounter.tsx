import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Users, 
  HeartHandshake, 
  Award, 
  Globe,
  Scale,
  ShieldCheck,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { ImpactStat } from '../types';

const ICON_MAP: Record<string, any> = {
  FileText,
  CheckCircle2,
  Users,
  HeartHandshake,
  Award,
  Globe,
  Scale,
  ShieldCheck,
  TrendingUp,
  MapPin
};

export const StatCounter: React.FC<{ stat: ImpactStat }> = ({ stat }) => {
  const [count, setCount] = useState(0);
  const IconComponent = ICON_MAP[stat.icon] || Award;

  useEffect(() => {
    let start = 0;
    const end = stat.numericValue || 0;
    if (start === end) {
      setCount(end);
      return;
    }

    const duration = 1200;
    const incrementTime = 25;
    const step = Math.max(1, Math.ceil(end / (duration / incrementTime)));

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [stat.numericValue]);

  const displayDisplay = stat.numericValue && stat.numericValue > 0 
    ? `${count.toLocaleString()}${stat.suffix}`
    : stat.value;

  return (
    <div className="group p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100/80 flex items-center justify-center text-teal-700 group-hover:scale-110 transition-transform">
          <IconComponent className="w-6 h-6" />
        </div>
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
          {displayDisplay}
        </span>
      </div>

      <div>
        <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-teal-700 transition-colors">
          {stat.label}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          {stat.description}
        </p>
      </div>
    </div>
  );
};
