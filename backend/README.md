# Backend notes

The Express service exposes the core trip and driver API. It includes a demo-mode fallback so you can test locally without a database connection.

## Routes

- `GET /health` – service health
- `POST /auth/register` – driver registration
- `POST /auth/login` – login using mobile number
- `GET /drivers/:driverId` – driver profile
- `POST /drivers/:driverId/toggle-online` – online/offline state
- `GET /trips/available` – pending trip requests
- `POST /trips/:tripId/accept` – accept a trip
- `POST /trips/:tripId/reject` – reject a trip
- `POST /auto-accept/config` – save auto-accept rules
- `GET /drivers/:driverId/dashboard` – driver dashboard stats
- `POST /trip-request/simulate` – create a new demo trip request

## Demo behavior

The server uses in-memory data by default so the application can be tested quickly without needing a database connection.

## Supabase integration

To connect to Supabase, add your project URL and keys to `.env` and replace in-memory logic with Supabase queries in a production branch.
