import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Eye, 
  Heart, 
  Compass, 
  Users, 
  Award, 
  ShieldCheck, 
  Globe2, 
  Sparkles, 
  CheckCircle2, 
  UserPlus 
} from 'lucide-react';
import { ORG_INFO } from '../data/mockData';

interface LeadershipMember {
  id?: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

const DEFAULT_LEADERS: LeadershipMember[] = [
  {
    id: 'lead-1',
    name: 'Adil Farooq',
    role: 'Executive Director & Founder',
    bio: 'Grassroots human rights advocate with 8+ years experience in youth development and community mediation.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'lead-2',
    name: 'Shafia Hassan',
    role: 'Head of Grievance Redressal & Legal Aid',
    bio: 'Paralegal specialist committed to accessible justice and transparent civic complaint resolution.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'lead-3',
    name: 'Muzamil Bashir',
    role: 'Director of Programs & Youth Partnerships',
    bio: 'Mobilizing student councils and environmental chapters across regional higher education centers.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'lead-4',
    name: 'Dr. Rabia Qadir',
    role: 'Chief Advisor - Health & Community Upliftment',
    bio: 'Public health researcher guiding adolescent wellness drives and winter relief campaigns.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
  }
];

export const AboutPage: React.FC = () => {
  const [leadershipTeam, setLeadershipTeam] = useState<LeadershipMember[]>(DEFAULT_LEADERS);
  const [missionText, setMissionText] = useState(
    'To mobilize, educate, and empower young generations to champion human rights, bridge societal divisions, protect ecological balance, and deliver responsive, community-driven civic solutions.'
  );
  const [visionText, setVisionText] = useState(
    'A just, peaceful, and equitable world where young leaders actively guide democratic institutions, uphold social harmony, and guarantee fundamental dignity for all human beings.'
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gyf_website_content');
      if (saved) {
        const data = JSON.parse(saved);
        if (Array.isArray(data.leadershipTeam) && data.leadershipTeam.length > 0) {
          setLeadershipTeam(data.leadershipTeam);
        }
        if (data.missionText) setMissionText(data.missionText);
        if (data.visionText) setVisionText(data.visionText);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const values = [
    {
      title: 'Dignity & Human Rights',
      desc: 'Upholding fundamental civil liberties, equality, and mutual respect for every individual regardless of background.',
      icon: ShieldCheck
    },
    {
      title: 'Youth-Led Innovation',
      desc: 'Placing young visionaries at the forefront of policy dialogue, social reform, and civic action.',
      icon: Sparkles
    },
    {
      title: 'Radical Transparency',
      desc: 'Commitment to zero corruption, verifiable community tracking, and open accountability in all programs.',
      icon: CheckCircle2
    },
    {
      title: 'Inclusivity & Peace',
      desc: 'Building bridges across diverse social strata to foster sustainable harmony and non-violent conflict resolution.',
      icon: Globe2
    }
  ];

  return (
    <div id="about-page" className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* Page Header */}
      <section className="bg-slate-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 opacity-95" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            About Global Youth Foundation
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Who We Are & What Drives Us
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto italic">
            “{ORG_INFO.tagline}”
          </p>
        </div>
      </section>

      {/* Main Core Narrative Statement */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-slate-700 leading-relaxed text-base sm:text-lg">
          
          <div className="p-6 rounded-2xl bg-teal-50/70 border border-teal-200/70 text-slate-900 font-medium">
            “At Global Youth Foundation, we are a dynamic, youth-led movement committed to creating a world defined by peace, justice, rights, and harmony. Our motto, <span className="font-bold text-teal-900">‘Empowering Youth, Inspiring Change, Building a Better Tomorrow.’</span> reflects our unwavering dedication to empowering young people to take meaningful action and drive positive change.”
          </div>

          <p>
            Founded on the belief that youth have the power to shape the future, we work with young leaders from all corners of the globe to advocate for human rights, social justice, environmental sustainability, and inclusive peacebuilding. Through grassroots campaigns, community engagement, and educational initiatives, we provide a platform for young voices to be heard and act as catalysts for social transformation.
          </p>

          <p>
            Our mission is to create a better world where everyone has access to dignity, equality, and opportunity. We foster collaboration, encourage innovation, and inspire action among youth to address the most pressing challenges facing our societies today. Together, we strive for a future where peace and justice are not just ideals, but lived realities for all.
          </p>

          <div className="p-4 rounded-xl bg-slate-900 text-white font-semibold text-center text-base">
            “Join us in our movement for a better tomorrow. Together, we can make a difference.”
          </div>

        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Mission */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {missionText}
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {visionText}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Guiding Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 hover:border-teal-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{v.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Do & Our Approach */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                Operational Framework
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                What We Do
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Global Youth Foundation operates across three key dimensions: direct grassroots assistance, policy advocacy with institutional stakeholders, and capacity-building training programs.
              </p>
              <ul className="space-y-3 pt-2 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Free grievance redressal and paralegal mediation for vulnerable citizens.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Youth fellowship programs and leadership incubators in colleges and districts.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Rapid community mobilization for climate action, sanitation, and winter relief.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                Strategic Methodology
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Our Approach
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                We reject top-down intervention models in favor of deep community listening, youth co-design, and continuous impact measurement.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <div className="text-xs font-bold text-teal-700">01. Listen & Map</div>
                  <div className="text-xs text-slate-600 mt-1">Identify localized grievances through open clinics.</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <div className="text-xs font-bold text-teal-700">02. Train Youth</div>
                  <div className="text-xs text-slate-600 mt-1">Equip volunteers with legal and civic tools.</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <div className="text-xs font-bold text-teal-700">03. Act & Mediate</div>
                  <div className="text-xs text-slate-600 mt-1">Collaborate with civic bodies to resolve root issues.</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <div className="text-xs font-bold text-teal-700">04. Sustain & Scale</div>
                  <div className="text-xs text-slate-600 mt-1">Publish open docket outcomes and foster resilience.</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Youth Leadership */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Governance & Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Youth Leadership Council
            </h2>
            <p className="text-sm text-slate-600">
              Guided by passionate young leaders and experienced advisors committed to institutional integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadershipTeam.map((member, i) => (
              <div key={i} className="group bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden text-left hover:border-teal-300 transition-all shadow-xs">
                <div className="h-52 overflow-hidden bg-slate-200">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-5 space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {member.name}
                  </h3>
                  <div className="text-xs font-semibold text-teal-700">
                    {member.role}
                  </div>
                  <p className="text-xs text-slate-500 pt-2 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl font-extrabold">Ready to Stand With Us?</h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Become a registered youth volunteer or support our community initiatives today.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/grievance"
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm"
            >
              Submit Grievance
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20"
            >
              Contact Office
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
