import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_CABS, INITIAL_RIDES, REFRESHMENT_ITEMS, CURRENT_USER } from './src/data/mockData.ts';
import { RideBooking, UserProfile } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-Memory Database collections (MERN stack simulation)
let dbUsers: UserProfile[] = [{ ...CURRENT_USER }];
let dbCabs = [...INITIAL_CABS];
let dbRides: RideBooking[] = [...INITIAL_RIDES];
let dbRefreshments = [...REFRESHMENT_ITEMS];

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'RideNow yourgaadi.com Core Engine',
    version: '2.0.0',
    dbStats: {
      users: dbUsers.length,
      cabs: dbCabs.length,
      rides: dbRides.length,
    },
  });
});

// Authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password, phone, otp } = req.body;

  if (email) {
    const user = dbUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
      ...CURRENT_USER,
      email,
      name: email.split('@')[0],
    };
    return res.json({ success: true, user, token: 'mock-jwt-token-' + Date.now() });
  }

  if (phone) {
    // Valid phone verification
    const user = dbUsers.find(u => u.phone === phone) || {
      ...CURRENT_USER,
      phone,
      name: 'Mobile Traveler',
    };
    return res.json({ success: true, user, token: 'mock-jwt-otp-' + Date.now() });
  }

  res.status(400).json({ error: 'Please provide either email or phone' });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, role } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const newUser: UserProfile = {
    id: 'usr_' + Date.now(),
    name,
    email,
    phone: phone || '+1 (555) 000-0000',
    role: role || 'passenger',
    walletBalance: 100.0,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    savedAddresses: [],
    paymentMethods: [
      { id: 'pm_wallet_new', type: 'wallet', label: 'RidePay Gaadi Balance ($100.00)', isDefault: true },
    ],
  };

  dbUsers.push(newUser);
  res.status(201).json({ success: true, user: newUser });
});

// Cabs & Fleet
app.get('/api/cabs', (req, res) => {
  res.json({ success: true, cabs: dbCabs });
});

app.get('/api/refreshments', (req, res) => {
  res.json({ success: true, refreshments: dbRefreshments });
});

// Rides
app.get('/api/rides', (req, res) => {
  res.json({ success: true, rides: dbRides });
});

app.get('/api/rides/:id', (req, res) => {
  const ride = dbRides.find(r => r.id === req.params.id);
  if (!ride) {
    return res.status(404).json({ error: 'Ride not found' });
  }
  res.json({ success: true, ride });
});

app.post('/api/rides', (req, res) => {
  const newBooking: RideBooking = {
    ...req.body,
    id: req.body.id || 'RN-' + Math.floor(10000 + Math.random() * 90000),
    createdAt: new Date().toISOString(),
    status: req.body.status || 'requested',
    currentProgressPercent: 0,
    speedKmh: 45,
  };

  dbRides.unshift(newBooking);
  res.status(201).json({ success: true, ride: newBooking });
});

app.patch('/api/rides/:id', (req, res) => {
  const index = dbRides.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Ride not found' });
  }

  dbRides[index] = { ...dbRides[index], ...req.body };
  res.json({ success: true, ride: dbRides[index] });
});

app.post('/api/rides/:id/refreshment', (req, res) => {
  const ride = dbRides.find(r => r.id === req.params.id);
  if (!ride) {
    return res.status(404).json({ error: 'Ride not found' });
  }

  const { item, quantity } = req.body;
  const existing = ride.refreshments.find(ref => ref.item.id === item.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    ride.refreshments.push({ item, quantity });
  }
  ride.totalPrice = Math.round((ride.totalPrice + item.price * quantity) * 100) / 100;

  res.json({ success: true, ride });
});

// Digital Wallet Top-up
app.post('/api/wallet/topup', (req, res) => {
  const { amount } = req.body;
  const numAmount = Number(amount) || 50;
  CURRENT_USER.walletBalance = Math.round((CURRENT_USER.walletBalance + numAmount) * 100) / 100;
  res.json({ success: true, walletBalance: CURRENT_USER.walletBalance });
});

// Vite Integration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 RideNow server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
