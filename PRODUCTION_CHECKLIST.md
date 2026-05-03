# ✅ Production Readiness Checklist

Complete this before deploying to production.

## 🔐 Security

- [ ] Changed `ADMIN_PASSWORD` to strong password (16+ chars, mix of upper/lower/numbers/symbols)
- [ ] Changed `JWT_SECRET` to strong secret (32+ chars)
- [ ] `.env` file is in `.gitignore` (never commit secrets)
- [ ] `.env` file exists on server with strong credentials
- [ ] Firewall allows only necessary ports (80, 443)
- [ ] SSH key authentication enabled (no password SSH)
- [ ] Nginx/reverse proxy configured for HTTPS
- [ ] SSL certificate installed (Let's Encrypt or other)
- [ ] File uploads validated on server-side
- [ ] Rate limiting configured for admin endpoints

## 📦 Deployment Setup

- [ ] Docker is installed (if using Docker)
- [ ] Node.js 18+ installed (if using manual setup)
- [ ] `npm install --production` run successfully
- [ ] `npm run build` completes without errors
- [ ] `dist/` folder contains frontend assets
- [ ] `data/` directory is writable
- [ ] `uploads/` directory is writable and backed up

## 🚀 Infrastructure

- [ ] Server has at least 2GB RAM
- [ ] Server has at least 10GB disk space
- [ ] Reverse proxy (Nginx) configured
- [ ] SSL certificate installed and auto-renewing
- [ ] Firewall configured correctly
- [ ] Port 5000 is open (or mapped through proxy)
- [ ] Health checks configured

## 📊 Monitoring & Logging

- [ ] Log rotation configured
- [ ] Monitoring alerts set up
- [ ] Systemd service or PM2 configured for auto-restart
- [ ] Daily backup script scheduled
- [ ] Backup tested and verified

## 🧪 Testing

- [ ] App starts without errors: `npm start` or `docker-compose up`
- [ ] Home page loads: `http://your-ip:5000/`
- [ ] Admin login works with strong password
- [ ] Can create a test video
- [ ] Can upload a test video
- [ ] Video slider works
- [ ] Settings auto-scroll works
- [ ] Can delete video
- [ ] Nginx proxy forwards correctly
- [ ] HTTPS works

## 📋 Configuration

- [ ] `.env` file has production values
- [ ] `ADMIN_PASSWORD` is changed from default
- [ ] `JWT_SECRET` is changed from default
- [ ] `NODE_ENV=production` set
- [ ] `VITE_API_URL` points to your domain
- [ ] Mail notifications configured (if needed)
- [ ] CORS origins configured if needed

## 🔄 Maintenance Plan

- [ ] Backup schedule defined (daily)
- [ ] Update schedule planned (weekly)
- [ ] Monitoring alerts configured
- [ ] On-call support assigned
- [ ] Incident response plan created
- [ ] Rollback procedure documented

## 📱 Performance

- [ ] Page loads in < 2 seconds
- [ ] Video slider works smoothly
- [ ] No console errors in browser DevTools
- [ ] Network requests < 200ms (from client perspective)
- [ ] Gzip compression enabled
- [ ] Browser cache configured

## 🌐 DNS & Domain

- [ ] Domain DNS configured
- [ ] SSL certificate covers domain
- [ ] DNS resolves correctly
- [ ] Domain points to correct server

## ✨ Final Checks

- [ ] Documentation updated with server details
- [ ] Team trained on operations
- [ ] Emergency contacts documented
- [ ] Runbooks created for common issues
- [ ] Everything tested one more time

---

## Pre-Launch Tasks (Last Hour)

1. **Database**
   ```bash
   # Verify data structure
   cat data/videos.json
   cat data/settings.json
   ```

2. **Permissions**
   ```bash
   # Check ownership
   ls -la data/ uploads/
   sudo chown -R user:user data/ uploads/
   ```

3. **Service Status**
   ```bash
   # Check running
   sudo systemctl status video-portfolio
   # or
   docker-compose ps
   ```

4. **Network Test**
   ```bash
   # Test locally
   curl http://localhost:5000
   curl http://localhost:5000/api/videos
   
   # Test from another machine
   curl http://your-server-ip:5000
   ```

5. **Backup Before Launch**
   ```bash
   # Create initial backup
   tar -czf backups/launch-backup-$(date +%Y%m%d-%H%M%S).tar.gz data/ uploads/
   ```

---

## Deployment Day Checklist

- [ ] 08:00 - Backup current state
- [ ] 08:15 - Final security review
- [ ] 08:30 - Deploy to production
- [ ] 08:45 - Test all functions
- [ ] 09:00 - Announce to users
- [ ] 09:15 - Monitor for 1 hour
- [ ] 10:00 - Production handoff

---

## After Launch

### Day 1
- Monitor app logs every 30 minutes
- Check performance metrics
- Verify backups worked

### Week 1
- Monitor stability
- Collect user feedback
- Performance review

### Monthly
- Security audit
- Backup restore test
- Update dependencies check

---

## Quick Reference Commands

### Docker
```bash
# Start
docker-compose up -d

# Logs
docker-compose logs -f

# Stop
docker-compose down

# Restart
docker-compose restart
```

### Systemd
```bash
# Status
sudo systemctl status video-portfolio

# Logs
sudo journalctl -u video-portfolio -f

# Restart
sudo systemctl restart video-portfolio
```

### Manual Backup
```bash
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz data/ uploads/
```

---

## Red Flags 🚨

If any of these are true, DO NOT DEPLOY:

- [ ] `npm run build` fails
- [ ] `npm start` fails
- [ ] Admin login doesn't work
- [ ] No HTTPS certificate
- [ ] Default passwords still in use
- [ ] .env committed to git
- [ ] No backup procedure tested
- [ ] Service won't auto-restart

---

**Review this checklist with your team before launching!**

Deployment Status: _____________  
Deployed by: _________________  
Date: _________________________  
Verified by: ___________________  
