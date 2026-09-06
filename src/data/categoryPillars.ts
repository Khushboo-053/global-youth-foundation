export interface CategoryTheme {
  primary: string;
  badgeBg: string;
  badgeText: string;
  border: string;
  gradient: string;
  pillActive: string;
}

export interface GYFCategory {
  id: string;
  name: string;
  shortName: string;
  shortTitle: string;
  badgeBg: string;
  badgeText: string;
  tagline: string;
  description: string;
  iconName: 'Scale' | 'HeartHandshake' | 'ShieldAlert' | 'Award' | 'Zap' | 'Leaf';
  theme: CategoryTheme;
  keyMetric: string;
  beneficiaries: string;
  eventIds: string[];
}

export const GYF_CATEGORIES: GYFCategory[] = [
  {
    id: 'peace-harmony',
    name: 'Peace, Justice & Social Harmony',
    shortName: 'Peace & Harmony',
    shortTitle: 'Peace & Harmony',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-800',
    tagline: 'Advancing communal cohesion, nonviolent democratic advocacy, and inter-faith dialogue',
    description: 'Promoting mutual respect, justice, and nonviolent social change across Kashmir through peaceful rallies, candlelight protests, mass signature campaigns, and consultative roundtables with senior religious scholars and community elders.',
    iconName: 'Scale',
    theme: {
      primary: '#4338ca',
      badgeBg: 'bg-indigo-50',
      badgeText: 'text-indigo-800',
      border: 'border-indigo-200',
      gradient: 'from-indigo-900 via-slate-900 to-indigo-950',
      pillActive: 'bg-indigo-600 text-white'
    },
    keyMetric: '45+ Peace Dialogues & Rallies',
    beneficiaries: 'Community elders, youth councils, inter-faith scholars & civic groups',
    eventIds: [
      'gyf-ev-1',  // Page 2: Peace with Justice – A Step Towards Harmony
      'gyf-ev-6',  // Page 7: United in Hope and Solidarity: Candlelight Protest
      'gyf-ev-11', // Page 12: Signature Campaign Organized by GYF
      'gyf-ev-12', // Page 13: Peaceful Protests Against Injustice: A Collective Voice for Change
      'gyf-ev-17'  // Page 18: Community Dialogue with Religious Leaders on De-Radicalization
    ]
  },
  {
    id: 'humanitarian-health',
    name: 'Disaster Relief & Healthcare Outreach',
    shortName: 'Relief & Healthcare',
    shortTitle: 'Relief & Healthcare',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-800',
    tagline: 'Emergency flood rescue, free specialist medical camps, and menstrual hygiene dignity',
    description: 'Serving as frontline first-responders during catastrophic disasters like the 2014 Kashmir floods, organizing free diagnostic health camps with prescription drug dispensaries, and breaking taboos through women’s sanitary pad distribution drives.',
    iconName: 'HeartHandshake',
    theme: {
      primary: '#0d9488',
      badgeBg: 'bg-teal-50',
      badgeText: 'text-teal-800',
      border: 'border-teal-200',
      gradient: 'from-teal-900 via-slate-900 to-teal-950',
      pillActive: 'bg-teal-600 text-white'
    },
    keyMetric: '14,000+ Citizens Supported in Crises',
    beneficiaries: 'Flood survivors, rural patients, elderly citizens, and schoolgirls',
    eventIds: [
      'gyf-ev-2',  // Page 3: Standing with the People During the 2014 Floods
      'gyf-ev-3',  // Page 4: Free Medical Outreach Initiative by GYF
      'gyf-ev-13'  // Page 14: Promoting Women’s Hygiene and Dignity ("Wings of Hope")
    ]
  },
  {
    id: 'substance-prevention',
    name: 'Substance Abuse Prevention & De-Addiction',
    shortName: 'Drug De-Addiction',
    shortTitle: 'Drug De-Addiction',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    tagline: 'Combating youth addiction through clinical guidance, legal awareness, and faith alliances',
    description: 'Confronting Kashmir’s devastating substance crisis through grassroots de-addiction awareness, legal education on the HIV Act 2017, and pioneering partnerships with the J&K Imam Association to mobilize mosques and communities.',
    iconName: 'ShieldAlert',
    theme: {
      primary: '#d97706',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-800',
      border: 'border-amber-200',
      gradient: 'from-amber-950 via-slate-900 to-amber-900',
      pillActive: 'bg-amber-600 text-white'
    },
    keyMetric: '1,800+ Youth Counseled & Sensitized',
    beneficiaries: 'At-risk youth, recovering individuals, families & religious leaders',
    eventIds: [
      'gyf-ev-8',  // Page 9: Towards a Drug Free Society: HIV Act 2017 & Training
      'gyf-ev-14'  // Page 15: Drug De Addiction Camp in Collaboration with JK Imam Association
    ]
  },
  {
    id: 'women-empowerment',
    name: 'Women & Girl Child Empowerment',
    shortName: 'Women Empowerment',
    shortTitle: 'Women Empowerment',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-800',
    tagline: 'Fostering academic confidence, gender equality, leadership, and martial arts self-defense',
    description: 'Empowering young girls and women through commemorative leadership assemblies, academic award ceremonies, and championship martial arts training that instills physical discipline, mental poise, and self-defense skills.',
    iconName: 'Award',
    theme: {
      primary: '#e11d48',
      badgeBg: 'bg-rose-50',
      badgeText: 'text-rose-800',
      border: 'border-rose-200',
      gradient: 'from-rose-950 via-slate-900 to-rose-900',
      pillActive: 'bg-rose-600 text-white'
    },
    keyMetric: '2,500+ Girls & Young Women Empowered',
    beneficiaries: 'School and college girls, young female athletes, women entrepreneurs',
    eventIds: [
      'gyf-ev-7',  // Page 8: Women Empowerment Day Commemorated
      'gyf-ev-16'  // Page 17: Empowering Young Girls Through Discipline and Confidence (Budokan Karate)
    ]
  },
  {
    id: 'youth-sports-culture',
    name: 'Youth Leadership, Sports & Culture',
    shortName: 'Youth & Sports',
    shortTitle: 'Youth & Sports',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-800',
    tagline: 'Building character and talent through athletic meets, debate championships, and trekking',
    description: 'Channeling young energy constructively through “Jawan Aur Awam” sports festivals, parliamentary debates at Sherwani Hall, wilderness trekking expeditions with summit flag ceremonies, and Kashmir’s Got Talent cultural showcases.',
    iconName: 'Zap',
    theme: {
      primary: '#2563eb',
      badgeBg: 'bg-blue-50',
      badgeText: 'text-blue-800',
      border: 'border-blue-200',
      gradient: 'from-blue-950 via-slate-900 to-blue-900',
      pillActive: 'bg-blue-600 text-white'
    },
    keyMetric: '5,500+ Young Athletes & Performers',
    beneficiaries: 'Student debaters, athletes, trekkers, and performing artists',
    eventIds: [
      'gyf-ev-4',  // Page 5: Building Harmony Through Youth Engagement ("Jawan Aur Awam Aman Hai Makaam")
      'gyf-ev-9',  // Page 10: Trekking Programme Organized by GYF
      'gyf-ev-10', // Page 11: Encounter of Polemics: Encouraging Healthy Debate
      'gyf-ev-15'  // Page 16: Talent Hunt Programme: Celebrating Youth Potential
    ]
  },
  {
    id: 'environmental-stewardship',
    name: 'Environmental Stewardship & Climate Action',
    shortName: 'Environment & Climate',
    shortTitle: 'Environment & Climate',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    tagline: 'School afforestation, native sapling plantations, and climate awareness for youth',
    description: 'Inspiring future generations to care for the earth through comprehensive tree-plantation drives across government schools and rural zones, teaching students the vital importance of biodiversity and green cover.',
    iconName: 'Leaf',
    theme: {
      primary: '#059669',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-800',
      border: 'border-emerald-200',
      gradient: 'from-emerald-950 via-slate-900 to-emerald-900',
      pillActive: 'bg-emerald-600 text-white'
    },
    keyMetric: '18,000+ Native Saplings Planted',
    beneficiaries: 'School students, teachers, local communities, and rural habitats',
    eventIds: [
      'gyf-ev-5'   // Page 6: Green Tomorrow Begins Today: Plantation Drive by GYF
    ]
  }
];

export const getCategoryById = (id: string): GYFCategory | undefined => {
  return GYF_CATEGORIES.find(c => c.id === id);
};

export const getCategoryForEvent = (eventId: string): GYFCategory | undefined => {
  return GYF_CATEGORIES.find(c => c.eventIds.includes(eventId));
};
