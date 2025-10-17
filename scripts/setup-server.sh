#!/bin/bash

# Server Setup Script for Ubetanation Landing Page
# This script automates the initial server setup process
# Run as root: ./setup-server.sh

set -e  # Exit on any error

# Configuration
USER_NAME="ubeta"
PROJECT_NAME="ubetanation-landing-page"
DOMAIN=""  # Will be prompted
NODE_VERSION="lts"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root (use sudo)"
    fi
}

# Get domain from user
get_domain() {
    echo ""
    read -p "Enter your domain name (e.g., yourdomain.com): " DOMAIN
    
    if [[ -z "$DOMAIN" ]]; then
        error "Domain name is required"
    fi
    
    log "Domain set to: $DOMAIN"
}

# Update system packages
update_system() {
    log "Updating system packages..."
    
    apt update
    apt upgrade -y
    
    success "System packages updated"
}

# Create application user
create_user() {
    log "Creating application user: $USER_NAME"
    
    if id "$USER_NAME" &>/dev/null; then
        warning "User $USER_NAME already exists"
    else
        adduser --disabled-password --gecos "" "$USER_NAME"
        usermod -aG sudo "$USER_NAME"
        success "User $USER_NAME created and added to sudo group"
    fi
}

# Configure SSH
configure_ssh() {
    log "Configuring SSH..."
    
    # Create .ssh directory for the new user
    mkdir -p "/home/$USER_NAME/.ssh"
    
    # Copy authorized keys from root if they exist
    if [[ -f /root/.ssh/authorized_keys ]]; then
        cp /root/.ssh/authorized_keys "/home/$USER_NAME/.ssh/"
        chown -R "$USER_NAME:$USER_NAME" "/home/$USER_NAME/.ssh"
        chmod 700 "/home/$USER_NAME/.ssh"
        chmod 600 "/home/$USER_NAME/.ssh/authorized_keys"
        success "SSH keys copied to user $USER_NAME"
    else
        warning "No SSH keys found in /root/.ssh/authorized_keys"
        echo "Please add your public key to /home/$USER_NAME/.ssh/authorized_keys after setup"
    fi
    
    # Configure SSH daemon
    cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
    
    # Update SSH configuration
    sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
    sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
    
    # Restart SSH service
    systemctl restart ssh
    
    success "SSH configured successfully"
}

# Configure firewall
configure_firewall() {
    log "Configuring UFW firewall..."
    
    # Reset UFW to defaults
    ufw --force reset
    
    # Set default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH, HTTP, and HTTPS
    ufw allow ssh
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # Enable firewall
    ufw --force enable
    
    success "Firewall configured and enabled"
}

# Install essential packages
install_essentials() {
    log "Installing essential packages..."
    
    apt install -y \
        curl \
        wget \
        git \
        unzip \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release \
        build-essential \
        htop \
        iotop \
        nethogs \
        fail2ban
    
    success "Essential packages installed"
}

# Install Node.js via NVM
install_nodejs() {
    log "Installing Node.js..."
    
    # Install NVM as the application user
    su - "$USER_NAME" -c "
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        source ~/.bashrc
        nvm install $NODE_VERSION
        nvm use $NODE_VERSION
        nvm alias default node
    "
    
    success "Node.js installed via NVM"
}

# Install PM2 globally
install_pm2() {
    log "Installing PM2..."
    
    su - "$USER_NAME" -c "
        source ~/.bashrc
        npm install -g pm2
    "
    
    success "PM2 installed"
}

# Install and configure Nginx
install_nginx() {
    log "Installing and configuring Nginx..."
    
    apt install -y nginx
    
    # Start and enable Nginx
    systemctl start nginx
    systemctl enable nginx
    
    # Remove default site
    rm -f /etc/nginx/sites-enabled/default
    
    success "Nginx installed and configured"
}

# Install Certbot for SSL
install_certbot() {
    log "Installing Certbot for SSL certificates..."
    
    apt install -y certbot python3-certbot-nginx
    
    success "Certbot installed"
}

# Configure fail2ban
configure_fail2ban() {
    log "Configuring fail2ban..."
    
    cat > /etc/fail2ban/jail.local << EOF
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
EOF
    
    # Start and enable fail2ban
    systemctl start fail2ban
    systemctl enable fail2ban
    
    success "Fail2ban configured and started"
}

# Create project directory
create_project_directory() {
    log "Creating project directory..."
    
    mkdir -p "/var/www"
    chown "$USER_NAME:$USER_NAME" "/var/www"
    
    success "Project directory created"
}

# Create log directories
create_log_directories() {
    log "Creating log directories..."
    
    mkdir -p "/var/log/$PROJECT_NAME"
    chown "$USER_NAME:$USER_NAME" "/var/log/$PROJECT_NAME"
    
    success "Log directories created"
}

# Configure automatic security updates
configure_auto_updates() {
    log "Configuring automatic security updates..."
    
    apt install -y unattended-upgrades
    
    cat > /etc/apt/apt.conf.d/50unattended-upgrades << EOF
Unattended-Upgrade::Allowed-Origins {
    "\${distro_id}:\${distro_codename}";
    "\${distro_id}:\${distro_codename}-security";
    "\${distro_id}ESMApps:\${distro_codename}-apps-security";
    "\${distro_id}ESM:\${distro_codename}-infra-security";
};

Unattended-Upgrade::Package-Blacklist {
};

Unattended-Upgrade::DevRelease "auto";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
EOF
    
    cat > /etc/apt/apt.conf.d/20auto-upgrades << EOF
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
EOF
    
    success "Automatic security updates configured"
}

# Create Nginx configuration template
create_nginx_config() {
    log "Creating Nginx configuration template..."
    
    cat > "/etc/nginx/sites-available/$PROJECT_NAME" << EOF
# HTTP server block - redirects to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Redirect all HTTP requests to HTTPS
    return 301 https://\$server_name\$request_uri;
}

# HTTPS server block
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # SSL configuration will be added by Certbot
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

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
        application/javascript
        application/xml+rss
        application/rss+xml
        application/atom+xml
        image/svg+xml
        application/json;

    # Proxy to Node.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_buffering off;
    }

    # Handle file uploads
    location /api/upload {
        proxy_pass http://localhost:3000;
        client_max_body_size 10M;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Block access to sensitive files
    location ~ /\. {
        deny all;
    }

    location ~ /\.env {
        deny all;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\\n";
        add_header Content-Type text/plain;
    }

    # Logging
    access_log /var/log/nginx/${PROJECT_NAME}.access.log;
    error_log /var/log/nginx/${PROJECT_NAME}.error.log warn;
}
EOF
    
    # Enable the site (but don't activate until SSL is configured)
    # ln -sf "/etc/nginx/sites-available/$PROJECT_NAME" "/etc/nginx/sites-enabled/"
    
    success "Nginx configuration template created"
}

# Create PM2 ecosystem template
create_pm2_config() {
    log "Creating PM2 configuration template..."
    
    su - "$USER_NAME" -c "
        mkdir -p /home/$USER_NAME/config
        cat > /home/$USER_NAME/config/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: '$PROJECT_NAME',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/$PROJECT_NAME',
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
      log_file: '/var/log/$PROJECT_NAME/combined.log',
      out_file: '/var/log/$PROJECT_NAME/out.log',
      error_file: '/var/log/$PROJECT_NAME/error.log',
      time: true
    }
  ]
}
EOF
    "
    
    success "PM2 configuration template created"
}

# Create helper scripts
create_helper_scripts() {
    log "Creating helper scripts..."
    
    # Create backup script
    su - "$USER_NAME" -c "
        mkdir -p /home/$USER_NAME/scripts
        mkdir -p /home/$USER_NAME/backups
        
        cat > /home/$USER_NAME/scripts/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR=\"/home/$USER_NAME/backups\"
DATE=\$(date +%Y%m%d_%H%M%S)
PROJECT_DIR=\"/var/www/$PROJECT_NAME\"

# Create backup directory
mkdir -p \$BACKUP_DIR

# Backup application files
tar -czf \$BACKUP_DIR/${PROJECT_NAME}_backup_\$DATE.tar.gz -C /var/www $PROJECT_NAME

# Backup database
if [ -f \$PROJECT_DIR/prisma/db.sqlite ]; then
    cp \$PROJECT_DIR/prisma/db.sqlite \$BACKUP_DIR/db_backup_\$DATE.sqlite
fi

# Keep only last 7 days of backups
find \$BACKUP_DIR -name \"*backup*\" -mtime +7 -delete

echo \"Backup completed: \$DATE\"
EOF
        
        chmod +x /home/$USER_NAME/scripts/backup.sh
    "
    
    # Create monitoring script
    su - "$USER_NAME" -c "
        cat > /home/$USER_NAME/scripts/monitor.sh << 'EOF'
#!/bin/bash
echo \"=== System Status \$(date) ===\"
echo \"CPU Usage:\"
top -bn1 | grep \"Cpu(s)\"

echo -e \"\\nMemory Usage:\"
free -h

echo -e \"\\nDisk Usage:\"
df -h

echo -e \"\\nNginx Status:\"
systemctl is-active nginx

echo -e \"\\nPM2 Status:\"
pm2 status

echo -e \"\\nApplication Logs (last 10 lines):\"
if [ -f /var/log/$PROJECT_NAME/error.log ]; then
    tail -n 10 /var/log/$PROJECT_NAME/error.log
fi
EOF
        
        chmod +x /home/$USER_NAME/scripts/monitor.sh
    "
    
    success "Helper scripts created"
}

# Configure logrotate
configure_logrotate() {
    log "Configuring log rotation..."
    
    cat > "/etc/logrotate.d/$PROJECT_NAME" << EOF
/var/log/$PROJECT_NAME/*.log {
    daily
    missingok
    rotate 52
    compress
    notifempty
    create 644 $USER_NAME $USER_NAME
    postrotate
        su $USER_NAME -c 'pm2 reloadLogs' || true
    endscript
}
EOF
    
    success "Log rotation configured"
}

# Create environment template
create_env_template() {
    log "Creating environment template..."
    
    su - "$USER_NAME" -c "
        cat > /home/$USER_NAME/config/.env.template << 'EOF'
# Database
DATABASE_URL=\"file:./prisma/db.sqlite\"

# Authentication
JWT_SECRET=\"your-super-secret-jwt-key-min-32-chars\"
AUTH_SECRET=\"your-auth-secret-key-min-32-chars\"

# Application
NEXTAUTH_URL=\"https://$DOMAIN\"
NEXT_PUBLIC_SITE_URL=\"https://$DOMAIN\"

# Email Configuration
SMTP_HOST=\"smtp.your-provider.com\"
SMTP_PORT=\"587\"
SMTP_USER=\"your-email@domain.com\"
SMTP_PASSWORD=\"your-email-password\"
SMTP_FROM=\"noreply@$DOMAIN\"

# Analytics
GOOGLE_ANALYTICS_ID=\"GA_MEASUREMENT_ID\"
GOOGLE_SITE_VERIFICATION=\"your-site-verification\"

# Security
CSRF_SECRET=\"your-csrf-secret-key\"

# File Upload
MAX_FILE_SIZE=\"10485760\"
ALLOWED_FILE_TYPES=\"image/jpeg,image/png,image/gif,image/webp\"

# Production settings
NODE_ENV=\"production\"
EOF
    "
    
    success "Environment template created"
}

# Display post-setup instructions
show_instructions() {
    echo ""
    success "Server setup completed successfully!"
    echo ""
    echo "=== NEXT STEPS ==="
    echo ""
    echo "1. CONFIGURE DNS:"
    echo "   Add these DNS records at your domain registrar:"
    echo "   A    @      $(curl -s ifconfig.me)"
    echo "   A    www    $(curl -s ifconfig.me)"
    echo ""
    echo "2. DEPLOY APPLICATION:"
    echo "   Switch to user $USER_NAME and clone your repository:"
    echo "   sudo su - $USER_NAME"
    echo "   cd /var/www"
    echo "   git clone YOUR_REPO_URL $PROJECT_NAME"
    echo "   cd $PROJECT_NAME"
    echo ""
    echo "3. CONFIGURE ENVIRONMENT:"
    echo "   Copy and edit the environment template:"
    echo "   cp /home/$USER_NAME/config/.env.template /var/www/$PROJECT_NAME/.env"
    echo "   nano /var/www/$PROJECT_NAME/.env"
    echo ""
    echo "4. INSTALL DEPENDENCIES AND BUILD:"
    echo "   npm install"
    echo "   npx prisma generate"
    echo "   npx prisma migrate deploy"
    echo "   npm run build"
    echo ""
    echo "5. START APPLICATION:"
    echo "   cp /home/$USER_NAME/config/ecosystem.config.js /var/www/$PROJECT_NAME/"
    echo "   pm2 start ecosystem.config.js"
    echo "   pm2 save"
    echo "   pm2 startup"
    echo ""
    echo "6. CONFIGURE SSL:"
    echo "   Enable Nginx site and get SSL certificate:"
    echo "   sudo ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/"
    echo "   sudo nginx -t"
    echo "   sudo systemctl reload nginx"
    echo "   sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    echo ""
    echo "7. SCHEDULE BACKUPS:"
    echo "   Add to crontab (crontab -e):"
    echo "   0 2 * * * /home/$USER_NAME/scripts/backup.sh"
    echo "   0 * * * * /home/$USER_NAME/scripts/monitor.sh >> /var/log/$PROJECT_NAME/monitor.log"
    echo ""
    echo "=== IMPORTANT SECURITY NOTES ==="
    echo "• Change default passwords and generate secure secrets"
    echo "• Review and customize firewall rules"
    echo "• Set up monitoring and alerting"
    echo "• Keep system and packages updated"
    echo ""
    echo "Configuration files are located in:"
    echo "• Nginx config: /etc/nginx/sites-available/$PROJECT_NAME"
    echo "• PM2 config: /home/$USER_NAME/config/ecosystem.config.js"
    echo "• Environment template: /home/$USER_NAME/config/.env.template"
    echo "• Helper scripts: /home/$USER_NAME/scripts/"
    echo ""
}

# Main setup function
main() {
    echo "=== Ubetanation Landing Page - Server Setup ==="
    echo ""
    
    check_root
    get_domain
    
    echo ""
    log "Starting server setup for domain: $DOMAIN"
    echo ""
    
    update_system
    install_essentials
    create_user
    configure_ssh
    configure_firewall
    install_nodejs
    install_pm2
    install_nginx
    install_certbot
    configure_fail2ban
    configure_auto_updates
    create_project_directory
    create_log_directories
    create_nginx_config
    create_pm2_config
    create_helper_scripts
    configure_logrotate
    create_env_template
    
    show_instructions
}

# Run main function
main "$@"