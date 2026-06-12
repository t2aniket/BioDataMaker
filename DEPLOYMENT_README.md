# Production Deployment Guide: Free Biodata Maker

This guide describes how to deploy the **Free Biodata Maker** application on an Ubuntu 22.04 LTS server, with Nginx reverse proxy, PM2 process management, PostgreSQL database, and SSL certificates using Certbot.

---

## 1. System Requirements & Installation

Run the following commands on your Ubuntu server to update packages and install core dependencies:

```bash
# Update repositories
sudo apt update && sudo apt upgrade -y

# Install Node.js LTS (v20.x)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx & Git
sudo apt install -y nginx git
```

---

## 2. PostgreSQL Database Setup

Log in to the PostgreSQL prompt and create the database and database user:

```bash
sudo -i -u postgres psql

# Run inside SQL terminal:
CREATE DATABASE biodata_maker;
CREATE USER db_user WITH PASSWORD 'db_secure_password';
GRANT ALL PRIVILEGES ON DATABASE biodata_maker TO db_user;
ALTER DATABASE biodata_maker OWNER TO db_user;
\q
```

---

## 3. Clone Repository and Install Dependencies

```bash
# Clone the repository to the web folder
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone <repository_url> free-biodata-maker
cd free-biodata-maker

# Install dependencies
npm install
```

---

## 4. Environment Configuration

Copy the production environment file and configure variables:

```bash
cp .env.production.example .env
nano .env
```

Ensure you configure:
- `DATABASE_URL="postgresql://db_user:db_secure_password@localhost:5432/biodata_maker?schema=public"`
- `RAZORPAY_KEY_ID="rzp_live_your_actual_key_id"` (Live key)
- `RAZORPAY_KEY_SECRET="your_actual_live_key_secret"` (Live secret)
- `JWT_SECRET` (Strong random key)
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` (Your administrator credentials)

---

## 5. Prisma Setup and Database Seeding

Initialize the database tables and seed the template metadata:

```bash
# Sync database schema
npx prisma db push

# Run seeds to create templates & admin user
npx prisma db seed
```

---

## 6. Build Next.js Web App

Compile and bundle the production files:

```bash
npm run build
```

---

## 7. Process Management with PM2

Install PM2 globally and start the Next.js production server:

```bash
# Install PM2
sudo npm install -g pm2

# Start the application using cluster mode
pm2 start ecosystem.config.js

# Configure PM2 to start automatically on system reboot
pm2 save
pm2 startup
# (Copy and run the command printed by the screen output of the startup command)
```

---

## 8. Nginx Reverse Proxy Setup

Copy the example Nginx server block to site configurations:

```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/freebiodatamaker.com
sudo ln -s /etc/nginx/sites-available/freebiodatamaker.com /etc/nginx/sites-enabled/

# Test Nginx syntax and reload
sudo nginx -t
sudo systemctl reload nginx
```

---

## 9. Enable SSL certificates using Certbot

Install and configure Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx

# Request certificate (Certbot will edit your Nginx config automatically)
sudo certbot --nginx -d freebiodatamaker.com -d www.freebiodatamaker.com
```

---

## 10. Operational Command Reference

### Database Backups
Create a backup of the production database:
```bash
pg_dump -U db_user -h localhost -d biodata_maker -F c -b -v -f /var/backups/biodata_maker_$(date +%F).backup
```

### Database Restore
Restore a database from a backup file:
```bash
pg_restore -U db_user -h localhost -d biodata_maker -v /var/backups/biodata_maker_2026-06-13.backup
```

### Checking Application Logs
```bash
# PM2 logs
pm2 logs free-biodata-maker

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Restarting Application safely
```bash
# Hot reload code changes without dropping connections
pm2 reload free-biodata-maker

# Hard restart
pm2 restart free-biodata-maker
```
