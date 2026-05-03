module.exports = {
  apps: [
    {
      name: 'video-portfolio',
      script: './server/server.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '500M',
      watch: false,
      ignore_watch: ['node_modules', 'dist', 'data', 'uploads'],
      max_restarts: 10,
      min_uptime: '10s'
    }
  ],
  deploy: {
    production: {
      user: 'videoapp',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/video-portfolio.git',
      path: '/home/video-portfolio',
      'post-deploy': 'npm ci && npm run build && npm prune --omit=dev && pm2 reload ecosystem.config.js --env production'
    }
  }
};
