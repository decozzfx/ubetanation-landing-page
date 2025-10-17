#!/bin/bash

# Production Deployment Script for Ubetanation Landing Page
# Usage: ./deploy.sh [environment]
# Environment: staging|production (defaults to staging)

set -e  # Exit on any error

# Configuration
ENVIRONMENT=${1:-staging}
PROJECT_NAME="ubetanation-landing-page"
PROJECT_DIR="/var/www/$PROJECT_NAME"
BACKUP_DIR="/home/$(whoami)/backups"
LOG_FILE="/var/log/$PROJECT_NAME/deploy.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE" 2>/dev/null || true
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    echo "[ERROR] $1" >> "$LOG_FILE" 2>/dev/null || true
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    echo "[SUCCESS] $1" >> "$LOG_FILE" 2>/dev/null || true
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    echo "[WARNING] $1" >> "$LOG_FILE" 2>/dev/null || true
}

# Check if running as correct user
check_user() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root. Please run as the application user."
    fi
}

# Verify prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if git is installed
    if ! command -v git &> /dev/null; then
        error "Git is not installed"
    fi
    
    # Check if node is installed
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed"
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        error "npm is not installed"
    fi
    
    # Check if pm2 is installed
    if ! command -v pm2 &> /dev/null; then
        error "PM2 is not installed"
    fi
    
    # Check if project directory exists
    if [ ! -d "$PROJECT_DIR" ]; then
        error "Project directory $PROJECT_DIR does not exist"
    fi
    
    success "All prerequisites check passed"
}

# Create backup before deployment
create_backup() {
    log "Creating backup..."
    
    # Create backup directory if it doesn't exist
    mkdir -p "$BACKUP_DIR"
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$BACKUP_DIR/${PROJECT_NAME}_backup_${timestamp}.tar.gz"
    
    # Create backup of current application
    cd $(dirname "$PROJECT_DIR")
    tar -czf "$backup_file" $(basename "$PROJECT_DIR") || error "Failed to create backup"
    
    # Keep only last 5 backups
    cd "$BACKUP_DIR"
    ls -t ${PROJECT_NAME}_backup_*.tar.gz | tail -n +6 | xargs -r rm --
    
    success "Backup created: $backup_file"
    echo "BACKUP_FILE=$backup_file" > /tmp/deploy_backup.env
}

# Update source code
update_code() {
    log "Updating source code..."
    
    cd "$PROJECT_DIR"
    
    # Stash any local changes
    git stash push -m "Deploy stash $(date)"
    
    # Pull latest changes
    if [ "$ENVIRONMENT" = "production" ]; then
        git fetch origin main
        git reset --hard origin/main
    else
        git fetch origin develop
        git reset --hard origin/develop
    fi
    
    success "Source code updated"
}

# Install/Update dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    cd "$PROJECT_DIR"
    
    # Clean install for production
    rm -rf node_modules
    npm ci --only=production --silent
    
    success "Dependencies installed"
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    
    cd "$PROJECT_DIR"
    
    # Generate Prisma client
    npx prisma generate
    
    # Run migrations
    npx prisma migrate deploy
    
    success "Database migrations completed"
}

# Build application
build_application() {
    log "Building application..."
    
    cd "$PROJECT_DIR"
    
    # Set environment
    export NODE_ENV=$ENVIRONMENT
    
    # Build application
    npm run build || error "Build failed"
    
    success "Application built successfully"
}

# Update environment configuration
update_environment() {
    log "Updating environment configuration..."
    
    cd "$PROJECT_DIR"
    
    if [ "$ENVIRONMENT" = "production" ]; then
        if [ -f ".env.production" ]; then
            cp .env.production .env
            success "Production environment loaded"
        else
            warning "No .env.production file found, using existing .env"
        fi
    else
        if [ -f ".env.staging" ]; then
            cp .env.staging .env
            success "Staging environment loaded"
        else
            warning "No .env.staging file found, using existing .env"
        fi
    fi
}

# Restart application services
restart_services() {
    log "Restarting application services..."
    
    cd "$PROJECT_DIR"
    
    # Restart PM2 processes
    if pm2 list | grep -q "$PROJECT_NAME"; then
        pm2 restart "$PROJECT_NAME" || error "Failed to restart PM2 process"
    else
        pm2 start ecosystem.config.js --env $ENVIRONMENT || error "Failed to start PM2 process"
    fi
    
    # Wait for application to start
    sleep 5
    
    # Check if application is running
    if pm2 list | grep -q "$PROJECT_NAME.*online"; then
        success "Application restarted successfully"
    else
        error "Application failed to start"
    fi
}

# Test deployment
test_deployment() {
    log "Testing deployment..."
    
    # Wait for application to fully start
    sleep 10
    
    # Test local application
    if curl -f -s http://localhost:3000/health > /dev/null; then
        success "Local health check passed"
    else
        error "Local health check failed"
    fi
    
    # Test if PM2 process is stable
    sleep 5
    if pm2 list | grep -q "$PROJECT_NAME.*online"; then
        success "PM2 process is stable"
    else
        error "PM2 process is not stable"
    fi
}

# Reload web server
reload_webserver() {
    log "Reloading web server..."
    
    # Test nginx configuration
    if sudo nginx -t; then
        sudo systemctl reload nginx
        success "Nginx reloaded successfully"
    else
        error "Nginx configuration test failed"
    fi
}

# Rollback function
rollback() {
    local backup_file
    
    if [ -f "/tmp/deploy_backup.env" ]; then
        source /tmp/deploy_backup.env
        backup_file="$BACKUP_FILE"
    else
        # Find the most recent backup
        backup_file=$(ls -t "$BACKUP_DIR"/${PROJECT_NAME}_backup_*.tar.gz 2>/dev/null | head -n1)
    fi
    
    if [ -z "$backup_file" ] || [ ! -f "$backup_file" ]; then
        error "No backup file found for rollback"
    fi
    
    warning "Rolling back to: $backup_file"
    
    # Stop current application
    pm2 stop "$PROJECT_NAME" || true
    
    # Remove current directory
    rm -rf "$PROJECT_DIR"
    
    # Restore from backup
    cd $(dirname "$PROJECT_DIR")
    tar -xzf "$backup_file"
    
    # Restart application
    cd "$PROJECT_DIR"
    pm2 start ecosystem.config.js --env $ENVIRONMENT
    
    success "Rollback completed"
}

# Cleanup function
cleanup() {
    log "Cleaning up..."
    
    cd "$PROJECT_DIR"
    
    # Clean npm cache
    npm cache clean --force
    
    # Remove temporary files
    rm -f /tmp/deploy_backup.env
    
    # Clean old log files
    find /var/log/$PROJECT_NAME -name "*.log" -mtime +30 -delete 2>/dev/null || true
    
    success "Cleanup completed"
}

# Send notification (placeholder)
send_notification() {
    local status=$1
    local message=$2
    
    log "Deployment $status: $message"
    
    # Here you can add integration with Slack, Discord, email, etc.
    # Example:
    # curl -X POST -H 'Content-type: application/json' \
    #      --data '{"text":"Deployment '"$status"': '"$message"'"}' \
    #      YOUR_WEBHOOK_URL
}

# Main deployment function
deploy() {
    log "Starting deployment to $ENVIRONMENT environment..."
    
    # Trap errors for rollback
    trap 'error "Deployment failed. Run with rollback option to revert changes."' ERR
    
    check_user
    check_prerequisites
    create_backup
    update_code
    install_dependencies
    run_migrations
    update_environment
    build_application
    restart_services
    test_deployment
    reload_webserver
    cleanup
    
    success "Deployment to $ENVIRONMENT completed successfully!"
    send_notification "SUCCESS" "Deployment to $ENVIRONMENT completed"
}

# Show usage information
show_usage() {
    echo "Usage: $0 [COMMAND] [ENVIRONMENT]"
    echo ""
    echo "Commands:"
    echo "  deploy       Deploy the application (default)"
    echo "  rollback     Rollback to previous version"
    echo "  status       Show application status"
    echo "  logs         Show recent logs"
    echo "  test         Test deployment"
    echo ""
    echo "Environment:"
    echo "  staging      Deploy to staging environment (default)"
    echo "  production   Deploy to production environment"
    echo ""
    echo "Examples:"
    echo "  $0 deploy production"
    echo "  $0 rollback"
    echo "  $0 status"
}

# Show application status
show_status() {
    echo "=== Application Status ==="
    pm2 list | grep "$PROJECT_NAME" || echo "Application not running"
    
    echo ""
    echo "=== System Resources ==="
    echo "CPU Usage:"
    top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1"%"}'
    
    echo "Memory Usage:"
    free -h | grep "Mem:"
    
    echo "Disk Usage:"
    df -h / | tail -1
    
    echo ""
    echo "=== Service Status ==="
    systemctl is-active nginx || echo "Nginx: inactive"
    systemctl is-active fail2ban || echo "Fail2ban: inactive"
}

# Show recent logs
show_logs() {
    echo "=== Recent Application Logs ==="
    pm2 logs "$PROJECT_NAME" --lines 50
}

# Main script logic
case "${1:-deploy}" in
    deploy)
        deploy
        ;;
    rollback)
        rollback
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    test)
        test_deployment
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        echo "Unknown command: $1"
        show_usage
        exit 1
        ;;
esac