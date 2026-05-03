# 🚀 Production Deployment Guide

## Simplest Deployment Options

Choose one method:

---

## Option 1: Docker (Recommended - Easiest)

### Prerequisites
- Docker installed
- Docker Compose installed

### Steps

1. **Copy configuration**
   ```bash
   cp .env.example .env
   ```

2. **Edit .env with strong passwords**
   ```bash
   nano .env
   # Change ADMIN_PASSWORD and JWT_SECRET
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access application**
   - Open http://your-server-ip:5000
   - Admin: http://your-server-ip:5000/admin

5. **View logs**
   ```bash
   docker-compose logs -f video-portfolio
   ```

6. **Stop application**
   ```bash
   docker-compose down
   ```

### Backup & Restore
```bash
# Backup data
docker cp video-portfolio:/app/data ./backup-data
docker cp video-portfolio:/app/uploads ./backup-uploads

# Restore data
docker cp ./backup-data video-portfolio:/app/
docker cp ./backup-uploads video-portfolio:/app/
```

---

## Option 2: Linux VM (Using Systemd)

### Prerequisites
- Ubuntu/Debian server
- SSH access
- sudo privileges

### Steps

1. **SSH into your server**
   ```bash
   ssh user@your-server.com
   ```

2. **Download and run deployment script**
   ```bash
   curl -o deploy.sh https://raw.githubusercontent.com/your-repo/deploy.sh
   bash deploy.sh
   ```

   Or manually:

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs nginx
   ```

4. **Setup application directory**
   ```bash
   sudo mkdir -p /home/video-portfolio
   sudo chown $USER:$USER /home/video-portfolio
   cd /home/video-portfolio
   ```

5. **Copy files**
   ```bash
   # From local machine
   scp -r . user@your-server:/home/video-portfolio/
   ```

6. **Configure environment**
   ```bash
   cd /home/video-portfolio
   cp .env.example .env
   nano .env  # Edit with strong passwords
   ```

7. **Install and build**
   ```bash
   npm install --production
   npm run build
   ```

8. **Create systemd service**
   ```bash
   sudo tee /etc/systemd/system/video-portfolio.service > /dev/null <<'EOF'
   [Unit]
   Description=Video Portfolio
   After=network.target

   [Service]
   Type=simple
   User=$USER
   WorkingDirectory=/home/video-portfolio
   ExecStart=/usr/bin/node server/server.js
   Restart=always
   Environment="NODE_ENV=production"
   Environment="PORT=5000"

   [Install]
   WantedBy=multi-user.target
   EOF

   sudo systemctl daemon-reload
   sudo systemctl enable video-portfolio
   sudo systemctl start video-portfolio
   ```

9. **Setup Nginx reverse proxy**
   ```bash
   sudo tee /etc/nginx/sites-available/video-portfolio > /dev/null <<'EOF'
   server {
       listen 80;
       server_name _;
       client_max_body_size 500M;

       location / {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   EOF

   sudo ln -sf /etc/nginx/sites-available/video-portfolio /etc/nginx/sites-enabled/
   sudo rm -f /etc/nginx/sites-enabled/default
   sudo nginx -t
   sudo systemctl restart nginx
   ```

10. **Verify it's running**
    ```bash
    sudo systemctl status video-portfolio
    curl http://localhost:5000
    ```

### Service Management
```bash
# View status
sudo systemctl status video-portfolio

# View logs
sudo journalctl -u video-portfolio -f

# Restart
sudo systemctl restart video-portfolio

# Stop
sudo systemctl stop video-portfolio

# Start
sudo systemctl start video-portfolio
```

---

## Option 3: Using PM2 (Process Manager)

### Setup
```bash
# SSH into server
ssh user@your-server.com

# Install PM2 globally
sudo npm install -g pm2

# Navigate to app
cd /home/video-portfolio

# Start with PM2
pm2 start ecosystem.config.js --env production

# Make it start on reboot
pm2 startup
pm2 save
```

### Commands
```bash
pm2 status                    # View all apps
pm2 logs video-portfolio      # View logs
pm2 restart video-portfolio   # Restart app
pm2 stop video-portfolio      # Stop app
```

---

## Setup SSL Certificate (HTTPS)

### Using Certbot with Nginx

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Update Nginx config
```bash
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # ... rest of config
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Monitoring & Maintenance

### Daily Checks
```bash
# Check disk space
df -h

# Check memory
free -h

# Check service status
sudo systemctl status video-portfolio
```

### Backups
```bash
# Backup data weekly
0 2 * * 0 tar -czf /backups/video-portfolio-$(date +\%Y\%m\%d).tar.gz /home/video-portfolio/data /home/video-portfolio/uploads
```

### Log Rotation
```bash
# Add to /etc/logrotate.d/video-portfolio
/home/video-portfolio/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
}
```

---

## Performance Optimization

### Nginx caching
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### Gzip compression
```bash
gzip on;
gzip_types text/plain text/css text/javascript application/json;
gzip_min_length 1000;
```

---

## Troubleshooting

### Service won't start
```bash
# Check logs
sudo journalctl -u video-portfolio -n 50

# Check port in use
sudo lsof -i :5000

# Check Node version
node --version

# Test manually
cd /home/video-portfolio
node server/server.js
```

### Database issues
```bash
# Recreate data files (will lose data!)
rm data/videos.json
rm data/settings.json
sudo systemctl restart video-portfolio
```

### Upload issues
```bash
# Check permissions
ls -la uploads/

# Fix permissions
sudo chown -R $USER:$USER uploads/
chmod -R 755 uploads/
```

---

## Quick Reference

| Task | Command |
|------|---------|
| View logs | `docker-compose logs -f` or `sudo journalctl -u video-portfolio -f` |
| Restart | `docker-compose restart` or `sudo systemctl restart video-portfolio` |
| Stop | `docker-compose down` or `sudo systemctl stop video-portfolio` |
| Update password | Edit .env and restart service |
| Backup data | `cp -r data/ backups/` and `cp -r uploads/ backups/` |
| SSL cert | `sudo certbot --nginx -d your-domain.com` |

---

## Support

For issues:
1. Check service logs
2. Verify .env configuration
3. Ensure ports are open (5000 or 80/443)
4. Check file permissions
5. Verify Node.js version 18+

---

**Deployed successfully! 🚀**
