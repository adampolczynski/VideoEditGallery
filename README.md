# 🎬 Video Portfolio

A modern, futuristic video portfolio application built with Node.js, Express, React, and Tailwind CSS. Features before/after video comparisons with interactive sliders and an admin panel for managing videos.

## 🌟 Features

- **Interactive Video Grid**: Beautiful grid layout with before/after video previews
- **Smart Slider**: Drag to compare videos or enable auto-scroll mode
- **Admin Panel**: Manage videos, upload new content, configure settings
- **Password Protected**: Secure admin access with JWT authentication
- **Auto-Scroll**: Optional automatic slider movement with configurable intervals
- **Futuristic Design**: Modern UI with neon accents and smooth animations
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Database**: SQLite for simple setup and deployment

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to the project**
```bash
cd video_portfolio
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
Edit `.env` file and set your admin password:
```env
ADMIN_PASSWORD=your_secure_password_here
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
```

4. **Start the development server**
```bash
npm run dev
```

This will:
- Start the backend on `http://localhost:5000`
- Start the frontend dev server on `http://localhost:5173`

The frontend will automatically proxy API requests to the backend.

5. **Access the application**
- Gallery: `http://localhost:5173/`
- Admin Panel: `http://localhost:5173/admin`

## 📝 Admin Panel Usage

### Login
1. Navigate to `/admin`
2. Enter your admin password (from `.env`)
3. Click "Login"

### Managing Videos

**Add Video:**
- Click "+ Add Video" button
- Fill in title, description, and video URLs
- Or upload videos directly
- Click "Create Video"

**Edit Video:**
- Hover over a video in the admin grid
- Click "Edit" button
- Modify details
- Click "Update Video"

**Delete Video:**
- Hover over a video
- Click "Delete" button
- Confirm deletion

**Reorder Videos:**
- Drag videos to reorder (coming soon)

### Settings

**Auto-Scroll:**
- Enable/disable automatic slider movement
- Set interval in milliseconds (minimum 1000ms)
- Settings apply to all videos

## 🎨 Customization

### Colors & Styling
Edit `tailwind.config.js` to change:
- Primary accent: `#00f0ff` (cyan)
- Secondary accent: `#9d4edd` (purple)
- Highlight color: `#ff006e` (pink)

### Animations
Modify `src/index.css` for custom animations:
- `glow`: Text glow effect
- `float`: Floating animation
- `pulse-glow`: Pulsing shadow effect

### Upload Limits
In `server/routes/upload.js`, change:
```javascript
fileSize: 500 * 1024 * 1024 // Currently 500MB
```

## 📦 Project Structure

```
video_portfolio/
├── server/
│   ├── routes/
│   │   ├── auth.js         # Authentication endpoints
│   │   ├── videos.js       # Video CRUD operations
│   │   └── upload.js       # Video upload handling
│   ├── middleware/
│   │   └── auth.js         # JWT verification
│   └── server.js           # Express app setup
├── src/
│   ├── components/
│   │   ├── VideoSlider.jsx # Before/after slider
│   │   ├── VideoCard.jsx   # Individual video card
│   │   ├── VideoGrid.jsx   # Grid layout
│   │   └── Modal.jsx       # Modal dialogs
│   ├── pages/
│   │   ├── Home.jsx        # Gallery page
│   │   └── Admin.jsx       # Admin panel
│   ├── App.jsx             # Main app component
│   ├── api.js              # API client
│   ├── store.js            # Zustand store
│   └── index.css           # Tailwind styles
├── public/                 # Static assets
├── uploads/                # Uploaded videos
├── data/                   # Database directory
└── package.json
```

## 🔐 Security Considerations

- Change `ADMIN_PASSWORD` and `JWT_SECRET` in production
- Use HTTPS in production
- Implement rate limiting for login attempts
- Consider adding CSRF protection
- Validate all file uploads

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Using PM2
```bash
npm install -g pm2
pm2 start server/server.js --name "video-portfolio"
pm2 save
pm2 startup
```

### Using Docker
Create `Dockerfile`:
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

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/login` - Login with password
- `POST /api/auth/verify` - Verify token validity

### Videos
- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get single video
- `POST /api/videos` - Create video (admin)
- `PUT /api/videos/:id` - Update video (admin)
- `DELETE /api/videos/:id` - Delete video (admin)
- `POST /api/videos/reorder` - Reorder videos (admin)

### Upload
- `POST /api/upload` - Upload video file (admin)

### Settings
- `GET /api/settings` - Get settings
- `POST /api/settings` - Update settings (admin)

## 🐛 Troubleshooting

### Videos not loading?
- Check that video URLs are correct
- Verify uploads are in `/uploads` directory
- Check browser console for errors

### Admin login failing?
- Verify `ADMIN_PASSWORD` is set in `.env`
- Clear browser localStorage and try again
- Check server logs for JWT errors

### Build errors?
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear vite cache: `rm -rf dist`

## 📝 License

MIT

## 🤝 Support

For issues and questions, check the console logs and ensure all dependencies are installed correctly.

---

**Built with ❤️ using React, Node.js, and Tailwind CSS**
