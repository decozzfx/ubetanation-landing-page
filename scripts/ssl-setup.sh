#!/bin/bash

# SSL Certificate Setup Script for Ubetanation Landing Page
# This script automates SSL certificate installation using Let's Encrypt
# Run as: ./ssl-setup.sh yourdomain.com

set -e  # Exit on any error

# Configuration
DOMAIN="$1"
PROJECT_NAME="ubetanation-landing-page"
EMAIL=""  # Will be prompted if needed

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

# Show usage
show_usage() {
    echo "Usage: $0 <domain>"
    echo ""
    echo "Examples:"
    echo "  $0 yourdomain.com"
    echo "  $0 example.org"
    echo ""
    echo "This script will:"
    echo "  1. Verify domain DNS configuration"
    echo "  2. Test Nginx configuration"
    echo "  3. Obtain SSL certificates from Let's Encrypt"
    echo "  4. Configure automatic renewal"
    echo "  5. Test SSL configuration"
}

# Validate domain parameter
validate_domain() {
    if [[ -z "$DOMAIN" ]]; then
        error "Domain parameter is required"
        show_usage
        exit 1
    fi
    
    # Basic domain validation
    if [[ ! "$DOMAIN" =~ ^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$ ]]; then
        error "Invalid domain format: $DOMAIN"
    fi
    
    log "Using domain: $DOMAIN"
}

# Check if running with proper permissions
check_permissions() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run with sudo privileges"
    fi
}

# Get email for Let's Encrypt notifications
get_email() {
    if [[ -z "$EMAIL" ]]; then
        echo ""
        read -p "Enter email address for SSL certificate notifications: " EMAIL
        
        if [[ -z "$EMAIL" ]]; then
            error "Email address is required for SSL certificates"
        fi
        
        # Basic email validation
        if [[ ! "$EMAIL" =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]]; then
            error "Invalid email format: $EMAIL"
        fi
    fi
    
    log "Using email: $EMAIL"
}

# Check DNS configuration
check_dns() {
    log "Checking DNS configuration for $DOMAIN..."
    
    # Get server's public IP
    SERVER_IP=$(curl -s ifconfig.me)
    
    if [[ -z "$SERVER_IP" ]]; then
        error "Could not determine server's public IP address"
    fi
    
    log "Server IP: $SERVER_IP"
    
    # Check A record for root domain
    DOMAIN_IP=$(dig +short "$DOMAIN" | head -n1)
    if [[ "$DOMAIN_IP" != "$SERVER_IP" ]]; then
        warning "DNS A record for $DOMAIN points to $DOMAIN_IP, but server IP is $SERVER_IP"
        echo "Please ensure DNS is properly configured before proceeding."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        success "DNS A record for $DOMAIN is correctly configured"
    fi
    
    # Check A record for www subdomain
    WWW_IP=$(dig +short "www.$DOMAIN" | head -n1)
    if [[ "$WWW_IP" != "$SERVER_IP" ]]; then
        warning "DNS A record for www.$DOMAIN points to $WWW_IP, but server IP is $SERVER_IP"
    else
        success "DNS A record for www.$DOMAIN is correctly configured"
    fi
}

# Check if Certbot is installed
check_certbot() {
    log "Checking if Certbot is installed..."
    
    if ! command -v certbot &> /dev/null; then
        log "Installing Certbot..."
        apt update
        apt install -y certbot python3-certbot-nginx
        success "Certbot installed"
    else
        success "Certbot is already installed"
    fi
}

# Check Nginx configuration
check_nginx() {
    log "Checking Nginx configuration..."
    
    # Test Nginx configuration
    if ! nginx -t; then
        error "Nginx configuration test failed. Please fix configuration errors first."
    fi
    
    # Check if site is enabled
    if [[ ! -L "/etc/nginx/sites-enabled/$PROJECT_NAME" ]]; then
        log "Enabling Nginx site..."
        
        if [[ -f "/etc/nginx/sites-available/$PROJECT_NAME" ]]; then
            ln -sf "/etc/nginx/sites-available/$PROJECT_NAME" "/etc/nginx/sites-enabled/"
            success "Nginx site enabled"
        else
            error "Nginx configuration file not found at /etc/nginx/sites-available/$PROJECT_NAME"
        fi
    fi
    
    # Reload Nginx to apply changes
    systemctl reload nginx
    success "Nginx configuration is valid and reloaded"
}

# Test HTTP accessibility
test_http_access() {
    log "Testing HTTP accessibility..."
    
    # Wait for DNS propagation
    sleep 5
    
    # Test if site is accessible via HTTP
    if curl -f -s -o /dev/null -w "%{http_code}" "http://$DOMAIN" | grep -q "200\|301\|302"; then
        success "Site is accessible via HTTP"
    else
        warning "Site may not be accessible via HTTP. SSL setup may fail."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Obtain SSL certificate
obtain_certificate() {
    log "Obtaining SSL certificate from Let's Encrypt..."
    
    # Run Certbot with nginx plugin
    certbot --nginx \
        --non-interactive \
        --agree-tos \
        --email "$EMAIL" \
        --domains "$DOMAIN,www.$DOMAIN" \
        --redirect \
        --hsts \
        --staple-ocsp \
        --must-staple
    
    if [[ $? -eq 0 ]]; then
        success "SSL certificate obtained and installed successfully"
    else
        error "Failed to obtain SSL certificate"
    fi
}

# Test SSL certificate
test_ssl() {
    log "Testing SSL certificate..."
    
    # Wait for certificate to be active
    sleep 10
    
    # Test HTTPS accessibility
    if curl -f -s -o /dev/null "https://$DOMAIN"; then
        success "HTTPS is working correctly"
    else
        error "HTTPS test failed"
    fi
    
    # Test SSL redirect
    HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN")
    if [[ "$HTTP_RESPONSE" == "301" ]]; then
        success "HTTP to HTTPS redirect is working"
    else
        warning "HTTP to HTTPS redirect may not be working properly (got HTTP $HTTP_RESPONSE)"
    fi
    
    # Check certificate details
    log "Certificate details:"
    echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | \
        openssl x509 -noout -dates -subject -issuer
}

# Configure automatic renewal
configure_renewal() {
    log "Configuring automatic SSL certificate renewal..."
    
    # Test automatic renewal
    if certbot renew --dry-run; then
        success "Automatic renewal test passed"
    else
        warning "Automatic renewal test failed"
    fi
    
    # Check if renewal cron job exists
    if crontab -l | grep -q "certbot renew"; then
        log "Renewal cron job already exists"
    else
        log "Adding renewal cron job..."
        
        # Create renewal script
        cat > /usr/local/bin/certbot-renewal.sh << 'EOF'
#!/bin/bash

# Certbot renewal script
# This script renews certificates and reloads Nginx if successful

LOG_FILE="/var/log/certbot-renewal.log"

echo "$(date): Starting certificate renewal check" >> "$LOG_FILE"

# Run certbot renewal
if /usr/bin/certbot renew --quiet >> "$LOG_FILE" 2>&1; then
    echo "$(date): Certificate renewal successful" >> "$LOG_FILE"
    
    # Reload nginx to use new certificates
    if /bin/systemctl reload nginx >> "$LOG_FILE" 2>&1; then
        echo "$(date): Nginx reloaded successfully" >> "$LOG_FILE"
    else
        echo "$(date): Failed to reload Nginx" >> "$LOG_FILE"
    fi
else
    echo "$(date): Certificate renewal failed or no renewal needed" >> "$LOG_FILE"
fi

# Clean up old log entries (keep last 1000 lines)
tail -n 1000 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
EOF
        
        chmod +x /usr/local/bin/certbot-renewal.sh
        
        # Add to crontab (run twice daily at 12:00 and 00:00)
        (crontab -l 2>/dev/null; echo "0 0,12 * * * /usr/local/bin/certbot-renewal.sh") | crontab -
        
        success "Automatic renewal configured"
    fi
}

# Configure enhanced SSL security
configure_ssl_security() {
    log "Configuring enhanced SSL security..."
    
    # Create SSL configuration snippet
    cat > /etc/nginx/snippets/ssl-params.conf << 'EOF'
# SSL Security Configuration

# Modern TLS configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;

# Strong ciphers for TLS 1.2
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;

# SSL session configuration
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:50m;
ssl_session_tickets off;

# OCSP stapling
ssl_stapling on;
ssl_stapling_verify on;
resolver 1.1.1.1 8.8.8.8 valid=300s;
resolver_timeout 5s;

# Security headers
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
EOF
    
    # Update Nginx site configuration to include SSL params
    if ! grep -q "ssl-params.conf" "/etc/nginx/sites-available/$PROJECT_NAME"; then
        log "Adding SSL security configuration to Nginx..."
        
        # Add include directive after the ssl_certificate lines
        sed -i '/ssl_certificate/a\    include /etc/nginx/snippets/ssl-params.conf;' "/etc/nginx/sites-available/$PROJECT_NAME"
        
        # Test and reload Nginx
        if nginx -t; then
            systemctl reload nginx
            success "Enhanced SSL security configuration applied"
        else
            error "Failed to apply SSL security configuration - Nginx config test failed"
        fi
    else
        log "SSL security configuration already present"
    fi
}

# Perform security check
security_check() {
    log "Performing SSL security check..."
    
    echo ""
    echo "=== SSL SECURITY REPORT ==="
    
    # Check SSL Labs rating (requires external service)
    log "You can check your SSL rating at: https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
    
    # Local SSL tests
    echo ""
    echo "Certificate information:"
    echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | \
        openssl x509 -noout -text | grep -A2 "Validity"
    
    echo ""
    echo "Supported protocols:"
    for protocol in tls1_2 tls1_3; do
        if echo | openssl s_client -"$protocol" -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | grep -q "Protocol"; then
            echo "✓ $protocol supported"
        else
            echo "✗ $protocol not supported"
        fi
    done
    
    echo ""
    echo "Security headers check:"
    HEADERS=$(curl -s -I "https://$DOMAIN")
    
    for header in "Strict-Transport-Security" "X-Frame-Options" "X-Content-Type-Options" "X-XSS-Protection"; do
        if echo "$HEADERS" | grep -qi "$header"; then
            echo "✓ $header present"
        else
            echo "✗ $header missing"
        fi
    done
}

# Create monitoring script for SSL
create_ssl_monitor() {
    log "Creating SSL monitoring script..."
    
    cat > /usr/local/bin/ssl-monitor.sh << EOF
#!/bin/bash

# SSL Certificate Monitoring Script
DOMAIN="$DOMAIN"
LOG_FILE="/var/log/ssl-monitor.log"
ALERT_DAYS=7

# Function to send alerts (customize as needed)
send_alert() {
    local message="\$1"
    echo "\$(date): ALERT - \$message" >> "\$LOG_FILE"
    # Add your alerting mechanism here (email, Slack, etc.)
    # Example: echo "\$message" | mail -s "SSL Alert for \$DOMAIN" admin@yourdomain.com
}

# Check certificate expiration
check_expiration() {
    local cert_end_date=\$(echo | openssl s_client -servername "\$DOMAIN" -connect "\$DOMAIN:443" 2>/dev/null | \
                         openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
    
    if [[ -n "\$cert_end_date" ]]; then
        local end_epoch=\$(date -d "\$cert_end_date" +%s)
        local now_epoch=\$(date +%s)
        local days_left=\$(( (\$end_epoch - \$now_epoch) / 86400 ))
        
        echo "\$(date): Certificate expires in \$days_left days" >> "\$LOG_FILE"
        
        if [[ \$days_left -lt \$ALERT_DAYS ]]; then
            send_alert "SSL certificate for \$DOMAIN expires in \$days_left days"
        fi
    else
        send_alert "Could not check SSL certificate expiration for \$DOMAIN"
    fi
}

# Check certificate validity
check_validity() {
    if echo | openssl s_client -servername "\$DOMAIN" -connect "\$DOMAIN:443" -verify_return_error 2>/dev/null | grep -q "Verification: OK"; then
        echo "\$(date): Certificate validation OK" >> "\$LOG_FILE"
    else
        send_alert "SSL certificate validation failed for \$DOMAIN"
    fi
}

# Main monitoring
echo "\$(date): Starting SSL monitoring check" >> "\$LOG_FILE"
check_expiration
check_validity

# Clean up old log entries (keep last 500 lines)
tail -n 500 "\$LOG_FILE" > "\$LOG_FILE.tmp" && mv "\$LOG_FILE.tmp" "\$LOG_FILE"
EOF
    
    chmod +x /usr/local/bin/ssl-monitor.sh
    
    # Add to crontab (run daily at 6 AM)
    if ! crontab -l | grep -q "ssl-monitor.sh"; then
        (crontab -l 2>/dev/null; echo "0 6 * * * /usr/local/bin/ssl-monitor.sh") | crontab -
        success "SSL monitoring script configured"
    else
        log "SSL monitoring script already configured"
    fi
}

# Show final instructions
show_final_instructions() {
    echo ""
    success "SSL setup completed successfully!"
    echo ""
    echo "=== SSL CONFIGURATION SUMMARY ==="
    echo "Domain: $DOMAIN"
    echo "Certificate issuer: Let's Encrypt"
    echo "HTTPS URL: https://$DOMAIN"
    echo "HTTPS URL (www): https://www.$DOMAIN"
    echo ""
    echo "=== FEATURES CONFIGURED ==="
    echo "✓ SSL/TLS certificates installed"
    echo "✓ HTTP to HTTPS redirect enabled"
    echo "✓ Security headers configured"
    echo "✓ HSTS (HTTP Strict Transport Security) enabled"
    echo "✓ OCSP stapling enabled"
    echo "✓ Automatic renewal configured"
    echo "✓ SSL monitoring script installed"
    echo ""
    echo "=== IMPORTANT NOTES ==="
    echo "• Certificates will auto-renew before expiration"
    echo "• Renewal logs: /var/log/certbot-renewal.log"
    echo "• SSL monitoring logs: /var/log/ssl-monitor.log"
    echo "• Test your SSL configuration: https://www.ssllabs.com/ssltest/"
    echo ""
    echo "=== TROUBLESHOOTING ==="
    echo "If you encounter issues:"
    echo "1. Check Nginx error logs: sudo tail -f /var/log/nginx/error.log"
    echo "2. Test certificate renewal: sudo certbot renew --dry-run"
    echo "3. Check certificate status: sudo certbot certificates"
    echo "4. Manual renewal: sudo certbot renew --force-renewal"
    echo ""
}

# Main function
main() {
    echo "=== SSL Certificate Setup for Ubetanation Landing Page ==="
    echo ""
    
    validate_domain
    check_permissions
    get_email
    
    log "Starting SSL setup for $DOMAIN"
    echo ""
    
    check_dns
    check_certbot
    check_nginx
    test_http_access
    obtain_certificate
    test_ssl
    configure_renewal
    configure_ssl_security
    security_check
    create_ssl_monitor
    
    show_final_instructions
}

# Handle command line arguments
if [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]; then
    show_usage
    exit 0
fi

# Run main function
main "$@"