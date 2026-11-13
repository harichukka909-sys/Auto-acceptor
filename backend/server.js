const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const demoDrivers = [
  {
    id: 'driver_101',
    name: 'Ravi Kumar',
    phone: '+91 98765 43210',
    isOnline: true,
    totalTrips: 148,
    todayEarnings: 3420,
    completedTrips: 27,
    cancelledTrips: 3,
    rating: 4.8,
    serviceArea: 'Banaswadi',
    autoAcceptEnabled: true,
    autoAcceptRules: {
      minFare: 180,
      maxDistanceKm: 8,
      pickupDistanceKm: 2.5,
      preferredAreas: ['Banaswadi', 'HRBR', 'Kalyan Nagar']
    }
  }
];

const demoTrips = [
  {
    id: 'trip_1001',
    customerName: 'Nisha',
    pickupAddress: 'Banaswadi Main Road',
    dropAddress: 'Kalyan Nagar 4th Block',
    pickupCoords: { lat: 13.0215, lng: 77.6467 },
    dropCoords: { lat: 13.0341, lng: 77.6476 },
    fare: 290,
    distanceKm: 4.8,
    durationMin: 18,
    status: 'pending',
    bookingTime: '2026-11-13T09:12:00Z',
    driverId: null,
    serviceArea: 'Banaswadi'
  },
  {
    id: 'trip_1002',
    customerName: 'Arjun',
    pickupAddress: 'HRBR Layout',
    dropAddress: 'Indiranagar',
    fare: 420,
    distanceKm: 7.2,
    durationMin: 22,
    status: 'pending',
    bookingTime: '2026-11-13T09:14:00Z',
    pickupCoords: { lat: 13.0224, lng: 77.6444 },
    dropCoords: { lat: 12.9797, lng: 77.6408 },
    driverId: null,
    serviceArea: 'HRBR'
  }
];

const getDriverById = (driverId) => demoDrivers.find((driver) => driver.id === driverId) || demoDrivers[0];

const evaluateAutoAccept = (trip, driver) => {
  const rules = driver.autoAcceptRules || {};
  const fareOk = trip.fare >= (rules.minFare || 0);
  const distanceOk = trip.distanceKm <= (rules.maxDistanceKm || 999);
  const pickupDistanceOk = trip.distanceKm <= (rules.pickupDistanceKm || 999);
  const areaOk = !rules.preferredAreas?.length || rules.preferredAreas.includes(trip.serviceArea);

  return fareOk && distanceOk && pickupDistanceOk && areaOk;
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'smart-auto-trip-acceptor-backend' });
});

app.post('/auth/register', (req, res) => {
  const { name, phone, vehicleNumber } = req.body || {};

  if (!name || !phone) {
    return res.status(400).json({ message: 'Name and phone are required' });
  }

  const driver = {
    id: `driver_${Date.now()}`,
    name,
    phone,
    vehicleNumber: vehicleNumber || 'KA-01-AB-1234',
    isOnline: false,
    totalTrips: 0,
    todayEarnings: 0,
    completedTrips: 0,
    cancelledTrips: 0,
    rating: 5.0,
    serviceArea: 'Banaswadi',
    autoAcceptEnabled: false,
    autoAcceptRules: {
      minFare: 200,
      maxDistanceKm: 10,
      pickupDistanceKm: 3,
      preferredAreas: ['Banaswadi']
    }
  };

  demoDrivers.unshift(driver);

  return res.status(201).json({ message: 'Driver registered successfully', driver });
});

app.post('/auth/login', (req, res) => {
  const { phone } = req.body || {};

  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  const driver = demoDrivers.find((item) => item.phone === phone) || demoDrivers[0];

  return res.json({ message: 'Login successful', driver });
});

app.get('/drivers/:driverId', (req, res) => {
  const driver = getDriverById(req.params.driverId);
  res.json({ driver });
});

app.post('/drivers/:driverId/toggle-online', (req, res) => {
  const driver = getDriverById(req.params.driverId);
  driver.isOnline = !driver.isOnline;
  res.json({ message: 'Online status updated', driver });
});

app.get('/trips/available', (req, res) => {
  const availableTrips = demoTrips.filter((trip) => trip.status === 'pending');
  res.json({ trips: availableTrips });
});

app.post('/trips/:tripId/accept', (req, res) => {
  const { driverId } = req.body || {};
  const trip = demoTrips.find((item) => item.id === req.params.tripId);

  if (!trip) {
    return res.status(404).json({ message: 'Trip not found' });
  }

  if (trip.status !== 'pending') {
    return res.status(400).json({ message: 'Trip is no longer pending' });
  }

  trip.status = 'accepted';
  trip.driverId = driverId || 'driver_101';

  return res.json({ message: 'Trip accepted successfully', trip });
});

app.post('/trips/:tripId/reject', (req, res) => {
  const trip = demoTrips.find((item) => item.id === req.params.tripId);

  if (!trip) {
    return res.status(404).json({ message: 'Trip not found' });
  }

  trip.status = 'cancelled';
  return res.json({ message: 'Trip rejected successfully', trip });
});

app.post('/auto-accept/config', (req, res) => {
  const { driverId, config } = req.body || {};
  const driver = getDriverById(driverId);

  driver.autoAcceptEnabled = !!config.autoAcceptEnabled;
  driver.autoAcceptRules = {
    minFare: config.minFare ?? 200,
    maxDistanceKm: config.maxDistanceKm ?? 10,
    pickupDistanceKm: config.pickupDistanceKm ?? 3,
    preferredAreas: config.preferredAreas || ['Banaswadi']
  };

  return res.json({ message: 'Auto-accept configuration updated', driver });
});

app.get('/drivers/:driverId/dashboard', (req, res) => {
  const driver = getDriverById(req.params.driverId);
  const recentTrips = demoTrips.filter((trip) => trip.driverId === driver.id || trip.status === 'accepted');

  return res.json({
    driver,
    stats: {
      totalTrips: driver.totalTrips,
      todayEarnings: driver.todayEarnings,
      completedTrips: driver.completedTrips,
      cancelledTrips: driver.cancelledTrips,
      availableTripRequests: demoTrips.filter((trip) => trip.status === 'pending').length
    },
    recentTrips
  });
});

app.post('/trip-request/simulate', (req, res) => {
  const driver = getDriverById(req.body.driverId || 'driver_101');
  const trip = {
    id: `trip_${Date.now()}`,
    customerName: req.body.customerName || 'Demo Customer',
    pickupAddress: req.body.pickupAddress || 'MG Road',
    dropAddress: req.body.dropAddress || 'Whitefield',
    pickupCoords: { lat: 13.0215, lng: 77.6467 },
    dropCoords: { lat: 12.9979, lng: 77.6941 },
    fare: req.body.fare || 360,
    distanceKm: req.body.distanceKm || 6.8,
    durationMin: req.body.durationMin || 22,
    status: 'pending',
    bookingTime: new Date().toISOString(),
    serviceArea: req.body.serviceArea || driver.serviceArea,
    driverId: null
  };

  const autoAccepted = driver.autoAcceptEnabled && evaluateAutoAccept(trip, driver);

  if (autoAccepted) {
    trip.status = 'accepted';
    trip.driverId = driver.id;
  }

  demoTrips.unshift(trip);

  return res.json({ message: autoAccepted ? 'Trip auto-accepted' : 'Trip queued for manual accept', trip });
});

app.listen(PORT, () => {
  console.log(`Smart Auto Trip Acceptor backend running on http://localhost:${PORT}`);
});
