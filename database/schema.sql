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

Open `android/` in Android Studio and run on emulator or device.

## Self-hosted production

1. Provision a Linux server
2. install Node.js and PostgreSQL
3. clone the repository
4. configure environment variables
5. create the database
6. run backend with PM2 or systemd
7. deploy admin panel behind NGINX if needed
8. release APKs using the owner's keystore

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
