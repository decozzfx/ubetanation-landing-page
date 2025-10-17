# Quick Deployment Guide - Ubetanation Landing Page

## 🚀 One-Command Deployment

For those who want to deploy quickly, use our automated deployment scripts:

### Prerequisites
- VPS/Server with Ubuntu 20.04+ 
- Domain name pointed to your server IP
- SSH access to your server

### Step 1: Initial Server Setup
```bash
# On your server (as root)
wget https://raw.githubusercontent.com/your-repo/ubetanation-landing-page/main/scripts/setup-server.sh
chmod +x setup-server.sh
./setup-server.sh
```

### Step 2: Deploy Application  
```bash
# Switch to application user
sudo su - ubeta

# Clone and deploy
git clone https://github.com/your-repo/ubetanation-landing-page.git /var/www/ubetanation-landing-page
cd /var/www/ubetanation-landing-page
./scripts/deploy.sh production
```

### Step 3: Configure SSL
```bash
# Configure SSL certificates
sudo ./scripts/ssl-setup.sh yourdomain.com
```

## 🎯 Manual Deployment (5 Minutes)

If you prefer manual setup, follow these essential steps:

### 1. Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts

# Install essential tools
sudo apt install -y git nginx certbot python3-certbot-nginx
npm install -g pm2
```

### 2. Application Setup
```bash
# Create directory and clone
sudo mkdir -p /var/www
cd /var/www
sudo git clone https://github.com/your-repo/ubetanation-landing-page.git
sudo chown -R $USER:$USER ubetanation-landing-page
cd ubetanation-landing-page

# Install dependencies and build
npm install
npm run build
```

### 3. Environment Configuration
```bash
# Create production environment file
cp .env.example .env.production
nano .env.production

# Set required variables:
# DATABASE_URL="file:./prisma/db.sqlite"
# JWT_SECRET="your-32-char-secret"
# NEXTAUTH_URL="https://yourdomain.com"
```

### 4. Database Setup
```bash
# Initialize database
npx prisma generate
npx prisma migrate deploy
```

### 5. Process Management
```bash
# Start with PM2
pm2 start npm --name "ubetanation" -- start
pm2 startup
pm2 save
```

### 6. Web Server Configuration
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/ubetanation
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ubetanation /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. SSL Certificate
```bash
# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## ✅ Verification Checklist

After deployment, verify these items:

- [ ] **Application Status**: `pm2 status` shows app running
- [ ] **HTTP Access**: `curl http://yourdomain.com` redirects to HTTPS  
- [ ] **HTTPS Access**: `curl https://yourdomain.com` returns 200
- [ ] **Admin Access**: Can login at `https://yourdomain.com/admin/login`
- [ ] **Contact Form**: Contact form submits successfully
- [ ] **Performance**: Site loads in under 3 seconds
- [ ] **Mobile**: Site responsive on mobile devices
- [ ] **SSL Rating**: A+ rating on SSL Labs

## 🔧 Common Issues & Solutions

### Application Won't Start
```bash
# Check logs
pm2 logs ubetanation

# Restart application  
pm2 restart ubetanation
```

### 502 Bad Gateway
```bash
# Check if app is running
pm2 status

# Check Nginx config
sudo nginx -t
sudo systemctl restart nginx
```

### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal
```

### Database Issues
```bash
# Check database file permissions
ls -la prisma/db.sqlite

# Re-run migrations
npx prisma migrate deploy
```

## 🚨 Emergency Rollback

If something goes wrong:

```bash
# Stop current version
pm2 stop ubetanation

# Restore from backup (if available)
cd /var/www
sudo tar -xzf backup.tar.gz

# Or redeploy from last known good commit
cd ubetanation-landing-page
git reset --hard HEAD~1
npm install
npm run build
pm2 restart ubetanation
```

## 📞 Support

- **Documentation**: See `DEPLOYMENT.md` for detailed instructions
- **Logs**: Check `/var/log/nginx/` and `pm2 logs`  
- **Monitoring**: Use `htop` for system resources
- **SSL**: Check certificate with `openssl s_client -connect yourdomain.com:443`

---

**🎉 Your Ubetanation Landing Page is now live!**

Visit `https://yourdomain.com` to see your deployed application.