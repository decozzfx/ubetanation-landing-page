module.exports = {
  apps: [
    {
      name: 'ubetanation-web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/var/www/ubetanation-landing-page',
      instances: 'max',
      exec_mode: 'cluster',
      
      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        NEXT_TELEMETRY_DISABLED: 1
      },
      
      // Performance
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 5,
      
      // Logging
      log_file: '/var/log/pm2/ubetanation-combined.log',
      out_file: '/var/log/pm2/ubetanation-out.log',
      error_file: '/var/log/pm2/ubetanation-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Monitoring
      autorestart: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.next'],
      
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 3000,
      
      // Health checks
      health_check_http_endpoint: 'http://localhost:3002/api/health',
      health_check_grace_period: 30000,
      
      // Process management
      pid_file: '/var/run/pm2/ubetanation-web.pid',
      
      // Source control
      source_map_support: true,
      
      // Advanced options
      node_args: '--max-old-space-size=2048',
      
      // Deployment hooks
      pre_setup: 'echo "Setting up deployment environment"',
      post_setup: 'echo "Setup completed"',
      pre_deploy_local: 'echo "Starting deployment"',
      post_deploy: 'npm run db:push && echo "Deployment completed"',
      
      // Error handling
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Cron restart (optional - restart every day at 4 AM)
      cron_restart: '0 4 * * *',
      
      // Time zone
      time_zone: 'UTC'
    }
  ],
  
  deploy: {
    production: {
      user: 'ubuntu',
      host: process.env.VPS_HOST || 'your-vps-ip',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/ubetanation-landing-page.git',
      path: '/var/www/ubetanation-landing-page',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'sudo apt-get update && sudo apt-get install -y nginx',
      'ssh_options': 'StrictHostKeyChecking=no'
    }
  }
}