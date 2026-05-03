# 📋 Video Portfolio - Quick Reference

## 🚀 Common Commands

```bash
# Installation & Setup
npm install                  # Install all dependencies
npm run dev                 # Start dev server (backend + frontend)
npm run build               # Build for production
npm run server              # Start backend only
npm run client              # Start frontend dev server

# Production
npm start                   # Start production server
npm run preview             # Preview production build locally
```

## 🔑 Default Credentials

- **Admin Password**: `admin123` (change in `.env`)
- **JWT Secret**: `your-secret-key-change-in-production` (change in `.env`)

## 🌐 URLs in Development

| Service | URL |
|---------|-----|
| Gallery | http://localhost:5173 |
| Admin Panel | http://localhost:5173/admin |
| Backend API | http://localhost:5000/api |
| Video Uploads | http://localhost:5000/uploads |

## 📁 Key Files to Edit

| File | Purpose |
|------|---------|
| `.env` | Environment variables & admin password |
| `tailwind.config.js` | Colors and styling customization |
| `src/index.css` | Tailwind styles and animations |
| `server/server.js` | Backend server configuration |

## 🎨 Customization

### Colors
```javascript
// In tailwind.config.js
colors: {
  'accent': '#00f0ff',           // Cyan
  'accent-purple': '#9d4edd',    // Purple
  'accent-pink': '#ff006e',      // Pink
}
```

### Auto-Scroll Settings
- Enable in Admin Panel > Settings
- Interval in milliseconds (1000ms = 1 second)
- Affects all video sliders

## 📱 API Endpoints Reference

### Videos
- `GET /api/videos` - List all
- `POST /api/videos` - Create (admin)
- `PUT /api/videos/:id` - Update (admin)
- `DELETE /api/videos/:id` - Delete (admin)

### Admin
- `POST /api/auth/login` - Login
- `POST /api/auth/verify` - Verify token
- `POST /api/upload` - Upload video

### Settings
- `GET /api/settings` - Get all
- `POST /api/settings` - Update (admin)

## 🐛 Quick Fixes

### Clear Everything & Start Fresh
```bash
rm -rf node_modules dist data/portfolio.db
npm install
npm run dev
```

### Check if Ports are in Use
```bash
# Check port 5000
lsof -i :5000

# Check port 5173
lsof -i :5173
```

### View Database Content
```bash
sqlite3 data/portfolio.db
.tables
.dump
.quit
```

## 📁 Project Structure Summary

```
video_portfolio/
├── server/              # Backend (Express.js)
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth/JWT
│   └── server.js       # Main server
├── src/                # Frontend (React)
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── App.jsx         # Main app
│   ├── api.js          # API client
│   └── store.js        # State management
├── uploads/            # Video files
├── data/               # SQLite database
└── public/             # Static files
```

## 🎯 First 5 Minutes

1. `npm install` - Install dependencies (2-3 min)
2. `npm run dev` - Start development server
3. Open http://localhost:5173
4. Go to /admin and log in with `admin123`
5. Add your first video!

## 🔒 Security Reminders

⚠️ **Before Production:**
1. Change `ADMIN_PASSWORD` in `.env`
2. Change `JWT_SECRET` in `.env`
3. Set `NODE_ENV=production`
4. Use HTTPS
5. Set strong passwords

## 📊 Database Tables

### Videos Table
```sql
CREATE TABLE videos (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  before_video TEXT NOT NULL,
  after_video TEXT NOT NULL,
  order_index INTEGER,
  created_at DATETIME,
  updated_at DATETIME
);
```

### Settings Table
```sql
CREATE TABLE settings (
  id INTEGER PRIMARY KEY,
  key TEXT UNIQUE,
  value TEXT,
  updated_at DATETIME
);
```

## 🆘 Troubleshooting Quick Links

| Problem | Solution |
|---------|----------|
| Port in use | Change port in `.env` or `lsof -ti:5000 \| xargs kill -9` |
| Admin won't login | Check `.env` password matches input |
| Videos not showing | Verify URLs in admin panel |
| Dependencies error | `rm -rf node_modules && npm install` |
| Build error | `rm -rf dist && npm run build` |

## 📚 Stack Overview

| Component | Technology |
|-----------|-----------|
| Backend | Node.js + Express |
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Database | SQLite3 |
| State | Zustand |
| HTTP Client | Axios |
| Icons | Lucide React |
| Routing | React Router |

---

**For detailed information, see README.md and SETUP.md**
