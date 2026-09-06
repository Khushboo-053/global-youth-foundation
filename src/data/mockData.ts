import { 
  Program, 
  EventItem, 
  NewsItem, 
  Testimonial, 
  GalleryItem, 
  ImpactStat, 
  FAQItem, 
  GrievanceRecord 
} from '../types';
import { ARCHIVAL_EVENTS } from './archivalEvents';

export const ORG_INFO = {
  name: 'Global Youth Foundation',
  shortName: 'GYF',
  tagline: 'Empowering Youth, Inspiring Change, Building a Better Tomorrow.',
  description: 'At Global Youth Foundation, we are a dynamic, youth-led movement committed to creating a world defined by peace, justice, rights, and harmony.',
  phone: '9103599292',
  email: 'contact.gyfoffice@gmail.com',
  addressDisplay: 'Bemina, Srinagar, Jammu & Kashmir (Headquarter Regional Hub)',
  establishedYear: '2010',
  founder: 'Mr. Touseef Mehraj Raina',
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
    twitter: 'https://twitter.com',
  },
  bankDetails: {
    bankName: 'J&K Bank',
    accountName: 'Global Youth Foundation',
    accountNumber: '0372040100022589',
    branch: 'Bemina, Srinagar',
    ifscCode: 'JAKA0BEMINA',
    accountType: 'Current / NGO Trust Account',
    note: 'Please verify the bank details before making a transfer. Official donations are receipted and accounted under our public transparency charter.'
  }
};

export const IMPACT_STATS: ImpactStat[] = [
  {
    id: 'cases-received',
    label: 'Cases Received',
    value: '1,250+',
    numericValue: 1250,
    suffix: '+',
    icon: 'FileText',
    description: 'Community grievances & advocacy appeals formally registered.'
  },
  {
    id: 'cases-resolved',
    label: 'Cases Resolved',
    value: '980+',
    numericValue: 980,
    suffix: '+',
    icon: 'CheckCircle2',
    description: 'Concerns successfully resolved through mediation and legal assistance.'
  },
  {
    id: 'volunteers',
    label: 'Volunteers',
    value: '500+',
    numericValue: 500,
    suffix: '+',
    icon: 'Users',
    description: 'Active young changemakers mobilized across regional chapters.'
  },
  {
    id: 'beneficiaries',
    label: 'Beneficiaries',
    value: '10,000+',
    numericValue: 10000,
    suffix: '+',
    icon: 'HeartHandshake',
    description: 'Youth, students, and marginalized families uplifted directly.'
  },
  {
    id: 'programs-conducted',
    label: 'Programs Conducted',
    value: '50+',
    numericValue: 50,
    suffix: '+',
    icon: 'Award',
    description: 'Grassroots campaigns, youth dialogues, and skill bootcamps.'
  },
  {
    id: 'communities-reached',
    label: 'Communities Reached',
    value: '25+',
    numericValue: 25,
    suffix: '+',
    icon: 'Globe',
    description: 'Townships, rural hamlets, and suburban communities impacted.'
  }
];

export const PROGRAMS: Program[] = [
  {
    id: 'peace-harmony',
    title: 'Peace, Justice & Social Harmony',
    shortDescription: 'Advancing communal harmony, nonviolent democratic advocacy, and inter-faith dialogue.',
    fullDescription: 'Promoting mutual respect, justice, and nonviolent social change across Kashmir through peaceful rallies, candlelight protests, mass signature campaigns, and consultative roundtables with senior religious scholars and community elders. Documented initiatives include the Peace with Justice rally, Candlelight Vigils, Signature Drives, and High-Level De-Radicalization dialogues.',
    objectives: [
      'Organize Youth Peace Circles, candlelight solidarity vigils, and restorative mediation forums.',
      'Conduct consultative conferences with respected Imams and scholars on de-radicalization.',
      'Mobilize students and citizens through mass signature campaigns for peaceful coexistence.'
    ],
    impactStats: '45+ Peace Dialogues & Rallies',
    iconName: 'Scale',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    category: 'Peace, Justice & Social Harmony',
    beneficiariesTarget: 'Community elders, youth councils, inter-faith scholars & civic groups'
  },
  {
    id: 'humanitarian-health',
    title: 'Disaster Relief & Healthcare Outreach',
    shortDescription: 'Emergency flood rescue, free specialist medical camps, and menstrual hygiene dignity.',
    fullDescription: 'Serving as frontline first-responders during catastrophic crises such as the 2014 Kashmir floods, organizing free diagnostic health camps with prescription drug dispensaries, and breaking taboos through the "Wings of Hope" women’s menstrual hygiene and dignity distribution drive.',
    objectives: [
      'Deploy rapid volunteer response teams during seasonal climate disasters and flood emergencies.',
      'Provide free doctor consultations, diagnostic checkups, and prescription medicines to rural families.',
      'Distribute menstrual hygiene packages and conduct adolescent reproductive health workshops.'
    ],
    impactStats: '14,000+ Citizens Supported in Crises',
    iconName: 'HeartHandshake',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80',
    category: 'Disaster Relief & Healthcare Outreach',
    beneficiariesTarget: 'Flood survivors, rural patients, elderly citizens, and schoolgirls'
  },
  {
    id: 'substance-prevention',
    title: 'Substance Abuse Prevention & De-Addiction',
    shortDescription: 'Confronting youth addiction through clinical guidance, legal awareness, and faith alliances.',
    fullDescription: 'Tackling Kashmir’s substance abuse crisis through community-based awareness camps, training on the HIV Act 2017, and pioneering partnerships with the J&K Imam Association to mobilize mosques and communities toward early intervention and rehabilitation.',
    objectives: [
      'Conduct grassroots awareness cum training seminars on the HIV Act 2017 and addiction risks.',
      'Forge coalitions with religious scholars and Imams to counsel youth from mosque pulpits.',
      'Provide compassionate counseling and refer affected youth to structured rehabilitation facilities.'
    ],
    impactStats: '1,800+ Youth Counseled & Sensitized',
    iconName: 'ShieldAlert',
    image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
    category: 'Substance Abuse Prevention & De-Addiction',
    beneficiariesTarget: 'At-risk youth, recovering individuals, families & religious leaders'
  },
  {
    id: 'women-empowerment',
    title: 'Women & Girl Child Empowerment',
    shortDescription: 'Fostering academic confidence, gender equality, leadership, and martial arts self-defense.',
    fullDescription: 'Empowering young girls and women through commemorative leadership assemblies, academic award ceremonies, and championship martial arts training (Budokan Karate) that instills physical discipline, mental poise, and self-defense skills.',
    objectives: [
      'Celebrate Women Empowerment Day with leadership summits, awards, and community dialogues.',
      'Sponsor martial arts and self-defense championships for young school and college girls.',
      'Promote equal opportunities in education, public speaking, and youth civic representation.'
    ],
    impactStats: '2,500+ Girls & Young Women Empowered',
    iconName: 'Award',
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1200&q=80',
    category: 'Women & Girl Child Empowerment',
    beneficiariesTarget: 'School and college girls, young female athletes, women entrepreneurs'
  },
  {
    id: 'youth-sports-culture',
    title: 'Youth Leadership, Sports & Culture',
    shortDescription: 'Building character and talent through athletic meets, debate championships, and trekking.',
    fullDescription: 'Channeling young energy constructively through “Jawan Aur Awam” sports festivals, parliamentary debate tournaments at Sherwani Hall, high-altitude wilderness trekking expeditions with summit flag ceremonies, and Kashmir’s Got Talent cultural showcases.',
    objectives: [
      'Host multi-sport community festivals ("Jawan Aur Awam Aman Hai Makaam") featuring running, carom, and games.',
      'Organize competitive debate championships ("Encounter of Polemics") in collaboration with Municipal Councils.',
      'Lead wilderness trekking expeditions that build physical endurance, team morale, and civic pride.',
      'Stage performing arts and talent hunts celebrating young musical, artistic, and literary talents.'
    ],
    impactStats: '5,500+ Young Athletes & Performers',
    iconName: 'Zap',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    category: 'Youth Leadership, Sports & Culture',
    beneficiariesTarget: 'Student debaters, athletes, trekkers, and performing artists'
  },
  {
    id: 'environmental-stewardship',
    title: 'Environmental Stewardship & Climate Action',
    shortDescription: 'Promoting school afforestation, native sapling plantations, and climate awareness.',
    fullDescription: 'Inspiring future generations to care for the earth through comprehensive tree-plantation drives across government schools and rural zones, teaching students the vital importance of biodiversity, green cover, and climate action.',
    objectives: [
      'Conduct school-wide plantation drives planting native pine, cedar, and shade saplings.',
      'Educate students on environmental balance, climate change mitigation, and conservation.',
      'Establish student eco-clubs to nurture planted trees and preserve campus biodiversity.'
    ],
    impactStats: '18,000+ Native Saplings Planted',
    iconName: 'Leaf',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    category: 'Environmental Stewardship & Climate Action',
    beneficiariesTarget: 'School students, teachers, local communities, and rural habitats'
  }
];

export const EVENTS: EventItem[] = ARCHIVAL_EVENTS;

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'GYF Launches 2026 Youth Fellowship for Human Rights & Civic Leadership',
    category: 'Youth Empowerment',
    date: 'February 20, 2026',
    shortDescription: 'Applications are now open for our flagship 6-month fellowship program empowering 50 young leaders across the region.',
    content: `Global Youth Foundation is delighted to inaugurate the 2026 Youth Fellowship Cohort. This initiative will provide comprehensive training, direct community project seed grants, and executive mentorship from distinguished human rights advocates and policy researchers.

### Cohort Orientation & Inaugural Assembly
Selected candidates from across the valley assembled for an intensive 3-day civic orientation focusing on local dispute mediation, RTI applications, and environmental stewardship.

![Youth Fellowship Orientation Assembly](https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1000&q=80)

> "When young citizens are equipped with constitutional knowledge and institutional literacy, peaceful resolution of community issues transforms from an aspiration into everyday reality."

### Grassroots Field Projects
During the second half of the program, fellows will establish decentralized helpdesks and environmental clubs in their respective sub-districts. Applications remain open through late March.`,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80',
    author: 'GYF Communications Directorate',
    readTime: '3 min read',
    articleImages: [
      {
        id: 'img-seed-1',
        url: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1000&q=80',
        caption: 'Youth Fellowship delegates participating in the constitutional rights workshop'
      },
      {
        id: 'img-seed-2',
        url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80',
        caption: 'Interactive policy debate and mediation simulations led by senior advocates'
      }
    ]
  },
  {
    id: 'news-2',
    title: 'Over 980 Citizen Grievances Successfully Mediated and Resolved',
    category: 'Legal Aid & Rights',
    date: 'January 15, 2026',
    shortDescription: 'Our transparent grievance desk reached a crucial milestone, providing swift, confidential assistance to affected youth and citizens.',
    content: `Through dedicated paralegal volunteers and collaborative dialogue with institutional authorities, Global Youth Foundation has resolved over 980 individual and collective community grievances since our portal inception, ranging from educational scholarship access to community amenities.

### Community Ombudsman Clinics in Rural Districts
Our travelling paralegal team conducted 24 in-person grievance intake camps across remote tehsils, allowing elderly residents and students to track submissions in real time.

![Field Legal Consultation and Grievance Intake Camp](https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80)

The digital complaint tracking system has cut the average resolution time by 60%, fostering greater accountability and citizen trust.`,
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80',
    author: 'Grievance Redressal Committee',
    readTime: '4 min read',
    articleImages: [
      {
        id: 'img-seed-3',
        url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80',
        caption: 'Field paralegal consultation and citizen intake camp'
      }
    ]
  },
  {
    id: 'news-3',
    title: 'Planting Hope: 10,000 Saplings Planted Across Degraded Valley Slopes',
    category: 'Environmental Action',
    date: 'November 18, 2025',
    shortDescription: 'Youth volunteers and local schools joined hands to restore indigenous green cover in an ambitious seasonal ecological initiative.',
    content: `Demonstrating the immense power of youth-driven climate action, over 300 volunteers participated across 8 plantation locations. The species chosen included deodar, walnut, and native pine to prevent soil erosion and promote biodiversity.

![Green Wings Youth Plantation Volunteers](https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80)

Each sapling has been geo-tagged by volunteer teams to monitor survival rates throughout the winter thaw.`,
    image: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=1000&q=80',
    author: 'GYF Green Wings Initiative',
    readTime: '3 min read',
    articleImages: [
      {
        id: 'img-seed-4',
        url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
        caption: 'Youth volunteers preparing indigenous saplings for valley slope afforestation'
      }
    ]
  },
  {
    id: 'news-4',
    title: 'Community Micro-Libraries Established in 5 Remote Village Centers',
    category: 'Education & Fellowships',
    date: 'October 10, 2025',
    shortDescription: 'Supplying over 3,000 books, competitive exam guides, and quiet reading spaces for high-school students in rural zones.',
    content: 'Education is the fundamental pillar of socio-economic elevation. With generous support from book donors and community elders, GYF turned unused community halls into vibrant, solar-powered study hubs.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80',
    author: 'Education & Literacy Wing',
    readTime: '2 min read'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Zahoor Ahmed Lone',
    role: 'Youth Fellowship Alumnus',
    location: 'Baramulla, J&K',
    story: 'Before joining Global Youth Foundation, I hesitated to speak up about local youth unemployment and school dropouts. GYF’s leadership mentorship gave me the courage and project framework to initiate an after-school tutoring circle that now supports 45 kids in my neighborhood.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    program: 'Youth Empowerment',
    year: '2025'
  },
  {
    id: 'test-2',
    name: 'Mehak Fatima',
    role: 'Student Rights Advocate & Member',
    location: 'Srinagar, J&K',
    story: 'When our college hostel faced acute sanitation and heating issues during harsh winter, we submitted a grievance via GYF’s portal. Within 48 hours, GYF’s student desk coordinated with campus management, and the issues were completely rectified. Their grievance tracking is truly transparent.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    program: 'Human Rights & Grievance',
    year: '2025'
  },
  {
    id: 'test-3',
    name: 'Aaqib Showkat Mir',
    role: 'Volunteer Team Lead',
    location: 'Anantnag, J&K',
    story: 'Leading the environmental cleanup drive was one of the most fulfilling experiences of my life. GYF gives young people the platform to stop complaining about civic issues and start executing practical, sustainable solutions together.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    program: 'Environmental Sustainability',
    year: '2026'
  },
  {
    id: 'test-4',
    name: 'Dr. Saba Parveen',
    role: 'Community Health Partner',
    location: 'Budgam, J&K',
    story: 'GYF’s dedication to grassroots dignity is unmatched. We collaborated on female hygiene awareness sessions across 12 villages, reaching over 900 young girls with essential kits and zero social stigma.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80',
    program: 'Community Development',
    year: '2025'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Youth Leadership Assembly at Srinagar',
    category: 'Workshops',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
    caption: '120+ student leaders gathered for the annual GYF Civic Action symposium.',
    date: 'Jan 2026'
  },
  {
    id: 'gal-2',
    title: 'Wetland Protection & Lake Shore Cleanup Drive',
    category: 'Campaigns',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80',
    caption: 'Volunteers collecting plastic debris and promoting eco-friendly habits.',
    date: 'Feb 2026'
  },
  {
    id: 'gal-3',
    title: 'Legal Literacy & Fundamental Rights Camp',
    category: 'Events',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80',
    caption: 'Paralegal volunteers advising citizens on grievance redressal procedures.',
    date: 'Nov 2025'
  },
  {
    id: 'gal-4',
    title: 'Winter Warmth & Relief Distribution for Families',
    category: 'Community Work',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
    caption: 'Distributing warm clothing, nutritional rations, and care kits to remote communities.',
    date: 'Dec 2025'
  },
  {
    id: 'gal-5',
    title: 'Youth Dialogue on Harmony & Cultural Understanding',
    category: 'Youth Activities',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80',
    caption: 'Young artists and debaters sharing visions for inclusive peacebuilding.',
    date: 'Oct 2025'
  },
  {
    id: 'gal-6',
    title: 'Digital Empowerment & Cybersecurity Bootcamp',
    category: 'Workshops',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
    caption: 'High school students learning practical skills for ethical digital citizenship.',
    date: 'Sep 2025'
  },
  {
    id: 'gal-7',
    title: 'Afforestation Drive: Planting 10,000 Native Trees',
    category: 'Campaigns',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    caption: 'Youth environmentalists planting indigenous conifers to protect watershed zones.',
    date: 'Aug 2025'
  },
  {
    id: 'gal-8',
    title: 'Community Micro-Library Inauguration',
    category: 'Community Work',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    caption: 'Village children enjoying new illustrated storybooks and reference materials.',
    date: 'Jul 2025'
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'What is Global Youth Foundation (GYF)?',
    answer: 'Global Youth Foundation is a dynamic, youth-led non-governmental organization committed to creating a world defined by peace, justice, human rights, and social harmony. We empower young people to lead meaningful social change.'
  },
  {
    id: 'faq-2',
    category: 'Membership',
    question: 'Who can become a member of GYF and is there any fee?',
    answer: 'Any young person (and supporting ally) passionate about positive social transformation, peace, human rights, and community welfare can apply for membership. Basic youth volunteer membership is free and open to everyone.'
  },
  {
    id: 'faq-3',
    category: 'Grievances',
    question: 'Can I submit a grievance anonymously?',
    answer: 'Yes. GYF provides a 100% confidential and anonymous grievance submission mechanism. You do not need to provide your name, phone number, or email. You will receive a unique tracking ID (e.g. GYF-2026-847291) to check status updates securely.'
  },
  {
    id: 'faq-4',
    category: 'Grievances',
    question: 'How long does it take for a complaint to be reviewed?',
    answer: 'Our grievance team reviews incoming submissions within 24 to 48 business hours. Urgent matters involving vulnerable youth or emergency assistance are escalated immediately.'
  },
  {
    id: 'faq-5',
    category: 'Donations',
    question: 'How are donations to GYF processed and utilized?',
    answer: 'To ensure absolute financial security and transparency, we do not operate third-party payment gateways with high convenience fees. Donations are accepted via direct Bank Transfer (NEFT/RTGS/IMPS/UPI) to our official J&K Bank NGO Account: 0372040100022589, IFSC: JAKA0BEMINA. All funds directly support grassroots youth programs and winter/emergency relief.'
  },
  {
    id: 'faq-6',
    category: 'Programs',
    question: 'How can our educational institution partner with GYF for workshops?',
    answer: 'Schools, colleges, and community centers can reach us via email at contact.gyfoffice@gmail.com or call 9103599292 to schedule custom leadership, cyber-safety, or environmental workshops.'
  }
];

export const INITIAL_COMPLAINTS: GrievanceRecord[] = [
  {
    id: 'GYF-2026-847291',
    category: 'Education & Scholarship Assistance',
    subject: 'Delay in disbursal of merit-cum-means scholarship for degree students',
    description: 'Submitted an appeal regarding administrative processing delays affecting 18 underprivileged college students in District Srinagar.',
    location: 'Bemina, Srinagar',
    isAnonymous: false,
    complainantEmail: 'user@gyf.org',
    fullName: 'Tariq Manzoor',
    submittedAt: '2026-02-14 10:30 AM',
    currentStatus: 'Resolved',
    priority: 'High',
    assignedDepartment: 'Student Rights & Grievance Redressal Wing',
    timeline: [
      {
        status: 'Submitted',
        date: 'Feb 14, 2026 • 10:30 AM',
        description: 'Grievance received and registered under standard procedural docket.',
        updatedBy: 'Automated System'
      },
      {
        status: 'Under Review',
        date: 'Feb 14, 2026 • 02:15 PM',
        description: 'Case categorized and reviewed by legal desk coordinators.',
        updatedBy: 'Legal Advisory Board'
      },
      {
        status: 'Assigned',
        date: 'Feb 15, 2026 • 11:00 AM',
        description: 'Assigned to Senior Student Ombudsman for administrative representation.',
        updatedBy: 'Grievance Committee'
      },
      {
        status: 'In Progress',
        date: 'Feb 18, 2026 • 04:00 PM',
        description: 'Formal representation submitted to higher education scholarship committee.',
        updatedBy: 'Ombudsman Desk'
      },
      {
        status: 'Resolved',
        date: 'Feb 25, 2026 • 01:30 PM',
        description: 'Sanction order released for all pending applications. Verification complete.',
        updatedBy: 'Executive Secretary'
      }
    ]
  },
  {
    id: 'GYF-2026-319042',
    category: 'Environmental & Civic Hygiene',
    subject: 'Illegal dumping of plastic waste near community wetland park',
    description: 'Reported continuous dumping of commercial construction and plastic debris threatening local bird sanctuary area.',
    location: 'Dal Foreshore Basin, Srinagar',
    isAnonymous: true,
    complainantEmail: 'peerzada.nabi@gmail.com',
    submittedAt: '2026-02-22 09:15 AM',
    currentStatus: 'In Progress',
    priority: 'Urgent',
    assignedDepartment: 'Environmental Action Taskforce',
    timeline: [
      {
        status: 'Submitted',
        date: 'Feb 22, 2026 • 09:15 AM',
        description: 'Confidential environmental report received.',
        updatedBy: 'Automated System'
      },
      {
        status: 'Under Review',
        date: 'Feb 22, 2026 • 11:45 AM',
        description: 'Photographic evidence verified and geo-tagged.',
        updatedBy: 'Ecological Monitoring Desk'
      },
      {
        status: 'Assigned',
        date: 'Feb 23, 2026 • 10:00 AM',
        description: 'Assigned to Municipal Coordination & Volunteer Taskforce.',
        updatedBy: 'Green Wings Coordinator'
      },
      {
        status: 'In Progress',
        date: 'Feb 24, 2026 • 03:20 PM',
        description: 'Joint site inspection conducted with local civic authorities. Fencing proposed.',
        updatedBy: 'Taskforce Lead'
      }
    ]
  },
  {
    id: 'GYF-2026-552108',
    category: 'Community Safety & Street Lighting',
    subject: 'Malfunctioning street illumination on girls school access route',
    description: 'Pedestrian lights non-functional over 400m stretch causing safety distress for morning and evening students.',
    location: 'Qamarwari Main Corridor',
    isAnonymous: false,
    complainantEmail: 'user@gyf.org',
    fullName: 'Tariq Manzoor',
    submittedAt: '2026-02-26 04:40 PM',
    currentStatus: 'Under Review',
    priority: 'Medium',
    assignedDepartment: 'Community Welfare Desk',
    timeline: [
      {
        status: 'Submitted',
        date: 'Feb 26, 2026 • 04:40 PM',
        description: 'Grievance submitted via online portal.',
        updatedBy: 'Automated System'
      },
      {
        status: 'Under Review',
        date: 'Feb 27, 2026 • 10:00 AM',
        description: 'Reviewing safety report with neighborhood ward representative.',
        updatedBy: 'Civic Coordinator'
      }
    ]
  },
  {
    id: 'GYF-2026-918234',
    category: 'Other Public Interest Matter',
    subject: 'Commercial lease disagreement between private shopping complex vendors',
    description: 'Complaint seeking ombudsman arbitration in a private shopfront rent escalation dispute.',
    location: 'Residency Road, Srinagar',
    isAnonymous: false,
    complainantEmail: 'user@gyf.org',
    fullName: 'Tariq Manzoor',
    submittedAt: '2026-02-28 11:15 AM',
    currentStatus: 'Rejected',
    priority: 'Low',
    assignedDepartment: 'Ombudsman Legal Screening Desk',
    timeline: [
      {
        status: 'Submitted',
        date: 'Feb 28, 2026 • 11:15 AM',
        description: 'Grievance received through citizen portal.',
        updatedBy: 'Automated System'
      },
      {
        status: 'Under Review',
        date: 'Mar 01, 2026 • 09:30 AM',
        description: 'Subject jurisdiction examined by Ombudsman Screening Officer.',
        updatedBy: 'Legal Ombudsman'
      },
      {
        status: 'Rejected',
        date: 'Mar 01, 2026 • 02:00 PM',
        description: 'Case dismissed: Private commercial disputes fall outside the Youth Foundation public welfare remit. Complainant advised on civil forum recourse.',
        updatedBy: 'Ombudsman Committee'
      }
    ]
  },
  {
    id: 'GYF-2026-483775',
    category: 'Human Rights & Civic Liberties',
    subject: 'Unauthorized obstruction of public pedestrian walkway near community hall',
    description: 'Notice served regarding unauthorized barricading obstructing elderly and student access.',
    location: 'Civil Lines, Srinagar',
    isAnonymous: false,
    complainantEmail: 'user@gyf.org',
    fullName: 'Tariq Manzoor',
    submittedAt: '2026-03-02 03:20 PM',
    currentStatus: 'Submitted',
    priority: 'Medium',
    assignedDepartment: 'Civic Rights Cell',
    timeline: [
      {
        status: 'Submitted',
        date: 'Mar 02, 2026 • 03:20 PM',
        description: 'Docket registered and pending initial ombudsman review.',
        updatedBy: 'Automated System'
      }
    ]
  }
];

export const INITIAL_CONTACT_MESSAGES: any[] = [
  {
    id: 'msg-01',
    name: 'Suhail Bashir',
    email: 'suhail.bashir@example.com',
    phone: '+91 94190 44211',
    subject: 'Youth Leadership Workshop Collaboration',
    message: 'Greetings GYF Team, We are organizing an inter-college youth conclave next month and would love to collaborate with GYF for a keynote and leadership training session.',
    isRead: false,
    status: 'unread',
    createdAt: '2026-02-28 10:30 AM'
  },
  {
    id: 'msg-02',
    name: 'Dr. Mehak Qureshi',
    email: 'mehak.q@kashmiruniv.edu',
    phone: '+91 98581 12345',
    subject: 'Legal Literacy Camp Partnership',
    message: 'Hello, our department of law is interested in partnering with Global Youth Foundation for a free community legal aid and human rights awareness camp in rural Baramulla.',
    isRead: false,
    status: 'unread',
    createdAt: '2026-02-27 03:45 PM'
  },
  {
    id: 'msg-03',
    name: 'Imran Farooq',
    email: 'imran.f@gmail.com',
    phone: '+91 97970 99881',
    subject: 'Donation Receipt & Tax Certificate Query',
    message: 'Dear Secretariat, I made a transfer of INR 5,000 yesterday towards the Winter Warmth Relief Drive. Could you please share the official stamped 80G receipt?',
    isRead: true,
    status: 'read',
    createdAt: '2026-02-25 11:15 AM'
  },
  {
    id: 'msg-04',
    name: 'Fariha Jan',
    email: 'fariha.youth@outlook.com',
    phone: '+91 91035 77665',
    subject: 'Volunteer Chapter in South Kashmir',
    message: 'Respected Team, We have a group of 20 college students in Anantnag eager to establish a local GYF youth club and environmental drive chapter. How can we get affiliated?',
    isRead: true,
    status: 'read',
    createdAt: '2026-02-24 02:10 PM'
  }
];
