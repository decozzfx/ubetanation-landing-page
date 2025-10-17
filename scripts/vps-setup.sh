#!/bin/bash

# VPS Setup Script for Ubuntu 22.04 LTS
# This script sets up the production environment for Ubetanation Landing Page

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="ubetanation-landing-page"
APP_DIR="/var/www/$APP_NAME"
NGINX_CONFIG="/etc/nginx/sites-available/$APP_NAME"
DOMAIN="ubetanation.com"
EMAIL="admin@ubetanation.com" # Change this to your email
NODE_VERSION="20"

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root. Please run as a regular user with sudo privileges."
fi

log "Starting VPS setup for $APP_NAME..."

# Update system packages
log "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install essential packages
log "Installing essential packages..."
sudo apt-get install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    ufw \
    fail2ban \
    htop \
    vim \
    tree

# Install Node.js
log "Installing Node.js $NODE_VERSION..."
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
node_version=$(node --version)
npm_version=$(npm --version)
log "Node.js installed: $node_version"
log "npm installed: $npm_version"

# Install PM2 globally
log "Installing PM2..."
sudo npm install -g pm2

# Setup PM2 startup
log "Setting up PM2 startup..."
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME

# Install Nginx
log "Installing Nginx..."
sudo apt-get install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Setup firewall
log "Configuring firewall..."
sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Configure fail2ban
log "Configuring fail2ban..."
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Create fail2ban nginx jail
sudo tee /etc/fail2ban/jail.d/nginx.conf > /dev/null <<EOF
[nginx-http-auth]
enabled = true

[nginx-noscript]
enabled = true

[nginx-badbots]
enabled = true

[nginx-noproxy]
enabled = true

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
action = iptables-multiport[name=ReqLimit, port="http,https", protocol=tcp]
logpath = /var/log/nginx/*error.log
findtime = 600
bantime = 7200
maxretry = 10
EOF

# Restart fail2ban
sudo systemctl restart fail2ban

# Create application directory
log "Creating application directory..."
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Create log directories
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

sudo mkdir -p /var/log/nginx
sudo chown -R www-data:www-data /var/log/nginx

# Clone repository (if not exists)
if [ ! -d "$APP_DIR/.git" ]; then
    log "Cloning repository..."
    git clone https://github.com/your-username/$APP_NAME.git $APP_DIR
    cd $APP_DIR
else
    log "Repository already exists, pulling latest changes..."
    cd $APP_DIR
    git pull origin main
fi

# Install application dependencies
log "Installing application dependencies..."
npm ci --production

# Create .env file template
if [ ! -f "$APP_DIR/.env.production" ]; then
    log "Creating .env.production template..."
    cat > $APP_DIR/.env.production <<EOF
# Production Environment Variables
NODE_ENV=production
PORT=3002
NEXT_TELEMETRY_DISABLED=1

# Database
DATABASE_URL="file:./production.db"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secure-jwt-secret-here"

# Application URL
NEXT_PUBLIC_APP_URL="https://$DOMAIN"

# Email Configuration (optional)
# SMTP_HOST=""
# SMTP_PORT=""
# SMTP_USER=""
# SMTP_PASS=""

# Analytics (optional)
# GOOGLE_ANALYTICS_ID=""

# Upload Configuration
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES="image/jpeg,image/jpg,image/png,image/gif,image/webp"
EOF
    warn "Please edit $APP_DIR/.env.production with your actual configuration values"
fi

# Generate Prisma client
log "Generating Prisma client..."
npx prisma generate

# Setup database
log "Setting up database..."
npx prisma db push

# Build application
log "Building application..."
npm run build

# Create Nginx configuration
log "Creating Nginx configuration..."
sudo cp nginx/ubetanation.conf $NGINX_CONFIG

# Update Nginx configuration with actual domain
sudo sed -i "s/ubetanation\.com/$DOMAIN/g" $NGINX_CONFIG

# Test Nginx configuration
sudo nginx -t

# Enable site
sudo ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Install Certbot for SSL
log "Installing Certbot for SSL certificates..."
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -sf /snap/bin/certbot /usr/bin/certbot

# Obtain SSL certificate (interactive)
log "Setting up SSL certificate..."
warn "About to run Certbot. Make sure your domain is pointing to this server!"
read -p "Press enter to continue or Ctrl+C to abort..."

sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --no-eff-email

# Setup automatic SSL renewal
sudo systemctl enable snap.certbot.renew.timer

# Start PM2 application
log "Starting PM2 application..."
pm2 start ecosystem.config.js
pm2 save

# Reload Nginx
sudo systemctl reload nginx

# Create health check endpoint test
log "Testing health check endpoint..."
sleep 5
if curl -f http://localhost:3002/api/health > /dev/null 2>&1; then
    log "Health check endpoint is working!"
else
    warn "Health check endpoint is not responding. Check PM2 logs: pm2 logs"
fi

# Setup log rotation
log "Setting up log rotation..."
sudo tee /etc/logrotate.d/ubetanation > /dev/null <<EOF
/var/log/pm2/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Setup monitoring script
log "Creating monitoring script..."
cat > $HOME/monitor-app.sh <<'EOF'
#!/bin/bash

# Simple monitoring script for Ubetanation app
APP_URL="http://localhost:3002"

# Check if app is responding
if ! curl -f $APP_URL/api/health > /dev/null 2>&1; then
    echo "$(date): App not responding, restarting PM2..."
    pm2 restart ubetanation-web
    
    # Send alert (customize as needed)
    echo "$(date): Ubetanation app was restarted due to health check failure" | logger -t ubetanation-monitor
fi
EOF

chmod +x $HOME/monitor-app.sh

# Add monitoring to crontab
(crontab -l 2>/dev/null || echo "") | grep -v "monitor-app.sh" | { cat; echo "*/5 * * * * $HOME/monitor-app.sh"; } | crontab -

# Create backup script
log "Creating backup script..."
cat > $HOME/backup-app.sh <<EOF
#!/bin/bash

BACKUP_DIR="/var/backups/ubetanation"
APP_DIR="$APP_DIR"
DATE=\$(date +%Y%m%d_%H%M%S)

mkdir -p \$BACKUP_DIR

# Backup database
cp \$APP_DIR/prisma/production.db \$BACKUP_DIR/database_\$DATE.db

# Backup uploads
tar -czf \$BACKUP_DIR/uploads_\$DATE.tar.gz -C \$APP_DIR uploads/

# Keep only last 7 backups
find \$BACKUP_DIR -name "database_*.db" -mtime +7 -delete
find \$BACKUP_DIR -name "uploads_*.tar.gz" -mtime +7 -delete

echo "\$(date): Backup completed - \$BACKUP_DIR"
EOF

chmod +x $HOME/backup-app.sh

# Add backup to crontab (daily at 2 AM)
(crontab -l 2>/dev/null || echo "") | grep -v "backup-app.sh" | { cat; echo "0 2 * * * $HOME/backup-app.sh"; } | crontab -

# Display final information
log "VPS setup completed successfully!"
echo ""
echo -e "${BLUE}=== Setup Summary ===${NC}"
echo "Application directory: $APP_DIR"
echo "Nginx configuration: $NGINX_CONFIG"
echo "Domain: $DOMAIN"
echo "SSL certificate: Configured with Let's Encrypt"
echo "PM2 status: $(pm2 list --no-color | grep ubetanation-web || echo 'Not running')"
echo ""
echo -e "${BLUE}=== Important Next Steps ===${NC}"
echo "1. Edit $APP_DIR/.env.production with your actual configuration"
echo "2. Update your DNS records to point $DOMAIN to this server"
echo "3. Test your application at https://$DOMAIN"
echo "4. Review and customize the monitoring and backup scripts"
echo ""
echo -e "${BLUE}=== Useful Commands ===${NC}"
echo "View PM2 status: pm2 status"
echo "View PM2 logs: pm2 logs"
echo "Restart app: pm2 restart ubetanation-web"
echo "View Nginx status: sudo systemctl status nginx"
echo "Test Nginx config: sudo nginx -t"
echo "Reload Nginx: sudo systemctl reload nginx"
echo "View SSL certificate: sudo certbot certificates"
echo ""
echo -e "${GREEN}Setup complete! 🎉${NC}"