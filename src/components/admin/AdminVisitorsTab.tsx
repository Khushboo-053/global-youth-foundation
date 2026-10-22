import React, { useState } from 'react';
import {
  Users,
  Eye,
  TrendingUp,
  Globe,
  Calendar,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  ExternalLink,
  BarChart3,
  Clock,
  CheckCircle2,
  Sliders,
  X,
  Check,
  Activity,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VisitorStatsSummary } from '../../types';

interface AdminVisitorsTabProps {
  stats: VisitorStatsSummary | null;
  isLoading: boolean;
  onRefresh: () => Promise<void>;
}

export const AdminVisitorsTab: React.FC<AdminVisitorsTabProps> = ({
  stats,
  isLoading,
  onRefresh
}) => {
  const { resetVisitorStats } = useApp();
  const [showCalibrateModal, setShowCalibrateModal] = useState(false);
  const [calibrating, setCalibrating] = useState(false);
  const [customVisits, setCustomVisits] = useState(stats?.totalVisits || 5840);
  const [customUniques, setCustomUniques] = useState(stats?.uniqueVisitors || 2310);
  const [toast, setToast] = useState('');

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleCalibrate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalibrating(true);
    try {
      await resetVisitorStats(Number(customVisits), Number(customUniques));
      setShowCalibrateModal(false);
      showToastMsg('Visitor statistics baseline successfully calibrated!');
    } catch {
      showToastMsg('Failed to calibrate visitor baseline.');
    } finally {
      setCalibrating(false);
    }
  };

  // Safe fallback values
  const totalVisits = stats?.totalVisits || 0;
  const uniqueVisitors = stats?.uniqueVisitors || 0;
  const todayVisits = stats?.todayVisits || 0;
  const todayUnique = stats?.todayUnique || 0;
  const thisMonthVisits = stats?.thisMonthVisits || totalVisits;
  const viewsPerPerson = uniqueVisitors > 0 ? (totalVisits / uniqueVisitors).toFixed(1) : '1.0';

  const dailyTrends = stats?.dailyTrends || [];
  const maxTrendVisits = Math.max(...dailyTrends.map(d => d.visits), 10);

  // Format relative time helper
  const getRelativeTime = (isoString: string) => {
    try {
      const now = Date.now();
      const diffMs = now - new Date(isoString).getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHrs = Math.floor(diffMin / 60);

      if (diffSec < 45) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHrs < 24) return `${diffHrs}h ago`;
      return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="px-5 py-3.5 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-xl border border-slate-700 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1b205a] via-[#242b78] to-teal-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-teal-300 text-[11px] font-extrabold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>Admin-Only Traffic Analytics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Website Visitors & Public Reach
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
            Real-time analytics tracking how many people have visited the Global Youth Foundation website, 
            their page browsing activity, and audience technology distribution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all shadow-xs"
            title="Refresh visitor counts from server"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-300' : ''}`} />
            <span>{isLoading ? 'Updating...' : 'Live Refresh'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCustomVisits(totalVisits);
              setCustomUniques(uniqueVisitors);
              setShowCalibrateModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-xs"
            title="Configure baseline starting visitor count"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Calibrate Counter</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: 4 Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Total People Visited (Unique Visitors) */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 opacity-60" />
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              People Visited
            </span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>

          <div className="relative z-10 my-4">
            <div className="text-4xl font-black text-slate-900 tracking-tight">
              {uniqueVisitors.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>+{todayUnique} unique visitors today</span>
            </div>
          </div>

          <div className="relative z-10 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-500">
            Unique individuals who accessed the site
          </div>
        </div>

        {/* Metric 2: Total Page Views */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-sky-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-bl-full -z-0 opacity-60" />
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Total Pageviews
            </span>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Eye className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>

          <div className="relative z-10 my-4">
            <div className="text-4xl font-black text-slate-900 tracking-tight">
              {totalVisits.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-sky-700 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
              <span>~{viewsPerPerson} pages per visitor</span>
            </div>
          </div>

          <div className="relative z-10 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-500">
            Cumulative pages viewed across sessions
          </div>
        </div>

        {/* Metric 3: Today's Traffic */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-0 opacity-60" />
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Today&apos;s Activity
            </span>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>

          <div className="relative z-10 my-4">
            <div className="text-4xl font-black text-slate-900 tracking-tight">
              {todayVisits.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-indigo-700 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
              <span>{todayUnique} individual people today</span>
            </div>
          </div>

          <div className="relative z-10 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-500">
            Real-time public visits logged today
          </div>
        </div>

        {/* Metric 4: 30-Day Monthly Reach */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-purple-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -z-0 opacity-60" />
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              30-Day Reach
            </span>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Calendar className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>

          <div className="relative z-10 my-4">
            <div className="text-4xl font-black text-slate-900 tracking-tight">
              {thisMonthVisits.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-purple-700 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
              <span>Active regional engagement</span>
            </div>
          </div>

          <div className="relative z-10 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-500">
            Total website sessions over 30 days
          </div>
        </div>

      </div>

      {/* Interactive 14-Day Traffic Trend Chart */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-800" />
              <span>14-Day Visitor Trend</span>
            </h3>
            <p className="text-xs text-slate-500">
              Daily comparison of total website views versus unique individual visitors
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#2C3292]" />
              <span>Total Pageviews</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-teal-500" />
              <span>Unique People</span>
            </div>
          </div>
        </div>

        {dailyTrends.length === 0 ? (
          <div className="h-48 flex items-center justify-center bg-slate-50 rounded-2xl text-slate-400 text-xs font-medium">
            Generating live trend data...
          </div>
        ) : (
          <div className="pt-4">
            <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 sm:gap-3 items-end h-56 pb-2">
              {dailyTrends.map((trend) => {
                const visitHeight = Math.max(12, Math.round((trend.visits / maxTrendVisits) * 100));
                const uniqueHeight = Math.max(8, Math.round((trend.uniqueVisitors / maxTrendVisits) * 100));
                const dateObj = new Date(trend.date);
                const dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'narrow' });
                const dateNum = dateObj.getDate();

                return (
                  <div key={trend.date} className="flex flex-col items-center gap-2 group h-full justify-end">
                    
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded-lg px-2 py-1 absolute -translate-y-24 pointer-events-none z-20 shadow-md text-center whitespace-nowrap">
                      <p className="font-bold">{new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      <p className="text-blue-200">{trend.visits} views • {trend.uniqueVisitors} visitors</p>
                    </div>

                    {/* Bars Container */}
                    <div className="w-full flex items-end justify-center gap-1 h-40">
                      <div
                        style={{ height: `${visitHeight}%` }}
                        className="w-full max-w-[14px] bg-[#2C3292] rounded-t-md group-hover:bg-[#1b205a] transition-all"
                        title={`${trend.visits} views`}
                      />
                      <div
                        style={{ height: `${uniqueHeight}%` }}
                        className="w-full max-w-[14px] bg-teal-500 rounded-t-md group-hover:bg-teal-600 transition-all"
                        title={`${trend.uniqueVisitors} unique visitors`}
                      />
                    </div>

                    {/* Date label */}
                    <div className="text-center">
                      <span className="block text-[10px] font-extrabold text-slate-800">{dayLabel}</span>
                      <span className="block text-[9px] text-slate-400 font-semibold">{dateNum}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Two Column Layout: Top Visited Pages & Audience Technology */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left (7 cols): Top Visited Website Pages */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-teal-800" />
                <span>Most Visited Website Sections</span>
              </h3>
              <p className="text-xs text-slate-500">
                Ranked by cumulative public views and visitor engagement
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {stats?.pageBreakdown?.length || 0} Pages Tracked
            </span>
          </div>

          <div className="space-y-3">
            {(stats?.pageBreakdown || []).map((page, idx) => (
              <div 
                key={page.path}
                className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-all flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-lg bg-slate-200 text-slate-700 text-[11px] font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {page.label}
                      </p>
                      <span className="text-[11px] text-teal-700 font-semibold font-mono">
                        {page.path}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-slate-900">
                      {page.count.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-500 ml-1">views</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#2C3292] to-teal-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, page.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right (5 cols): Audience Platform & Technology */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Device Distribution Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-teal-800" />
                <span>Audience Device Breakdown</span>
              </h3>
              <p className="text-xs text-slate-500">
                Types of hardware used by website visitors
              </p>
            </div>

            <div className="space-y-3.5">
              {(stats?.deviceBreakdown || []).map((dev) => {
                const Icon = dev.device === 'Mobile' ? Smartphone : dev.device === 'Tablet' ? Tablet : Monitor;
                return (
                  <div key={dev.device} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Icon className="w-4 h-4 text-teal-700" />
                        <span>{dev.device}</span>
                      </div>
                      <div className="text-slate-900">
                        <span>{dev.percentage}%</span>
                        <span className="text-slate-400 font-normal ml-1">({dev.count.toLocaleString()})</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          dev.device === 'Mobile' ? 'bg-teal-600' : dev.device === 'Desktop' ? 'bg-[#2C3292]' : 'bg-amber-500'
                        }`}
                        style={{ width: `${dev.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Browser Distribution Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-sky-700" />
                <span>Browser Share</span>
              </h3>
              <p className="text-xs text-slate-500">
                Browsers utilized across desktop & mobile visits
              </p>
            </div>

            <div className="space-y-3">
              {(stats?.browserBreakdown || []).map((b) => (
                <div key={b.browser} className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">{b.browser}</span>
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="text-slate-900 font-bold">{b.percentage}%</span>
                    <span className="text-slate-400">({b.count.toLocaleString()})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Live Recent Visitor Stream */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 space-y-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-800" />
              <span>Recent Public Visitor Stream</span>
            </h3>
            <p className="text-xs text-slate-500">
              Live log of individual visit sessions recorded across the website
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Live Feed</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                <th className="pb-3 pl-2">Time</th>
                <th className="pb-3">Page Visited</th>
                <th className="pb-3">Device & Browser</th>
                <th className="pb-3">Referrer</th>
                <th className="pb-3 text-right pr-2">Visitor Token</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {(stats?.recentVisitors || []).slice(0, 15).map((vis) => (
                <tr key={vis.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pl-2 text-slate-600 font-semibold whitespace-nowrap">
                    {getRelativeTime(vis.timestamp)}
                  </td>
                  <td className="py-3 font-bold text-slate-900">
                    <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/60 font-mono text-[11px]">
                      {vis.path}
                    </span>
                  </td>
                  <td className="py-3 text-slate-700">
                    <span className="font-semibold">{vis.device}</span>
                    <span className="text-slate-400 ml-1.5">• {vis.browser}</span>
                  </td>
                  <td className="py-3 text-slate-500 max-w-[150px] truncate">
                    {vis.referrer || 'Direct Entry'}
                  </td>
                  <td className="py-3 pr-2 text-right font-mono text-[10px] text-slate-400">
                    {vis.visitorId.slice(0, 12)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calibration Modal */}
      {showCalibrateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Calibrate Visitor Counter</h4>
                  <p className="text-[11px] text-slate-500">Configure historical starting numbers</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCalibrateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCalibrate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total People Visited (Unique Visitors Baseline)
                </label>
                <input
                  type="number"
                  min="1"
                  value={customUniques}
                  onChange={(e) => setCustomUniques(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Every new visitor who opens the site will increment this count.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Pageviews Baseline
                </label>
                <input
                  type="number"
                  min="1"
                  value={customVisits}
                  onChange={(e) => setCustomVisits(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCalibrateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={calibrating}
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{calibrating ? 'Saving...' : 'Apply Baseline'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
