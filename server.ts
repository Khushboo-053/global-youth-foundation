import "dotenv/config";
import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { ARCHIVAL_EVENTS } from './src/data/archivalEvents';
import { PROGRAMS, NEWS_ITEMS } from './src/data/mockData';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3040;

app.use(express.json());

// -----------------------------------------------------------------
// FILE UPLOAD: multer — saves to public/uploads/
// -----------------------------------------------------------------
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `event-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ok = allowed.test(file.mimetype) && allowed.test(path.extname(file.originalname).toLowerCase().slice(1));
    ok ? cb(null, true) : cb(new Error('Only image files are allowed (jpg, png, gif, webp).'));
  }
});

// Serve uploaded files as static assets
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/hero', express.static(path.join(process.cwd(), 'public', 'hero')));

app.post('/api/upload', upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided.' });
  }
  const url = `/uploads/${req.file.filename}`;
  res.json({ success: true, url });
});

// Persistent database file path
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default seed database
const DEFAULT_DB = {
  programs: PROGRAMS.map(p => ({
    ...p,
    status: 'Active',
    isPublished: true,
    createdAt: '2026-01-15T10:00:00.000Z'
  })),
  events: ARCHIVAL_EVENTS.map(e => ({
    ...e,
    isPublished: true,
    createdAt: e.createdAt || '2026-01-15T10:00:00.000Z'
  })),
  blogs: NEWS_ITEMS.map(b => ({
    ...b,
    isPublished: true,
    createdAt: '2026-01-15T10:00:00.000Z'
  })),
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
  },
  websiteContent: null
};

// Database helper functions
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);

      let changed = false;

      // --- Migration for blogs ---
      if (!parsed.blogs || !Array.isArray(parsed.blogs)) {
        parsed.blogs = NEWS_ITEMS.map(b => ({
          ...b,
          isPublished: true,
          createdAt: '2026-01-15T10:00:00.000Z'
        }));
        changed = true;
      }

      // --- NON-DESTRUCTIVE events migration ---
      // Only seed archival events that are genuinely missing by ID.
      // NEVER wipe or reset existing events — user-created ones must be preserved.
      if (!parsed.events || !Array.isArray(parsed.events)) {
        parsed.events = ARCHIVAL_EVENTS.map(e => ({
          ...e,
          isPublished: true,
          createdAt: e.createdAt || '2026-01-15T10:00:00.000Z'
        }));
        changed = true;
      } else {
        const existingIds = new Set(parsed.events.map((e: any) => e.id));
        const missingArchival = ARCHIVAL_EVENTS.filter(e => !existingIds.has(e.id));
        if (missingArchival.length > 0) {
          // Append only the truly missing archival events (don't touch existing ones)
          parsed.events = [
            ...parsed.events,
            ...missingArchival.map(e => ({
              ...e,
              isPublished: true,
              createdAt: e.createdAt || '2026-01-15T10:00:00.000Z'
            }))
          ];
          changed = true;
        }
      }

      // --- Programs migration (safe: only if missing the new pillar structure) ---
      if (!parsed.programs || !Array.isArray(parsed.programs) || parsed.programs.some((p: any) => p.id === 'youth-empowerment')) {
        parsed.programs = PROGRAMS.map(p => ({
          ...p,
          status: 'Active',
          isPublished: true,
          createdAt: '2026-01-15T10:00:00.000Z'
        }));
        changed = true;
      }

      if (changed) saveDatabase(parsed);
      return parsed;
    }
  } catch (err) {
    console.error('Error reading database file, using default seed:', err);
  }
  // Initialize file with defaults
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
    galleryImages,
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
    galleryImages: galleryImages || [],
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
// BLOGS CRUD
// -------------------------------------------------------------
app.get('/api/blogs', (req: Request, res: Response) => {
  res.json(db.blogs || []);
});

app.post('/api/blogs', (req: Request, res: Response) => {
  const { title, category, date, shortDescription, content, image, author, readTime, isPublished, articleImages } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Blog title is required' });
  }

  const newBlog = {
    id: 'blog-' + Date.now(),
    title: title.trim(),
    category: category || 'Youth Empowerment',
    date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    shortDescription: shortDescription || '',
    content: content || '',
    image: image || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    author: author || 'Editorial Desk, GYF',
    readTime: readTime || '4 min read',
    isPublished: isPublished ?? true,
    articleImages: articleImages || [],
    createdAt: new Date().toISOString()
  };

  if (!db.blogs) db.blogs = [];
  db.blogs.unshift(newBlog);
  saveDatabase(db);
  res.status(201).json(newBlog);
});

app.put('/api/blogs/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!db.blogs) db.blogs = [];
  const index = db.blogs.findIndex((b: any) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Blog article not found' });
  }

  const existing = db.blogs[index];
  const updated = {
    ...existing,
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  db.blogs[index] = updated;
  saveDatabase(db);
  res.json(updated);
});

app.delete('/api/blogs/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!db.blogs) db.blogs = [];
  const initialLength = db.blogs.length;
  db.blogs = db.blogs.filter((b: any) => b.id !== id);

  if (db.blogs.length === initialLength) {
    return res.status(404).json({ error: 'Blog article not found' });
  }

  saveDatabase(db);
  res.json({ success: true, message: 'Blog deleted successfully' });
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

// Website Content
app.get('/api/website-content', (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.json(db.websiteContent || null);
});

app.put('/api/website-content', (req: Request, res: Response) => {
  db.websiteContent = req.body;
  saveDatabase(db);
  res.json(db.websiteContent);
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
