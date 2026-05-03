# 🚀 Quick Production Deployment - 5 Minutes

## The Simplest Way: Docker

### For VPS/Virtual Machine Deployment

#### Prerequisites (30 seconds)
- Docker installed: https://docs.docker.com/engine/install/
- Docker Compose installed: https://docs.docker.com/compose/install/

#### Deployment (3 steps - 5 minutes total)

**Step 1: Get the files**
```bash
# Clone or copy your project
cd video_portfolio
```

**Step 2: Set strong passwords**
```bash
cp .env.example .env
nano .env

# Change these to STRONG values:
ADMIN_PASSWORD=YourSuperSecurePassword123!
JWT_SECRET=AnotherSuperSecureSecret456!
```

**Step 3: Deploy**
```bash
docker-compose up -d
```

**Done!** Application runs at:
- Website: `http://your-server-ip:5000`
- Admin: `http://your-server-ip:5000/admin`
- Password: Check your .env file

#### View logs
```bash
docker-compose logs -f
```

#### Stop
```bash
docker-compose down
```

---

## Without Docker: Manual Setup (Linux)

### Prerequisites
- Ubuntu/Debian server
- 10 minutes time

### One Command Deploy

```bash
bash deploy.sh
```

This automatically:
- ✅ Installs Node.js
- ✅ Installs Nginx
- ✅ Builds your app
- ✅ Sets up auto-restart
- ✅ Configures SSL (optional)

Then access at: `http://your-server-ip`

---

## Check It's Working

```bash
# Test API
curl http://your-server-ip:5000/api/videos

# Should return: []
```

---

## Backup & Updates

### Backup data
```bash
# Docker
docker cp video-portfolio:/app/data ./backup-data
docker cp video-portfolio:/app/uploads ./backup-uploads

# Manual
tar -czf backup.tar.gz data/ uploads/
```

### Update app
```bash
# Docker
git pull origin main
docker-compose up -d --build

# Manual
git pull origin main
npm ci
npm run build
npm prune --omit=dev
sudo systemctl restart video-portfolio
```

---

## Common Issues

| Problem | Solution |
|---------|----------|
| Port 5000 in use | Change PORT in .env |
| Login fails | Check ADMIN_PASSWORD in .env |
| Videos not showing | Check /uploads folder exists |
| Can't access | Check firewall allows port 5000 |

---

## That's it! 🎉

Your video portfolio is live. Check:
- `docker-compose.yml` (configuration)
- `.env` (passwords & settings)
- `PRODUCTION_DEPLOYMENT.md` (detailed guide)

**Questions?** See PRODUCTION_DEPLOYMENT.md for advanced options.
