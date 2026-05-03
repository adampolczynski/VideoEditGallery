# Docker Deployment Guide

## Building Docker Image

Create `Dockerfile` in project root:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Build frontend
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built frontend
COPY --from=builder /app/dist ./dist

# Copy server code
COPY server ./server
COPY .env .env

# Create necessary directories
RUN mkdir -p data uploads

EXPOSE 5000

ENV NODE_ENV=production

CMD ["npm", "start"]
```

## Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  video-portfolio:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./data:/app/data
      - ./uploads:/app/uploads
    restart: unless-stopped
```

## Build and Run

```bash
# Build image
docker build -t video-portfolio:latest .

# Run container
docker run -p 5000:5000 \
  -e ADMIN_PASSWORD=your_password \
  -e JWT_SECRET=your_secret \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/uploads:/app/uploads \
  video-portfolio:latest

# Using Docker Compose
docker-compose up -d
```

## Push to Docker Hub

```bash
# Tag image
docker tag video-portfolio:latest username/video-portfolio:latest

# Login to Docker Hub
docker login

# Push
docker push username/video-portfolio:latest
```

---

## Deployment to Heroku

### Using Heroku CLI

```bash
# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set ADMIN_PASSWORD=your_password -a your-app-name
heroku config:set JWT_SECRET=your_secret -a your-app-name

# Deploy
git push heroku main
```

### Create `Procfile`:

```
web: npm start
```

---

## AWS EC2 Deployment

```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-instance.amazonaws.com

# Update system
sudo yum update -y

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Clone repository
git clone your-repo-url
cd video_portfolio

# Install dependencies
npm install

# Create .env
nano .env

# Start with PM2
npm install -g pm2
pm2 start server/server.js --name "video-portfolio"
pm2 startup
pm2 save

# Setup Nginx as reverse proxy
sudo amazon-linux-extras install nginx1 -y
sudo systemctl start nginx
```

---

## DigitalOcean App Platform

1. Connect GitHub repository
2. Set environment variables:
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
   - `NODE_ENV=production`
3. Set build command: `npm install && npm run build`
4. Set run command: `npm start`
5. Deploy!

---

## Monitoring & Maintenance

```bash
# Check PM2 status
pm2 list
pm2 logs video-portfolio

# Update dependencies
npm update

# Backup database
cp data/portfolio.db data/portfolio.db.backup

# View disk usage
du -sh data/ uploads/
```
