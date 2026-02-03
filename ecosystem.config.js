// PM2 Configuration for LalNova Technologies
module.exports = {
  apps: [{
    name: 'lalnova-backend',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    // Logging
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Auto-restart settings
    watch: false,
    max_memory_restart: '1G',
    restart_delay: 4000,
    
    // Health monitoring
    min_uptime: '10s',
    max_restarts: 10,
    
    // Environment variables
    env_file: '.env.production'
  }]
};