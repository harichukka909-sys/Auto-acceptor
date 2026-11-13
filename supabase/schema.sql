CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  vehicle_number TEXT,
  is_online BOOLEAN DEFAULT FALSE,
  service_area TEXT,
  rating NUMERIC DEFAULT 5.0,
  total_trips INTEGER DEFAULT 0,
  today_earnings NUMERIC DEFAULT 0,
  cancelled_trips INTEGER DEFAULT 0,
  completed_trips INTEGER DEFAULT 0,
  auto_accept_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auto_accept_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  min_fare NUMERIC DEFAULT 200,
  max_distance_km NUMERIC DEFAULT 10,
  pickup_distance_km NUMERIC DEFAULT 3,
  preferred_areas TEXT[] DEFAULT ARRAY['Banaswadi'],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trip_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES drivers(id),
  customer_name TEXT,
  pickup_address TEXT NOT NULL,
  drop_address TEXT NOT NULL,
  pickup_lat DOUBLE PRECISION,
  pickup_lng DOUBLE PRECISION,
  drop_lat DOUBLE PRECISION,
  drop_lng DOUBLE PRECISION,
  fare NUMERIC NOT NULL,
  distance_km NUMERIC NOT NULL,
  duration_min INTEGER,
  status TEXT NOT NULL DEFAULT 'pending',
  booking_time TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trip_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trip_requests(id),
  driver_id UUID REFERENCES drivers(id),
  status TEXT NOT NULL,
  accepted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  earnings NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  polygon_geojson JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_name TEXT,
  action TEXT,
  entity_type TEXT,
  entity_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trip_requests_status ON trip_requests(status);
CREATE INDEX IF NOT EXISTS idx_trip_requests_driver_id ON trip_requests(driver_id);
CREATE INDEX IF NOT EXISTS idx_drivers_phone ON drivers(phone);
