# Smart Auto Trip Acceptor

A modern Android trip-acceptance application for auto-rickshaw / taxi drivers with a demo-ready backend and admin control panel.

## Overview

This repository contains:

- React Native Expo mobile app for drivers
- Node.js backend service for trip management and auto-accept logic
- Supabase-ready schema and API integration notes
- Admin dashboard for monitoring drivers and trips
- Setup instructions and deployment guidance

## Important

This project is designed for authorized fleet / partner integrations only. It does not use unauthorized third-party APIs, screen scraping, or automation against external apps. For production use, connect to your own approved backend or authorized ride platform APIs.

## Tech stack

- Frontend: React Native + Expo
- Backend: Node.js + Express
- Database: Supabase (schema included)
- Auth: Supabase Auth (ready for integration)
- Real-time: Firebase Cloud Messaging (integration-ready)
- Maps: Google Maps / Android location services

## Repository structure

- `app/` – driver mobile application
- `admin/` – admin dashboard
- `backend/` – Express API server
- `supabase/` – database schema
- `README.md` – project overview

## Quick start

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2. Mobile app

```bash
cd app
npm install
npm start
```

### 3. Admin dashboard

```bash
cd admin
npm install
npm run dev
```

## Android build

```bash
cd app
npx expo run:android
```

## Demo behavior

- Driver can toggle online/offline
- Pending trip cards appear in dashboard
- Auto-accept evaluates fare, pickup distance, and service area rules
- Manual accept and reject actions are supported
- Trip history is displayed in local demo data

## Production notes

- Store API keys in environment variables
- Use Supabase Row Level Security (RLS)
- Use Firebase for push notifications
- Use Google Maps API for route and navigation
- Connect authorized trip events with your fleet backend

## License

This project is provided as a starter implementation for internal fleet tooling and evaluation.
