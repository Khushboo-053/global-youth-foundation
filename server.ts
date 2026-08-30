import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent database file path
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default seed database
const DEFAULT_DB = {
  programs: [
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
      beneficiariesTarget: 'Youth aged 15–29, students, young entrepreneurs',
      date: '2026-01-15',
      status: 'Active',
      isPublished: true,
      createdAt: '2026-01-15T10:00:00.000Z'
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
      beneficiariesTarget: 'Vulnerable citizens, marginalized youth, students',
      date: '2026-01-20',
      status: 'Active',
      isPublished: true,
      createdAt: '2026-01-20T10:00:00.000Z'
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
      beneficiariesTarget: 'Community leaders, grassroots youth, students',
      date: '2026-02-01',
      status: 'Active',
      isPublished: true,
      createdAt: '2026-02-01T10:00:00.000Z'
    },
    {
      id: 'environment-sustainability',
      title: 'Environment & Sustainability',
      shortDescription: 'Green initiatives, climate action, afforestation and clean communities.',
      fullDescription: 'Under our “Green Wings” banner, we organize mass afforestation drives, wetland restoration brigades, zero-waste neighborhood initiatives, and renewable energy literacy campaigns across Himalayan and urban ecosystems.',
      objectives: [
        'Plant 25,000+ native saplings in ecologically fragile zones.',
        'Facilitate community plastic cleanup drives across lakes and riversides.',
        'Train student eco-clubs in climate mitigation and waste segregation.'
      ],
      impactStats: '15,000+ Saplings Planted & 12 Waterways Cleaned',
      iconName: 'Leaf',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      category: 'Climate & Ecology',
      beneficiariesTarget: 'Local communities, schools, environmental advocates',
      date: '2026-02-10',
      status: 'Active',
      isPublished: true,
      createdAt: '2026-02-10T10:00:00.000Z'
    },
    {
      id: 'community-development',
      title: 'Community Development',
      shortDescription: 'Grassroots upliftment, rural outreach, social support and infrastructure aid.',
      fullDescription: 'Addressing acute grassroots socio-economic bottlenecks by providing emergency winter relief, solar study lamps for remote villages, sanitary health kits, and community skill learning centers.',
      objectives: [
        'Deliver winter warmth kits and dry rations to remote alpine settlements.',
        'Equip rural schools with clean water filtration and solar backup units.',
        'Support self-help groups with micro-vocational equipment.'
      ],
      impactStats: '25+ Villages & Hamlets Supported',
      iconName: 'Building2',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
      category: 'Grassroots Upliftment',
      beneficiariesTarget: 'Underprivileged families, rural schools, elders',
      date: '2026-02-15',
      status: 'Active',
      isPublished: true,
      createdAt: '2026-02-15T10:00:00.000Z'
    },
    {
      id: 'education-learning',
      title: 'Education & Learning',
      shortDescription: 'Skill training, scholarships, literacy, digital access and book drives.',
      fullDescription: 'Empowering children and youth from humble backgrounds through scholarship mentorship, free library corners, digital computer literacy labs, and peer-to-peer tutoring circles.',
      objectives: [
        'Establish 10+ free community library and study hubs.',
        'Mentor first-generation college applicants on scholarship discovery.',
        'Distribute textbooks, digital tablets, and school supplies to deserving students.'
      ],
      impactStats: '2,800+ Students Empowered in Learning',
      iconName: 'GraduationCap',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
      category: 'Education & Learning',
      beneficiariesTarget: 'School children, university aspirants, first-generation learners',
      date: '2026-02-20',
      status: 'Active',
      isPublished: true,
      createdAt: '2026-02-20T10:00:00.000Z'
    }
  ],
  events: [
    {
      id: 'ev-01',
      title: 'Youth Leadership & Social Innovation Summit 2026',
      date: 'April 18, 2026',
      time: '09:30 AM - 05:00 PM IST',
      location: 'SKICC Convention Centre, Srinagar',
      category: 'Leadership',
      description: 'Annual gathering of 400+ youth changemakers, civic leaders, innovators, and policy experts deliberating sustainable grassroots solutions.',
      fullDetails: 'Keynotes by civil society leaders, workshops on AI for social good, community dispute mediation, and grant pitches for youth ventures.',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
      status: 'Upcoming',
      attendeesCount: 420,
      isPublished: true,
      createdAt: '2026-02-01T10:00:00.000Z'
    },
    {
      id: 'ev-02',
      title: 'Himalayan Green Wings Afforestation Drive',
      date: 'April 26, 2026',
      time: '08:00 AM - 02:00 PM IST',
      location: 'Dara Eco-Zone, Harwan Foothills',
      category: 'Environment',
      description: 'Community afforestation camp planting 3,000 native pine and deodar saplings with youth volunteer teams.',
      fullDetails: 'All saplings, tree guards, and tool kits provided. Includes ecological awareness briefing and zero-waste community lunch.',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
      status: 'Upcoming',
      attendeesCount: 150,
      isPublished: true,
      createdAt: '2026-02-05T10:00:00.000Z'
    },
    {
      id: 'ev-03',
      title: 'Free Community Legal Literacy & Paralegal Helpdesk',
      date: 'May 04, 2026',
      time: '10:00 AM - 04:00 PM IST',
      location: 'Town Hall Auditorium, Baramulla',
      category: 'Outreach',
      description: 'Free legal aid clinic addressing civil grievances, consumer rights, RTI filing procedures, and government welfare scheme enrollment.',
      fullDetails: 'Senior advocates and paralegal volunteers available for 1-on-1 confidential consultations.',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80',
      status: 'Upcoming',
      attendeesCount: 200,
      isPublished: true,
      createdAt: '2026-02-10T10:00:00.000Z'
    },
    {
      id: 'ev-04',
      title: 'Winter Warmth & Relief Distribution 2025–26',
      date: 'January 14, 2026',
      time: 'Completed',
      location: 'Gurez & Bandipora Highland Hamlets',
      category: 'Outreach',
      description: 'Distribution of thermal blankets, winter boots, and heating kits to 500+ vulnerable families in snowbound hamlets.',
      fullDetails: 'Conducted successfully in coordination with local district administration and volunteer teams.',
      image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1000&q=80',
      status: 'Completed',
      attendeesCount: 520,
      isPublished: true,
      createdAt: '2026-01-14T10:00:00.000Z'
    },
    {
      id: 'ev-05',
      title: 'Youth Peace & Inter-Faith Harmony Circle',
      date: 'December 20, 2025',
      time: 'Completed',
      location: 'Heritage Complex, Srinagar',
      category: 'Peacebuilding',
      description: 'Dialogue sessions and cultural exchange promoting shared heritage and youth harmony across diverse backgrounds.',
      fullDetails: 'Featured spoken word poetry, art installations, and joint youth resolutions.',
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80',
      status: 'Completed',
      attendeesCount: 180,
      isPublished: true,
      createdAt: '2025-12-20T10:00:00.000Z'
    }
  ],
  contactMessages: [
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
  ],
  adminProfile: {
    fullName: 'Executive Administrator',
    email: 'admin@gyf.org',
    phone: '+91 91035 99292',
    roleTitle: 'Secretariat Director',
    chapter: 'Central Kashmir Hub (Headquarter Secretariat)',
    bio: 'Overseeing youth initiatives, grievance redressal, foundation compliance, and grassroots program deployment.',
    membershipId: 'GYF-ADM-2024-001'
  }
};

// Database helper functions
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading database file, using default seed:', err);
  }
  // Initialize file
  saveDatabase(DEFAULT_DB);
  return DEFAULT_DB;
}

function saveDatabase(data: typeof DEFAULT_DB) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

// In-memory active database reference
let db = loadDatabase();

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Overview Statistics
app.get('/api/stats', (req: Request, res: Response) => {
  const totalPrograms = db.programs.length;
  const totalEvents = db.events.length;
  const totalContactMessages = db.contactMessages.length;
  const unreadMessages = db.contactMessages.filter((m: any) => !m.isRead).length;

  res.json({
    totalPrograms,
    totalEvents,
    totalContactMessages,
    unreadMessages,
    activeVolunteers: 540,
    resolvedGrievances: 980
  });
});

// Authentication
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Admin login check
  if (email.toLowerCase().includes('admin')) {
    return res.json({
      success: true,
      token: 'gyf_token_admin_' + Date.now(),
      user: {
        id: 'usr-gyf-admin-01',
        fullName: db.adminProfile.fullName || 'Executive Administrator',
        email: db.adminProfile.email || 'admin@gyf.org',
        phone: db.adminProfile.phone || '+91 91035 99292',
        role: 'admin',
        roleTitle: db.adminProfile.roleTitle || 'Secretariat Director',
        membershipId: db.adminProfile.membershipId || 'GYF-ADM-2024-001',
        chapter: db.adminProfile.chapter || 'Central Kashmir Hub (Headquarter Secretariat)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        joinedDate: 'January 2024',
        membershipStatus: 'Admin',
        isActive: true
      }
    });
  }

  // Volunteer login check
  if (email.toLowerCase().includes('volunteer')) {
    return res.json({
      success: true,
      token: 'gyf_token_vol_' + Date.now(),
      user: {
        id: 'usr-gyf-vol-01',
        fullName: 'Aisha Begum',
        email: 'volunteer@gyf.org',
        phone: '+91 98580 44211',
        role: 'volunteer',
        roleTitle: 'Green Wings Volunteer Lead',
        membershipId: 'GYF-VOL-2024-042',
        chapter: 'North Kashmir Hub (Baramulla)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        joinedDate: 'June 2024',
        membershipStatus: 'Volunteer',
        isActive: true
      }
    });
  }

  // Standard citizen/member user
  return res.json({
    success: true,
    token: 'gyf_token_user_' + Date.now(),
    user: {
      id: 'usr-gyf-user-01',
      fullName: 'Tariq Manzoor',
      email: email,
      phone: '+91 94190 88231',
      role: 'user',
      roleTitle: 'Active Youth Member',
      membershipId: 'GYF-MEM-2025-084',
      chapter: 'Central Kashmir Hub (Srinagar)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      joinedDate: 'February 2025',
      membershipStatus: 'Member',
      isActive: true
    }
  });
});

// Admin Profile
app.get('/api/admin/profile', (req: Request, res: Response) => {
  res.json(db.adminProfile);
});

app.put('/api/admin/profile', (req: Request, res: Response) => {
  db.adminProfile = {
    ...db.adminProfile,
    ...req.body
  };
  saveDatabase(db);
  res.json({ success: true, profile: db.adminProfile });
});

// -------------------------------------------------------------
// PROGRAMS CRUD
// -------------------------------------------------------------
app.get('/api/programs', (req: Request, res: Response) => {
  res.json(db.programs);
});

app.post('/api/programs', (req: Request, res: Response) => {
  const {
    title,
    description,
    shortDescription,
    fullDescription,
    image,
    date,
    status,
    category,
    objectives,
    impactStats,
    beneficiariesTarget,
    iconName
  } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Program title is required' });
  }

  const newProgram = {
    id: 'prog-' + Date.now(),
    title: title.trim(),
    shortDescription: shortDescription || description || 'Youth empowerment and community development initiative.',
    fullDescription: fullDescription || description || shortDescription || 'Comprehensive community action program designed to create lasting social impact.',
    objectives: Array.isArray(objectives) && objectives.length > 0 ? objectives : ['Promote youth development and community welfare.'],
    impactStats: impactStats || '1,000+ Youth Impacted',
    iconName: iconName || 'Zap',
    image: image || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    category: category || 'Leadership & Skills',
    beneficiariesTarget: beneficiariesTarget || 'Youth, students, and local community members',
    date: date || new Date().toISOString().split('T')[0],
    status: status || 'Active',
    isPublished: status !== 'Draft',
    createdAt: new Date().toISOString()
  };

  db.programs.unshift(newProgram);
  saveDatabase(db);
  res.status(201).json(newProgram);
});

app.put('/api/programs/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.programs.findIndex((p: any) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Program not found' });
  }

  const existing = db.programs[index];
  const updated = {
    ...existing,
    ...req.body,
    shortDescription: req.body.shortDescription || req.body.description || existing.shortDescription,
    fullDescription: req.body.fullDescription || req.body.description || existing.fullDescription,
    isPublished: req.body.status ? req.body.status !== 'Draft' : existing.isPublished
  };

  db.programs[index] = updated;
  saveDatabase(db);
  res.json(updated);
});

app.delete('/api/programs/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLength = db.programs.length;
  db.programs = db.programs.filter((p: any) => p.id !== id);

  if (db.programs.length === initialLength) {
    return res.status(404).json({ error: 'Program not found' });
  }

  saveDatabase(db);
  res.json({ success: true, message: 'Program deleted successfully' });
});

// -------------------------------------------------------------
// EVENTS CRUD
// -------------------------------------------------------------
app.get('/api/events', (req: Request, res: Response) => {
  res.json(db.events);
});

app.post('/api/events', (req: Request, res: Response) => {
  const {
    title,
    description,
    fullDetails,
    date,
    time,
    location,
    image,
    category,
    status,
    attendeesCount
  } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Event title is required' });
  }

  const newEvent = {
    id: 'ev-' + Date.now(),
    title: title.trim(),
    description: description || 'Community and youth gathering organized by Global Youth Foundation.',
    fullDetails: fullDetails || description || 'Detailed agenda and volunteer briefing will be shared with all registered participants.',
    date: date || 'Upcoming 2026',
    time: time || '10:00 AM - 04:00 PM IST',
    location: location || 'Srinagar, Jammu & Kashmir',
    image: image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    category: category || 'Workshop',
    status: status || 'Upcoming',
    attendeesCount: attendeesCount || 50,
    isPublished: status !== 'Draft',
    createdAt: new Date().toISOString()
  };

  db.events.unshift(newEvent);
  saveDatabase(db);
  res.status(201).json(newEvent);
});

app.put('/api/events/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.events.findIndex((e: any) => e.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const existing = db.events[index];
  const updated = {
    ...existing,
    ...req.body,
    isPublished: req.body.status ? req.body.status !== 'Draft' : existing.isPublished
  };

  db.events[index] = updated;
  saveDatabase(db);
  res.json(updated);
});

app.delete('/api/events/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLength = db.events.length;
  db.events = db.events.filter((e: any) => e.id !== id);

  if (db.events.length === initialLength) {
    return res.status(404).json({ error: 'Event not found' });
  }

  saveDatabase(db);
  res.json({ success: true, message: 'Event deleted successfully' });
});

// -------------------------------------------------------------
// CONTACT MESSAGES API
// -------------------------------------------------------------
app.get('/api/contact', (req: Request, res: Response) => {
  res.json(db.contactMessages);
});

app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Name, email, subject, and message are required' });
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) + ' • ' + now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const newMessage = {
    id: 'msg-' + Date.now(),
    name: name.trim(),
    email: email.trim(),
    phone: phone ? phone.trim() : undefined,
    subject: subject.trim(),
    message: message.trim(),
    isRead: false,
    status: 'unread',
    createdAt: dateStr
  };

  db.contactMessages.unshift(newMessage);
  saveDatabase(db);
  res.status(201).json({ success: true, message: 'Contact message saved successfully', data: newMessage });
});

app.patch('/api/contact/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.contactMessages.findIndex((m: any) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Message not found' });
  }

  const current = db.contactMessages[index];
  const isRead = typeof req.body.isRead === 'boolean' ? req.body.isRead : !current.isRead;
  
  db.contactMessages[index] = {
    ...current,
    isRead,
    status: isRead ? 'read' : 'unread'
  };

  saveDatabase(db);
  res.json(db.contactMessages[index]);
});

app.delete('/api/contact/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLength = db.contactMessages.length;
  db.contactMessages = db.contactMessages.filter((m: any) => m.id !== id);

  if (db.contactMessages.length === initialLength) {
    return res.status(404).json({ error: 'Message not found' });
  }

  saveDatabase(db);
  res.json({ success: true, message: 'Contact message deleted successfully' });
});

// -------------------------------------------------------------
// VITE DEV MIDDLEWARE / STATIC PRODUCTION SERVING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
