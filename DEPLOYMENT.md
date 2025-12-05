# Deployment Guide - Training Platform

## Local Development

### 1. Setup PostgreSQL Database

```bash
# Windows
psql -U postgres -d postgres -a -f script.sql

# macOS (if installed via Homebrew)
psql -U postgres -d postgres -a -f script.sql

# Linux
sudo -u postgres psql -d postgres -a -f script.sql
```

Verify database was created:
```bash
psql -U postgres -l
# Look for "training_platform" in the list
```

### 2. Start Backend Server

```bash
cd backend

# Copy .env.example to .env and update values
cp .env.example .env
# Edit .env with your Stripe keys and database credentials

# Install dependencies
npm install

# Run server
npm start
# Should see: "Server running on port 5000"
```

### 3. Start Frontend

```bash
cd frontend

# Copy .env.example to .env (optional)
cp .env.example .env

# Install dependencies
npm install

# Run dev server
npm run dev
# Should see: "Local: http://localhost:5173"
```

### Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Database: PostgreSQL on localhost:5432

---

## Production Deployment

### Option 1: Heroku (Backend) + Vercel (Frontend)

#### Backend on Heroku

1. **Install Heroku CLI**
   ```bash
   # https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create Heroku App**
   ```bash
   heroku create your-app-name
   heroku addons:create heroku-postgresql:hobby-dev
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your-production-secret-key
   heroku config:set STRIPE_SECRET_KEY=sk_live_...
   heroku config:set STRIPE_WEBHOOK_SECRET=whsec_...
   heroku config:set FRONTEND_URL=https://your-frontend.vercel.app
   ```

4. **Initialize Database**
   ```bash
   heroku pg:psql < script.sql
   # Or run through pgAdmin interface
   ```

5. **Deploy**
   ```bash
   git push heroku main
   heroku logs --tail
   ```

#### Frontend on Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   # Follow prompts
   ```

3. **Set Environment Variables in Vercel Dashboard**
   ```
   VITE_API_URL=https://your-app-name.herokuapp.com/api
   ```

4. **Redeploy**
   ```bash
   vercel --prod
   ```

---

### Option 2: AWS (Backend) + CloudFlare Pages (Frontend)

#### Backend on AWS EC2

1. **Launch EC2 Instance**
   - AMI: Ubuntu 22.04 LTS
   - Instance type: t3.micro (free tier)
   - Security groups: Allow ports 80, 443, 5000

2. **SSH into Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm postgresql postgresql-contrib
   ```

4. **Setup Database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE training_platform;
   \q
   psql -U postgres -d training_platform -a -f script.sql
   ```

5. **Deploy Backend**
   ```bash
   git clone your-repo backend
   cd backend
   cp .env.example .env
   # Edit .env with production values
   npm install
   npm start
   ```

6. **Setup PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name "training-platform"
   pm2 startup
   pm2 save
   ```

7. **Setup Nginx (Reverse Proxy)**
   ```bash
   sudo apt install -y nginx
   sudo nano /etc/nginx/sites-available/default
   ```

   Edit to:
   ```nginx
   server {
     listen 80 default_server;
     server_name your-domain.com;

     location / {
       proxy_pass http://localhost:5000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

   ```bash
   sudo systemctl restart nginx
   ```

#### Frontend on Cloudflare Pages

1. **Deploy via Git**
   - Connect your GitHub repo to Cloudflare Pages
   - Build command: `npm run build`
   - Build output: `dist`

2. **Set Environment Variables**
   - `VITE_API_URL`: https://your-backend-domain.com/api

3. **Add Custom Domain**
   - Configure DNS in Cloudflare dashboard

---

### Option 3: Docker + Docker Compose (Local Deployment)

1. **Create Dockerfile for Backend**

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY server.js .

ENV PORT=5000
EXPOSE 5000

CMD ["npm", "start"]
```

2. **Create Dockerfile for Frontend**

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

3. **Create docker-compose.yml**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: training_platform
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - ./script.sql:/docker-entrypoint-initdb.d/script.sql
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    environment:
      DB_USER: postgres
      DB_PASSWORD: postgres
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: training_platform
      JWT_SECRET: your-secret-key
      STRIPE_SECRET_KEY: sk_test_...
      PORT: 5000
    ports:
      - "5000:5000"
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      VITE_API_URL: http://localhost:5000/api

volumes:
  postgres_data:
```

4. **Deploy**
   ```bash
   docker-compose up -d
   ```

---

## SSL Certificate Setup

### Using Let's Encrypt with Nginx

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
sudo nano /etc/nginx/sites-available/default
```

Update Nginx config:
```nginx
server {
  listen 443 ssl;
  server_name your-domain.com;

  ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

  location / {
    proxy_pass http://localhost:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}

server {
  listen 80;
  server_name your-domain.com;
  return 301 https://$server_name$request_uri;
}
```

---

## Stripe Webhook Setup

### Testing Locally with Stripe CLI

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login to your account
stripe login

# Forward webhook events to your local server
stripe listen --forward-to localhost:5000/api/webhook/stripe

# Get webhook secret
# Set STRIPE_WEBHOOK_SECRET in your .env
```

### Production Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://your-domain.com/api/webhook/stripe`
3. Select event: `checkout.session.completed`
4. Get signing secret and add to production `.env`

---

## Database Backup & Restore

### PostgreSQL Backup

```bash
# Create backup
pg_dump -U postgres training_platform > backup.sql

# Restore backup
psql -U postgres -d training_platform < backup.sql
```

### Automated Daily Backups (AWS RDS)

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h your-rds-endpoint.amazonaws.com -U postgres training_platform > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-bucket/backups/
rm backup_$DATE.sql
```

Add to crontab:
```bash
0 2 * * * /path/to/backup.sh
```

---

## Monitoring & Logging

### Heroku Logs
```bash
heroku logs --tail
heroku logs --tail --dyno web
```

### AWS CloudWatch
- Monitor EC2 instances
- View application logs in `/var/log/`

### PM2 Monitoring
```bash
pm2 monit
pm2 logs
pm2 logs --err
```

---

## Performance Optimization

### Frontend
- Enable GZIP compression in Nginx
- Use CDN for static assets
- Optimize images
- Enable browser caching

### Backend
- Connection pooling for database
- Redis caching (optional)
- API rate limiting
- Database indexes on frequently queried columns

---

## Troubleshooting

### 502 Bad Gateway on Heroku
```bash
heroku restart
heroku logs --tail
```

### Database Connection Issues
```bash
# Check connection
psql -U postgres -h localhost -d training_platform

# Reset connection pool
heroku pg:reset DATABASE
```

### Stripe Webhook Not Firing
- Verify webhook secret is correct
- Check endpoint URL is accessible
- Use Stripe CLI to test locally

### CORS Errors
- Verify `FRONTEND_URL` in backend `.env`
- Check `VITE_API_URL` in frontend `.env`
- Backend must have `CORS` enabled
