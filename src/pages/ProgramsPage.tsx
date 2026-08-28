import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  ShieldAlert, 
  Scale, 
  Leaf, 
  Building2, 
  GraduationCap, 
  CheckCircle2, 
  Users, 
  Target, 
  ArrowRight, 
  HeartHandshake 
} from 'lucide-react';
import { PROGRAMS } from '../data/mockData';
import { Program } from '../types';
import { Modal } from '../components/Modal';

const PROGRAM_ICONS: Record<string, any> = {
  Zap,
  ShieldAlert,
  Scale,
  Leaf,
  Building2,
  GraduationCap
};

export const ProgramsPage: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'Leadership & Skills', 'Advocacy & Justice', 'Peace & Harmony', 'Climate & Ecology', 'Grassroots Upliftment', 'Education & Learning'];

  const filteredPrograms = filter === 'All'
    ? PROGRAMS
    : PROGRAMS.filter(p => p.category === filter);

  return (
    <div id="programs-page" className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* Header */}
      <section className="bg-slate-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 opacity-95" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            Transformative Social Impact
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Our Core Programs & Initiatives
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Explore our structured interventions advancing leadership, legal rights, peacebuilding, environmental conservation, and education.
          </p>
        </div>
      </section>

      {/* Program Grid Section */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  filter === cat
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Programs Detailed Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((prog) => {
              const Icon = PROGRAM_ICONS[prog.iconName] || Zap;
              return (
                <div
                  key={prog.id}
                  id={prog.id}
                  className="group bg-white rounded-3xl border border-slate-200/80 hover:border-teal-300 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <img
                      src={prog.image}
                      alt={prog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-md bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold shadow-xs">
                      {prog.category}
                    </span>

                    <div className="absolute bottom-4 right-4 w-11 h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-lg">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {prog.title}
                        </h2>
                        <span className="text-xs font-bold text-teal-700 mt-1 block">
                          Impact: {prog.impactStats}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed">
                        {prog.fullDescription}
                      </p>

                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-teal-600" />
                          Key Objectives
                        </h3>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {prog.objectives.map((obj, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => setSelectedProgram(prog)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
                      >
                        <span>Full Prospectus</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <Link
                        to="/membership"
                        className="text-xs font-semibold text-teal-700 hover:text-teal-900"
                      >
                        Join Program Team →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Program Detail Modal */}
      <Modal
        isOpen={selectedProgram !== null}
        onClose={() => setSelectedProgram(null)}
        title={selectedProgram?.title || 'Program Overview'}
        maxWidth="xl"
      >
        {selectedProgram && (
          <div className="space-y-6">
            <div className="relative h-60 rounded-2xl overflow-hidden">
              <img
                src={selectedProgram.image}
                alt={selectedProgram.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <span className="text-xs font-bold text-teal-300 uppercase">{selectedProgram.category}</span>
                <h3 className="text-xl font-bold">{selectedProgram.title}</h3>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Program Description</h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedProgram.fullDescription}
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Target Beneficiaries</h4>
              <p className="text-xs text-slate-600">{selectedProgram.beneficiariesTarget}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Primary Strategic Objectives</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {selectedProgram.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                {selectedProgram.impactStats}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProgram(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Close
                </button>
                <Link
                  to="/membership"
                  className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
                >
                  Apply as Youth Fellow
                </Link>
              </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
