# 🚀 Video Portfolio - Setup Guide

## Step-by-Step Installation

### 1. Prerequisites
- **Node.js**: Download from https://nodejs.org/ (v16 or higher)
- **npm**: Comes with Node.js
- **Git** (optional): For version control

### 2. Installation Steps

#### Option A: Fresh Installation

```bash
# Navigate to project directory
cd video_portfolio

# Install all dependencies
npm install

# The installation will include:
# - Express.js (backend server)
# - React (frontend framework)
# - Vite (build tool)
# - Tailwind CSS (styling)
# - Zustand (state management)
# - SQLite (database)
# - And more utilities
```

#### Option B: Using Concurrently (Recommended)

```bash
npm install
npm run dev
```

This runs both backend and frontend in one terminal.

### 3. Configuration

Edit `.env` file in the project root:

```env
# Server
PORT=5000
NODE_ENV=development

# API URL for frontend
VITE_API_URL=http://localhost:5000

# Admin credentials
ADMIN_PASSWORD=admin123        # ⚠️ Change this!
JWT_SECRET=your-secret-key    # ⚠️ Change this in production!

# Database and uploads
DATABASE_PATH=./data/portfolio.db
UPLOAD_DIR=./uploads
```

### 4. Running the Application

#### Development Mode
```bash
# Both frontend and backend together
npm run dev

# Or run separately in different terminals:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

#### Production Build
```bash
npm run build
npm start
```

### 5. Accessing the Application

After `npm run dev`:

- **Gallery**: http://localhost:5173/
- **Admin Panel**: http://localhost:5173/admin
- **API Server**: http://localhost:5000/api

### 6. First Time Setup

#### Add Your First Video

1. Navigate to http://localhost:5173/admin
2. Click "Admin" or go directly to admin
3. Enter password (default: `admin123`)
4. Click "+ Add Video"
5. Fill in:
   - Video Title
   - Description (optional)
   - Before Video URL (e.g., `/uploads/video1-before.mp4`)
   - After Video URL (e.g., `/uploads/video1-after.mp4`)
6. Click "Create Video"

#### Upload Videos

Option 1: Upload via Admin Panel
- In the "Add Video" modal, use the upload buttons
- Select video files from your computer

Option 2: Manual Upload
- Place video files in the `uploads/` directory
- Reference them in the URL field as `/uploads/filename.mp4`

### 7. Folder Structure Explained

```
video_portfolio/
├── server/                 # Backend (Node.js + Express)
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth middleware
│   └── server.js          # Main server file
│
├── src/                   # Frontend (React)
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── App.jsx            # Main app
│   ├── api.js             # API client
│   ├── store.js           # State management
│   └── index.css          # Tailwind styles
│
├── uploads/               # Uploaded video files
├── data/                  # SQLite database
├── .env                   # Environment variables
├── package.json           # Dependencies
├── vite.config.js         # Vite config
└── tailwind.config.js     # Tailwind config
```

## 🎨 Customization

### Change Admin Password

Edit `.env`:
```env
ADMIN_PASSWORD=your_new_password
```

### Change Colors

Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      'accent': '#00f0ff',              // Main cyan color
      'accent-purple': '#9d4edd',       // Purple accent
      'accent-pink': '#ff006e',         // Pink accent
    },
  },
}
```

### Adjust Auto-Scroll Speed

In admin panel:
1. Go to Settings
2. Enable "Auto-Scroll"
3. Set interval (e.g., 5000ms = 5 seconds)

## 🔧 Troubleshooting

### Issue: Port already in use
```bash
# Change port in .env
PORT=5001

# Or kill existing process
# On macOS/Linux:
lsof -ti:5000 | xargs kill -9

# On Windows:
netstat -ano | findstr :5000
```

### Issue: Videos not displaying
1. Check if video files exist in `/uploads/`
2. Verify URLs in admin panel start with `/uploads/`
3. Check browser console for errors (F12)

### Issue: Admin login not working
1. Verify password in `.env` matches what you're entering
2. Clear browser cache and localStorage
3. Restart the server
4. Check server logs for errors

### Issue: Database errors
```bash
# Reinitialize database (will delete existing data!)
rm -rf data/portfolio.db
npm run dev
```

### Issue: Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📦 First Deploy

### Local Testing
1. Build production version: `npm run build`
2. Start server: `npm start`
3. Test at http://localhost:5000

### Deploy to Server

#### Using PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server/server.js --name "video-portfolio"

# View logs
pm2 logs video-portfolio

# Restart on reboot
pm2 startup
pm2 save
```

#### Using Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔐 Security Checklist

- [ ] Change `ADMIN_PASSWORD` in `.env`
- [ ] Change `JWT_SECRET` in `.env`
- [ ] Use HTTPS in production
- [ ] Set `NODE_ENV=production`
- [ ] Limit file upload sizes
- [ ] Implement rate limiting
- [ ] Regular backups of database
- [ ] Keep dependencies updated

## 📚 Additional Commands

```bash
# View database contents (requires sqlite3 CLI)
sqlite3 data/portfolio.db

# Sample queries:
# SELECT * FROM videos;
# SELECT * FROM settings;

# Format code (if prettier is installed)
npm run format

# See all scripts
npm run
```

## 🆘 Getting Help

1. Check browser console for errors (F12)
2. Check server logs in terminal
3. Review `.env` configuration
4. Ensure Node.js version is 16+
5. Delete `node_modules` and reinstall if needed

## 📝 Next Steps

1. ✅ Install and run application
2. ✅ Add your first videos
3. ✅ Test admin panel
4. ✅ Customize colors and settings
5. ✅ Deploy to production

---

**Happy creating! 🎬**
