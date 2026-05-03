#!/bin/bash

# Video Portfolio - Simple VPS/VM Deployment Script
# Usage: bash deploy.sh

set -e

echo "🚀 Video Portfolio - Production Deployment"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
APP_DIR="/home/video-portfolio"
APP_PORT=5000
APP_USER="videoapp"

echo -e "${BLUE}Step 1: Installing system dependencies${NC}"
sudo apt-get update
sudo apt-get install -y curl git

echo -e "${BLUE}Step 2: Installing Node.js 18${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

echo -e "${BLUE}Step 3: Creating application user${NC}"
sudo useradd -m -s /bin/bash $APP_USER || echo "User already exists"

echo -e "${BLUE}Step 4: Setting up application directory${NC}"
sudo mkdir -p $APP_DIR
sudo chown -R $APP_USER:$APP_USER $APP_DIR

echo -e "${BLUE}Step 5: Cloning/copying application${NC}"
if [ -d "$APP_DIR/.git" ]; then
  echo "Git repository found, pulling latest changes..."
  sudo -u $APP_USER git -C $APP_DIR pull origin main
else
  echo "Copying application files..."
  sudo cp -r . $APP_DIR/
  sudo chown -R $APP_USER:$APP_USER $APP_DIR
fi

echo -e "${BLUE}Step 6: Installing dependencies${NC}"
cd $APP_DIR
sudo -u $APP_USER npm ci

echo -e "${BLUE}Step 7: Building frontend${NC}"
sudo -u $APP_USER npm run build
sudo -u $APP_USER npm prune --omit=dev

if [ ! -f "$APP_DIR/.env" ]; then
  echo -e "${BLUE}Step 7b: Creating .env from example${NC}"
  sudo -u $APP_USER cp "$APP_DIR/.env.example" "$APP_DIR/.env"
  echo "Created $APP_DIR/.env - update ADMIN_PASSWORD and JWT_SECRET before public launch."
fi

echo -e "${BLUE}Step 8: Setting up systemd service${NC}"
sudo tee /etc/systemd/system/video-portfolio.service > /dev/null <<EOF
[Unit]
Description=Video Portfolio Application
After=network.target

[Service]
Type=simple
User=$APP_USER
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/node server/server.js
Restart=always
RestartSec=10
Environment="NODE_ENV=production"
Environment="PORT=$APP_PORT"
EnvironmentFile=-$APP_DIR/.env

[Install]
WantedBy=multi-user.target
EOF

echo -e "${BLUE}Step 9: Enabling and starting service${NC}"
sudo systemctl daemon-reload
sudo systemctl enable video-portfolio
sudo systemctl start video-portfolio

echo -e "${BLUE}Step 10: Setting up Nginx reverse proxy${NC}"
sudo apt-get install -y nginx

sudo tee /etc/nginx/sites-available/video-portfolio > /dev/null <<'EOF'
server {
    listen 80;
    server_name _;
    client_max_body_size 500M;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/video-portfolio /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx

echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo "📍 Application URL: http://$(hostname -I | awk '{print $1}')"
echo "🔐 Admin Login: http://$(hostname -I | awk '{print $1}')/admin"
echo "🔑 Password: configured in $APP_DIR/.env"
echo ""
echo "📝 Service Commands:"
echo "   sudo systemctl status video-portfolio"
echo "   sudo systemctl restart video-portfolio"
echo "   sudo journalctl -u video-portfolio -f"
echo ""
echo "📂 Application Directory: $APP_DIR"
echo "📋 Change ADMIN_PASSWORD and JWT_SECRET in: $APP_DIR/.env"
echo ""
