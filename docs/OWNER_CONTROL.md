# Deployment guide

## Local development

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Admin dashboard

```bash
cd admin
npm install
npm run dev
```

### Android app

Open the `android/` project in Android Studio and run it on a connected device or emulator.

## Self-hosted production

1. provision a Linux server
2. install Node.js and PostgreSQL
3. clone the repo
4. configure environment variables
5. create the database
6. run the backend with a process manager such as PM2
7. deploy the admin dashboard behind a reverse proxy
8. generate and sign APKs using the project owner's keystore

## Reverse proxy example

```nginx
server {
  listen 80;
  server_name api.yourdomain.com;

  location / {
    proxy_pass http://localhost:4000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

## Owner control checklist

- repo in owner account
- DB in owner account
- env secrets in owner environment
- keystore kept by owner
- release uploads done by owner
- no vendor lock-in
