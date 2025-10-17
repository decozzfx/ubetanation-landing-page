# Production Deployment Instructions - Ubetanation Landing Page

## Overview

This guide provides comprehensive, step-by-step instructions for deploying the Ubetanation Landing Page to a production environment. The deployment includes server setup, application configuration, SSL certificates, domain setup, and monitoring.

## Prerequisites

- A domain name registered and ready for configuration
- SSH access to a VPS/server
- Basic knowledge of Linux command line

## Table of Contents

1. [Server Provisioning & Initial Setup](#1-server-provisioning--initial-setup)
2. [Prerequisites Installation](#2-prerequisites-installation)
3. [Application Deployment](#3-application-deployment)
4. [Database Setup](#4-database-setup)
5. [Environment Configuration](#5-environment-configuration)
6. [Nginx Configuration](#6-nginx-configuration)
7. [SSL Certificate Setup](#7-ssl-certificate-setup)
8. [Domain Configuration](#8-domain-configuration)
9. [Process Management (PM2)](#9-process-management-pm2)
10. [Monitoring and Logging](#10-monitoring-and-logging)
11. [Security Best Practices](#11-security-best-practices)
12. [Post-Deployment Verification](#12-post-deployment-verification)
13. [Maintenance & Updates](#13-maintenance--updates)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Server Provisioning & Initial Setup

### 1.1 Choose a Cloud Provider

Recommended providers:
- **DigitalOcean** - User-friendly, good documentation
- **Vultr** - Cost-effective, fast deployment
- **AWS EC2** - Enterprise-grade, extensive features
- **Linode** - Reliable, developer-friendly

### 1.2 Server Specifications

**Minimum Requirements:**
- **CPU:** 1-2 vCPUs
- **RAM:** 2-4 GB
- **Storage:** 25-50 GB SSD
- **OS:** Ubuntu Server 22.04 LTS (recommended)

**Recommended for Production:**
- **CPU:** 2-4 vCPUs
- **RAM:** 4-8 GB
- **Storage:** 50-100 GB SSD

### 1.3 Initial Server Security Setup

```bash
# Connect to your server
ssh root@YOUR_SERVER_IP

# Update system packages
apt update && apt upgrade -y

# Create a new user (replace 'ubeta' with your preferred username)
adduser ubeta

# Add user to sudo group
usermod -aG sudo ubeta

# Set up SSH key authentication for the new user
mkdir -p /home/ubeta/.ssh
cp /root/.ssh/authorized_keys /home/ubeta/.ssh/
chown -R ubeta:ubeta /home/ubeta/.ssh
chmod 700 /home/ubeta/.ssh
chmod 600 /home/ubeta/.ssh/authorized_keys

# Configure UFW firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Disable root login (edit SSH config)
nano /etc/ssh/sshd_config
```

In `/etc/ssh/sshd_config`, set:
```
PermitRootLogin no
PasswordAuthentication no
```

```bash
# Restart SSH service
systemctl restart ssh

# Exit and reconnect as the new user
exit
ssh ubeta@YOUR_SERVER_IP
```

---

## 2. Prerequisites Installation

### 2.1 Install Node.js (via NVM)

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload bash profile
source ~/.bashrc

# Install latest LTS Node.js
nvm install --lts
nvm use --lts
nvm alias default node

# Verify installation
node --version
npm --version
```

### 2.2 Install Git

```bash
sudo apt install git -y
git --version
```

### 2.3 Install Nginx

```bash
sudo apt install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify installation
sudo systemctl status nginx
```

### 2.4 Install PM2 Process Manager

```bash
npm install -g pm2

# Verify installation
pm2 --version
```

### 2.5 Install Additional Tools

```bash
# Install build essentials
sudo apt install build-essential -y

# Install htop for monitoring
sudo apt install htop -y

# Install certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

---

## 3. Application Deployment

### 3.1 Clone the Repository

```bash
# Navigate to web directory
cd /var/www

# Clone the repository (replace with your actual repo URL)
sudo git clone https://github.com/your-username/ubetanation-landing-page.git
sudo chown -R ubeta:ubeta ubetanation-landing-page

# Navigate to project directory
cd ubetanation-landing-page
```

### 3.2 Install Dependencies

```bash
# Install project dependencies
npm install

# Install additional production dependencies if needed
npm install sharp @next/bundle-analyzer
```

### 3.3 Build the Application

```bash
# Build for production
npm run build

# Verify build success
ls -la .next
```

---

## 4. Database Setup

### 4.1 Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Optional: Seed database with initial data
npx prisma db seed
```

---

## 5. Environment Configuration

### 5.1 Create Production Environment File

```bash
# Create production environment file
cp .env.example .env.production

# Edit environment variables
nano .env.production
```

### 5.2 Required Environment Variables

```bash
# Database
DATABASE_URL="file:./db.sqlite"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
AUTH_SECRET="your-auth-secret-key-min-32-chars"

# Application
NEXTAUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# Email (if using contact forms)
SMTP_HOST="smtp.your-provider.com"
SMTP_PORT="587"
SMTP_USER="your-email@domain.com"
SMTP_PASSWORD="your-email-password"

# Analytics (optional)
GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"
GOOGLE_SITE_VERIFICATION="your-site-verification"

# Security
CSRF_SECRET="your-csrf-secret-key"

# Upload limits
MAX_FILE_SIZE="10485760"  # 10MB
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/gif,image/webp"
```

### 5.3 Set Environment Variables

```bash
# For system-wide environment variables
sudo nano /etc/environment

# Add your variables:
# NEXTAUTH_URL="https://yourdomain.com"
# NODE_ENV="production"

# Apply changes
source /etc/environment
```

---

## 6. Nginx Configuration

### 6.1 Create Nginx Server Block

```bash
# Create new server block configuration
sudo nano /etc/nginx/sites-available/ubetanation
```

### 6.2 Nginx Configuration Content

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect to HTTPS (will be configured later)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL configuration (certificates will be added by Certbot)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Root directory
    root /var/www/ubetanation-landing-page/.next;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        text/csv
        application/javascript
        application/xml+rss
        application/rss+xml
        application/atom+xml
        image/svg+xml
        application/json
        application/ld+json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri $uri/ =404;
    }

    # Handle Next.js static files
    location /_next/static/ {
        alias /var/www/ubetanation-landing-page/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle API routes and dynamic content
    location / {
        try_files $uri $uri.html $uri/ @nextjs;
    }

    # Proxy to Next.js application
    location @nextjs {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
    }

    # Handle uploads
    location /api/upload {
        proxy_pass http://localhost:3000;
        client_max_body_size 10M;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Admin routes
    location /admin {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Block access to sensitive files
    location ~ /\. {
        deny all;
    }

    location ~ /\.env {
        deny all;
    }

    # Robots.txt
    location = /robots.txt {
        try_files $uri @nextjs;
    }

    # Sitemap
    location = /sitemap.xml {
        try_files $uri @nextjs;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### 6.3 Enable the Site

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/ubetanation /etc/nginx/sites-enabled/

# Remove default site
sudo unlink /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 7. SSL Certificate Setup

### 7.1 Obtain SSL Certificate with Certbot

```bash
# Obtain certificate for your domain
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts:
# - Enter email address for notifications
# - Agree to terms of service
# - Choose whether to share email with EFF
# - Select redirect option (recommend option 2)
```

### 7.2 Test SSL Certificate

```bash
# Test certificate renewal
sudo certbot renew --dry-run
```

### 7.3 Set Up Automatic Renewal

```bash
# Edit crontab
sudo crontab -e

# Add renewal cron job (runs twice daily)
0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 8. Domain Configuration

### 8.1 DNS Configuration

Configure the following DNS records at your domain registrar:

```
Type    Name    Value               TTL
A       @       YOUR_SERVER_IP      3600
A       www     YOUR_SERVER_IP      3600
AAAA    @       YOUR_IPv6_IP        3600 (if available)
AAAA    www     YOUR_IPv6_IP        3600 (if available)
```

### 8.2 Verify DNS Propagation

```bash
# Check DNS propagation
nslookup yourdomain.com
nslookup www.yourdomain.com

# Test from different locations
dig yourdomain.com @8.8.8.8
dig yourdomain.com @1.1.1.1
```

---

## 9. Process Management (PM2)

### 9.1 Create PM2 Ecosystem File

```bash
# Create PM2 configuration
nano ecosystem.config.js
```

### 9.2 PM2 Configuration Content

```javascript
module.exports = {
  apps: [
    {
      name: 'ubetanation-landing-page',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/ubetanation-landing-page',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      log_file: '/var/log/ubetanation/combined.log',
      out_file: '/var/log/ubetanation/out.log',
      error_file: '/var/log/ubetanation/error.log',
      time: true
    }
  ]
}
```

### 9.3 Set Up PM2

```bash
# Create log directory
sudo mkdir -p /var/log/ubetanation
sudo chown -R ubeta:ubeta /var/log/ubetanation

# Start application with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 process list
pm2 save

# Generate startup script
pm2 startup

# Follow the instructions provided by the startup command
# It will show you a command to run with sudo

# Verify PM2 is running
pm2 status
pm2 logs ubetanation-landing-page
```

---

## 10. Monitoring and Logging

### 10.1 Set Up Log Rotation

```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/ubetanation
```

```bash
/var/log/ubetanation/*.log {
    daily
    missingok
    rotate 52
    compress
    notifempty
    create 644 ubeta ubeta
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 10.2 Configure Nginx Logging

```bash
# Edit Nginx configuration to add custom logging
sudo nano /etc/nginx/sites-available/ubetanation
```

Add to server block:
```nginx
# Custom log format
log_format detailed '$remote_addr - $remote_user [$time_local] '
                   '"$request" $status $body_bytes_sent '
                   '"$http_referer" "$http_user_agent" '
                   '$request_time $upstream_response_time';

# Access logs
access_log /var/log/nginx/ubetanation.access.log detailed;
error_log /var/log/nginx/ubetanation.error.log warn;
```

### 10.3 Set Up System Monitoring

```bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y

# Create monitoring script
nano /home/ubeta/monitor.sh
```

```bash
#!/bin/bash
# Simple monitoring script

echo "=== System Status $(date) ==="
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)"

echo -e "\nMemory Usage:"
free -h

echo -e "\nDisk Usage:"
df -h

echo -e "\nNginx Status:"
systemctl is-active nginx

echo -e "\nPM2 Status:"
pm2 status

echo -e "\nApplication Logs (last 10 lines):"
tail -n 10 /var/log/ubetanation/error.log
```

```bash
# Make script executable
chmod +x /home/ubeta/monitor.sh

# Add to crontab for regular monitoring
crontab -e

# Add line for hourly monitoring report
0 * * * * /home/ubeta/monitor.sh >> /var/log/ubetanation/monitor.log 2>&1
```

---

## 11. Security Best Practices

### 11.1 System Security

```bash
# Install fail2ban for intrusion prevention
sudo apt install fail2ban -y

# Configure fail2ban
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
```

```bash
# Start and enable fail2ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### 11.2 Application Security

```bash
# Set proper file permissions
sudo chown -R ubeta:www-data /var/www/ubetanation-landing-page
sudo find /var/www/ubetanation-landing-page -type f -exec chmod 644 {} \;
sudo find /var/www/ubetanation-landing-page -type d -exec chmod 755 {} \;

# Secure environment files
sudo chmod 600 /var/www/ubetanation-landing-page/.env*

# Set up automatic security updates
sudo apt install unattended-upgrades -y
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
```

### 11.3 Backup Strategy

```bash
# Create backup script
nano /home/ubeta/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/ubeta/backups"
DATE=$(date +%Y%m%d_%H%M%S)
PROJECT_DIR="/var/www/ubetanation-landing-page"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz -C /var/www ubetanation-landing-page

# Backup database
cp $PROJECT_DIR/prisma/db.sqlite $BACKUP_DIR/db_backup_$DATE.sqlite

# Backup configuration files
tar -czf $BACKUP_DIR/config_backup_$DATE.tar.gz /etc/nginx/sites-available/ubetanation /etc/letsencrypt/

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*backup*" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Make backup script executable
chmod +x /home/ubeta/backup.sh

# Schedule daily backups
crontab -e

# Add daily backup at 2 AM
0 2 * * * /home/ubeta/backup.sh >> /var/log/ubetanation/backup.log 2>&1
```

---

## 12. Post-Deployment Verification

### 12.1 Functionality Testing

```bash
# Test application status
pm2 status

# Test Nginx configuration
sudo nginx -t

# Check SSL certificate
curl -I https://yourdomain.com

# Test application response
curl -I https://yourdomain.com
```

### 12.2 Performance Testing

```bash
# Install Apache Bench for load testing
sudo apt install apache2-utils -y

# Basic load test
ab -n 100 -c 10 https://yourdomain.com/

# Test specific pages
ab -n 50 -c 5 https://yourdomain.com/about
ab -n 50 -c 5 https://yourdomain.com/services
```

### 12.3 Security Verification

```bash
# Test SSL rating
curl -s "https://api.ssllabs.com/api/v3/analyze?host=yourdomain.com" | jq '.grade'

# Check security headers
curl -I https://yourdomain.com

# Verify firewall status
sudo ufw status
```

### 12.4 SEO and Analytics Verification

1. **Google Search Console:**
   - Submit sitemap: `https://yourdomain.com/sitemap.xml`
   - Verify site ownership
   - Check for crawl errors

2. **Google Analytics:**
   - Verify tracking code installation
   - Test real-time data collection

3. **Performance Testing:**
   - Test with Google PageSpeed Insights
   - Check Core Web Vitals
   - Verify mobile responsiveness

---

## 13. Maintenance & Updates

### 13.1 Regular Update Procedure

```bash
# Create update script
nano /home/ubeta/update.sh
```

```bash
#!/bin/bash
PROJECT_DIR="/var/www/ubetanation-landing-page"
cd $PROJECT_DIR

echo "Starting update process..."

# Backup before update
/home/ubeta/backup.sh

# Pull latest changes
git pull origin main

# Install/update dependencies
npm ci

# Run database migrations if needed
npx prisma migrate deploy

# Rebuild application
npm run build

# Restart PM2 processes
pm2 restart ubetanation-landing-page

# Reload Nginx configuration
sudo nginx -t && sudo systemctl reload nginx

echo "Update completed successfully!"
```

```bash
# Make update script executable
chmod +x /home/ubeta/update.sh
```

### 13.2 System Maintenance

```bash
# Monthly system update (add to cron)
# 0 4 1 * * apt update && apt upgrade -y && reboot
```

---

## 14. Troubleshooting

### 14.1 Common Issues and Solutions

**Issue: Application won't start**
```bash
# Check PM2 logs
pm2 logs ubetanation-landing-page

# Check system resources
htop
df -h

# Restart services
pm2 restart ubetanation-landing-page
sudo systemctl restart nginx
```

**Issue: SSL Certificate Problems**
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew --force-renewal

# Test certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

**Issue: High Memory Usage**
```bash
# Check memory usage
free -h
pm2 monit

# Restart application if needed
pm2 restart ubetanation-landing-page
```

**Issue: 502 Bad Gateway**
```bash
# Check if application is running
pm2 status

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Verify proxy configuration in Nginx
sudo nginx -t
```

### 14.2 Emergency Procedures

**Complete System Restore:**
```bash
# Stop services
pm2 stop all
sudo systemctl stop nginx

# Restore from backup
cd /home/ubeta/backups
tar -xzf app_backup_YYYYMMDD_HHMMSS.tar.gz -C /var/www/

# Restart services
sudo systemctl start nginx
pm2 start ecosystem.config.js
```

### 14.3 Monitoring Commands

```bash
# Real-time monitoring
pm2 monit
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/ubetanation/error.log

# System health check
systemctl status nginx
systemctl status fail2ban
pm2 status
```

---

## 15. Support and Documentation

### 15.1 Log Locations

- **Application logs:** `/var/log/ubetanation/`
- **Nginx logs:** `/var/log/nginx/`
- **PM2 logs:** `~/.pm2/logs/`
- **System logs:** `/var/log/syslog`

### 15.2 Configuration Files

- **Nginx:** `/etc/nginx/sites-available/ubetanation`
- **PM2:** `/var/www/ubetanation-landing-page/ecosystem.config.js`
- **Environment:** `/var/www/ubetanation-landing-page/.env.production`
- **SSL:** `/etc/letsencrypt/`

### 15.3 Useful Commands Reference

```bash
# PM2 commands
pm2 start|stop|restart|reload [app-name]
pm2 logs [app-name]
pm2 monit
pm2 save
pm2 resurrect

# Nginx commands
sudo nginx -t              # Test configuration
sudo systemctl reload nginx # Reload configuration
sudo systemctl restart nginx # Restart service

# SSL commands
sudo certbot renew         # Renew certificates
sudo certbot certificates  # List certificates

# System monitoring
htop                       # Process monitor
df -h                      # Disk usage
free -h                    # Memory usage
netstat -tlnp              # Network connections
```

---

## Conclusion

Your Ubetanation Landing Page is now successfully deployed to production! This guide covered all essential aspects of deployment including security, performance, monitoring, and maintenance.

**Next Steps:**
1. Set up monitoring dashboards
2. Configure automated alerts
3. Plan regular maintenance windows
4. Document any custom configurations

**Important Reminders:**
- Keep all software updated
- Monitor logs regularly
- Test backups periodically
- Review security configurations quarterly

For support or questions, refer to the troubleshooting section or consult the application documentation.