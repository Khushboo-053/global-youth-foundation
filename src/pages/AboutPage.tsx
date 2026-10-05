import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Award, 
  ShieldCheck, 
  Globe2, 
  Sparkles, 
  CheckCircle2, 
  Scale,
  Handshake,
  BookOpen,
  Leaf,
  Activity,
  Megaphone,
  Compass,
  MessageSquare,
  TrendingUp,
  MapPin,
  Calendar,
  Quote,
  ArrowRight,
  Shield,
  Lightbulb,
  HeartHandshake,
  UserCheck
} from 'lucide-react';
import { ORG_INFO } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { LeadershipMember } from '../types';
import { MemberLightboxModal } from '../components/MemberLightboxModal';

const DEFAULT_LEADERS: LeadershipMember[] = [
  {
    id: 'lead-founder',
    name: 'Mr. Touseef Mehraj Raina',
    role: 'Founder/Chairman',
    bio: 'Established GYF in 2010 together with socially conscious students to champion youth empowerment, peace, human rights, and humanitarian causes across Jammu, Kashmir, and Ladakh.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lead-suhail',
    name: 'Suhail Aslam',
    role: 'Co-Founder',
    bio: 'Co-Founder dedicated to social service, community development, youth empowerment, and creating positive change through meaningful grassroots initiatives.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lead-yasir',
    name: 'Syed Yasir Ali Jalali',
    role: 'Co Founder',
    bio: 'A passionate community leader and Co-Founder, committed to empowering youth, supporting communities, and driving positive social change.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lead-zahid',
    name: 'Zahid Fayaz Mir',
    role: 'District Coordinator Baramulla',
    bio: 'Our commitment is unwavering to empower youth, strengthen communities and create lasting pathways toward a future of dignity, opportunity and impact.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lead-shafia',
    name: 'Shafia Hassan',
    role: 'Head of Grievance Redressal & Legal Aid',
    bio: 'Paralegal specialist committed to accessible justice, citizen rights, and transparent civic dispute mediation.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lead-muzamil',
    name: 'Muzamil Bashir',
    role: 'Director of Programs & Youth Partnerships',
    bio: 'Mobilizing student councils, community development initiatives, and environmental chapters across regional districts.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lead-rabia',
    name: 'Dr. Rabia Qadir',
    role: 'Chief Advisor - Health & Community Upliftment',
    bio: 'Public health researcher guiding adolescent wellness drives, substance prevention clinics, and humanitarian outreach.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80'
  }
];

export const AboutPage: React.FC = () => {
  const { websiteContent } = useApp();
  const [selectedMemberIndex, setSelectedMemberIndex] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const leadershipTeam = (websiteContent?.leadershipTeam && websiteContent.leadershipTeam.length > 0)
    ? websiteContent.leadershipTeam
    : DEFAULT_LEADERS;

  // Four Principles / Core Values
  const corePrinciples = [
    {
      number: '01',
      title: 'Peace & Harmony',
      desc: 'We promote peaceful coexistence, mutual understanding, dialogue, and cooperation among diverse communities.',
      icon: HeartHandshake,
      color: 'teal'
    },
    {
      number: '02',
      title: 'Justice & Equality',
      desc: 'We stand for dignity, fairness, equal opportunities, social justice, and respect for the rights of every individual.',
      icon: Scale,
      color: 'blue'
    },
    {
      number: '03',
      title: 'Youth Empowerment',
      desc: 'We believe young people are powerful agents of positive change and encourage their leadership, participation, skills, and personal development.',
      icon: Sparkles,
      color: 'amber'
    },
    {
      number: '04',
      title: 'Integrity & Collective Action',
      desc: 'We believe meaningful change comes through ethical action, trust, cooperation, solidarity, and shared responsibility.',
      icon: ShieldCheck,
      color: 'emerald'
    }
  ];

  // Mission Pillars
  const missionPillars = [
    'Promoting peace and inter-community harmony.',
    'Empowering young people to become responsible and active citizens.',
    'Supporting women’s rights and gender equality.',
    'Addressing drug abuse through awareness, prevention, counselling, and community engagement.',
    'Supporting marginalized and underserved communities.',
    'Promoting education, skill development, and equal opportunities.',
    'Encouraging ethical civic engagement and peaceful social advocacy.',
    'Responding to humanitarian and community needs.'
  ];

  // Strategic Methodology
  const methodologySteps = [
    {
      step: '1',
      title: 'Awareness',
      desc: 'We identify important social challenges and create awareness through campaigns, workshops, seminars, and educational programmes.',
      icon: Lightbulb
    },
    {
      step: '2',
      title: 'Community Engagement',
      desc: 'We work directly with communities, volunteers, students, families, and local stakeholders to understand needs and encourage participation.',
      icon: Users
    },
    {
      step: '3',
      title: 'Youth Participation',
      desc: 'We place young people at the centre of social initiatives, providing platforms for leadership, learning, creativity, and responsible civic engagement.',
      icon: Sparkles
    },
    {
      step: '4',
      title: 'Advocacy & Dialogue',
      desc: 'We encourage peaceful expression, constructive dialogue, democratic participation, and awareness to address social concerns and promote positive change.',
      icon: MessageSquare
    },
    {
      step: '5',
      title: 'Support & Intervention',
      desc: 'Where communities face challenges, we support them through humanitarian assistance, counselling, outreach programmes, and community-based interventions.',
      icon: Handshake
    },
    {
      step: '6',
      title: 'Sustainable Impact',
      desc: 'We aim to transform awareness into meaningful action and encourage long-term community development, empowerment, and social responsibility.',
      icon: TrendingUp
    }
  ];

  // What We Do
  const whatWeDoList = [
    {
      title: 'Youth Empowerment',
      desc: 'We create opportunities for young people through leadership programmes, talent development, educational activities, workshops, and community engagement.',
      icon: Users,
      badge: 'Leadership'
    },
    {
      title: 'Peace & Social Harmony',
      desc: 'We organize initiatives that promote peace, unity, mutual understanding, dialogue, and cooperation among communities.',
      icon: Globe2,
      badge: 'Coexistence'
    },
    {
      title: 'Drug Abuse Prevention & Awareness',
      desc: 'We conduct awareness drives, counselling sessions, youth engagement programmes, and community-based initiatives to address substance abuse and promote healthy lifestyles.',
      icon: Activity,
      badge: 'Public Health'
    },
    {
      title: 'Women’s Rights & Empowerment',
      desc: 'We promote gender equality, education, self-reliance, dignity, health awareness, and equal opportunities for women and girls.',
      icon: Heart,
      badge: 'Gender Equality'
    },
    {
      title: 'Community Development',
      desc: 'We work with communities through grassroots programmes that address social needs and encourage collective responsibility.',
      icon: Compass,
      badge: 'Grassroots'
    },
    {
      title: 'Humanitarian Support',
      desc: 'We stand with communities during challenging situations by providing relief, outreach, moral support, and assistance where possible.',
      icon: Shield,
      badge: 'Relief & Care'
    },
    {
      title: 'Education & Skill Development',
      desc: 'We encourage education, awareness, critical thinking, creativity, and skill development as tools for individual and community progress.',
      icon: BookOpen,
      badge: 'Education'
    },
    {
      title: 'Environmental Awareness',
      desc: 'We promote environmental responsibility through initiatives such as plantation drives and activities that encourage young people to protect nature and contribute to a greener future.',
      icon: Leaf,
      badge: 'Ecology'
    },
    {
      title: 'Social Advocacy',
      desc: 'We support peaceful and lawful forms of civic expression, awareness campaigns, signature drives, and public engagement to encourage justice, accountability, and positive reform.',
      icon: Megaphone,
      badge: 'Civil Rights'
    }
  ];

  return (
    <div id="about-page" className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* Page Header Banner */}
      <section className="bg-slate-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 opacity-95" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <span>Established 2010 • Jammu, Kashmir & Ladakh</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            About Global Youth Foundation
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto italic">
            “{ORG_INFO.tagline}”
          </p>
        </div>
      </section>

      {/* 1. About Us Core Statement */}
      <section id="about-us-section" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="space-y-3">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Who We Are
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              About Us
            </h2>
          </div>

          <div className="space-y-6 text-slate-700 leading-relaxed text-base sm:text-lg">
            <p className="text-slate-900 font-medium leading-relaxed">
              <strong>Global Youth Foundation (GYF)</strong> is a voluntary, youth-led organization primarily active in <strong>Jammu, Kashmir, and Ladakh</strong>. Established in <strong>2010</strong> by <strong>Mr. Touseef Mehraj Raina</strong>, along with a group of socially conscious students, GYF was founded with a shared vision of promoting social change, community development, youth empowerment, and humanitarian causes.
            </p>

            <p>
              We work to promote <strong>peace, inter-community harmony, justice, and social transformation</strong> through non-violent and inclusive approaches. GYF strives to build a more inclusive, liberal, and secular society by advancing dignity, democracy, equality, and ethical civic engagement.
            </p>

            <p>
              Through awareness campaigns, community outreach programmes, workshops, seminars, educational initiatives, and humanitarian activities, we work to address important social issues and create meaningful opportunities for young people and communities.
            </p>
          </div>

          {/* Quick Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Founded</div>
              <div className="text-2xl font-extrabold text-teal-800">2010</div>
              <div className="text-xs text-slate-600">Over a decade of service</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Founder</div>
              <div className="text-base font-extrabold text-slate-900">Mr. Touseef Mehraj Raina</div>
              <div className="text-xs text-slate-600">Youth-led civic vision</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Region</div>
              <div className="text-base font-extrabold text-slate-900">J&K and Ladakh</div>
              <div className="text-xs text-slate-600">Jammu, Kashmir & Ladakh</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approach</div>
              <div className="text-base font-extrabold text-teal-800">Inclusive & Non-Violent</div>
              <div className="text-xs text-slate-600">Grassroots engagement</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. About the Founder */}
      <section id="founder-section" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="space-y-2">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Visionary Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              About the Founder
            </h2>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
                  Founder • Global Youth Foundation
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Mr. Touseef Mehraj Raina
                </h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200 shrink-0">
                <Quote className="w-7 h-7" />
              </div>
            </div>

            <div className="space-y-4 text-slate-700 leading-relaxed text-base sm:text-lg">
              <p>
                <strong>Mr. Touseef Mehraj Raina</strong> is the founder of Global Youth Foundation. In 2010, he established GYF together with a group of socially conscious students who shared a commitment to social change, community development, youth empowerment, and humanitarian service.
              </p>

              <p>
                Under his leadership, GYF has worked to support communities through awareness initiatives, humanitarian responses, youth engagement, social advocacy, and community development programmes.
              </p>

              <p className="font-medium text-slate-900">
                His leadership reflects the Foundation’s commitment to <strong>peace, justice, equality, youth empowerment, and positive social transformation</strong>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm text-slate-600 italic">
              “Meaningful social change is rooted in ethical action, empowering youth as front-line catalysts, and building an inclusive society where every community lives with dignity and equal opportunity.”
            </div>
          </div>

        </div>
      </section>

      {/* 3. Our Mission & Vision */}
      <section id="mission-vision-section" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Purpose & Direction
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Our Mission & Vision
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Mission Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center border border-teal-200">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
                <p className="text-base sm:text-lg text-slate-800 font-semibold leading-relaxed">
                  Our mission is to <strong>empower youth, strengthen communities, and promote a peaceful, just, inclusive, and harmonious society</strong>.
                </p>
                <div className="pt-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    We work toward this mission by:
                  </div>
                  <ul className="space-y-2.5 text-sm text-slate-700">
                    {missionPillars.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">Our Vision</h3>
                <p className="text-base sm:text-lg text-teal-100 leading-relaxed">
                  Our vision is to build a <strong>more inclusive, liberal, secular, peaceful, and empowered society</strong> where every individual is treated with dignity and has equal opportunities to participate, contribute, and grow.
                </p>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                    Our Future Outlook
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    We envision communities where <strong>youth lead positive change, people live with mutual respect, justice and equality are strengthened, and collective action creates sustainable social progress</strong>.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center gap-3 text-xs text-slate-400">
                <Globe2 className="w-4 h-4 text-teal-400" />
                <span>Advancing dignity, democracy, and ethical civic engagement</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Four Principles / Core Values */}
      <section id="principles-section" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Guiding Foundations
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Four Principles / Core Values
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              The ethical pillars that inspire and direct every initiative undertaken by Global Youth Foundation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {corePrinciples.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.number}
                  className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 hover:border-teal-400 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-2xl font-extrabold text-slate-300">
                        {item.number}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-teal-700 flex items-center gap-1">
                    <span>Core Pillar</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. Strategic Methodology */}
      <section id="methodology-section" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              How We Operate
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Strategic Methodology
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              Our approach is rooted in <strong>grassroots engagement, youth participation, awareness, dialogue, and collective action</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {methodologySteps.map((m) => {
              const Icon = m.icon;
              return (
                <div 
                  key={m.step}
                  className="p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs space-y-3 hover:border-teal-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white text-teal-700 flex items-center justify-center border border-slate-200 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-100/70 text-teal-800">
                      Step {m.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 pt-1">
                    {m.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. What We Do */}
      <section id="what-we-do-section" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Areas of Action
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              What We Do
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Global Youth Foundation works across multiple areas to create positive social impact:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatWeDoList.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3.5 hover:border-teal-400 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. Youth Leadership Team */}
      <section id="leadership-section" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Governance & Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Youth Leadership Council
            </h2>
            <p className="text-sm text-slate-600">
              Guided by passionate leaders and advisors committed to institutional integrity and social transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadershipTeam.map((member, i) => (
              <div 
                key={i} 
                onClick={() => {
                  setSelectedMemberIndex(i);
                  setIsLightboxOpen(true);
                }}
                className="group bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden text-left hover:border-teal-400 transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="h-56 overflow-hidden bg-slate-200 relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                      <div className="px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-xs border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                        <Eye className="w-3.5 h-3.5 text-teal-400" />
                        <span>Click to view photos</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 space-y-1.5">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {member.name}
                    </h3>
                    <div className="text-xs font-semibold text-teal-700">
                      {member.role}
                    </div>
                    <p className="text-xs text-slate-500 pt-2 leading-relaxed line-clamp-3">
                      {member.bio}
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-4 text-[11px] font-bold text-teal-700 group-hover:text-teal-800 flex items-center gap-1 transition-colors">
                  <span>View photo & bio</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. Call to Action */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join Our Movement</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Ready to Stand With Us?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            “Join us in our movement for a better tomorrow. Together, we can make a difference.” Become a registered youth volunteer or support our community initiatives today.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/membership"
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-xs"
            >
              Join as Volunteer / Member
            </Link>
            <Link
              to="/grievance"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
            >
              Submit Grievance
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
            >
              Contact Office
            </Link>
          </div>
        </div>
      </section>

      {/* Member Photo Lightbox Modal */}
      <MemberLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        members={leadershipTeam}
        initialIndex={selectedMemberIndex !== null ? selectedMemberIndex : 0}
      />

    </div>
  );
};
