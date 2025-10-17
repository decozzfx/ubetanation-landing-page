# Deployment Guide

This document provides comprehensive instructions for deploying the Ubetanation Landing Page to a production VPS environment.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [VPS Setup](#vps-setup)
4. [GitHub Actions CI/CD](#github-actions-cicd)
5. [Manual Deployment](#manual-deployment)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

## Overview

The deployment architecture consists of:

- **Application Server**: Next.js application managed by PM2
- **Reverse Proxy**: Nginx with SSL/TLS termination
- **Database**: SQLite with Prisma ORM
- **CI/CD**: GitHub Actions for automated deployments
- **SSL**: Let's Encrypt certificates with automatic renewal

## Prerequisites

### VPS Requirements

- **OS**: Ubuntu 22.04 LTS (recommended)
- **RAM**: Minimum 2GB, recommended 4GB+
- **Storage**: Minimum 20GB SSD
- **Network**: Public IPv4 address
- **Access**: SSH access with sudo privileges

### Domain Requirements

- Domain name pointing to your VPS IP
- DNS A records configured for your domain and www subdomain

### GitHub Repository

- Repository with the application code
- GitHub Actions enabled
- Repository secrets configured (see [GitHub Actions CI/CD](#github-actions-cicd))

## VPS Setup

### Automated Setup

1. **Upload setup script to your VPS:**
   ```bash
   scp scripts/vps-setup.sh user@your-vps-ip:~/
   ```

2. **Run the setup script:**
   ```bash
   ssh user@your-vps-ip
   chmod +x ~/vps-setup.sh
   ./vps-setup.sh
   ```

3. **Follow the interactive prompts** for SSL certificate setup.

### Manual Setup (if needed)

1. **Update system packages:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Node.js 20:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PM2:**
   ```bash
   sudo npm install -g pm2
   pm2 startup
   ```

4. **Install and configure Nginx:**
   ```bash
   sudo apt install nginx -y
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

5. **Setup firewall:**
   ```bash
   sudo ufw allow ssh
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```

6. **Clone and setup application:**
   ```bash
   sudo mkdir -p /var/www/ubetanation-landing-page
   sudo chown -R $USER:$USER /var/www/ubetanation-landing-page
   git clone <your-repo-url> /var/www/ubetanation-landing-page
   cd /var/www/ubetanation-landing-page
   npm ci --production
   ```

7. **Configure environment:**
   ```bash
   cp .env.example .env.production
   # Edit .env.production with your configuration
   ```

8. **Setup database:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

9. **Build application:**
   ```bash
   npm run build
   ```

10. **Configure Nginx:**
    ```bash
    sudo cp nginx/ubetanation.conf /etc/nginx/sites-available/
    sudo ln -s /etc/nginx/sites-available/ubetanation.conf /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl reload nginx
    ```

11. **Setup SSL with Let's Encrypt:**
    ```bash
    sudo snap install --classic certbot
    sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
    ```

12. **Start application with PM2:**
    ```bash
    pm2 start ecosystem.config.js
    pm2 save
    ```

## GitHub Actions CI/CD

### Required Secrets

Configure the following secrets in your GitHub repository (`Settings > Secrets and variables > Actions`):

| Secret Name | Description | Example |
|------------|-------------|---------|
| `VPS_HOST` | Your VPS IP address or domain | `192.168.1.100` |
| `VPS_USER` | SSH username | `ubuntu` |
| `VPS_SSH_KEY` | Private SSH key for VPS access | `-----BEGIN OPENSSH PRIVATE KEY-----...` |

### SSH Key Setup

1. **Generate SSH key pair** (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "github-actions@yourdomain.com"
   ```

2. **Add public key to VPS:**
   ```bash
   ssh-copy-id -i ~/.ssh/id_ed25519.pub user@your-vps-ip
   ```

3. **Add private key to GitHub secrets** as `VPS_SSH_KEY`

### Workflow Triggers

The CI/CD pipeline runs on:
- Push to `main` or `master` branch
- Pull requests to `main` or `master` branch

### Pipeline Stages

1. **Test**: Runs tests, linting, and type checking
2. **Build**: Creates and pushes Docker image (optional)
3. **Deploy**: Deploys to VPS and runs health checks
4. **Lighthouse**: Runs performance audits post-deployment

## Manual Deployment

For manual deployments or troubleshooting:

### Deploy Latest Code

```bash
# SSH to your VPS
ssh user@your-vps-ip

# Navigate to app directory
cd /var/www/ubetanation-landing-page

# Pull latest changes
git pull origin main

# Install dependencies
npm ci --production

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:push

# Build application
npm run build

# Restart PM2
pm2 reload ecosystem.config.js

# Reload Nginx (if config changed)
sudo nginx -t && sudo systemctl reload nginx
```

### Rollback Deployment

```bash
# SSH to your VPS
ssh user@your-vps-ip

# Navigate to app directory
cd /var/www/ubetanation-landing-page

# Check available backups
ls -la backup-*

# Restore from backup
cp -r backup-YYYYMMDD-HHMMSS/* current/

# Restart application
pm2 restart ubetanation-web
```

## Monitoring & Maintenance

### Health Checks

- **Application Health**: `https://yourdomain.com/api/health`
- **PM2 Status**: `pm2 status`
- **Nginx Status**: `sudo systemctl status nginx`
- **SSL Certificate**: `sudo certbot certificates`

### Logs

- **Application Logs**: `pm2 logs ubetanation-web`
- **Nginx Access**: `sudo tail -f /var/log/nginx/ubetanation.access.log`
- **Nginx Error**: `sudo tail -f /var/log/nginx/ubetanation.error.log`
- **System Logs**: `sudo journalctl -u nginx -f`

### Performance Monitoring

- **Resource Usage**: `htop` or `pm2 monit`
- **Disk Space**: `df -h`
- **Network**: `netstat -tulnp`

### Automated Backups

The setup script creates automated backup scripts:

- **Database**: Backed up daily at 2 AM
- **Uploads**: Backed up daily at 2 AM
- **Retention**: 7 days
- **Location**: `/var/backups/ubetanation/`

### SSL Certificate Renewal

Certificates are automatically renewed via systemd timer:
```bash
# Check renewal status
sudo systemctl status snap.certbot.renew.timer

# Test renewal
sudo certbot renew --dry-run
```

## Troubleshooting

### Common Issues

#### Application Won't Start

```bash
# Check PM2 status
pm2 status

# View PM2 logs
pm2 logs ubetanation-web

# Restart PM2
pm2 restart ubetanation-web

# If still failing, check configuration
pm2 delete ubetanation-web
pm2 start ecosystem.config.js
```

#### Nginx Issues

```bash
# Test configuration
sudo nginx -t

# Check Nginx status
sudo systemctl status nginx

# Reload Nginx
sudo systemctl reload nginx

# View error logs
sudo tail -f /var/log/nginx/error.log
```

#### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

#### Database Issues

```bash
# Check database file
ls -la prisma/production.db

# Reset database (DANGER: will delete all data)
npm run db:push -- --force-reset

# Check Prisma schema
npx prisma db pull
```

#### Performance Issues

```bash
# Check resource usage
htop
pm2 monit

# Check disk space
df -h

# Check network connections
netstat -tulnp | grep :3002

# Restart with more memory
pm2 restart ubetanation-web --max-memory-restart 1G
```

### Getting Help

1. **Check logs** first using the commands above
2. **Verify configuration** files are correct
3. **Test connectivity** to external services
4. **Monitor resource usage** for bottlenecks
5. **Check GitHub Actions** logs for deployment issues

### Emergency Procedures

#### Complete Service Restoration

```bash
# Stop all services
pm2 stop all
sudo systemctl stop nginx

# Start services in order
sudo systemctl start nginx
pm2 start ecosystem.config.js

# Verify health
curl -f https://yourdomain.com/api/health
```

#### Disaster Recovery

```bash
# Restore from latest backup
cd /var/www/ubetanation-landing-page
cp /var/backups/ubetanation/database_latest.db prisma/production.db
tar -xzf /var/backups/ubetanation/uploads_latest.tar.gz

# Restart application
pm2 restart ubetanation-web
```

## Security Considerations

- Keep system packages updated: `sudo apt update && sudo apt upgrade`
- Monitor fail2ban logs: `sudo fail2ban-client status`
- Review Nginx access logs regularly
- Update Node.js and dependencies periodically
- Monitor SSL certificate expiration
- Use strong passwords and SSH keys
- Consider implementing intrusion detection

## Performance Optimization

- Enable Nginx gzip compression (included in config)
- Use Next.js Image optimization
- Implement proper caching headers
- Monitor and optimize database queries
- Consider using a CDN for static assets
- Implement rate limiting (included in Nginx config)

---

For additional support or questions, please refer to the project documentation or contact the development team.