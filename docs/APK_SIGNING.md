# NammaRide

NammaRide is a free, owner-controlled auto-driver fleet application designed for self-hosted implementation.

## Core idea

This project is designed to allow a fleet owner to run a driver management and trip operation system without premium subscriptions, paid APIs, or vendor lock-in.

## Goals

- 100% free for drivers
- no paid subscription or premium access
- no in-app purchases
- no mandatory ads
- no hidden developer lock
- full source ownership
- owner-managed admin account
- self-hosted backend and database
- optional free services only

## Architecture

- Android app: Kotlin + Jetpack Compose
- backend: Node.js + Express
- database: PostgreSQL
- admin panel: React + Vite
- maps and location: OpenStreetMap-compatible open stack

## Repository structure

- `android/` — Android project
- `backend/` — Node.js API
- `database/` — PostgreSQL schema
- `admin/` — owner dashboard
- `docs/` — deployment, backup, signing docs

## Driver features

- driver registration
- mobile login
- online/offline mode
- live trip requests
- accept/reject actions
- pickup and destination details
- fare and distance display
- auto-accept settings
- earnings and trip history
- notifications
- navigation-ready flow

## Smart trip filter

- minimum fare threshold
- maximum pickup distance
- preferred distance
- preferred service area
- confirm-before-accept workflow

## Owner control

The project owner must retain control of:
- repository
- database
- environment secrets
- signing keystore
- APK release flow
- deployment infra

## Quick start

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Android

Open `android/` in Android Studio, sync Gradle, then run on emulator or device.

### Admin dashboard

```bash
cd admin
npm install
npm run dev
```

## Security

- no hardcoded admin credentials
- `.env` is required for secrets
- JWT secret is owner-managed
- API keys are stored in environment variables

## Documentation

- `docs/APK_SIGNING.md`
- `docs/OWNER_CONTROL.md`
- `docs/DEPLOYMENT.md`

## Important note

This project is a free, self-hosted starter platform for fleet operations and does not bypass or automate third-party ride apps. It is intended for authorized use by the owner and their drivers.
