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

export const ORG_INFO = {
  name: 'Global Youth Foundation',
  shortName: 'GYF',
  tagline: 'Empowering Youth, Inspiring Change, Building a Better Tomorrow.',
  description: 'At Global Youth Foundation, we are a dynamic, youth-led movement committed to creating a world defined by peace, justice, rights, and harmony.',
  phone: '9103599292',
  email: 'contact.gyfoffice@gmail.com',
  addressDisplay: 'Bemina, Srinagar, Jammu & Kashmir (Headquarter Regional Hub)',
  establishedYear: '2020',
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
    id: 'youth-empowerment',
    title: 'Youth Empowerment',
    shortDescription: 'Developing leadership, confidence, skills and opportunities for young people.',
    fullDescription: 'Our Youth Empowerment program equips young individuals with practical leadership training, public speaking acumen, emotional intelligence, and digital skills. Through structured fellowships and mentorship circles, we bridge the gap between academic education and real-world civic impact.',
    objectives: [
      'Conduct grassroots leadership incubators for underrepresented youth.',
      'Provide career counseling, mentorship, and digital literacy workshops.',
      'Create student representation councils in universities and local communities.'
    ],
    impactStats: '3,200+ Young Leaders Trained',
    iconName: 'Zap',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    category: 'Leadership & Skills',
    beneficiariesTarget: 'Youth aged 15–29, students, young entrepreneurs'
  },
  {
    id: 'human-rights',
    title: 'Human Rights',
    shortDescription: 'Promoting dignity, equality and awareness of fundamental rights.',
    fullDescription: 'We advocate for human dignity, legal literacy, non-discrimination, and fundamental freedoms. GYF conducts rights-awareness clinics, provides free paralegal guidance for vulnerable families, and works alongside civil rights practitioners to protect individual and community rights.',
    objectives: [
      'Disseminate accessible legal literacy guides in local languages.',
      'Host free civic grievance clinics and legal awareness seminars.',
      'Advocate for the eradication of discrimination, gender bias, and youth exploitation.'
    ],
    impactStats: '1,400+ Citizens Supported in Legal Literacy',
    iconName: 'ShieldAlert',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    category: 'Advocacy & Justice',
    beneficiariesTarget: 'Vulnerable citizens, marginalized youth, students'
  },
  {
    id: 'peace-justice',
    title: 'Peace & Justice',
    shortDescription: 'Supporting peacebuilding, dialogue, justice and social harmony.',
    fullDescription: 'Fostering cohesive communities through youth-led intercommunity dialogues, conflict de-escalation workshops, and collaborative art and cultural forums. We believe lasting peace is anchored in restorative justice and mutual empathy.',
    objectives: [
      'Organize Youth Peace Circles and restorative mediation forums.',
      'Train youth ambassadors in conflict resolution and empathetic communication.',
      'Publish policy briefs and youth perspectives on local peacebuilding.'
    ],
    impactStats: '45+ Peace Dialogues Facilitated',
    iconName: 'Scale',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&q=80',
    category: 'Peace & Harmony',
    beneficiariesTarget: 'Community elders, youth councils, grassroots peace advocates'
  },
  {
    id: 'environmental-sustainability',
    title: 'Environmental Sustainability',
    shortDescription: 'Encouraging youth participation in environmental protection and sustainable development.',
    fullDescription: 'Empowering young climate stewards to lead urban tree plantation drives, water body conservation, plastic-reduction campaigns, and renewable energy literacy. We connect grassroots ecological action with United Nations Sustainable Development Goals (SDGs).',
    objectives: [
      'Plant and nurture 25,000+ native saplings in urban and peri-urban zones.',
      'Organize riverbank and public lake cleanup mobilizations.',
      'Train school students in waste segregation and climate resilience.'
    ],
    impactStats: '18,000+ Trees Planted & 12 Cleanups',
    iconName: 'Leaf',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    category: 'Climate & Ecology',
    beneficiariesTarget: 'Youth climate activists, schools, local neighborhoods'
  },
  {
    id: 'community-development',
    title: 'Community Development',
    shortDescription: 'Supporting grassroots initiatives and vulnerable communities.',
    fullDescription: 'Direct intervention programs addressing socio-economic distress, winter relief drives, emergency food distribution, sanitary health kit distributions for young women, and infrastructure rehabilitation in underprivileged areas.',
    objectives: [
      'Deploy rapid volunteer response teams during seasonal climate hardships.',
      'Distribute menstrual hygiene and essential healthcare supplies.',
      'Establish community micro-libraries and study spaces in rural clusters.'
    ],
    impactStats: '25+ Villages & Municipal Wards Supported',
    iconName: 'Building2',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
    category: 'Grassroots Upliftment',
    beneficiariesTarget: 'Low-income households, remote communities, children'
  },
  {
    id: 'education-awareness',
    title: 'Education & Awareness',
    shortDescription: 'Conducting workshops, campaigns, training and awareness programs.',
    fullDescription: 'Breaking structural barriers to education through remedial tutoring for first-generation learners, scholarship discovery guidance, anti-substance abuse drives, and cyber safety workshops for teens and parents.',
    objectives: [
      'Facilitate free weekend tutoring and board examination preparation.',
      'Host awareness campaigns against substance abuse and mental health stigma.',
      'Provide digital safety and misinformation resilience toolkits.'
    ],
    impactStats: '8,500+ Students Reached in Schools & Colleges',
    iconName: 'GraduationCap',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    category: 'Education & Learning',
    beneficiariesTarget: 'School pupils, college scholars, educators'
  }
];

export const EVENTS: EventItem[] = [
  {
    id: 'event-1',
    title: 'Youth Leadership Workshop 2026',
    date: 'March 18, 2026',
    time: '10:00 AM - 04:30 PM',
    location: 'Srinagar Convention Centre, J&K',
    category: 'Workshop',
    description: 'An intensive, interactive seminar focusing on public policy advocacy, conflict resolution strategies, and civic leadership.',
    fullDetails: 'Participants will engage with seasoned civil society activists, participate in policy simulation rounds, and collaborate on actionable community project roadmaps.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    status: 'Upcoming',
    attendeesCount: 140
  },
  {
    id: 'event-2',
    title: 'Human Rights Awareness Campaign',
    date: 'April 05, 2026',
    time: '11:00 AM - 03:00 PM',
    location: 'University Campus & Public Square, Bemina',
    category: 'Campaign',
    description: 'Street theatre, rights handbook distribution, and open legal helpdesks to foster awareness of constitutional and human rights.',
    fullDetails: 'GYF volunteers and legal scholars will host open-mic sessions and one-on-one citizen advisory desks explaining RTI, basic civil liberties, and grievance redressal.',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80',
    status: 'Upcoming',
    attendeesCount: 320
  },
  {
    id: 'event-3',
    title: 'Peacebuilding Initiative & Youth Dialogue',
    date: 'January 24, 2026',
    time: '02:00 PM - 06:00 PM',
    location: 'Community Peace Hall, Rajbagh',
    category: 'Peacebuilding',
    description: 'A cross-generational dialogue bringing young voices and community leaders together to build mutual trust and harmonic frameworks.',
    fullDetails: 'A high-impact symposium bringing together 70+ young delegates to discuss community harmony, youth inclusion in municipal decision-making, and peace education.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
    status: 'Completed',
    attendeesCount: 95
  },
  {
    id: 'event-4',
    title: 'Environmental Awareness Drive & Lake Clean-Up',
    date: 'February 12, 2026',
    time: '08:30 AM - 01:30 PM',
    location: 'Dal Foreshore Road & Surrounding Wetlands',
    category: 'Environment',
    description: 'Youth volunteers gathered to collect over 1.2 metric tons of non-biodegradable waste and distributed reusable cloth bags to shopkeepers.',
    fullDetails: 'A collaborative drive with local municipal volunteers, mobilizing 180 youth to clear plastic pollutants and install eco-signboards promoting sustainable tourism.',
    image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1000&q=80',
    status: 'Completed',
    attendeesCount: 185
  },
  {
    id: 'event-5',
    title: 'Community Outreach & Winter Warmth Program',
    date: 'December 28, 2025',
    time: '09:00 AM - 05:00 PM',
    location: 'Rural Outskirts & Tribal Settlements',
    category: 'Outreach',
    description: 'Providing thermal blankets, woolens, and nutritional emergency rations to 350+ elderly citizens and underprivileged children.',
    fullDetails: 'GYF grassroots response unit mapped vulnerable families prior to the harsh chill, ensuring timely, dignified distribution of protective winter gear.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80',
    status: 'Completed',
    attendeesCount: 420
  },
  {
    id: 'event-6',
    title: 'Youth Digital Skills & Media Literacy Bootcamp',
    date: 'May 14, 2026',
    time: '10:00 AM - 03:00 PM',
    location: 'GYF Digital Hub & Virtual Stream',
    category: 'Leadership',
    description: 'Empowering young content creators and student journalists to combat fake news and produce positive social advocacy campaigns.',
    fullDetails: 'Hands-on practical sessions in ethical digital storytelling, smartphone filmmaking for causes, and cybersecurity basics.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
    status: 'Upcoming',
    attendeesCount: 200
  }
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'GYF Launches 2026 Youth Fellowship for Human Rights & Civic Leadership',
    category: 'Announcements',
    date: 'February 20, 2026',
    shortDescription: 'Applications are now open for our flagship 6-month fellowship program empowering 50 young leaders across the region.',
    content: 'Global Youth Foundation is delighted to inaugurate the 2026 Youth Fellowship Cohort. This initiative will provide comprehensive training, direct community project seed grants, and executive mentorship from distinguished human rights advocates and policy researchers.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80',
    author: 'GYF Communications Directorate',
    readTime: '3 min read'
  },
  {
    id: 'news-2',
    title: 'Over 980 Citizen Grievances Successfully Mediated and Resolved',
    category: 'Impact Report',
    date: 'January 15, 2026',
    shortDescription: 'Our transparent grievance desk reached a crucial milestone, providing swift, confidential assistance to affected youth and citizens.',
    content: 'Through dedicated paralegal volunteers and collaborative dialogue with institutional authorities, Global Youth Foundation has resolved over 980 individual and collective community grievances since our portal inception, ranging from educational scholarship access to community amenities.',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80',
    author: 'Grievance Redressal Committee',
    readTime: '4 min read'
  },
  {
    id: 'news-3',
    title: 'Planting Hope: 10,000 Saplings Planted Across Degraded Valley Slopes',
    category: 'Environment',
    date: 'November 18, 2025',
    shortDescription: 'Youth volunteers and local schools joined hands to restore indigenous green cover in an ambitious seasonal ecological initiative.',
    content: 'Demonstrating the immense power of youth-driven climate action, over 300 volunteers participated across 8 plantation locations. The species chosen included deodar, walnut, and native pine to prevent soil erosion and promote biodiversity.',
    image: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=1000&q=80',
    author: 'GYF Green Wings Initiative',
    readTime: '3 min read'
  },
  {
    id: 'news-4',
    title: 'Community Micro-Libraries Established in 5 Remote Village Centers',
    category: 'Education',
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
    complainantEmail: 'student.liaison@example.org',
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
    isAnonymous: true,
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
