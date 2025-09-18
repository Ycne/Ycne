import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? '*' }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));

const PORT = process.env.PORT || 4000;

function signJwt(payload: object, expiresIn = process.env.JWT_EXPIRES_IN || '15m') {
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev', { expiresIn });
}

function authMiddleware(req: any, res: any, next: any) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = header.slice(7);
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev');
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/health', (_req, res) => res.json({ ok: true, service: 'safe-api', timestamp: Date.now() }));

// Auth
app.post('/auth/register', async (req, res) => {
  const schema = z.object({ email: z.string().email().optional(), phone: z.string().min(6).optional(), password: z.string().min(6), displayName: z.string().min(2) });
  const data = schema.safeParse(req.body);
  if (!data.success) return res.status(400).json({ error: data.error.flatten() });
  const { email, phone, password, displayName } = data.data;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, phone, passwordHash, displayName, badges: [] } });
  const token = signJwt({ sub: user.id, roles: user.roles });
  res.json({ token, user });
});

app.post('/auth/login', async (req, res) => {
  const schema = z.object({ email: z.string().email().optional(), phone: z.string().optional(), password: z.string() });
  const data = schema.safeParse(req.body);
  if (!data.success) return res.status(400).json({ error: data.error.flatten() });
  const { email, phone, password } = data.data;
  const user = await prisma.user.findFirst({ where: { OR: [{ email: email ?? undefined }, { phone: phone ?? undefined }] } });
  if (!user?.passwordHash) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signJwt({ sub: user.id, roles: user.roles });
  res.json({ token, user });
});

// Listings
app.get('/listings', async (req, res) => {
  const q = String(req.query.q || '');
  const city = req.query.city ? String(req.query.city) : undefined;
  const listings = await prisma.listing.findMany({
    where: {
      status: 'ACTIVE',
      AND: [
        q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] } : {},
        city ? { city } : {},
      ]
    },
    include: { seller: true }
  });
  res.json(listings);
});

app.post('/listings', authMiddleware, async (req: any, res) => {
  const schema = z.object({ title: z.string().min(2), description: z.string().min(2), price: z.number().int().nonnegative(), category: z.string(), city: z.string(), images: z.array(z.string()).default([]) });
  const data = schema.safeParse(req.body);
  if (!data.success) return res.status(400).json({ error: data.error.flatten() });
  const listing = await prisma.listing.create({ data: { ...data.data, sellerId: req.user.sub as string } });
  res.json(listing);
});

// Reservations
app.get('/reservations', authMiddleware, async (req: any, res) => {
  const userId = req.user.sub as string;
  const reservations = await prisma.reservation.findMany({ where: { userId }, include: { listing: true } });
  res.json(reservations);
});

app.post('/reservations', authMiddleware, async (req: any, res) => {
  const schema = z.object({ listingId: z.string().optional(), start: z.string(), end: z.string(), city: z.string(), notes: z.string().optional() });
  const data = schema.safeParse(req.body);
  if (!data.success) return res.status(400).json({ error: data.error.flatten() });
  const reservation = await prisma.reservation.create({ data: { ...data.data, start: new Date(data.data.start), end: new Date(data.data.end), userId: req.user.sub as string } });
  res.json(reservation);
});

// Admin only example
app.get('/admin/users', authMiddleware, async (req: any, res) => {
  const roles: Role[] = req.user.roles || [];
  if (!roles.includes('ADMIN' as Role)) return res.status(403).json({ error: 'Forbidden' });
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
  res.json(users);
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`SAFE API running on :${PORT}`));
