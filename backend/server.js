const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'development_secret_change_me';
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/nammaride';

const pool = new Pool({ connectionString: DATABASE_URL });

const demoDrivers = [
  {
    id: 'driver_101',
    fullName: 'Ravi Kumar',
    phone: '+919876543210',
    email: 'ravi@example.com',
    vehicleNumber: 'KA-01-AB-1234',
    isOnline: true,
    rating: 4.9,
    serviceArea: 'Banaswadi',
    totalTrips: 148,
    todayEarnings: 3420,
    completedTrips: 27,
    cancelledTrips: 3,
    autoAcceptRules: {
      enabled: true,
      minFare: 200,
      maxPickupDistanceKm: 8,
      preferredDistanceKm: 10,
      preferredArea: 'Banaswadi'
    }
  }
];

const demoTrips = [
  {
    id: 'trip_1001',
    customerName: 'Nisha',
    pickupAddress: 'MG Road',
    dropAddress: 'Whitefield',
    fare: 420,
    distanceKm: 8.6,
    durationMin: 22,
    status: 'pending',
    driverId: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'trip_1002',
    customerName: 'Sanjay',
    pickupAddress: 'Banaswadi',
    dropAddress: 'Indiranagar',
    fare: 310,
    distanceKm: 6.2,
    durationMin: 18,
    status: 'pending',
    driverId: null,
    createdAt: new Date().toISOString()
  }
];

app.use(cors());
app.use(express.json());

async function ensureDatabaseReady() {
  try {
    await pool.query('SELECT 1');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS drivers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name TEXT NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        email TEXT,
        password_hash TEXT NOT NULL,
        vehicle_number TEXT,
        is_online BOOLEAN DEFAULT FALSE,
        rating NUMERIC DEFAULT 5.0,
        service_area TEXT,
        total_trips INTEGER DEFAULT 0,
        today_earnings NUMERIC DEFAULT 0,
        completed_trips INTEGER DEFAULT 0,
        cancelled_trips INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'super_admin',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS trip_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        driver_id UUID REFERENCES drivers(id),
        customer_name TEXT NOT NULL,
        pickup_address TEXT NOT NULL,
        drop_address TEXT NOT NULL,
        pickup_lat DOUBLE PRECISION,
        pickup_lng DOUBLE PRECISION,
        drop_lat DOUBLE PRECISION,
        drop_lng DOUBLE PRECISION,
        fare NUMERIC NOT NULL,
        distance_km NUMERIC NOT NULL,
        duration_min INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'pending',
        booking_time TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS auto_accept_rules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
        enabled BOOLEAN DEFAULT FALSE,
        min_fare NUMERIC DEFAULT 0,
        max_pickup_distance_km NUMERIC DEFAULT 8,
        preferred_distance_km NUMERIC DEFAULT 10,
        preferred_area TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log('Database check passed');
  } catch (error) {
    console.warn('Database unavailable; using demo mode:', error.message);
  }
}

async function bootstrapAdmin() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.warn('Admin bootstrapping skipped because env vars are missing.');
    return;
  }

  try {
    const { rows } = await pool.query('SELECT * FROM admin_users WHERE email = $1', [process.env.ADMIN_EMAIL]);
    if (rows.length === 0) {
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await pool.query(
        'INSERT INTO admin_users (full_name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
        ['Project Owner', process.env.ADMIN_EMAIL, passwordHash, 'super_admin']
      );
      console.log('Super admin created');
    }
  } catch (error) {
    console.warn('Admin bootstrap could not complete in demo mode:', error.message);
  }
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

async function createDriverRecord({ fullName, phone, email, password, vehicleNumber }) {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO drivers (full_name, phone, email, password_hash, vehicle_number, is_online, service_area)
       VALUES ($1, $2, $3, $4, $5, false, 'Banaswadi')
       RETURNING id, full_name as "fullName", phone, email, vehicle_number as "vehicleNumber", is_online as "isOnline", service_area as "serviceArea"`,
      [fullName, phone, email, passwordHash, vehicleNumber || '']
    );
    return result.rows[0];
  } catch (error) {
    return null;
  }
}

async function findDriverByPhone(phone) {
  try {
    const result = await pool.query('SELECT * FROM drivers WHERE phone = $1', [phone]);
    return result.rows[0];
  } catch (error) {
    return null;
  }
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'nammaride-backend' });
});

app.post('/api/admin/bootstrap', async (req, res) => {
  await bootstrapAdmin();
  res.json({ message: 'Bootstrap completed' });
});

app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalDrivers: demoDrivers.length,
    onlineDrivers: demoDrivers.filter((d) => d.isOnline).length,
    activeTrips: demoTrips.filter((t) => t.status === 'pending').length,
    earningsToday: demoDrivers.reduce((sum, d) => sum + d.todayEarnings, 0)
  });
});

app.post('/api/auth/register', async (req, res) => {
  const { fullName, phone, email, password, vehicleNumber } = req.body || {};

  if (!fullName || !phone || !password) {
    return res.status(400).json({ message: 'fullName, phone, and password are required' });
  }

  const existing = await findDriverByPhone(phone);
  if (existing) {
    return res.status(409).json({ message: 'A driver with this phone number already exists' });
  }

  const created = await createDriverRecord({ fullName, phone, email, password, vehicleNumber });
  if (!created) {
    return res.status(500).json({ message: 'Driver registration failed' });
  }

  const token = signToken({ sub: created.id, role: 'driver' });
  return res.status(201).json({ token, driver: created });
});

app.post('/api/auth/login', async (req, res) => {
  const { phone, password } = req.body || {};

  if (!phone || !password) {
    return res.status(400).json({ message: 'Phone and password are required' });
  }

  const driver = await findDriverByPhone(phone);
  if (!driver) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, driver.password_hash);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken({ sub: driver.id, role: 'driver' });
  return res.json({
    token,
    driver: {
      id: driver.id,
      fullName: driver.full_name,
      phone: driver.phone,
      email: driver.email,
      vehicleNumber: driver.vehicle_number,
      isOnline: driver.is_online,
      serviceArea: driver.service_area,
      rating: driver.rating
    }
  });
});

app.get('/api/drivers', (req, res) => {
  res.json({ drivers: demoDrivers });
});

app.get('/api/drivers/:driverId', (req, res) => {
  const driver = demoDrivers.find((item) => item.id === req.params.driverId);
  if (!driver) {
    return res.status(404).json({ message: 'Driver not found' });
  }
  return res.json({ driver });
});

app.post('/api/drivers/:driverId/toggle-online', (req, res) => {
  const driver = demoDrivers.find((item) => item.id === req.params.driverId);
  if (!driver) {
    return res.status(404).json({ message: 'Driver not found' });
  }

  driver.isOnline = !driver.isOnline;
  return res.json({ message: 'Online status updated', driver });
});

app.get('/api/trips/available', (req, res) => {
  res.json({ trips: demoTrips.filter((trip) => trip.status === 'pending') });
});

app.post('/api/trips', (req, res) => {
  const trip = {
    id: `trip_${Date.now()}`,
    customerName: req.body.customerName || 'Customer',
    pickupAddress: req.body.pickupAddress || 'Pickup Location',
    dropAddress: req.body.dropAddress || 'Drop Location',
    fare: Number(req.body.fare || 300),
    distanceKm: Number(req.body.distanceKm || 5),
    durationMin: Number(req.body.durationMin || 20),
    status: 'pending',
    driverId: null,
    createdAt: new Date().toISOString()
  };

  demoTrips.unshift(trip);
  return res.status(201).json({ trip });
});

app.post('/api/trips/:tripId/accept', (req, res) => {
  const trip = demoTrips.find((item) => item.id === req.params.tripId);
  if (!trip) {
    return res.status(404).json({ message: 'Trip not found' });
  }

  trip.status = 'accepted';
  trip.driverId = req.body.driverId || 'driver_101';
  return res.json({ message: 'Trip accepted successfully', trip });
});

app.post('/api/trips/:tripId/reject', (req, res) => {
  const trip = demoTrips.find((item) => item.id === req.params.tripId);
  if (!trip) {
    return res.status(404).json({ message: 'Trip not found' });
  }

  trip.status = 'cancelled';
  return res.json({ message: 'Trip rejected successfully', trip });
});

app.post('/api/drivers/:driverId/auto-accept', (req, res) => {
  const driver = demoDrivers.find((item) => item.id === req.params.driverId);
  if (!driver) {
    return res.status(404).json({ message: 'Driver not found' });
  }

  driver.autoAcceptRules = {
    enabled: Boolean(req.body.enabled),
    minFare: Number(req.body.minFare || 0),
    maxPickupDistanceKm: Number(req.body.maxPickupDistanceKm || 8),
    preferredDistanceKm: Number(req.body.preferredDistanceKm || 10),
    preferredArea: req.body.preferredArea || 'Banaswadi'
  };

  return res.json({ message: 'Auto accept settings updated', rules: driver.autoAcceptRules });
});

app.get('/api/dashboard/:driverId', (req, res) => {
  const driver = demoDrivers.find((item) => item.id === req.params.driverId) || demoDrivers[0];
  res.json({
    driver,
    stats: {
      totalTrips: driver.totalTrips,
      todayEarnings: driver.todayEarnings,
      completedTrips: driver.completedTrips,
      cancelledTrips: driver.cancelledTrips,
      pendingTrips: demoTrips.filter((trip) => trip.status === 'pending').length
    },
    recentTrips: demoTrips.slice(0, 5)
  });
});

async function startServer() {
  await ensureDatabaseReady();
  await bootstrapAdmin();

  app.listen(PORT, () => {
    console.log(`NammaRide backend started on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Server startup failed', error);
  process.exit(1);
});
